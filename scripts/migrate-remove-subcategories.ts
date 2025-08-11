import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateRemoveSubcategories() {
  console.log('Starting migration to remove subcategories...')

  try {
    // Step 1: Add categoryId column to galleries table
    console.log('Step 1: Adding categoryId column to galleries...')
    await prisma.$executeRaw`ALTER TABLE galleries ADD COLUMN categoryId TEXT`
    
    // Step 2: Migrate data from subcategories to direct category relationship
    console.log('Step 2: Migrating data...')
    const subcategories = await prisma.subcategory.findMany({
      include: {
        galleries: true
      }
    })

    console.log(`Found ${subcategories.length} subcategories to migrate`)

    for (const subcategory of subcategories) {
      console.log(`Migrating subcategory: ${subcategory.name}`)
      
      // Update all galleries in this subcategory to point to the category using raw SQL
      await prisma.$executeRaw`
        UPDATE galleries 
        SET categoryId = ${subcategory.categoryId} 
        WHERE subcategoryId = ${subcategory.id}
      `
      
      console.log(`  - Updated ${subcategory.galleries.length} galleries`)
    }

    // Step 3: Remove subcategoryId column
    console.log('Step 3: Removing subcategoryId column...')
    await prisma.$executeRaw`ALTER TABLE galleries DROP COLUMN subcategoryId`
    
    // Step 4: Drop subcategories table
    console.log('Step 4: Dropping subcategories table...')
    await prisma.$executeRaw`DROP TABLE subcategories`

    console.log('Migration completed successfully!')
    console.log('You can now update the schema and run: npx prisma db push')

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateRemoveSubcategories()
