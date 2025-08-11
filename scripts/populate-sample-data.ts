import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define the structure based on the reference
const structure = {
  "NewArt": [
    "grazing",
    "copy-2-of-flowers", // Anarchy (The Masters)
    "copy-of-anarchy-the-masters", // Unicyclists
    "flowers",
    "flowers-b-w",
    "frequencies",
    "willem-ci",
    "organized-chaos",
    "deconstruction",
    "beyond-chaos"
  ],
  "Earlier": [
    "chaotic-evolution",
    "playful-chaos",
    "frentic-chaos",
    "chaos",
    "copy-of-chaos", // Geometric Chaos
    "beyond-transition",
    "transition",
    "circus",
    "jazz",
    "cows",
    "the-americas",
    "still-life",
    "meninas",
    "figuratives",
    "family-portraits",
    "old-abstracts"
  ],
  "JourArt": [
    "september-11",
    "journalism-and-free-press", // Press Freedom
    "copy-of-jourart" // Illustrations
  ],
  "Sculpt": [
    "plaster",
    "ceramics"
  ],
  "Photos": [
    "copy-of-photography-3", // Blur People
    "copy-of-photography", // Blur Places
    "copy-of-photography-2", // Blur Abstracts
    "copy-of-photography-1", // Blur Landscapes
    "copy-of-photography-4", // Black and White
    "copy-of-photography-5" // Art Deco
  ]
}

// Gallery descriptions
const galleryDescriptions: Record<string, string> = {
  "grazing": "A series exploring the peaceful coexistence of animals in natural settings",
  "copy-2-of-flowers": "Anarchy (The Masters) - Reinterpreting classical masterpieces with contemporary chaos",
  "copy-of-anarchy-the-masters": "Unicyclists - Balancing acts of artistic expression",
  "flowers": "Vibrant floral compositions celebrating nature's beauty",
  "flowers-b-w": "Monochromatic floral studies exploring form and contrast",
  "frequencies": "Abstract explorations of visual rhythms and patterns",
  "willem-ci": "Collaborative works with Willem de Kooning and Cy Twombly",
  "organized-chaos": "Structured disorder in artistic composition",
  "deconstruction": "Breaking down and rebuilding visual elements",
  "beyond-chaos": "Transcending chaos to find new order",
  "chaotic-evolution": "The evolution of artistic expression through controlled chaos",
  "playful-chaos": "Joyful exploration of disorder and spontaneity",
  "frentic-chaos": "High-energy chaotic compositions",
  "chaos": "Pure expressions of artistic disorder",
  "copy-of-chaos": "Geometric Chaos - Structured disorder in geometric forms",
  "beyond-transition": "Moving beyond transitional phases in art",
  "transition": "Artistic transitions and transformations",
  "circus": "Circus-themed works capturing movement and performance",
  "jazz": "Jazz-inspired compositions reflecting musical rhythms",
  "cows": "Rural scenes featuring cattle in pastoral settings",
  "the-americas": "Cultural explorations of the Americas",
  "still-life": "Traditional still life compositions",
  "meninas": "Inspired by Velázquez's Las Meninas",
  "figuratives": "Figurative works exploring human form",
  "family-portraits": "Intimate family portraits and scenes",
  "old-abstracts": "Early abstract explorations",
  "september-11": "Reflections on the events of September 11, 2001",
  "journalism-and-free-press": "Press Freedom - Celebrating journalistic integrity",
  "copy-of-jourart": "Illustrations - Editorial and journalistic artwork",
  "plaster": "Sculptural works in plaster",
  "ceramics": "Ceramic sculptures and vessels",
  "copy-of-photography-3": "Blur People - Photographic studies of human movement",
  "copy-of-photography": "Blur Places - Architectural photography with motion blur",
  "copy-of-photography-2": "Blur Abstracts - Abstract photographic compositions",
  "copy-of-photography-1": "Blur Landscapes - Landscape photography with movement",
  "copy-of-photography-4": "Black and White - Monochromatic photographic studies",
  "copy-of-photography-5": "Art Deco - Photography inspired by Art Deco aesthetics"
}

async function populateDatabase() {
  console.log('Starting database population...')

  try {
    // Create categories
    const categoryMap = new Map<string, string>()
    
    for (const [categoryName, galleries] of Object.entries(structure)) {
      console.log(`Creating category: ${categoryName}`)
      
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `Artworks from the ${categoryName} collection`,
          order: Object.keys(structure).indexOf(categoryName)
        }
      })
      
      categoryMap.set(categoryName, category.id)
      console.log(`  ✓ Created category: ${categoryName} (ID: ${category.id})`)
      
      // Create galleries for this category
      for (let i = 0; i < galleries.length; i++) {
        const gallerySlug = galleries[i]
        const galleryName = getGalleryName(gallerySlug)
        const description = galleryDescriptions[gallerySlug] || `Gallery from ${categoryName} collection`
        
        console.log(`  Creating gallery: ${galleryName}`)
        
        const gallery = await prisma.gallery.create({
          data: {
            name: galleryName,
            slug: gallerySlug,
            description: description,
            order: i,
            categoryId: category.id
          }
        })
        
        console.log(`    ✓ Created gallery: ${galleryName} (ID: ${gallery.id})`)
      }
    }
    
    console.log('\n✅ Database population completed successfully!')
    console.log(`Created ${Object.keys(structure).length} categories`)
    console.log(`Created ${Object.values(structure).flat().length} galleries`)
    
  } catch (error) {
    console.error('Error populating database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getGalleryName(slug: string): string {
  const nameMap: Record<string, string> = {
    "grazing": "Grazing",
    "copy-2-of-flowers": "Anarchy (The Masters)",
    "copy-of-anarchy-the-masters": "Unicyclists",
    "flowers": "Flowers",
    "flowers-b-w": "Flowers B&W",
    "frequencies": "Frequencies",
    "willem-ci": "Willem & Cy",
    "organized-chaos": "Organized Chaos",
    "deconstruction": "Deconstruction",
    "beyond-chaos": "Beyond Chaos",
    "chaotic-evolution": "Chaotic Evolution",
    "playful-chaos": "Playful Chaos",
    "frentic-chaos": "Frenetic Chaos",
    "chaos": "Chaos",
    "copy-of-chaos": "Geometric Chaos",
    "beyond-transition": "Beyond Transition",
    "transition": "Transition",
    "circus": "Circus",
    "jazz": "Jazz",
    "cows": "Cows",
    "the-americas": "The Americas",
    "still-life": "Still Life",
    "meninas": "Meninas",
    "figuratives": "Figuratives",
    "family-portraits": "Family Portraits",
    "old-abstracts": "Old Abstract",
    "september-11": "September 11",
    "journalism-and-free-press": "Press Freedom",
    "copy-of-jourart": "Illustrations",
    "plaster": "Plaster",
    "ceramics": "Ceramics",
    "copy-of-photography-3": "Blur People",
    "copy-of-photography": "Blur Places",
    "copy-of-photography-2": "Blur Abstracts",
    "copy-of-photography-1": "Blur Landscapes",
    "copy-of-photography-4": "Black and White",
    "copy-of-photography-5": "Art Deco"
  }
  
  return nameMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

populateDatabase()
