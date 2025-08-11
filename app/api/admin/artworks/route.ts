import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, year, medium, dimensions, galleryId, available, order } = body

    const artwork = await db.artwork.create({
      data: {
        title,
        description,
        imageUrl,
        year,
        medium,
        dimensions,
        available: available ?? true,
        order: order || 0,
        galleryId,
      },
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Error creating artwork:', error)
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const artworks = await db.artwork.findMany({
      include: {
        gallery: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
} 