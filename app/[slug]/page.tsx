import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import SoundDetailClient from "@/components/sound/sound-detail-client"
import CategoryDetailClient from "@/components/category/category-detail-client"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryBySlug } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

// Detect mobile device on server side
function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 60

interface SlugPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

// Helper to generate slug from name (same logic as in sound-button)
function generateSlug(name: string): string {
  if (!name) return ''
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special chars but keep word chars, spaces, hyphens
    .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
}

// Helper to extract ID from slug if it contains ID (fallback)
function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart, 10)
  // If last part is a valid number, it's likely the ID
  if (!isNaN(id) && id > 0 && lastPart === id.toString()) {
    return id
  }
  return null
}

/** Capitalize first letter of each word for meta title. */
function toTitleCase(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Resolve slug to sound or category for metadata — same logic as page so title/SEO match. */
async function resolveSlugForMetadata(slug: string): Promise<{ sound: Sound } | { category: { name: string } } | null> {
  if (slug.endsWith('-soundboard')) {
    const category = getCategoryBySlug(slug)
    if (category) return { category: { name: category.name } }
    return null
  }

  try {
    const idFromSlug = extractIdFromSlug(slug)
    if (idFromSlug) {
      const response = await apiClient.getSoundById(idFromSlug)
      if (response?.data) {
        const sound = response.data as Sound
        const expectedBaseSlug = generateSlug(sound.name)
        const expectedFullSlug = `${expectedBaseSlug}-${sound.id}`
        const slugWithoutId = slug.replace(`-${idFromSlug}`, '')
        if (expectedFullSlug === slug || expectedBaseSlug === slugWithoutId || expectedBaseSlug === slug) {
          return { sound }
        }
      }
    }

    const searchResult = await apiClient.searchSounds(slug.replace(/-/g, ' '), 1, 50)
    if (searchResult?.data?.results?.length > 0) {
      const matches = searchResult.data.results as Sound[]
      const sound = matches.find((s) => {
        const soundSlug = generateSlug(s.name)
        return soundSlug === slug || `${soundSlug}-${s.id}` === slug
      })
      if (sound) return { sound }
      const first = matches[0]
      const firstSlug = generateSlug(first.name)
      if (firstSlug === slug || slug.includes(firstSlug) || firstSlug.includes(slug)) return { sound: first }
    }
  } catch {
    // fall through
  }
  return null
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolveSlugForMetadata(slug)

  if (resolved && 'category' in resolved) {
    const name = resolved.category.name
    const title = `${name} Soundboard: Instant Sound Buttons | Myinstants.app`
    const description = `Explore our ${name} soundboard with trending sound buttons and meme soundboard. Download, play, and share ${name} sound effects for pranks, fun & entertainment!`
    return {
      title,
      description,
      alternates: { canonical: `${SITE.baseUrl}/${slug}` },
      openGraph: {
        title,
        description,
        url: `${SITE.baseUrl}/${slug}`,
        images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
      },
      twitter: { card: "summary_large_image", images: ["/og.jpeg"], title },
    }
  }

  if (resolved && 'sound' in resolved) {
    const sound = resolved.sound
    const title = `${sound.name} Sound Effect Download: Instant Play Sound Buttons`
    const description = `Download and play the ${sound.name} sound button for your soundboard. This trending sound effect is perfect for meme creation, gaming, streaming, and sharing viral content across platforms!`
    return {
      title,
      description,
      alternates: { canonical: `${SITE.baseUrl}/${slug}` },
      openGraph: {
        title,
        description,
        url: `${SITE.baseUrl}/${slug}`,
        images: [{ url: "/sound.jpg", width: 1200, height: 630, alt: `${SITE.name} - Sound Button` }],
      },
      twitter: { card: "summary_large_image", images: ["/sound.jpg"], title },
    }
  }

  return {
    title: `Page Not Found | ${SITE.name}`,
    description: "The page you're looking for doesn't exist.",
    robots: { index: false, follow: true },
  }
}

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  
  // Get user agent for mobile detection (once at the top)
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = isMobileDevice(userAgent)
  
  // Check if it's a category slug (ends with -soundboard)
  if (slug.endsWith('-soundboard')) {
    const category = getCategoryBySlug(slug)
    
    if (!category) {
      notFound()
    }

    const currentPage = 1
    // Desktop: 44 sounds (4 lines × 11 sounds), Mobile: 20 sounds (5 lines × 4 sounds)
    const pageSize = isMobile ? 20 : 44

    let sounds: Sound[] = []
    let count = 0
    let hasMore = false

    try {
      const soundsResponse = await apiClient.getSounds({ 
        category: category.id, 
        page: currentPage, 
        page_size: pageSize 
      })

      if (soundsResponse?.data && typeof soundsResponse.data === 'object' && 'results' in soundsResponse.data) {
        sounds = (soundsResponse.data as { results: Sound[]; count: number; next: string | null }).results || []
        count = (soundsResponse.data as { count: number }).count || 0
        hasMore = !!(soundsResponse.data as { next: string | null }).next
      }
    } catch (error) {
      console.error("Error fetching category sounds:", error)
      notFound()
    }

    const BASE = SITE.baseUrl
    const categoryUrl = `${BASE}/${slug}`

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/` },
        { "@type": "ListItem", "position": 2, "name": "Soundboard", "item": `${BASE}/new` },
        { "@type": "ListItem", "position": 3, "name": category.name, "item": categoryUrl }
      ]
    }

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": sounds.slice(0, 10).map((s, idx) => {
        const soundSlug = `${generateSlug(s.name || "")}-${s.id}`
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "AudioObject",
            "name": s.name,
            "description": `${category.name} soundboard button`,
            "url": `${BASE}/${soundSlug}`
          }
        }
      })
    }

    return (
      <div className="min-h-screen bg-background">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              {category.name} Soundboard
            </h1>
          </div>

          <CategoryDetailClient
            initialSounds={sounds}
            category={category}
            initialPage={currentPage}
            initialHasMore={hasMore}
            totalCount={count}
            isMobileDevice={isMobile}
          />
        </main>
        <Footer />
      </div>
    )
  }
  
  // Otherwise, treat as sound slug
  let sound: Sound | null = null
  let relatedSounds: Sound[] = []

  try {
    // First, try to extract ID from slug if it's in format sound-name-123
    const idFromSlug = extractIdFromSlug(slug)
    
    if (idFromSlug) {
      // Try to get sound by ID first (most reliable)
      try {
        const response = await apiClient.getSoundById(idFromSlug)
        if (response?.data) {
          sound = response.data as Sound
          // Verify slug matches: expected format is "name-id"
          const expectedBaseSlug = generateSlug(sound.name)
          const expectedFullSlug = `${expectedBaseSlug}-${sound.id}`
          const slugWithoutId = slug.replace(`-${idFromSlug}`, '')
          
          // Match if: full slug matches OR base slug matches (without ID)
          if (expectedFullSlug === slug || expectedBaseSlug === slugWithoutId || expectedBaseSlug === slug) {
            // Slug matches, use this sound - will continue to get related sounds below
          } else {
            sound = null // Slug doesn't match, continue to search
          }
        }
      } catch (error) {
        // Continue to search if ID lookup fails
      }
    }

    // If not found by ID, search by name - try multiple search strategies
    if (!sound) {
      // Try 1: Search with slug converted back to words (most common case)
      let searchQuery = slug.replace(/-/g, ' ')
      let searchResult = await apiClient.searchSounds(searchQuery, 1, 100)
      
      if (searchResult?.data?.results?.length > 0) {
        const matches = searchResult.data.results as Sound[]
        // Find EXACT match by comparing slugs
        sound = matches.find(s => {
          const soundSlug = generateSlug(s.name)
          return soundSlug === slug
        }) || null
      }
      
      // Try 2: If still not found, try fuzzy matching with all results
      if (!sound && searchResult?.data?.results?.length > 0) {
        const matches = searchResult.data.results as Sound[]
        // Try fuzzy match - check if slug matches or is very similar
        sound = matches.find(s => {
          const soundSlug = generateSlug(s.name)
          // Exact match
          if (soundSlug === slug) return true
          // Check if one contains the other (for partial matches)
          if (soundSlug.includes(slug) || slug.includes(soundSlug)) return true
          // Check if they're the same when hyphens are removed
          if (soundSlug.replace(/-/g, '') === slug.replace(/-/g, '')) return true
          // Check if the slug without last word matches (for cases like "youve-got-a-whole-lot-to-learn" vs "youve-got-a-whole-lot-to")
          const slugWords = slug.split('-')
          const soundWords = soundSlug.split('-')
          if (slugWords.length > 0 && soundWords.length > 0) {
            // Try matching without last word
            const slugBase = slugWords.slice(0, -1).join('-')
            const soundBase = soundWords.slice(0, -1).join('-')
            if (slugBase === soundBase && slugBase.length > 10) return true
            // Try matching first few words
            const minLength = Math.min(slugWords.length, soundWords.length)
            if (minLength >= 3) {
              const slugStart = slugWords.slice(0, Math.min(5, slugWords.length)).join('-')
              const soundStart = soundWords.slice(0, Math.min(5, soundWords.length)).join('-')
              if (slugStart === soundStart && slugStart.length > 15) return true
            }
          }
          return false
        }) || null
      }
      
      // Try 3: Search with partial slug (remove last word in case it's different)
      if (!sound) {
        const slugParts = slug.split('-')
        if (slugParts.length > 1) {
          // Try without last word
          const partialSlug1 = slugParts.slice(0, -1).join(' ')
          searchResult = await apiClient.searchSounds(partialSlug1, 1, 100)
          if (searchResult?.data?.results?.length > 0) {
            const matches = searchResult.data.results as Sound[]
            sound = matches.find(s => {
              const soundSlug = generateSlug(s.name)
              const baseSlug = slugParts.slice(0, -1).join('-')
              return soundSlug === slug || soundSlug === baseSlug || soundSlug.startsWith(baseSlug)
            }) || null
          }
          
          // Try without last 2 words if still not found
          if (!sound && slugParts.length > 2) {
            const partialSlug2 = slugParts.slice(0, -2).join(' ')
            searchResult = await apiClient.searchSounds(partialSlug2, 1, 100)
            if (searchResult?.data?.results?.length > 0) {
              const matches = searchResult.data.results as Sound[]
              sound = matches.find(s => {
                const soundSlug = generateSlug(s.name)
                const baseSlug = slugParts.slice(0, -2).join('-')
                return soundSlug === slug || soundSlug === baseSlug || soundSlug.startsWith(baseSlug)
              }) || null
            }
          }
        }
      }
      
      // Try 4: Search with the slug as-is
      if (!sound) {
        searchResult = await apiClient.searchSounds(slug, 1, 100)
        if (searchResult?.data?.results?.length > 0) {
          const matches = searchResult.data.results as Sound[]
          sound = matches.find(s => {
            const soundSlug = generateSlug(s.name)
            return soundSlug === slug || soundSlug.includes(slug) || slug.includes(soundSlug)
          }) || null
        }
      }
    }

    if (!sound) {
      notFound()
    }

    // Related sounds from API (same category / similar tags)
    try {
      const relatedResponse = await apiClient.getRelatedSounds(sound!.id, 44, 1, 44)
      if (relatedResponse?.data && typeof relatedResponse.data === 'object' && 'results' in relatedResponse.data) {
        relatedSounds = (relatedResponse.data as { results: Sound[] }).results.slice(0, 44)
      }
    } catch {
      // Fallback: use new sounds if related API fails
      try {
        const fallback = await apiClient.getNewSounds(1, 50)
        if (fallback?.data && typeof fallback.data === 'object' && 'results' in fallback.data) {
          relatedSounds = (fallback.data as { results: Sound[] }).results
            .filter(s => s.id !== sound!.id)
            .slice(0, 44)
        }
      } catch {
        // Silently fail
      }
    }

    // Update views
    try {
      await apiClient.updateViews(sound.id)
    } catch (error) {
      // Silently fail view updates
    }
  } catch (error) {
    console.error("Error fetching sound:", error)
    notFound()
  }

  if (!sound) {
    notFound()
  }

  return <SoundDetailClient sound={sound} relatedSounds={relatedSounds} isMobileDevice={isMobile} />
}
