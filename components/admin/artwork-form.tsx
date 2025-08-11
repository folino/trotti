"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface Gallery {
  id: string
  name: string
  category: {
    name: string
  }
}

interface ArtworkFormProps {
  galleries: Gallery[]
}

export function ArtworkForm({ galleries }: ArtworkFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [year, setYear] = useState("")
  const [medium, setMedium] = useState("")
  const [dimensions, setDimensions] = useState("")
  const [galleryId, setGalleryId] = useState("")
  const [available, setAvailable] = useState(true)
  const [order, setOrder] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          year,
          medium,
          dimensions,
          galleryId,
          available,
          order: parseInt(order),
        }),
      })

      if (response.ok) {
        setTitle("")
        setDescription("")
        setImageUrl("")
        setYear("")
        setMedium("")
        setDimensions("")
        setGalleryId("")
        setAvailable(true)
        setOrder("0")
        router.refresh()
      } else {
        console.error("Failed to create artwork")
      }
    } catch (error) {
      console.error("Error creating artwork:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Artwork Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Grazing Series I"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gallery">Gallery</Label>
          <Select value={galleryId} onValueChange={setGalleryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a gallery" />
            </SelectTrigger>
            <SelectContent>
              {galleries.map((gallery) => (
                <SelectItem key={gallery.id} value={gallery.id}>
                  {gallery.category.name} → {gallery.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the artwork"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medium">Medium</Label>
          <Input
            id="medium"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="e.g., Oil on Canvas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="e.g., 120 x 80 cm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="available"
            checked={available}
            onCheckedChange={(checked) => setAvailable(checked as boolean)}
          />
          <Label htmlFor="available">Available for Purchase</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Artwork"}
      </Button>
    </form>
  )
} 