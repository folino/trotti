"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
  id: string
  type: 'category' | 'artwork' | 'gallery'
  onDelete?: () => void
}

export function DeleteButton({ id, type, onDelete }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return
    }

    setIsLoading(true)

    try {
      // Proper pluralization for API endpoints
      const getPluralType = (type: string) => {
        switch (type) {
          case 'category':
            return 'categories'
          case 'gallery':
            return 'galleries'
          case 'artwork':
            return 'artworks'
          default:
            return `${type}s`
        }
      }

      const url = `/api/admin/${getPluralType(type)}/${id}`
      console.log(`Attempting to delete ${type} with ID: ${id}`)
      console.log(`DELETE URL: ${url}`)

      const response = await fetch(url, {
        method: 'DELETE',
      })

      console.log(`Delete response status: ${response.status}`)

      if (response.ok) {
        const result = await response.json()
        console.log(`Successfully deleted ${type}:`, result)
        if (onDelete) {
          onDelete()
        } else {
          // Force a hard refresh to ensure the UI updates
          window.location.reload()
        }
      } else {
        const error = await response.json()
        console.error(`Failed to delete ${type}:`, error)
        alert(`Failed to delete ${type}: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      alert(`Failed to delete ${type}: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
} 