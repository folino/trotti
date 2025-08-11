import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.artwork.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Artwork deleted successfully" })
  } catch (error) {
    console.error("Error deleting artwork:", error)
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, imageUrl, year, medium, dimensions, galleryId, available, order } = body

    const artwork = await db.artwork.update({
      where: { id },
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
      }
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error("Error updating artwork:", error)
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 })
  }
}
