import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Read the output.json file
const outputPath = path.join(process.cwd(), 'output.json')
const outputData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))

interface ArtworkData {
  title: string
  description: string | null
  image_url: string
}

async function importGrazingData() {
  console.log('Importing grazing artwork data...')

  try {
    // Find the copy-of-flowers gallery data
    const copyOfFlowersData = outputData.galleries.find((g: any) => g.url === 'copy-of-flowers')
    
    if (!copyOfFlowersData) {
      console.log('❌ copy-of-flowers gallery not found in output.json')
      return
    }

    console.log(`Found ${copyOfFlowersData.gallery.length} artworks in copy-of-flowers`)

    // Find the grazing gallery in the database
    const grazingGallery = await prisma.gallery.findFirst({
      where: { slug: 'grazing' }
    })

    if (!grazingGallery) {
      console.log('❌ Grazing gallery not found in database')
      return
    }

    console.log(`✓ Found grazing gallery: ${grazingGallery.name}`)

    // Delete existing sample artworks
    const deletedCount = await prisma.artwork.deleteMany({
      where: { galleryId: grazingGallery.id }
    })

    console.log(`✓ Deleted ${deletedCount.count} existing sample artworks`)

    // Import the actual grazing artworks
    for (let i = 0; i < copyOfFlowersData.gallery.length; i++) {
      const artwork = copyOfFlowersData.gallery[i]
      
      // Parse description to extract year, medium, dimensions, and availability
      const parsedInfo = parseArtworkDescription(artwork.description || '')
      
      try {
        const createdArtwork = await prisma.artwork.create({
          data: {
            title: artwork.title.trim(),
            description: artwork.description,
            imageUrl: artwork.image_url,
            year: parsedInfo.year,
            medium: parsedInfo.medium,
            dimensions: parsedInfo.dimensions,
            available: parsedInfo.available,
            order: i,
            galleryId: grazingGallery.id
          }
        })

        console.log(`  ✓ Imported: ${artwork.title}`)

      } catch (error) {
        console.log(`  ❌ Error importing artwork: ${error}`)
      }
    }

    console.log('\n✅ Grazing artwork import completed!')

  } catch (error) {
    console.error('Error importing grazing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function parseArtworkDescription(description: string): {
  year: string | null
  medium: string | null
  dimensions: string | null
  available: boolean
} {
  const result = {
    year: null as string | null,
    medium: null as string | null,
    dimensions: null as string | null,
    available: true
  }

  if (!description) return result

  // Check for availability
  if (description.toLowerCase().includes('not available') || 
      description.toLowerCase().includes('sold') ||
      description.toLowerCase().includes('private collection')) {
    result.available = false
  }

  // Extract year (4-digit number)
  const yearMatch = description.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) {
    result.year = yearMatch[0]
  }

  // Extract medium (common art mediums)
  const mediumPatterns = [
    /acrylic[^.]*/i,
    /oil[^.]*/i,
    /watercolor[^.]*/i,
    /pastel[^.]*/i,
    /charcoal[^.]*/i,
    /pencil[^.]*/i,
    /enamel[^.]*/i,
    /mixed media[^.]*/i,
    /photography[^.]*/i,
    /digital[^.]*/i
  ]

  for (const pattern of mediumPatterns) {
    const match = description.match(pattern)
    if (match) {
      result.medium = match[0].trim()
      break
    }
  }

  // Extract dimensions (patterns like "30 x 40 inches", "76 x 102 cms", etc.)
  const dimensionPatterns = [
    /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(inches?|cm|centimeters?)/gi,
    /(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\s*(inches?|cm|centimeters?)/gi
  ]

  for (const pattern of dimensionPatterns) {
    const match = description.match(pattern)
    if (match) {
      result.dimensions = match[0].trim()
      break
    }
  }

  return result
}

importGrazingData()
