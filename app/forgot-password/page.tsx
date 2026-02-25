import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Forgot Password - ${SITE.domain}`,
  description: `Reset your ${SITE.domain} password. We'll send you a link to create a new password.`,
  openGraph: {
    title: `Forgot Password - ${SITE.domain}`,
    url: `${SITE.baseUrl}/forgot-password`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: `${SITE.baseUrl}/forgot-password` },
  robots: { index: false, follow: true },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Forgot password?
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Enter your email and we&apos;ll send you a link to create a new password.
          </p>
          <ForgotPasswordForm />
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link href="/login" className="font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
