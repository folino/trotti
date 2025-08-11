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

interface GalleryData {
  url: string
  gallery: ArtworkData[]
}

async function importArtworks() {
  console.log('Starting artwork import...')

  try {
    let totalArtworks = 0
    let importedArtworks = 0

    for (const galleryData of outputData.galleries) {
      const gallerySlug = galleryData.url
      const artworks = galleryData.gallery

      console.log(`\nProcessing gallery: ${gallerySlug}`)
      console.log(`Found ${artworks.length} artworks`)

      // Find the gallery in the database
      const gallery = await prisma.gallery.findFirst({
        where: { slug: gallerySlug }
      })

      if (!gallery) {
        console.log(`  ⚠️  Gallery not found: ${gallerySlug}`)
        continue
      }

      console.log(`  ✓ Found gallery: ${gallery.name}`)

      // Import artworks for this gallery
      for (let i = 0; i < artworks.length; i++) {
        const artwork = artworks[i]
        totalArtworks++

        // Skip artworks without titles
        if (!artwork.title || artwork.title.trim() === '') {
          console.log(`    ⚠️  Skipping artwork ${i + 1}: No title`)
          continue
        }

        try {
          // Parse description to extract year, medium, dimensions, and availability
          const parsedInfo = parseArtworkDescription(artwork.description || '')
          
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
              galleryId: gallery.id
            }
          })

          console.log(`    ✓ Imported: ${artwork.title}`)
          importedArtworks++

        } catch (error) {
          console.log(`    ❌ Error importing artwork ${i + 1}: ${error}`)
        }
      }
    }

    console.log('\n✅ Artwork import completed!')
    console.log(`Total artworks processed: ${totalArtworks}`)
    console.log(`Successfully imported: ${importedArtworks}`)
    console.log(`Skipped: ${totalArtworks - importedArtworks}`)

  } catch (error) {
    console.error('Error importing artworks:', error)
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

  // Extract dimensions (patterns like "24 x 19 inches", "61 x 48 cms", etc.)
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

importArtworks()
