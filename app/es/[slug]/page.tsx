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

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 60

interface SlugPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

function generateSlug(name: string): string {
  if (!name) return ''
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart, 10)
  if (!isNaN(id) && id > 0 && lastPart === id.toString()) return id
  return null
}

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
        if (expectedFullSlug === slug || expectedBaseSlug === slugWithoutId || expectedBaseSlug === slug) return { sound }
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
  const canonicalUrl = `${SITE.baseUrl}/es/${slug}`

  if (resolved && 'category' in resolved) {
    const name = resolved.category.name
    const title = `${name} Soundboard: Botones de Sonido | Myinstants.app`
    const description = `Explora el soundboard ${name} con botones de sonido en tendencia. Descarga, reproduce y comparte efectos de ${name} para bromas, diversión y entretenimiento.`
    return {
      title,
      description,
      metadataBase: new URL(SITE.baseUrl),
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${SITE.baseUrl}/${slug}`,
          es: canonicalUrl,
          fr: `${SITE.baseUrl}/fr/${slug}`,
          pt: `${SITE.baseUrl}/pt/${slug}`,
          ru: `${SITE.baseUrl}/ru/${slug}`,
        },
      },
      openGraph: {
        locale: "es_ES",
        title,
        description,
        url: canonicalUrl,
        images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
      },
      twitter: { card: "summary_large_image", images: ["/og.jpeg"], title },
    }
  }

  if (resolved && 'sound' in resolved) {
    const sound = resolved.sound
    const title = `${sound.name} Efecto de Sonido | Botones de Sonido Instantáneos`
    const description = `Descarga y reproduce el botón de sonido ${sound.name}. Efecto de sonido perfecto para memes, gaming, streaming y compartir contenido viral en todas las plataformas.`
    return {
      title,
      description,
      metadataBase: new URL(SITE.baseUrl),
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${SITE.baseUrl}/${slug}`,
          es: canonicalUrl,
          fr: `${SITE.baseUrl}/fr/${slug}`,
          pt: `${SITE.baseUrl}/pt/${slug}`,
          ru: `${SITE.baseUrl}/ru/${slug}`,
        },
      },
      openGraph: {
        locale: "es_ES",
        title,
        description,
        url: canonicalUrl,
        images: [{ url: "/sound.jpg", width: 1200, height: 630, alt: `${SITE.name} - Botón de sonido` }],
      },
      twitter: { card: "summary_large_image", images: ["/sound.jpg"], title },
    }
  }

  return {
    title: `Página no encontrada | ${SITE.name}`,
    description: "La página que buscas no existe.",
    robots: { index: false, follow: true },
  }
}

export default async function SpanishSlugPage({ params, searchParams }: SlugPageProps) {
  const { slug } = await params
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = isMobileDevice(userAgent)

  if (slug.endsWith('-soundboard')) {
    const category = getCategoryBySlug(slug)
    if (!category) notFound()

    const currentPage = 1
    const pageSize = isMobile ? 20 : 44
    let sounds: Sound[] = []
    let count = 0
    let hasMore = false

    try {
      const soundsResponse = await apiClient.getSounds({
        category: category.id,
        page: currentPage,
        page_size: pageSize,
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
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": `${BASE}/es` },
        { "@type": "ListItem", "position": 2, "name": "Soundboard", "item": `${BASE}/es/new` },
        { "@type": "ListItem", "position": 3, "name": category.name, "item": `${BASE}/es/${slug}` },
      ],
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
            "description": `Botón del soundboard ${category.name}`,
            "url": `${BASE}/${soundSlug}`,
          },
        }
      }),
    }

    return (
      <div className="min-h-screen bg-background">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Soundboard de {category.name}
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

  let sound: Sound | null = null
  let relatedSounds: Sound[] = []

  try {
    const idFromSlug = extractIdFromSlug(slug)
    if (idFromSlug) {
      try {
        const response = await apiClient.getSoundById(idFromSlug)
        if (response?.data) {
          const s = response.data as Sound
          const expectedBaseSlug = generateSlug(s.name)
          const expectedFullSlug = `${expectedBaseSlug}-${s.id}`
          const slugWithoutId = slug.replace(`-${idFromSlug}`, '')
          if (expectedFullSlug === slug || expectedBaseSlug === slugWithoutId || expectedBaseSlug === slug) sound = s
          else sound = null
        }
      } catch {
        // continue
      }
    }

    if (!sound) {
      let searchQuery = slug.replace(/-/g, ' ')
      let searchResult = await apiClient.searchSounds(searchQuery, 1, 100)
      if (searchResult?.data?.results?.length > 0) {
        const matches = searchResult.data.results as Sound[]
        sound = matches.find(s => generateSlug(s.name) === slug) || null
      }
      if (!sound && searchResult?.data?.results?.length > 0) {
        const matches = searchResult.data.results as Sound[]
        sound = matches.find(s => {
          const soundSlug = generateSlug(s.name)
          return soundSlug === slug || soundSlug.includes(slug) || slug.includes(soundSlug)
        }) || null
      }
      if (!sound) {
        const slugParts = slug.split('-')
        if (slugParts.length > 1) {
          searchResult = await apiClient.searchSounds(slugParts.slice(0, -1).join(' '), 1, 100)
          if (searchResult?.data?.results?.length > 0) {
            const matches = searchResult.data.results as Sound[]
            sound = matches.find(s => {
              const soundSlug = generateSlug(s.name)
              const baseSlug = slugParts.slice(0, -1).join('-')
              return soundSlug === slug || soundSlug.startsWith(baseSlug)
            }) || null
          }
        }
      }
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

    if (!sound) notFound()

    try {
      const relatedResponse = await apiClient.getRelatedSounds(sound.id, 44, 1, 44)
      if (relatedResponse?.data && typeof relatedResponse.data === 'object' && 'results' in relatedResponse.data) {
        relatedSounds = (relatedResponse.data as { results: Sound[] }).results.slice(0, 44)
      }
    } catch {
      try {
        const fallback = await apiClient.getNewSounds(1, 50)
        if (fallback?.data && typeof fallback.data === 'object' && 'results' in fallback.data) {
          relatedSounds = (fallback.data as { results: Sound[] }).results
            .filter(s => s.id !== sound!.id)
            .slice(0, 44)
        }
      } catch {
        // ignore
      }
    }

    try {
      await apiClient.updateViews(sound.id)
    } catch {
      // ignore
    }
  } catch (error) {
    console.error("Error fetching sound:", error)
    notFound()
  }

  if (!sound) notFound()

  return <SoundDetailClient sound={sound} relatedSounds={relatedSounds} isMobileDevice={isMobile} />
}
