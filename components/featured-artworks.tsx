"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Artwork {
  id: string
  title: string
  category: string
  image: string
  year?: string
  medium?: string
  available?: boolean
  gallerySlug?: string
  galleryName?: string
}

interface FeaturedArtworksProps {
  limit?: number
  showInGrid?: boolean
}

export function FeaturedArtworks({ limit = 6, showInGrid = false }: FeaturedArtworksProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedArtworks() {
      try {
        setLoading(true)
        const response = await fetch(`/api/featured-artworks?limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured artworks')
        }
        
        const data = await response.json()
        setArtworks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching featured artworks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArtworks()
  }, [limit])

  if (loading) {
    if (showInGrid) {
      return (
        <>
          {Array.from({ length: limit }).map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
        </>
      )
    }
    
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-600 dark:text-stone-400">
          Unable to load featured artworks. Please try again later.
        </p>
      </div>
    )
  }

  if (showInGrid) {
    return (
      <>
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className="aspect-square rounded-lg overflow-hidden transition-all duration-300 hover:scale-110"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              width={200}
              height={200}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {artworks.map((artwork, index) => (
        <Card
          key={artwork.id}
          className="group hover:shadow-xl transition-all duration-500 ease-out overflow-hidden hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              width={600}
              height={400}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>
          <CardContent className="p-6 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-serif text-lg text-stone-800 dark:text-stone-100 transition-colors duration-300">
                {artwork.title}
              </h4>
              <Badge variant="outline" className="transition-all duration-300 hover:scale-105">
                {artwork.category}
              </Badge>
            </div>
            {artwork.year && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">
                {artwork.year}
              </p>
            )}
            {artwork.medium && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                {artwork.medium}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Badge 
                variant={artwork.available ? "default" : "secondary"} 
                className="text-xs"
              >
                {artwork.available ? "Available" : "Private Collection"}
              </Badge>
              {artwork.gallerySlug && (
                <Link 
                  href={`/art/gallery/${artwork.gallerySlug}`}
                  className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors duration-300"
                >
                  View Gallery →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
