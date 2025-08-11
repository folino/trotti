import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Define the structure of the JSON data
interface ArtworkData {
  title: string
  description: string | null
  image_url: string
}

interface GalleryData {
  url: string
  gallery: ArtworkData[]
}

interface ArtData {
  galleries: GalleryData[]
}

// Map gallery URLs to categories and subcategories
const galleryMapping: Record<string, { category: string; subcategory: string }> = {
  'meninas': { category: 'NewArt', subcategory: 'Figurative' },
  'copy-of-jourart': { category: 'JourArt', subcategory: 'Travel Sketches' },
  'playful-chaos': { category: 'NewArt', subcategory: 'Abstract' },
  'copy-of-photography-5': { category: 'JourArt', subcategory: 'Photography' },
  'copy-of-photography-3': { category: 'JourArt', subcategory: 'Photography' },
  'copy-of-photography-2': { category: 'JourArt', subcategory: 'Photography' },
  'transition': { category: 'Earlier', subcategory: 'Transition Series' },
  'copy-of-photography': { category: 'JourArt', subcategory: 'Photography' },
  'old-abstracts': { category: 'Earlier', subcategory: 'Abstract' },
  'frentic-chaos': { category: 'NewArt', subcategory: 'Abstract' },
  'chaos': { category: 'Earlier', subcategory: 'Abstract' },
  'plaster': { category: 'Sculpture', subcategory: 'Mixed Media' },
  'family-portraits': { category: 'NewArt', subcategory: 'Figurative' },
  'copy-2-of-flowers': { category: 'NewArt', subcategory: 'Still Life' },
  'copy-of-photography-4': { category: 'JourArt', subcategory: 'Photography' },
  'willem-ci': { category: 'NewArt', subcategory: 'Figurative' },
  'september-11': { category: 'Earlier', subcategory: 'Contemporary' },
  'copy-of-flowers': { category: 'NewArt', subcategory: 'Still Life' },
  'beyond-transition': { category: 'Earlier', subcategory: 'Transition Series' },
  'organized-chaos': { category: 'NewArt', subcategory: 'Abstract' },
  'jazz': { category: 'NewArt', subcategory: 'Figurative' },
  'copy-of-photography-1': { category: 'JourArt', subcategory: 'Photography' },
  'cows': { category: 'NewArt', subcategory: 'Figurative' },
  'sculptures': { category: 'Sculpture', subcategory: 'Three Dimensional' },
  'photography': { category: 'JourArt', subcategory: 'Photography' },
  'flowers-b-w': { category: 'NewArt', subcategory: 'Still Life' },
  'circus': { category: 'NewArt', subcategory: 'Figurative' },
  'figuratives': { category: 'NewArt', subcategory: 'Figurative' },
  'frequencies': { category: 'NewArt', subcategory: 'Abstract' },
  'flowers': { category: 'NewArt', subcategory: 'Still Life' },
  'deconstruction': { category: 'NewArt', subcategory: 'Abstract' },
  'copy-of-late-2010': { category: 'Earlier', subcategory: 'Contemporary' },
  'copy-of-chaos': { category: 'Earlier', subcategory: 'Abstract' },
  'chaotic-evolution': { category: 'NewArt', subcategory: 'Abstract' },
  'ceramics': { category: 'Sculpture', subcategory: 'Ceramics' },
  'beyond-chaos': { category: 'NewArt', subcategory: 'Abstract' },
  '2000s': { category: 'Earlier', subcategory: 'Contemporary' },
  'the-americas': { category: 'JourArt', subcategory: 'Cultural' },
  'new-work': { category: 'NewArt', subcategory: 'Contemporary' }
}

// Helper function to extract year from description
function extractYear(description: string | null): string | null {
  if (!description) return null
  
  const yearMatch = description.match(/\b(19|20)\d{2}\b/)
  return yearMatch ? yearMatch[0] : null
}

// Helper function to extract medium from description
function extractMedium(description: string | null): string | null {
  if (!description) return null
  
  const mediumMatch = description.match(/(acrylic|oil|watercolor|pastel|charcoal|bronze|marble|mixed media)/i)
  return mediumMatch ? mediumMatch[0] : null
}

// Helper function to extract dimensions from description
function extractDimensions(description: string | null): string | null {
  if (!description) return null
  
  const dimensionMatch = description.match(/\d+\s*x\s*\d+\s*(inches|cm|centimeters)/i)
  return dimensionMatch ? dimensionMatch[0] : null
}

// Helper function to check availability
function isAvailable(description: string | null): boolean {
  if (!description) return true
  return !description.toLowerCase().includes('not available') && 
         !description.toLowerCase().includes('private collection') &&
         !description.toLowerCase().includes('sold')
}

// Helper function to create slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function importArtData() {
  try {
    console.log('Starting art data import...')
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'output.json')
    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const artData: ArtData = JSON.parse(jsonData)
    
    // Create categories
    const categories = ['NewArt', 'Earlier', 'JourArt', 'Sculpture']
    const categoryMap = new Map<string, string>()
    
    for (const categoryName of categories) {
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          slug: createSlug(categoryName),
          description: getCategoryDescription(categoryName),
          order: categories.indexOf(categoryName)
        }
      })
      categoryMap.set(categoryName, category.id)
    }
    
    // Create subcategories and galleries
    const subcategoryMap = new Map<string, string>()
    
    for (const galleryData of artData.galleries) {
      const mapping = galleryMapping[galleryData.url]
      if (!mapping) {
        console.warn(`No mapping found for gallery: ${galleryData.url}`)
        continue
      }
      
      const categoryId = categoryMap.get(mapping.category)
      if (!categoryId) {
        console.warn(`Category not found: ${mapping.category}`)
        continue
      }
      
      // Create subcategory
      const subcategory = await prisma.subcategory.upsert({
        where: { 
          categoryId_slug: {
            categoryId,
            slug: createSlug(mapping.subcategory)
          }
        },
        update: {},
        create: {
          name: mapping.subcategory,
          slug: createSlug(mapping.subcategory),
          categoryId,
          description: getSubcategoryDescription(mapping.subcategory),
          order: 0
        }
      })
      
      subcategoryMap.set(`${mapping.category}-${mapping.subcategory}`, subcategory.id)
      
      // Create gallery
      const gallery = await prisma.gallery.upsert({
        where: {
          subcategoryId_slug: {
            subcategoryId: subcategory.id,
            slug: galleryData.url
          }
        },
        update: {},
        create: {
          name: formatGalleryName(galleryData.url),
          slug: galleryData.url,
          subcategoryId: subcategory.id,
          description: getGalleryDescription(galleryData.url),
          order: 0
        }
      })
      
      // Import artworks
      for (let i = 0; i < galleryData.gallery.length; i++) {
        const artworkData = galleryData.gallery[i]
        
        if (!artworkData.title && !artworkData.description) {
          console.warn(`Skipping artwork with no title or description in gallery ${galleryData.url}`)
          continue
        }
        
        const title = artworkData.title || `Untitled ${i + 1}`
        const year = extractYear(artworkData.description)
        const medium = extractMedium(artworkData.description)
        const dimensions = extractDimensions(artworkData.description)
        const available = isAvailable(artworkData.description)
        
        await prisma.artwork.create({
          data: {
            title,
            description: artworkData.description,
            imageUrl: artworkData.image_url,
            year,
            medium,
            dimensions,
            available,
            order: i,
            galleryId: gallery.id
          }
        })
      }
      
      console.log(`Imported gallery: ${galleryData.url} with ${galleryData.gallery.length} artworks`)
    }
    
    console.log('Art data import completed successfully!')
    
  } catch (error) {
    console.error('Error importing art data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'NewArt': 'Contemporary works exploring modern themes and techniques',
    'Earlier': 'Foundational pieces that established the artist\'s creative journey',
    'JourArt': 'Travel-inspired works capturing moments and places from around the world',
    'Sculpture': 'Three-dimensional works exploring form and space'
  }
  return descriptions[category] || ''
}

function getSubcategoryDescription(subcategory: string): string {
  const descriptions: Record<string, string> = {
    'Figurative': 'Works exploring human form and expression',
    'Abstract': 'Non-representational works focusing on form and color',
    'Travel Sketches': 'Quick impressions and studies from various journeys',
    'Photography': 'Captured moments and places through the lens',
    'Transition Series': 'Works from a period of artistic evolution',
    'Sculpture': 'Three-dimensional explorations of form and space',
    'Still Life': 'Compositions featuring inanimate objects and arrangements',
    'Contemporary': 'Modern works reflecting current artistic trends',
    'Mixed Media': 'Works combining various materials and techniques',
    'Three Dimensional': 'Sculptural works exploring volume and space',
    'Ceramics': 'Works created with clay and ceramic materials',
    'Cultural': 'Works exploring cultural themes and traditions'
  }
  return descriptions[subcategory] || ''
}

function getGalleryDescription(galleryUrl: string): string {
  const descriptions: Record<string, string> = {
    'meninas': 'A collection exploring figurative themes with contemporary techniques',
    'playful-chaos': 'Dynamic works capturing energy and movement',
    'transition': 'Works from a period of artistic transition and evolution',
    'copy-of-photography': 'Photographic explorations of urban and natural landscapes',
    'copy-of-photography-2': 'Further photographic studies and observations',
    'copy-of-photography-3': 'Additional photographic explorations',
    'copy-of-photography-5': 'Extended photographic series',
    'copy-of-jourart': 'Travel-inspired sketches and studies',
    'old-abstracts': 'Early abstract explorations and experiments',
    'frentic-chaos': 'Intense abstract works with frenetic energy',
    'chaos': 'Early chaotic and experimental compositions',
    'plaster': 'Sculptural works using plaster and mixed media',
    'family-portraits': 'Intimate portraits exploring family relationships',
    'copy-2-of-flowers': 'Floral compositions in contemporary style',
    'copy-of-photography-4': 'Additional photographic documentation',
    'willem-ci': 'Collaborative works exploring artistic partnerships',
    'september-11': 'Works reflecting on historical events and their impact',
    'copy-of-flowers': 'Classical floral arrangements and studies',
    'beyond-transition': 'Advanced works from the transition period',
    'organized-chaos': 'Structured abstract compositions with controlled chaos',
    'jazz': 'Musical influences in visual form',
    'copy-of-photography-1': 'Early photographic explorations',
    'cows': 'Rural themes and pastoral compositions',
    'sculptures': 'Three-dimensional works exploring form and space',
    'photography': 'Core photographic works and studies',
    'flowers-b-w': 'Monochromatic floral studies',
    'circus': 'Performative themes and dynamic compositions',
    'figuratives': 'Classical figurative studies and compositions',
    'frequencies': 'Rhythmic and wave-like abstract compositions',
    'flowers': 'Traditional floral studies and arrangements',
    'deconstruction': 'Works exploring fragmentation and reconstruction',
    'copy-of-late-2010': 'Works from the late 2010s period',
    'copy-of-chaos': 'Additional chaotic and experimental works',
    'chaotic-evolution': 'Evolutionary abstract compositions',
    'ceramics': 'Ceramic works and pottery studies',
    'beyond-chaos': 'Advanced chaotic compositions',
    '2000s': 'Works from the 2000s decade',
    'the-americas': 'Cultural explorations of the Americas',
    'new-work': 'Latest contemporary works and experiments'
  }
  return descriptions[galleryUrl] || ''
}

function formatGalleryName(galleryUrl: string): string {
  const names: Record<string, string> = {
    'meninas': 'Meninas Series',
    'playful-chaos': 'Playful Chaos',
    'transition': 'Transition Series',
    'copy-of-photography': 'Photography I',
    'copy-of-photography-2': 'Photography II',
    'copy-of-photography-3': 'Photography III',
    'copy-of-photography-5': 'Photography V',
    'copy-of-jourart': 'JourArt Sketches',
    'old-abstracts': 'Early Abstracts',
    'frentic-chaos': 'Frenetic Chaos',
    'chaos': 'Chaos Series',
    'plaster': 'Plaster Works',
    'family-portraits': 'Family Portraits',
    'copy-2-of-flowers': 'Flowers II',
    'copy-of-photography-4': 'Photography IV',
    'willem-ci': 'Willem & Cy',
    'september-11': 'September 11',
    'copy-of-flowers': 'Flowers I',
    'beyond-transition': 'Beyond Transition',
    'organized-chaos': 'Organized Chaos',
    'jazz': 'Jazz Series',
    'copy-of-photography-1': 'Photography I',
    'cows': 'Cows Series',
    'sculptures': 'Sculptures',
    'photography': 'Photography',
    'flowers-b-w': 'Flowers B&W',
    'circus': 'Circus Series',
    'figuratives': 'Figuratives',
    'frequencies': 'Frequencies',
    'flowers': 'Flowers',
    'deconstruction': 'Deconstruction',
    'copy-of-late-2010': 'Late 2010s',
    'copy-of-chaos': 'Chaos II',
    'chaotic-evolution': 'Chaotic Evolution',
    'ceramics': 'Ceramics',
    'beyond-chaos': 'Beyond Chaos',
    '2000s': '2000s',
    'the-americas': 'The Americas',
    'new-work': 'New Work'
  }
  return names[galleryUrl] || galleryUrl.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Run the import
importArtData() 