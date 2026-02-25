import type { Metadata } from "next"
import { headers } from "next/headers"
import { Sparkles } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import NewSoundsList from "@/components/sound/new-sounds-list"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { SITE } from "@/lib/constants/site"

// Detect mobile device on server side
function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 60

export const metadata: Metadata = {
  title: "New Sound Buttons: Latest Meme Soundboard",
  description: "Discover the newest sound buttons on Myinstants! Fresh prank sounds, unblocked meme soundboard, and latest sound effects added daily. Play and share instantly!",
  alternates: {
    canonical: `${SITE.baseUrl}/new`,
    languages: { en: `${SITE.baseUrl}/new`, es: `${SITE.baseUrl}/es/new`, fr: `${SITE.baseUrl}/fr/new`, pt: `${SITE.baseUrl}/pt/new`, ru: `${SITE.baseUrl}/ru/new` },
  },
  openGraph: {
    title: "New Sound Buttons: Latest Meme Soundboard",
    description: "Discover the newest sound buttons on Myinstants! Fresh prank sounds, unblocked meme soundboard, and latest sound effects added daily. Play and share instantly!",
    url: `${SITE.baseUrl}/new`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default async function NewPage() {
  // Get user agent for mobile detection
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = isMobileDevice(userAgent)

  // Desktop: 44 sounds (4 lines × 11 sounds), Mobile: 20 sounds (5 lines × 4 sounds)
  const pageSize = isMobile ? 20 : 44
  let sounds: Sound[] = []
  let count = 0

  try {
    const response = await apiClient.getNewSounds(1, pageSize)
    
    if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
      sounds = (response.data as { results: Sound[]; count: number }).results || []
      count = (response.data as { count: number }).count || 0
    }
  } catch (error) {
    console.error("Error fetching new sounds:", error)
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": SITE.baseUrl },
      { "@type": "ListItem", "position": 2, "name": "New Sounds", "item": `${SITE.baseUrl}/new` }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "New Sound Buttons: Latest Meme Soundboard",
    "description": "Find new sound buttons and prank sounds added daily to Myinstants soundboard collection!",
    "url": `${SITE.baseUrl}/new`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": count,
      "itemListElement": sounds.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": { "@type": "AudioObject", "name": s.name, "url": `${SITE.baseUrl}/${s.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || 'sound'}-${s.id}` }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            <Sparkles className="h-6 w-6 text-emerald-500" />
            New Sound Buttons
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Find new sound buttons and prank sounds added daily to Myinstants soundboard collection!
          </p>
          {count > 0 && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
              {count.toLocaleString()} sounds
            </p>
          )}
        </div>

        {sounds.length > 0 ? (
          <NewSoundsList
            initialSounds={sounds}
            pageSize={pageSize}
            isMobileDevice={isMobile}
          />
        ) : (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400">No new sounds available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
