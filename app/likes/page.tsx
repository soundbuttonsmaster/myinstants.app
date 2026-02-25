import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LikesPageClient from "@/components/likes/likes-page-client"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `My Likes - ${SITE.domain}`,
  description: "Sounds you've liked. Sign in to see them.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE.baseUrl}/likes` },
  openGraph: {
    title: `My Likes - ${SITE.domain}`,
    url: `${SITE.baseUrl}/likes`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
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
