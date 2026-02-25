import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import UploadsPageClient from "@/components/uploads/uploads-page-client"

export const metadata: Metadata = {
  title: "My Uploads - MemeSoundboard.Org",
  description: "Sounds you've uploaded. Sign in to see and manage your uploads.",
  openGraph: {
    title: "My Uploads - MemeSoundboard.Org",
    url: "https://memesoundboard.org/uploads",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: "https://memesoundboard.org/uploads" },
  robots: { index: false, follow: true },
}

export default function UploadsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <UploadsPageClient />
      </main>
      <Footer />
    </div>
  )
}
