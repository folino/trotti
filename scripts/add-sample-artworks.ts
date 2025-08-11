import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample artwork data for empty galleries
const sampleArtworks = {
  "grazing": [
    {
      title: "Grazing in the Meadow",
      description: "Acrylic on canvas. 36 x 48 inches. 2020. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_c591e7b686824bd9bd56bd322f5192c3~mv2.jpg",
      year: "2020",
      medium: "Acrylic",
      dimensions: "36 x 48 inches",
      available: true
    },
    {
      title: "Peaceful Pasture",
      description: "Oil on canvas. 30 x 40 inches. 2019. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_36d9de3b6380408bb032ccb5ed4552b9~mv2_d_1386_1751_s_2.jpg",
      year: "2019",
      medium: "Oil",
      dimensions: "30 x 40 inches",
      available: true
    },
    {
      title: "Sunset Grazing",
      description: "Watercolor on paper. 24 x 18 inches. 2021. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_168c7eee513a4fe7a92ec5db8a536f40~mv2.jpg",
      year: "2021",
      medium: "Watercolor",
      dimensions: "24 x 18 inches",
      available: true
    }
  ],
  "copy-of-anarchy-the-masters": [
    {
      title: "Unicyclist in Motion",
      description: "Acrylic and mixed media on canvas. 40 x 60 inches. 2018. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_4dbe012e3bca4216bfb9b53b714b71ac~mv2.jpg",
      year: "2018",
      medium: "Acrylic and mixed media",
      dimensions: "40 x 60 inches",
      available: true
    },
    {
      title: "Balancing Act",
      description: "Oil on canvas. 36 x 48 inches. 2019. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_e8f1ef71463645efae4a549e1704a904~mv2.jpg",
      year: "2019",
      medium: "Oil",
      dimensions: "36 x 48 inches",
      available: true
    },
    {
      title: "Circus Dreams",
      description: "Mixed media on paper. 30 x 22 inches. 2020. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_a4a317bafd944ae2a1c510e9e5960a3c~mv2.jpg",
      year: "2020",
      medium: "Mixed media",
      dimensions: "30 x 22 inches",
      available: true
    }
  ],
  "still-life": [
    {
      title: "Still Life with Flowers",
      description: "Oil on canvas. 24 x 30 inches. 2021. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_3b53de4aa34a4fada45c5c02bc2078cc~mv2.jpg",
      year: "2021",
      medium: "Oil",
      dimensions: "24 x 30 inches",
      available: true
    },
    {
      title: "Fruit Bowl",
      description: "Acrylic on canvas. 20 x 24 inches. 2020. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_d7fc786f9fa440a397b141da9e2bf582~mv2.jpg",
      year: "2020",
      medium: "Acrylic",
      dimensions: "20 x 24 inches",
      available: true
    },
    {
      title: "Vase and Flowers",
      description: "Watercolor on paper. 18 x 24 inches. 2019. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_21f4ef74bbe14002bcde545408f551bf~mv2_d_1501_2047_s_2.jpg",
      year: "2019",
      medium: "Watercolor",
      dimensions: "18 x 24 inches",
      available: true
    }
  ],
  "journalism-and-free-press": [
    {
      title: "Press Freedom",
      description: "Mixed media on canvas. 48 x 36 inches. 2020. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_5c54d4351778488eb2230f6ee38b28b9~mv2.jpg",
      year: "2020",
      medium: "Mixed media",
      dimensions: "48 x 36 inches",
      available: true
    },
    {
      title: "Truth Seekers",
      description: "Acrylic on canvas. 40 x 30 inches. 2019. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_e7d68a6700344db994254cd19444cc19~mv2.jpg",
      year: "2019",
      medium: "Acrylic",
      dimensions: "40 x 30 inches",
      available: true
    },
    {
      title: "Free Speech",
      description: "Oil on canvas. 36 x 48 inches. 2021. Available.",
      imageUrl: "https://static.wixstatic.com/media/c2c7fb_20427a1dc7fe40a5aa1b19b88c5777f1~mv2.jpg",
      year: "2021",
      medium: "Oil",
      dimensions: "36 x 48 inches",
      available: true
    }
  ]
}

async function addSampleArtworks() {
  console.log('Adding sample artworks to empty galleries...')

  try {
    for (const [gallerySlug, artworks] of Object.entries(sampleArtworks)) {
      console.log(`\nProcessing gallery: ${gallerySlug}`)

      // Find the gallery
      const gallery = await prisma.gallery.findFirst({
        where: { slug: gallerySlug }
      })

      if (!gallery) {
        console.log(`  ⚠️  Gallery not found: ${gallerySlug}`)
        continue
      }

      // Check if gallery already has artworks
      const existingArtworks = await prisma.artwork.count({
        where: { galleryId: gallery.id }
      })

      if (existingArtworks > 0) {
        console.log(`  ⚠️  Gallery already has ${existingArtworks} artworks, skipping`)
        continue
      }

      console.log(`  ✓ Found empty gallery: ${gallery.name}`)

      // Add sample artworks
      for (let i = 0; i < artworks.length; i++) {
        const artwork = artworks[i]
        
        try {
          const createdArtwork = await prisma.artwork.create({
            data: {
              title: artwork.title,
              description: artwork.description,
              imageUrl: artwork.imageUrl,
              year: artwork.year,
              medium: artwork.medium,
              dimensions: artwork.dimensions,
              available: artwork.available,
              order: i,
              galleryId: gallery.id
            }
          })

          console.log(`    ✓ Added: ${artwork.title}`)

        } catch (error) {
          console.log(`    ❌ Error adding artwork: ${error}`)
        }
      }
    }

    console.log('\n✅ Sample artworks added successfully!')

  } catch (error) {
    console.error('Error adding sample artworks:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleArtworks()
