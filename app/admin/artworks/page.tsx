import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { ArtworkForm } from "@/components/admin/artwork-form"

export default async function ArtworksPage() {
  const artworks = await prisma.artwork.findMany({
    include: {
      gallery: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      order: 'asc'
    },
    take: 20 // Limit to first 20 for performance
  })

  const galleries = await prisma.gallery.findMany({
    include: {
      category: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 transition-colors duration-300">
                Manage Artworks
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 italic transition-colors duration-300">
                Add, edit, and organize individual artworks
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Add Artwork Form */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ArtworkForm galleries={galleries} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Artworks List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Recent Artworks</h2>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Showing {artworks.length} of {artworks.length} artworks
            </div>
          </div>
          
          <div className="space-y-4">
            {artworks.map((artwork) => (
              <Card key={artwork.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                        {artwork.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">
                          {artwork.gallery.category.name} → {artwork.gallery.name}
                        </Badge>
                        <Badge variant={artwork.available ? "default" : "secondary"}>
                          {artwork.available ? "Available" : "Sold"}
                        </Badge>
                        {artwork.year && (
                          <span className="text-xs text-stone-500">
                            {artwork.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 