import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.gallery.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Gallery deleted successfully" })
  } catch (error) {
    console.error("Error deleting gallery:", error)
    return NextResponse.json({ error: "Failed to delete gallery" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, categoryId, order } = body

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const gallery = await db.gallery.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        order: order || 0,
        categoryId,
      }
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Error updating gallery:", error)
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 })
  }
}
