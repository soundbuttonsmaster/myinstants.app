import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import UploadSoundForm from "@/components/upload/upload-sound-form"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Upload Sound - ${SITE.domain}`,
  description: `Upload your own sound to ${SITE.domain}. Safe and fun for everyone!`,
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE.baseUrl}/upload-sound` },
  openGraph: {
    title: `Upload Sound - ${SITE.domain}`,
    url: `${SITE.baseUrl}/upload-sound`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function UploadSoundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Upload a sound
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Share your sound with everyone! Add a name and your audio file (or a link).
          </p>
          <UploadSoundForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
