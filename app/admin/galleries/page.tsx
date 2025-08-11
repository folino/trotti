import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { GalleryForm } from "@/components/admin/gallery-form"

export default async function GalleriesPage() {
  const galleries = await db.gallery.findMany({
    include: {
      _count: {
        select: {
          artworks: true
        }
      },
      category: true
    },
    orderBy: {
      order: 'asc'
    }
  })

  const categories = await db.category.findMany({
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
                Manage Galleries
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 italic transition-colors duration-300">
                Add, edit, and organize art galleries
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

      {/* Add Gallery Form */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryForm categories={categories} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Galleries List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-6">Existing Galleries</h2>
          
          <div className="space-y-4">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                        {gallery.name}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                        {gallery.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">
                          {gallery.category.name}
                        </Badge>
                        <Badge variant="outline">
                          {gallery._count.artworks} artworks
                        </Badge>
                        <span className="text-xs text-stone-500">
                          Order: {gallery.order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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