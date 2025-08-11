export interface Artwork {
  id: number
  title: string
  description: string
  image: string
  year: string
  medium: string
  dimensions: string
  price?: string
  available?: boolean
}

export interface Gallery {
  id: string
  title: string
  description: string
  images: Artwork[]
}

export interface ArtCategory {
  id: string
  title: string
  description: string
  galleries: Gallery[]
}

export const artCategories: Record<string, ArtCategory> = {
  newArt: {
    id: "newArt",
    title: "NewArt",
    description: "Contemporary works exploring modern themes and techniques, representing the latest evolution in my artistic journey",
    galleries: [
      {
        id: "grazing-series",
        title: "Grazing Series",
        description: "A collection exploring the relationship between nature and human intervention, using contemporary techniques to capture pastoral themes",
        images: [
          {
            id: 1,
            title: "Grazing Series I",
            description: "The first in a series exploring pastoral themes with contemporary techniques. This piece captures the essence of rural life through abstract forms and earthy tones. The composition suggests the rhythmic patterns of grazing animals while maintaining a modern, minimalist aesthetic.",
            image: "https://static.wixstatic.com/media/c2c7fb_30a7ea254bfd482998b54c43a2ecda1b~mv2.jpg/v1/fit/w_2632,h_1340,q_90,enc_avif,quality_auto/c2c7fb_30a7ea254bfd482998b54c43a2ecda1b~mv2.jpg",
            year: "2024",
            medium: "Mixed Media on Canvas",
            dimensions: "120 x 80 cm",
            available: true
          },
          {
            id: 2,
            title: "Grazing Series II",
            description: "Continuing the exploration of pastoral themes, this piece delves deeper into the abstract representation of grazing patterns and natural rhythms. The warm earth tones create a sense of connection to the land and its cycles.",
            image: "https://static.wixstatic.com/media/c2c7fb_38b50ff9a7d4423f9cf0a3e5b16b5eb4~mv2_d_1404_1536_s_2.jpg/v1/fit/w_2058,h_1047,q_90,enc_avif,quality_auto/c2c7fb_38b50ff9a7d4423f9cf0a3e5b16b5eb4~mv2_d_1404_1536_s_2.jpg",
            year: "2024",
            medium: "Mixed Media on Canvas",
            dimensions: "100 x 100 cm",
            available: true
          }
        ]
      },
      {
        id: "pastoral-harmony",
        title: "Pastoral Harmony",
        description: "Works that celebrate the peaceful coexistence of human and natural worlds, exploring themes of balance and harmony",
        images: [
          {
            id: 3,
            title: "Pastoral Harmony I",
            description: "A meditation on the harmonious relationship between human cultivation and natural landscapes. The piece uses warm earth tones to evoke a sense of timeless connection between humanity and the environment.",
            image: "https://static.wixstatic.com/media/c2c7fb_38b50ff9a7d4423f9cf0a3e5b16b5eb4~mv2_d_1404_1536_s_2.jpg/v1/fit/w_2058,h_1047,q_90,enc_avif,quality_auto/c2c7fb_38b50ff9a7d4423f9cf0a3e5b16b5eb4~mv2_d_1404_1536_s_2.jpg",
            year: "2024",
            medium: "Oil on Canvas",
            dimensions: "150 x 120 cm",
            available: true
          }
        ]
      },
      {
        id: "contemporary-explorations",
        title: "Contemporary Explorations",
        description: "Modern interpretations of classical themes using contemporary materials and techniques",
        images: [
          {
            id: 4,
            title: "Urban Rhythm",
            description: "A contemporary take on urban landscapes, capturing the dynamic energy of city life through abstract geometric forms and bold color choices.",
            image: "/placeholder.jpg",
            year: "2024",
            medium: "Acrylic on Canvas",
            dimensions: "140 x 100 cm",
            available: false
          }
        ]
      }
    ]
  },
  earlier: {
    id: "earlier",
    title: "Earlier Works",
    description: "Foundational pieces that established the artist's creative journey and early artistic vision",
    galleries: [
      {
        id: "silent-fields",
        title: "Silent Fields",
        description: "Early explorations of landscape and memory, capturing the quiet majesty of rural environments",
        images: [
          {
            id: 5,
            title: "Silent Fields I",
            description: "One of the earliest pieces in the collection, this work captures the quiet majesty of rural landscapes. The muted palette reflects the contemplative nature of the subject matter, while the composition suggests the vastness and solitude of open fields.",
            image: "https://static.wixstatic.com/media/c2c7fb_572b14a93d194f3cb73d702c1fe678dc~mv2.jpg/v1/fit/w_2632,h_1340,q_90,enc_avif,quality_auto/c2c7fb_572b14a93d194f3cb73d702c1fe678dc~mv2.jpg",
            year: "1985",
            medium: "Oil on Canvas",
            dimensions: "80 x 60 cm",
            available: false
          }
        ]
      },
      {
        id: "early-portraits",
        title: "Early Portraits",
        description: "Early figurative work exploring human expression and character",
        images: [
          {
            id: 6,
            title: "Portrait Study I",
            description: "An early exploration of human form and expression, this piece demonstrates the foundational skills that would later inform more abstract work.",
            image: "/placeholder.jpg",
            year: "1983",
            medium: "Charcoal on Paper",
            dimensions: "50 x 40 cm",
            available: false
          }
        ]
      }
    ]
  },
  jourArt: {
    id: "jourArt",
    title: "JourArt",
    description: "Travel-inspired works capturing moments and places from around the world, documenting artistic journeys",
    galleries: [
      {
        id: "travel-sketches",
        title: "Travel Sketches",
        description: "Quick impressions and studies from various journeys, capturing the essence of different cultures and landscapes",
        images: [
          {
            id: 7,
            title: "Venice Morning",
            description: "A quick sketch capturing the morning light on the canals of Venice. The loose brushwork conveys the fleeting nature of travel memories and the atmospheric quality of the city at dawn.",
            image: "/placeholder.jpg",
            year: "2019",
            medium: "Watercolor on Paper",
            dimensions: "30 x 40 cm",
            available: true
          },
          {
            id: 8,
            title: "Paris Café",
            description: "A vibrant study of Parisian café culture, capturing the energy and atmosphere of a typical Paris morning through bold colors and dynamic composition.",
            image: "/placeholder.jpg",
            year: "2018",
            medium: "Gouache on Paper",
            dimensions: "25 x 35 cm",
            available: true
          }
        ]
      },
      {
        id: "mediterranean-series",
        title: "Mediterranean Series",
        description: "Works inspired by the light and colors of the Mediterranean region",
        images: [
          {
            id: 9,
            title: "Santorini Light",
            description: "Capturing the unique quality of Mediterranean light, this piece explores the interplay between white architecture and the brilliant blue of the Aegean Sea.",
            image: "/placeholder.jpg",
            year: "2020",
            medium: "Oil on Canvas",
            dimensions: "90 x 70 cm",
            available: true
          }
        ]
      }
    ]
  },
  sculpture: {
    id: "sculpture",
    title: "Sculpture",
    description: "Three-dimensional works exploring form and space, representing a different dimension of artistic expression",
    galleries: [
      {
        id: "abstract-forms",
        title: "Abstract Forms",
        description: "Sculptural explorations of abstract concepts and human emotion through three-dimensional form",
        images: [
          {
            id: 10,
            title: "Contemplation",
            description: "A bronze sculpture exploring the human form in a moment of deep reflection. The piece invites viewers to consider their own inner journey and the universal experience of contemplation.",
            image: "/placeholder.jpg",
            year: "2020",
            medium: "Bronze",
            dimensions: "60 x 40 x 30 cm",
            available: true
          },
          {
            id: 11,
            title: "Dancing Forms",
            description: "A dynamic sculpture capturing movement and rhythm through abstract forms. The piece suggests the fluidity of dance and the energy of human expression.",
            image: "/placeholder.jpg",
            year: "2021",
            medium: "Steel and Bronze",
            dimensions: "80 x 50 x 40 cm",
            available: true
          }
        ]
      },
      {
        id: "natural-forms",
        title: "Natural Forms",
        description: "Sculptural interpretations of natural elements and organic shapes",
        images: [
          {
            id: 12,
            title: "River Stone",
            description: "A polished stone sculpture that mimics the smooth, worn surfaces of river stones. The piece celebrates the natural beauty of geological forms.",
            image: "/placeholder.jpg",
            year: "2019",
            medium: "Marble",
            dimensions: "45 x 35 x 25 cm",
            available: false
          }
        ]
      }
    ]
  }
}

export const getArtworkById = (id: number): Artwork | undefined => {
  for (const category of Object.values(artCategories)) {
    for (const gallery of category.galleries) {
      const artwork = gallery.images.find(img => img.id === id)
      if (artwork) return artwork
    }
  }
  return undefined
}

export const getAllArtworks = (): Artwork[] => {
  const artworks: Artwork[] = []
  for (const category of Object.values(artCategories)) {
    for (const gallery of category.galleries) {
      artworks.push(...gallery.images)
    }
  }
  return artworks
}

export const getAvailableArtworks = (): Artwork[] => {
  return getAllArtworks().filter(artwork => artwork.available)
} 