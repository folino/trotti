import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const categories = await prisma.category.findMany({
    include: {
      galleries: {
        include: {
          _count: {
            select: {
              artworks: true
            }
          }
        }
      },
      _count: {
        select: {
          galleries: true
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  })

  const totalArtworks = await prisma.artwork.count()
  const availableArtworks = await prisma.artwork.count({
    where: {
      available: true
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
                Admin Dashboard
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 italic transition-colors duration-300">
                Manage Art Gallery
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Stats Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Categories</p>
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{categories.length}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Total Artworks</p>
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{totalArtworks}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Available</p>
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{availableArtworks}</p>
                  </div>
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Sold</p>
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{totalArtworks - availableArtworks}</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Management */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100">Categories</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600 dark:text-stone-400">Galleries:</span>
                      <Badge variant="outline">{category._count.galleries}</Badge>
                    </div>
                    <div className="space-y-1">
                      {category.galleries.map((gallery) => (
                        <div key={gallery.id} className="flex justify-between items-center text-sm">
                          <span className="text-stone-600 dark:text-stone-400">{gallery.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {gallery._count.artworks} artworks
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/admin/artworks">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Plus className="h-6 w-6 mb-2" />
                <span>Manage Artworks</span>
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Edit className="h-6 w-6 mb-2" />
                <span>Manage Categories</span>
              </Button>
            </Link>

            <Link href="/admin/galleries">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Edit className="h-6 w-6 mb-2" />
                <span>Manage Galleries</span>
              </Button>
            </Link>
            <Link href="/art">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Eye className="h-6 w-6 mb-2" />
                <span>View Gallery</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 