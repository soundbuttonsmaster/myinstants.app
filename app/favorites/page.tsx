import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import FavoritesPageClient from "@/components/favorites/favorites-page-client"

export const metadata: Metadata = {
  title: "My Favorites - MemeSoundboard.Org",
  description: "Your favorite meme sounds in one place. Sign in to save and sync favorites across devices!",
  openGraph: {
    title: "My Favorites - MemeSoundboard.Org",
    url: "https://memesoundboard.org/favorites",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: "https://memesoundboard.org/favorites" },
  robots: { index: false, follow: true },
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <FavoritesPageClient />
      </main>
      <Footer />
    </div>
  )
}
