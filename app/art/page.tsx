import Image from "next/image"
import { getOptimizedImageUrl } from "@/lib/cloudinary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ArrowLeft, ArrowRight, ZoomIn, Calendar, MapPin, Tag } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrismaClient } from "@prisma/client"

// Use Prisma types instead of custom interfaces
type Category = any
type Gallery = any
type Artwork = any

// Fetch data directly from Prisma
async function getCategories(): Promise<Category[]> {
  const prisma = new PrismaClient()
  
  const categories = await prisma.category.findMany({
    include: {
      galleries: {
        include: {
          artworks: {
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  })
  
  return categories
}

export default async function ArtPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo art and prose.jpg"
                  alt="Art & Prose Logo"
                  width={160}
                  height={50}
                  className="h-10 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
            </div>

            {/* Name in the center */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 transition-colors duration-300">
                Ricardo Trotti
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 italic transition-colors duration-300">
                Art & Prose
              </p>
            </div>

            {/* Menu on the right */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-100 mb-6 transition-colors duration-300">
              Artwork Gallery
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Explore four decades of artistic evolution through carefully curated collections. 
              Each piece tells a story, captures a moment, or explores a theme that has shaped my creative journey.
            </p>
          </div>
        </div>
      </section>

      {/* Art Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={categories[0]?.slug || "newart"} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.slug} className="text-sm md:text-base">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
                    {category.name}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto transition-colors duration-300">
                    {category.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.galleries.map((gallery: any) => (
                    /* Single gallery card with image, name, description, and view gallery button */
                    gallery.artworks && gallery.artworks.length > 0 && (
                      <Card key={gallery.id} className="group hover:shadow-xl transition-all duration-500 ease-out overflow-hidden hover:scale-105 hover:-translate-y-2">
                        <div className="aspect-[4/3] overflow-hidden relative">
                                                        <Image
                                src={gallery.artworks[0].imageUrl}
                                alt={gallery.name}
                                width={400}
                                height={300}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                // If using Cloudinary, you can optimize the URL
                                // src={gallery.artworks[0].imageUrl.includes('cloudinary.com') 
                                //   ? getOptimizedImageUrl(gallery.artworks[0].imageUrl, 400, 300)
                                //   : gallery.artworks[0].imageUrl
                                // }
                              />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-stone-800"
                              asChild
                            >
                              <Link href={`/art/gallery/${gallery.slug}`}>
                                <ZoomIn className="h-4 w-4 mr-2" />
                                View Gallery
                              </Link>
                            </Button>
                          </div>
                        </div>
                                                    <CardContent className="p-4">
                              <h4 className="font-serif text-lg text-stone-800 dark:text-stone-100 transition-colors duration-300 mb-2">
                                <Link href={`/art/gallery/${gallery.slug}`} className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-300 cursor-pointer">
                                  {gallery.name}
                                </Link>
                              </h4>
                          {gallery.description && (
                            <p className="text-sm text-stone-600 dark:text-stone-400 transition-colors duration-300 mb-4">
                              {gallery.description}
                            </p>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            asChild
                          >
                            <Link href={`/art/gallery/${gallery.slug}`}>
                              View Gallery ({gallery.artworks.length} artworks)
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-serif mb-4">Ricardo Trotti</h4>
              <p className="text-stone-300 mb-4">Art & Prose</p>
              <p className="text-stone-400 text-sm">
                Exploring artistic expression through four decades of creative evolution.
              </p>
            </div>

            <div>
              <h5 className="font-medium mb-4">Artwork Categories</h5>
              <ul className="space-y-2 text-stone-300">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`#${category.slug}`} className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium mb-4">Connect</h5>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <Link href="/" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="http://www.ricardotrottiblog.com/" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:trottiart@gmail.com"
                    className="hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2024 Ricardo Trotti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 