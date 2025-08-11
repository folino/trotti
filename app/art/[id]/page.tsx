import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Tag, ExternalLink } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

interface ArtworkPageProps {
  params: {
    id: string
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: params.id },
    include: {
      gallery: {
        include: {
          category: true
        }
      }
    }
  })

  if (!artwork) {
    notFound()
  }

  // Get related artworks from the same gallery
  const relatedArtworks = await prisma.artwork.findMany({
    where: {
      galleryId: artwork.galleryId,
      id: { not: artwork.id }
    },
    take: 6,
    orderBy: {
      order: "asc"
    }
  })

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

      {/* Artwork Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out hover:shadow-3xl">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {artwork.gallery.category.name}
                  </Badge>
                  <Badge 
                    variant={artwork.available ? "default" : "secondary"} 
                    className="text-sm"
                  >
                    {artwork.available ? "Available" : "Sold"}
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
                  {artwork.title}
                </h1>

                {artwork.description && (
                  <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-6 transition-colors duration-300">
                    {artwork.description}
                  </p>
                )}

                <div className="space-y-4">
                  {artwork.year && (
                    <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 transition-colors duration-300">
                      <Calendar className="w-5 h-5 text-stone-500" />
                      <span>{artwork.year}</span>
                    </div>
                  )}
                  
                  {artwork.medium && (
                    <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-stone-500" />
                      <span>{artwork.medium}</span>
                    </div>
                  )}
                  
                  {artwork.dimensions && (
                    <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 transition-colors duration-300">
                      <Tag className="w-5 h-5 text-stone-500" />
                      <span>{artwork.dimensions}</span>
                    </div>
                  )}

                  {artwork.price && (
                    <div className="text-2xl font-semibold text-stone-800 dark:text-stone-100 transition-colors duration-300">
                      ${artwork.price}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Info */}
              <Card className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm border-stone-200 dark:border-stone-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2 transition-colors duration-300">
                    From: {artwork.gallery.name}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 transition-colors duration-300">
                    {artwork.gallery.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {artwork.gallery.category.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {artwork.available && (
                  <Button 
                    size="lg" 
                    className="bg-stone-800 hover:bg-stone-700 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Inquire About Purchase
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-stone-300 bg-transparent transition-all duration-300 ease-out hover:scale-105 hover:shadow-md hover:bg-stone-50 dark:hover:bg-stone-800"
                  asChild
                >
                  <Link href={`/art/gallery/${artwork.gallery.slug}`}>
                    View More from This Gallery
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <section className="py-16 bg-white dark:bg-stone-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-8 text-center transition-colors duration-300">
              More from {artwork.gallery.name}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArtworks.map((relatedArtwork) => (
                <Card key={relatedArtwork.id} className="group hover:shadow-xl transition-all duration-500 ease-out overflow-hidden hover:scale-105 hover:-translate-y-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={relatedArtwork.imageUrl}
                      alt={relatedArtwork.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-stone-800 dark:text-stone-100 transition-colors duration-300">
                        {relatedArtwork.title}
                      </h3>
                      <Badge 
                        variant={relatedArtwork.available ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {relatedArtwork.available ? "Available" : "Sold"}
                      </Badge>
                    </div>
                    {relatedArtwork.medium && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 transition-colors duration-300">
                        {relatedArtwork.medium}
                      </p>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 p-0 h-auto text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100"
                      asChild
                    >
                      <Link href={`/art/${relatedArtwork.id}`}>
                        View Details →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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




