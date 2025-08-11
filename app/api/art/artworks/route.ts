import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const galleryId = searchParams.get('galleryId')
    const available = searchParams.get('available')

    let where: any = {}

    if (categoryId) {
      where.gallery = {
        categoryId
      }
    }

    if (galleryId) {
      where.galleryId = galleryId
    }

    if (available !== null) {
      where.available = available === 'true'
    }

    const artworks = await db.artwork.findMany({
      where,
      include: {
        gallery: {
          include: {
            category: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { title: 'asc' }
      ]
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