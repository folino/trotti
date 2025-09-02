import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface OutputGallery {
  url: string
  gallery: Array<{
    title: string
    description: string | null
    image_url: string
  }>
}

interface OutputData {
  galleries: OutputGallery[]
}

interface LocalImage {
  gallery: string
  filename: string
  fullPath: string
}

interface DatabaseArtwork {
  id: string
  title: string
  imageUrl: string
  gallery: {
    slug: string
  }
}

// Read the output.json file
function readOutputFile(): OutputData | null {
  try {
    const outputPath = path.join(process.cwd(), 'output.json')
    const outputContent = fs.readFileSync(outputPath, 'utf-8')
    return JSON.parse(outputContent) as OutputData
  } catch (error) {
    console.error('Error reading output.json:', error)
    return null
  }
}

// Scan local images from images_resized folder
function scanLocalImages(): LocalImage[] {
  const imagesDir = path.join(process.cwd(), 'public', 'images_resized')
  const images: LocalImage[] = []
  
  try {
    if (!fs.existsSync(imagesDir)) {
      console.log('images_resized folder not found. Creating it...')
      fs.mkdirSync(imagesDir, { recursive: true })
      return []
    }

    const galleries = fs.readdirSync(imagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const gallery of galleries) {
      const galleryPath = path.join(imagesDir, gallery)
      
      // Check if there's a subfolder with the same name (doubled structure)
      const subGalleryPath = path.join(galleryPath, gallery)
      if (fs.existsSync(subGalleryPath) && fs.statSync(subGalleryPath).isDirectory()) {
        // Handle doubled folder structure: gallery/gallery/filename
        const files = fs.readdirSync(subGalleryPath)
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        
        for (const file of files) {
          images.push({
            gallery,
            filename: file,
            fullPath: `/images_resized/${gallery}/${gallery}/${file}`
          })
        }
      } else {
        // Handle single folder structure: gallery/filename
        const files = fs.readdirSync(galleryPath)
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        
        for (const file of files) {
          images.push({
            gallery,
            filename: file,
            fullPath: `/images_resized/${gallery}/${file}`
          })
        }
      }
    }
    
    return images
  } catch (error) {
    console.error('Error scanning local images:', error)
    return []
  }
}

// Create mapping between Wix URLs and local images
function createUrlMapping(outputData: OutputData, localImages: LocalImage[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  
  for (const galleryData of outputData.galleries) {
    const gallerySlug = galleryData.url
    
    for (const artwork of galleryData.gallery) {
      const wixUrl = artwork.image_url
      const artworkTitle = artwork.title
      
      if (!artworkTitle) continue
      
      // Try to find a matching local image
      const matchingImage = findMatchingLocalImage(artworkTitle, gallerySlug, localImages)
      
      if (matchingImage) {
        mapping[wixUrl] = matchingImage.fullPath
        console.log(`✅ Mapped: "${artworkTitle}" -> ${matchingImage.fullPath}`)
      } else {
        console.log(`❌ No match found for: "${artworkTitle}" in gallery "${gallerySlug}"`)
      }
    }
  }
  
  return mapping
}

// Find matching local image based on title and gallery
function findMatchingLocalImage(artworkTitle: string, gallerySlug: string, localImages: LocalImage[]): LocalImage | null {
  // First, try exact gallery match
  const galleryImages = localImages.filter(img => img.gallery === gallerySlug)
  
  if (galleryImages.length === 0) {
    // Try alternative gallery names (handle the copy-of- pattern)
    const alternativeGalleries = localImages.filter(img => 
      img.gallery.includes(gallerySlug) || gallerySlug.includes(img.gallery)
    )
    if (alternativeGalleries.length > 0) {
      return alternativeGalleries[0] // Return first match
    }
    return null
  }
  
  // Try to find by title similarity
  const normalizedTitle = normalizeTitle(artworkTitle)
  
  for (const image of galleryImages) {
    const normalizedFilename = normalizeTitle(path.parse(image.filename).name)
    
    if (normalizedTitle === normalizedFilename) {
      return image
    }
    
    // Try partial matches
    if (normalizedTitle.includes(normalizedFilename) || normalizedFilename.includes(normalizedTitle)) {
      return image
    }
  }
  
  // If no exact match, return the first image from the gallery
  return galleryImages[0]
}

// Normalize title for comparison
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '')
}

// Update database with new image URLs
async function updateDatabase(mapping: Record<string, string>) {
  try {
    console.log('\n🔄 Updating database...')
    
    const artworks = await prisma.artwork.findMany({
      include: {
        gallery: true
      }
    })
    
    let updatedCount = 0
    let skippedCount = 0
    let backupCount = 0
    
    for (const artwork of artworks) {
      const currentUrl = artwork.imageUrl
      
      if (mapping[currentUrl]) {
        const newUrl = mapping[currentUrl]
        
        // First, backup the original Wix URL if not already backed up
        if (!artwork.originalImageUrl) {
          await prisma.artwork.update({
            where: { id: artwork.id },
            data: { originalImageUrl: currentUrl }
          })
          backupCount++
        }
        
        // Then update the imageUrl to local path
        await prisma.artwork.update({
          where: { id: artwork.id },
          data: { imageUrl: newUrl }
        })
        console.log(`✅ Updated: ${artwork.title} -> ${newUrl}`)
        updatedCount++
      } else {
        console.log(`⚠️  Skipped: ${artwork.title} - No mapping found`)
        skippedCount++
      }
    }
    
    console.log(`\n🎉 Update completed!`)
    console.log(`💾 Backed up: ${backupCount} original URLs`)
    console.log(`✅ Updated: ${updatedCount} artworks`)
    console.log(`⚠️  Skipped: ${skippedCount} artworks`)
    
  } catch (error) {
    console.error('Error updating database:', error)
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting smart image URL update...\n')
    
    // 1. Read output.json
    console.log('📖 Reading output.json...')
    const outputData = readOutputFile()
    if (!outputData) {
      console.error('❌ Failed to read output.json')
      return
    }
    console.log(`✅ Found ${outputData.galleries.length} galleries in output.json`)
    
    // 2. Scan local images
    console.log('\n🔍 Scanning local images...')
    const localImages = scanLocalImages()
    console.log(`✅ Found ${localImages.length} local images across ${new Set(localImages.map(img => img.gallery)).size} galleries`)
    
    // 3. Create URL mapping
    console.log('\n🔗 Creating URL mappings...')
    const mapping = createUrlMapping(outputData, localImages)
    console.log(`✅ Created ${Object.keys(mapping).length} URL mappings`)
    
    // 4. Update database
    if (Object.keys(mapping).length > 0) {
      await updateDatabase(mapping)
    } else {
      console.log('\n❌ No mappings created. Check your local images and output.json structure.')
    }
    
  } catch (error) {
    console.error('❌ Error in main process:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
main()
  .catch(console.error)
  .finally(() => process.exit(0))
