"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TestCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    order: 0
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult("")

    try {
      console.log("Submitting:", formData)
      
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`Success: ${JSON.stringify(data, null, 2)}`)
        setFormData({ name: "", description: "", slug: "", order: 0 })
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
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-6">
          Test Category Form
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-stone-800 p-6 rounded-lg shadow">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Create Category"}
          </Button>
        </form>

        {result && (
          <div className="mt-6 bg-white dark:bg-stone-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
