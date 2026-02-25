import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PlayRandomClient from "@/components/play-random/play-random-client"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

export const metadata: Metadata = {
  title: "Play Random Sound – Fun Meme Sound Button Generator",
  description:
    "Play random meme sounds with one click! Discover fun, trending, and new sound buttons. Try your luck and enjoy endless sound surprises on memesoundboard.org.",
  openGraph: {
    title: "Play Random Sound – Fun Meme Sound Button Generator",
    description:
      "Play random meme sounds with one click! Discover fun, trending, and new sound buttons. Try your luck and enjoy endless sound surprises.",
    url: "https://memesoundboard.org/play-random",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: {
    canonical: "https://memesoundboard.org/play-random",
  },
}

async function fetchSounds(): Promise<Sound[]> {
  try {
    const [trendingResult, latestResult] = await Promise.allSettled([
      apiClient.getTrendingSounds(1, 50),
      apiClient.getNewSounds(1, 50),
    ])

    const trending: Sound[] =
      trendingResult.status === "fulfilled" && trendingResult.value?.data && "results" in trendingResult.value.data
        ? (trendingResult.value.data as { results: Sound[] }).results || []
        : []

    const latest: Sound[] =
      latestResult.status === "fulfilled" && latestResult.value?.data && "results" in latestResult.value.data
        ? (latestResult.value.data as { results: Sound[] }).results || []
        : []

    const combined = [
      ...trending,
      ...latest.filter((s) => !trending.some((t) => t.id === s.id)),
    ]

    return combined
  } catch {
    return []
  }
}

export default async function PlayRandomPage() {
  const initialSounds = await fetchSounds()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 flex flex-col">
        <PlayRandomClient initialSounds={initialSounds} />
      </main>
      <Footer />
    </div>
  )
}
