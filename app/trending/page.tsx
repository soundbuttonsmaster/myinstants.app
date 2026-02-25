import type { Metadata } from "next"
import { headers } from "next/headers"
import { Star } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TrendingSoundsList from "@/components/sound/trending-sounds-list"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

// Detect mobile device on server side
function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export const revalidate = 60

export const metadata: Metadata = {
  title: "Trending Soundboard: Popular Meme Sounds | MemeSoundboard.org",
  description: "Play & Listen to the most trending sounds with viral sound buttons, funny soundboard, meme buttons and top sound effects. No registration required!",
  alternates: { canonical: "https://memesoundboard.org/trending" },
  openGraph: {
    title: "Trending Soundboard: Popular Meme Sounds | MemeSoundboard.org",
    description: "Play & Listen to the most trending sounds with viral sound buttons, funny soundboard, meme buttons and top sound effects. No registration required!",
    url: "https://memesoundboard.org/trending",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default async function TrendingPage() {
  // Get user agent for mobile detection
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = isMobileDevice(userAgent)

  // Desktop: 44 sounds (4 lines × 11 sounds), Mobile: 20 sounds (5 lines × 4 sounds)
  const pageSize = isMobile ? 20 : 44
  let sounds: Sound[] = []
  let count = 0

  try {
    const response = await apiClient.getTrendingSounds(1, pageSize)
    if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
      sounds = (response.data as { results: Sound[]; count: number }).results || []
      count = (response.data as { count: number }).count || 0
    }
  } catch (error) {
    console.error("Error fetching trending sounds:", error)
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MemeSoundboard", "item": "https://memesoundboard.org" },
      { "@type": "ListItem", "position": 2, "name": "Trending Sounds", "item": "https://memesoundboard.org/trending" }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Trending Meme Soundboard Buttons",
    "description": "Discover the hottest trending meme soundboard buttons. Play the most viral and funny sound effects.",
    "url": "https://memesoundboard.org/trending",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": count,
      "itemListElement": sounds.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": { "@type": "AudioObject", "name": s.name, "url": `https://memesoundboard.org/${s.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || 'sound'}-${s.id}` }
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
            <Star className="h-6 w-6 text-amber-500" fill="currentColor" />
            Trending Meme Soundboard Buttons
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Discover the hottest trending meme soundboard buttons right now! Play the most viral and funny sound effects everyone is using on Discord, streams and chats. Totally free and unblocked!
          </p>
          {count > 0 && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
              {count.toLocaleString()} sounds
            </p>
          )}
        </div>

        {sounds.length > 0 ? (
          <TrendingSoundsList
            initialSounds={sounds}
            pageSize={pageSize}
            isMobileDevice={isMobile}
          />
        ) : (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400">No trending sounds available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
