import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params
  
  try {
    const gallery = await prisma.gallery.findFirst({
      where: { slug },
      include: {
        artworks: {
          orderBy: {
            order: 'asc'
          }
        },
        category: true
      }
    })

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
