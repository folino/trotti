import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import cloudinary, { uploadImage } from '../lib/cloudinary'

const prisma = new PrismaClient()

interface LocalImage {
  gallery: string
  filename: string
  fullPath: string
  localPath: string
}

interface CloudinaryResult {
  publicId: string
  url: string
  width: number
  height: number
}

// Scan local images from images_resized folder
function scanLocalImages(): LocalImage[] {
  const imagesDir = path.join(process.cwd(), 'public', 'images_resized')
  const images: LocalImage[] = []
  
  try {
    if (!fs.existsSync(imagesDir)) {
      console.log('images_resized folder not found.')
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
            fullPath: `/images_resized/${gallery}/${gallery}/${file}`,
            localPath: path.join(subGalleryPath, file)
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
            fullPath: `/images_resized/${gallery}/${file}`,
            localPath: path.join(galleryPath, file)
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

// Upload image to Cloudinary
async function uploadToCloudinary(image: LocalImage): Promise<CloudinaryResult | null> {
  try {
    console.log(`📤 Uploading: ${image.filename} from ${image.gallery}...`)
    
    const folder = `ricardo-trotti-art/${image.gallery}`
    const result = await uploadImage(image.localPath, folder)
    
    console.log(`✅ Uploaded: ${image.filename} -> ${result.publicId}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to upload ${image.filename}:`, error)
    return null
  }
}

// Update database with Cloudinary URLs
async function updateDatabaseWithCloudinaryUrls(mapping: Record<string, CloudinaryResult>) {
  try {
    console.log('\n🔄 Updating database with Cloudinary URLs...')
    
    const artworks = await prisma.artwork.findMany({
      include: {
        gallery: true
      }
    })
    
    let updatedCount = 0
    let skippedCount = 0
    
    for (const artwork of artworks) {
      const currentUrl = artwork.imageUrl
      
      // Find matching Cloudinary result by local path
      const cloudinaryResult = Object.entries(mapping).find(([localPath, result]) => 
        localPath === currentUrl
      )?.[1]
      
      if (cloudinaryResult) {
        // Update with Cloudinary URL
        await prisma.artwork.update({
          where: { id: artwork.id },
          data: { 
            imageUrl: cloudinaryResult.url,
            // You could add new fields for Cloudinary data if needed
            // cloudinaryPublicId: cloudinaryResult.publicId,
            // imageWidth: cloudinaryResult.width,
            // imageHeight: cloudinaryResult.height
          }
        })
        console.log(`✅ Updated: ${artwork.title} -> Cloudinary`)
        updatedCount++
      } else {
        console.log(`⚠️  Skipped: ${artwork.title} - No Cloudinary mapping found`)
        skippedCount++
      }
    }
    
    console.log(`\n🎉 Database update completed!`)
    console.log(`✅ Updated: ${updatedCount} artworks`)
    console.log(`⚠️  Skipped: ${skippedCount} artworks`)
    
  } catch (error) {
    console.error('Error updating database:', error)
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Cloudinary upload process...\n')
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Missing Cloudinary environment variables!')
      console.log('Please set:')
      console.log('- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
      console.log('- CLOUDINARY_API_KEY')
      console.log('- CLOUDINARY_API_SECRET')
      return
    }
    
    // 1. Scan local images
    console.log('🔍 Scanning local images...')
    const localImages = scanLocalImages()
    console.log(`✅ Found ${localImages.length} local images across ${new Set(localImages.map(img => img.gallery)).size} galleries`)
    
    if (localImages.length === 0) {
      console.log('❌ No images found to upload')
      return
    }
    
    // 2. Upload to Cloudinary
    console.log('\n📤 Starting uploads to Cloudinary...')
    const mapping: Record<string, CloudinaryResult> = {}
    let successCount = 0
    let failCount = 0
    
    for (const image of localImages) {
      const result = await uploadToCloudinary(image)
      if (result) {
        mapping[image.fullPath] = result
        successCount++
      } else {
        failCount++
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n📊 Upload Summary:`)
    console.log(`✅ Successful: ${successCount} images`)
    console.log(`❌ Failed: ${failCount} images`)
    
    // 3. Update database
    if (successCount > 0) {
      await updateDatabaseWithCloudinaryUrls(mapping)
    }
    
    console.log('\n🎉 Cloudinary migration completed!')
    
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


