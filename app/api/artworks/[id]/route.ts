import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: {
        gallery: {
          include: {
            category: true
          }
        }
      }
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Get related artworks from the same gallery
    const relatedArtworks = await prisma.artwork.findMany({
      where: {
        galleryId: artwork.galleryId,
        id: { not: artwork.id }
      },
      take: 6,
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({
      artwork,
      relatedArtworks
    })
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
