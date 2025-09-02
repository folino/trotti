import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import path from 'path'

const prisma = new PrismaClient()

async function migrateToPostgres() {
  try {
    console.log('🚀 Starting migration to PostgreSQL...')
    
    // 1. Generate Prisma client for new schema
    console.log('📦 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // 2. Push the schema to PostgreSQL
    console.log('🗄️  Pushing schema to PostgreSQL...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    // 3. Seed the database with your data
    console.log('🌱 Seeding database with your data...')
    
    // Import your existing data from output.json
    const outputPath = path.join(process.cwd(), 'output.json')
    const outputData = require(outputPath)
    
    // Handle the galleries wrapper structure
    const galleries = outputData.galleries || outputData
    
    console.log(`Found ${galleries.length} galleries to migrate`)
    
    // Clear existing data first
    console.log('🗑️  Clearing existing data...')
    await prisma.artwork.deleteMany()
    await prisma.gallery.deleteMany()
    await prisma.category.deleteMany()
    
    for (const galleryData of galleries) {
      // Extract gallery info from the structure
      const gallerySlug = galleryData.url
      const artworks = galleryData.gallery || []
      
      // Create a default category for now (we can organize this later)
      let category = await prisma.category.findUnique({
        where: {
          slug: 'default'
        }
      })
      
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: 'Art Galleries',
            slug: 'default',
            description: 'Collection of art galleries',
            order: 0
          }
        })
      }
      
      // Create gallery
      const gallery = await prisma.gallery.create({
        data: {
          name: gallerySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug: gallerySlug,
          description: `Gallery: ${gallerySlug}`,
          order: 0,
          categoryId: category.id
        }
      })
      
      console.log(`✅ Created gallery: ${gallery.name}`)
      
      // Create artworks
      if (artworks && Array.isArray(artworks)) {
        for (const artworkData of artworks) {
          await prisma.artwork.create({
            data: {
              title: artworkData.title || 'Untitled',
              description: artworkData.description || null,
              imageUrl: artworkData.image_url || '',
              originalImageUrl: artworkData.image_url || '',
              year: null,
              medium: null,
              dimensions: null,
              price: null,
              available: true,
              order: 0,
              galleryId: gallery.id
            }
          })
        }
        console.log(`✅ Created ${artworks.length} artworks for ${gallery.name}`)
      }
    }
    
    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToPostgres()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { migrateToPostgres }
