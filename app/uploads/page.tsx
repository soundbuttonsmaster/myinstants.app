import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import UploadsPageClient from "@/components/uploads/uploads-page-client"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `My Uploads - ${SITE.domain}`,
  description: "Sounds you've uploaded. Sign in to see and manage your uploads.",
  openGraph: {
    title: `My Uploads - ${SITE.domain}`,
    url: `${SITE.baseUrl}/uploads`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: `${SITE.baseUrl}/uploads` },
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
