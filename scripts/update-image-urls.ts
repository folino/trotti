import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map Wix URLs to local resized image paths
function transformWixUrlToLocal(wixUrl: string): string | null {
  try {
    // Extract the filename from Wix URL
    // Example: https://static.wixstatic.com/media/c2c7fb_c591e7b686824bd9bd56bd322f5192c3~mv2.jpg
    const urlParts = wixUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    
    if (!filename) return null
    
    // Remove the Wix-specific prefix and get the actual filename
    // The filename format is usually: c2c7fb_c591e7b686824bd9bd56bd322f5192c3~mv2.jpg
    // We need to find the actual image name from your local files
    
    // For now, return null to indicate we need manual mapping
    // You'll need to provide the mapping based on your actual file structure
    return null
  } catch (error) {
    console.error('Error transforming URL:', wixUrl, error)
    return null
  }
}

// Manual mapping of Wix URLs to local paths
// You'll need to fill this out based on your actual image files
const urlMapping: Record<string, string> = {
  // Example mappings - you need to fill these out
  // 'https://static.wixstatic.com/media/c2c7fb_c591e7b686824bd9bd56bd322f5192c3~mv2.jpg': '/images_resized/gallery-name/image-name.jpg',
  
  // Add your mappings here based on the actual files in public/images_resized/
}

async function updateImageUrls() {
  try {
    console.log('Starting image URL update...')
    
    // Get all artworks
    const artworks = await prisma.artwork.findMany({
      include: {
        gallery: true
      }
    })
    
    console.log(`Found ${artworks.length} artworks to process`)
    
    let updatedCount = 0
    let skippedCount = 0
    
    for (const artwork of artworks) {
      const currentUrl = artwork.imageUrl
      
      // Check if we have a manual mapping
      if (urlMapping[currentUrl]) {
        const newUrl = urlMapping[currentUrl]
        await prisma.artwork.update({
          where: { id: artwork.id },
          data: { imageUrl: newUrl }
        })
        console.log(`Updated: ${artwork.title} -> ${newUrl}`)
        updatedCount++
      } else {
        console.log(`Skipped (no mapping): ${artwork.title} - ${currentUrl}`)
        skippedCount++
      }
    }
    
    console.log(`\nUpdate completed!`)
    console.log(`Updated: ${updatedCount} artworks`)
    console.log(`Skipped: ${skippedCount} artworks`)
    
    if (skippedCount > 0) {
      console.log(`\nYou need to add mappings for ${skippedCount} URLs in the urlMapping object.`)
      console.log('Check the skipped URLs above and map them to your local image paths.')
    }
    
  } catch (error) {
    console.error('Error updating image URLs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Helper function to generate mappings based on your local files
async function generateUrlMappings() {
  try {
    console.log('Generating URL mappings...')
    
    const artworks = await prisma.artwork.findMany({
      include: {
        gallery: true
      }
    })
    
    console.log('\nSuggested mappings (add these to urlMapping object):')
    console.log('const urlMapping: Record<string, string> = {')
    
    for (const artwork of artworks) {
      const gallerySlug = artwork.gallery.slug
      const filename = artwork.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      // Generate a suggested local path
      const suggestedPath = `/images_resized/${gallerySlug}/${filename}.jpg`
      
      console.log(`  '${artwork.imageUrl}': '${suggestedPath}',`)
    }
    
    console.log('}')
    
  } catch (error) {
    console.error('Error generating mappings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Main execution
async function main() {
  const command = process.argv[2]
  
  if (command === 'generate') {
    await generateUrlMappings()
  } else {
    await updateImageUrls()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))


