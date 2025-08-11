import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ZoomIn } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

interface GalleryPageProps {
  params: {
    slug: string
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const gallery = await prisma.gallery.findFirst({
    where: { slug: params.slug },
    include: {
      artworks: {
        orderBy: {
          order: "asc"
        }
      },
      category: true
    }
  })

  if (!gallery || !gallery.category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-center">
              <Link href="/" className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 transition-colors duration-300 hover:opacity-80">
                Ricardo Trotti
              </Link>
              <p className="text-sm text-stone-600 dark:text-stone-400 italic transition-colors duration-300">
                Art & Prose
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/art">
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Gallery Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline">
                {gallery.category.name}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
              {gallery.name}
            </h1>
            {gallery.description && (
              <p className="text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                {gallery.description}
              </p>
            )}
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-4 transition-colors duration-300">
              {gallery.artworks.length} artwork{gallery.artworks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.artworks.map((artwork) => (
              <Card key={artwork.id} className="group hover:shadow-xl transition-all duration-500 ease-out overflow-hidden hover:scale-105 hover:-translate-y-2">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-stone-800"
                      asChild
                    >
                      <Link href={`/art/${artwork.id}`}>
                        <ZoomIn className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-stone-800 dark:text-stone-100 transition-colors duration-300">
                      {artwork.title}
                    </h3>
                    <Badge 
                      variant={artwork.available ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {artwork.available ? "Available" : "Sold"}
                    </Badge>
                  </div>
                  {artwork.medium && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 transition-colors duration-300 mb-2">
                      {artwork.medium}
                    </p>
                  )}
                  {artwork.dimensions && (
                    <p className="text-xs text-stone-500 dark:text-stone-500 transition-colors duration-300 mb-2">
                      {artwork.dimensions}
                    </p>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 p-0 h-auto text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100"
                    asChild
                  >
                    <Link href={`/art/${artwork.id}`}>
                      View Details →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <h5 className="font-medium mb-4">Artwork</h5>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <Link href="/art" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Home
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

            <div>
              <h5 className="font-medium mb-4">Connect</h5>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <Link href="http://www.ricardotrottiblog.com/" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Books
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
