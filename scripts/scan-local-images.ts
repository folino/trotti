import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

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

async function scanLocalImages(): Promise<LocalImage[]> {
  const imagesDir = path.join(process.cwd(), 'public', 'images_resized')
  const images: LocalImage[] = []
  
  try {
    const galleries = fs.readdirSync(imagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const gallery of galleries) {
      const galleryPath = path.join(imagesDir, gallery)
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
    
    return images
  } catch (error) {
    console.error('Error scanning local images:', error)
    return []
  }
}

async function generateMapping() {
  try {
    console.log('Scanning local images...')
    const localImages = await scanLocalImages()
    
    console.log(`Found ${localImages.length} local images across ${new Set(localImages.map(img => img.gallery)).size} galleries`)
    
    console.log('\nLocal images by gallery:')
    const imagesByGallery = localImages.reduce((acc, img) => {
      if (!acc[img.gallery]) acc[img.gallery] = []
      acc[img.gallery].push(img)
      return acc
    }, {} as Record<string, LocalImage[]>)
    
    for (const [gallery, images] of Object.entries(imagesByGallery)) {
      console.log(`\n${gallery} (${images.length} images):`)
      images.forEach(img => console.log(`  - ${img.filename}`))
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('DATABASE ARTWORKS:')
    console.log('='.repeat(50))
    
    const artworks = await prisma.artwork.findMany({
      include: {
        gallery: true
      },
      orderBy: {
        gallery: {
          slug: 'asc'
        }
      }
    })
    
    console.log(`Found ${artworks.length} artworks in database`)
    
    // Group artworks by gallery
    const artworksByGallery = artworks.reduce((acc, artwork) => {
      if (!acc[artwork.gallery.slug]) acc[artwork.gallery.slug] = []
      acc[artwork.gallery.slug].push(artwork)
      return acc
    }, {} as Record<string, DatabaseArtwork[]>)
    
    for (const [gallerySlug, galleryArtworks] of Object.entries(artworksByGallery)) {
      console.log(`\n${gallerySlug} (${galleryArtworks.length} artworks):`)
      galleryArtworks.forEach(artwork => {
        console.log(`  - ${artwork.title}`)
        console.log(`    Current URL: ${artwork.imageUrl}`)
        
        // Try to find a matching local image
        const localImagesInGallery = localImages.filter(img => img.gallery === gallerySlug)
        if (localImagesInGallery.length > 0) {
          console.log(`    Suggested local path: ${localImagesInGallery[0].fullPath}`)
        } else {
          console.log(`    No local images found for this gallery`)
        }
        console.log('')
      })
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('NEXT STEPS:')
    console.log('='.repeat(50))
    console.log('1. Review the local images and database artworks above')
    console.log('2. Create a mapping in scripts/update-image-urls.ts')
    console.log('3. Run: npm run update-image-urls')
    
  } catch (error) {
    console.error('Error generating mapping:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateMapping()
  .catch(console.error)
  .finally(() => process.exit(0))


