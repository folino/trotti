"use client"

import { useState, useEffect } from "react"
import { Calendar, ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"

interface BlogPost {
  title: string
  link: string
  published: string
  image?: string
}

export function BlogPreview({ blogUrl }: { blogUrl: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/blog/rss')
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      // Use smaller images for the preview
      const postsWithSmallImages = (data.posts || []).map((post: BlogPost) => ({
        ...post,
        image: post.image ? post.image.replace(/\/s320\//, '/s72-c/') : undefined
      }))

      setPosts(postsWithSmallImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-stone-600" />
        <span className="ml-2 text-sm text-stone-600">Loading...</span>
      </div>
    )
  }

  if (error || posts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-stone-600">Latest thoughts and reflections</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.slice(0, 2).map((post, index) => (
        <div
          key={index}
          className="border-l-2 border-stone-200 dark:border-stone-700 pl-4 transition-all duration-300 hover:border-stone-400 hover:pl-6 group"
        >
          {post.image && (
            <div className="relative h-12 w-12 mb-2 overflow-hidden rounded float-left mr-3 flex-shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="48px"
              />
            </div>
          )}
          <h5 className="font-medium text-stone-800 dark:text-stone-100 mb-1 line-clamp-1 transition-colors duration-300">
            {post.title}
          </h5>
          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 gap-2 transition-colors duration-300">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.published)}</span>
          </div>
        </div>
      ))}
    </div>
  )
} 