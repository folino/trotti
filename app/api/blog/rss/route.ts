import { NextResponse } from 'next/server'

interface RSSItem {
  title: string
  link: string
  published: string
  image?: string
}

export async function GET() {
  try {
    // Use environment variable for RSS feed URL, with fallback to FeedBurner
    const rssUrl = process.env.BLOG_RSS_URL || 'https://feeds.feedburner.com/PrensaYExpresin'
    
    console.log(`Fetching RSS from: ${rssUrl}`)
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RicardoTrottiWebsite/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlText = await response.text()
    console.log('XML length:', xmlText.length)
    
    // Parse XML to extract blog posts
    const posts = parseRSSFeed(xmlText)
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', debug: { error: error instanceof Error ? error.message : String(error) } },
      { status: 500 }
    )
  }
}

function parseRSSFeed(xmlText: string): RSSItem[] {
  const posts: RSSItem[] = []
  
  try {
    console.log('Starting RSS parsing...')
    
    // Check if it's Atom format (uses <entry> tags) or RSS format (uses <item> tags)
    const isAtomFormat = xmlText.includes('<entry>')
    
    if (isAtomFormat) {
      console.log('Detected Atom format, parsing entries...')
      // Parse Atom format - extract title, link, published, and image
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
      const titleRegex = /<title[^>]*>(.*?)<\/title>/
      const linkRegex = /<link[^>]*rel='alternate'[^>]*href='([^']*)'/
      const publishedRegex = /<published>(.*?)<\/published>/
      const mediaThumbnailRegex = /<media:thumbnail[^>]*url="([^"]*)"/
      const contentRegex = /<content[^>]*type='html'>(.*?)<\/content>/
      
      let match
      let count = 0
      
      while ((match = entryRegex.exec(xmlText)) !== null && count < 10) {
        count++
        const entryContent = match[1]
        
        const titleMatch = entryContent.match(titleRegex)
        const linkMatch = entryContent.match(linkRegex)
        const publishedMatch = entryContent.match(publishedRegex)
        const mediaThumbnailMatch = entryContent.match(mediaThumbnailRegex)
        const contentMatch = entryContent.match(contentRegex)
        
        if (titleMatch && linkMatch && publishedMatch) {
          const title = titleMatch[1].trim()
          const link = linkMatch[1].trim()
          const published = publishedMatch[1].trim()
          
          // Extract image from media:thumbnail first, then from content
          let image: string | undefined
          
          if (mediaThumbnailMatch) {
            image = mediaThumbnailMatch[1].trim()
            // Replace s72-c with s320 for larger images
            image = image.replace(/\/s72-c\//, '/s320/')
          } else if (contentMatch) {
            // Try to extract image from HTML content
            const imgRegex = /<img[^>]*src="([^"]*)"/
            const imgMatch = contentMatch[1].match(imgRegex)
            if (imgMatch) {
              image = imgMatch[1].trim()
              // Replace s72-c with s320 for larger images
              image = image.replace(/\/s72-c\//, '/s320/')
            }
          }
          
          posts.push({
            title,
            link,
            published,
            image
          })
          
          console.log(`Found post ${count}: ${title}${image ? ' (with image)' : ''}`)
        }
      }
      
      console.log(`Total posts found: ${posts.length}`)
    } else {
      console.log('Detected RSS format, parsing items...')
      // Parse RSS format - extract title, link, pubDate, and image
      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      const titleRegex = /<title[^>]*>(.*?)<\/title>/
      const linkRegex = /<link[^>]*>(.*?)<\/link>/
      const pubDateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/
      const mediaThumbnailRegex = /<media:thumbnail[^>]*url="([^"]*)"/
      const descriptionRegex = /<description[^>]*>(.*?)<\/description>/
      
      let match
      let count = 0
      
      while ((match = itemRegex.exec(xmlText)) !== null && count < 10) {
        count++
        const itemContent = match[1]
        
        const titleMatch = itemContent.match(titleRegex)
        const linkMatch = itemContent.match(linkRegex)
        const pubDateMatch = itemContent.match(pubDateRegex)
        const mediaThumbnailMatch = itemContent.match(mediaThumbnailRegex)
        const descriptionMatch = itemContent.match(descriptionRegex)
        
        if (titleMatch && linkMatch && pubDateMatch) {
          const title = titleMatch[1].trim()
          const link = linkMatch[1].trim()
          const published = pubDateMatch[1].trim()
          
          // Extract image from media:thumbnail first, then from description
          let image: string | undefined
          
          if (mediaThumbnailMatch) {
            image = mediaThumbnailMatch[1].trim()
            // Replace s72-c with s320 for larger images
            image = image.replace(/\/s72-c\//, '/s320/')
          } else if (descriptionMatch) {
            // Try to extract image from HTML description
            const imgRegex = /<img[^>]*src="([^"]*)"/
            const imgMatch = descriptionMatch[1].match(imgRegex)
            if (imgMatch) {
              image = imgMatch[1].trim()
              // Replace s72-c with s320 for larger images
              image = image.replace(/\/s72-c\//, '/s320/')
            }
          }
          
          posts.push({
            title,
            link,
            published,
            image
          })
          
          console.log(`Found post ${count}: ${title}${image ? ' (with image)' : ''}`)
        }
      }
      
      console.log(`Total posts found: ${posts.length}`)
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
  }
  
  return posts
} 