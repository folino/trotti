"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  order: number
}

export default function TestDeletePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    setLoading(true)
    setResult("")

    try {
      console.log(`Attempting to delete category with ID: ${id}`)
      
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      console.log(`Delete response status: ${response.status}`)
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(`Success: ${JSON.stringify(data, null, 2)}`)
        // Refresh the categories list
        fetchCategories()
      } else {
        setResult(`Error: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`Exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-6">
          Test Delete Functionality
        </h1>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="bg-white dark:bg-stone-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                      {category.name}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {category.description}
                    </p>
                    <p className="text-xs text-stone-500">
                      ID: {category.id} | Slug: {category.slug} | Order: {category.order}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {result && (
          <div className="mt-6 bg-white dark:bg-stone-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto">{result}</pre>
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center text-stone-600 dark:text-stone-400">
            No categories found. Create some categories first.
          </div>
        )}
      </div>
    </div>
  )
}
