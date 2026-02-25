import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LikesPageClient from "@/components/likes/likes-page-client"

export const metadata: Metadata = {
  title: "My Likes - MemeSoundboard.Org",
  description: "Sounds you've liked. Sign in to see them.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://memesoundboard.org/likes" },
  openGraph: {
    title: "My Likes - MemeSoundboard.Org",
    url: "https://memesoundboard.org/likes",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function LikesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <LikesPageClient />
      </main>
      <Footer />
    </div>
  )
}
