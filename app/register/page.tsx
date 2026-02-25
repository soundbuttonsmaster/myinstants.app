import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account - MemeSoundboard.Org",
  description: "Create your free MemeSoundboard.org account to save favorite sounds and enjoy the best meme soundboard. Safe and fun for everyone!",
  keywords: ["meme soundboard account", "sign up", "register", "free account", "meme sounds"],
  openGraph: {
    title: "Create Account - MemeSoundboard.Org",
    description: "Create your free account and save your favorite meme sounds. Safe and fun!",
    url: "https://memesoundboard.org/register",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: "https://memesoundboard.org/register" },
  robots: { index: true, follow: true },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Create Account - MemeSoundboard.Org",
  description: "Create your free account to save favorite meme sounds and enjoy the soundboard.",
  url: "https://memesoundboard.org/register",
  publisher: { "@type": "Organization", name: "MemeSoundboard.org" },
}

export default function RegisterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-md px-4 py-8 sm:py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Create your account
            </h1>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Join for free and save your favorite sounds. Super easy and fun!
            </p>
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to home
            </Link>
          </p>
        </main>
        <Footer />
      </div>
    </>
  )
}
