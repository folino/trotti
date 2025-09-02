import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    // Get random artworks with their gallery and category information
    const featuredArtworks = await prisma.artwork.findMany({
      take: limit,
      include: {
        gallery: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        // Use a random seed based on current time to get different results
        id: 'asc'
      }
    })

    // Shuffle the results to make them truly random
    const shuffled = featuredArtworks.sort(() => 0.5 - Math.random())

    // Transform the data to match the frontend expectations
    const transformedArtworks = shuffled.map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      category: artwork.gallery.category.name,
      image: artwork.imageUrl,
      year: artwork.year,
      medium: artwork.medium,
      available: artwork.available,
      gallerySlug: artwork.gallery.slug,
      galleryName: artwork.gallery.name
    }))

    return NextResponse.json(transformedArtworks)
  } catch (error) {
    console.error('Error fetching featured artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured artworks' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
