import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, categoryId, order } = body

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const gallery = await db.gallery.create({
      data: {
        name,
        description,
        slug,
        order: order || 0,
        categoryId,
      },
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const galleries = await db.gallery.findMany({
      include: {
        category: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    )
  }
} 