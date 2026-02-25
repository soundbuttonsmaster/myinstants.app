import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import FavoritesPageClient from "@/components/favorites/favorites-page-client"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `My Favorites - ${SITE.domain}`,
  description: "Your favorite sound buttons in one place. Sign in to save and sync favorites across devices!",
  openGraph: {
    title: `My Favorites - ${SITE.domain}`,
    url: `${SITE.baseUrl}/favorites`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: `${SITE.baseUrl}/favorites` },
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
