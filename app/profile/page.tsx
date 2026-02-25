import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProfilePageClient from "@/components/auth/profile-page-client"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `My Profile - ${SITE.domain}`,
  description: `View and update your ${SITE.domain} profile. Safe and fun for everyone!`,
  openGraph: {
    title: `My Profile - ${SITE.domain}`,
    url: `${SITE.baseUrl}/profile`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: `${SITE.baseUrl}/profile` },
  robots: { index: false, follow: true },
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <ProfilePageClient />
      </main>
      <Footer />
    </div>
  )
}
