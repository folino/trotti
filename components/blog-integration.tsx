"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"

interface BlogPost {
  title: string
  link: string
  published: string
  image?: string
}

export function BlogIntegration({ blogUrl }: { blogUrl: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBlogPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await fetch('/api/blog/rss')
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
        <span className="ml-2 text-stone-600">Loading latest posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchBlogPosts(true)} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 mb-4">No blog posts found</p>
        <Button onClick={() => fetchBlogPosts(true)} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
          Latest from the Blog
        </h3>
        <Button
          onClick={() => fetchBlogPosts(true)}
          variant="ghost"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.slice(0, 6).map((post, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            {post.image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center text-sm text-stone-500 dark:text-stone-400 mb-3 gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published)}</span>
              </div>
              <h4 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-4 line-clamp-2">
                {post.title}
              </h4>
              <Button
                variant="ghost"
                className="p-0 h-auto text-stone-700 hover:text-stone-900 transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  Read More
                  <ExternalLink className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="bg-stone-800 hover:bg-stone-700 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          asChild
        >
          <a href={blogUrl} target="_blank" rel="noopener noreferrer">
            Visit Full Blog
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
