import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import LoginForm from "@/components/auth/login-form"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Sign In - ${SITE.domain}`,
  description: `Sign in to your ${SITE.domain} account to access your favorite sounds. Safe and fun for everyone!`,
  keywords: ["sound buttons login", "sign in", "account", "Myinstants"],
  openGraph: {
    title: `Sign In - ${SITE.domain}`,
    description: "Sign in to your account and enjoy your saved favorite sound buttons.",
    url: `${SITE.baseUrl}/login`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: `${SITE.baseUrl}/login` },
  robots: { index: true, follow: true },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Sign In - ${SITE.domain}`,
  description: "Sign in to your account to access your favorite sound buttons.",
  url: `${SITE.baseUrl}/login`,
  publisher: { "@type": "Organization", name: SITE.domain },
}

export default function LoginPage() {
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
              Welcome back!
            </h1>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Sign in to get to your favorite sounds.
            </p>
            <Suspense fallback={<div className="animate-pulse h-64 rounded-lg bg-slate-200 dark:bg-slate-700" />}>
              <LoginForm />
            </Suspense>
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
