import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProfilePageClient from "@/components/auth/profile-page-client"

export const metadata: Metadata = {
  title: "My Profile - MemeSoundboard.Org",
  description: "View and update your MemeSoundboard.org profile. Safe and fun for everyone!",
  openGraph: {
    title: "My Profile - MemeSoundboard.Org",
    url: "https://memesoundboard.org/profile",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: "https://memesoundboard.org/profile" },
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
