import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Heart, ThumbsUp, Eye, Calendar, Tag } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SoundGrid from "@/components/sound/sound-grid"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

function toTitleCase(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

interface SoundDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SoundDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const soundId = parseInt(id, 10)

  if (isNaN(soundId)) {
    return {
      title: "Sound Not Found",
    }
  }

  try {
    const response = await apiClient.getSoundById(soundId)
    if (response?.data) {
      const sound = response.data as Sound
      const title = `${sound.name} Sound Effect Download: Instant Play Sound Buttons`
      const description = `Download and play the ${sound.name} sound button for your soundboard. This trending sound effect is perfect for meme creation, gaming, streaming, and sharing viral content across platforms!`
      const canonicalSlug = `${sound.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || 'sound'}-${sound.id}`
      return {
        title,
        description,
        alternates: { canonical: `${SITE.baseUrl}/${canonicalSlug}` },
        openGraph: {
          title,
          description,
          url: `${SITE.baseUrl}/${canonicalSlug}`,
          images: [{ url: "/sound.jpg", width: 1200, height: 630, alt: `${SITE.name} - Sound Button` }],
        },
        twitter: { card: "summary_large_image", images: ["/sound.jpg"] },
      }
    }
  } catch (error) {
    // Fall through to default
  }

  return {
    title: "Sound Not Found",
  }
}

export default async function SoundDetailPage({ params }: SoundDetailPageProps) {
  const { id } = await params
  const soundId = parseInt(id, 10)

  if (isNaN(soundId)) {
    notFound()
  }

  let sound: Sound | null = null
  let relatedSounds: Sound[] = []

  try {
    const [soundResponse, relatedResponse] = await Promise.all([
      apiClient.getSoundById(soundId),
      apiClient.getRelatedSounds(soundId, 10, 1, 20).catch(() => null),
    ])

    if (soundResponse?.data) {
      sound = soundResponse.data as Sound
    }

    if (relatedResponse?.data && typeof relatedResponse.data === 'object' && 'results' in relatedResponse.data) {
      relatedSounds = (relatedResponse.data as { results: Sound[] }).results || []
    } else if (relatedResponse?.data && Array.isArray(relatedResponse.data)) {
      // Handle case where related sounds might be returned as array directly
      relatedSounds = relatedResponse.data as Sound[]
    }

    // Update views
    try {
      await apiClient.updateViews(soundId)
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

  const slugBase = sound.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || 'sound'
  const soundSlug = `${slugBase}-${sound.id}`
  const canonicalUrl = `${SITE.baseUrl}/${soundSlug}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": SITE.baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Sounds", "item": `${SITE.baseUrl}/search` },
      { "@type": "ListItem", "position": 3, "name": sound.name, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              {sound.name}
            </h1>

            <div className="mb-6">
              <audio
                controls
                className="w-full"
                src={sound.sound_file}
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{sound.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{sound.likes_count.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{sound.favorites_count.toLocaleString()} favorites</span>
                </div>
              </div>

              {sound.created_at && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Added {new Date(sound.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {sound.tags && sound.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sound.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-900 dark:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sound.category_name && sound.category_id && (
              <div className="mt-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">Category: </span>
                <Link
                  href={`/${getCategoryById(sound.category_id)?.slug || (sound.category_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-soundboard'}`}
                  className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
                >
                  {sound.category_name}
                </Link>
              </div>
            )}
          </div>

          {relatedSounds.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                Related Sounds
              </h2>
              <SoundGrid sounds={relatedSounds} maxMobile={8} />
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
