import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - MemeSoundboard.Org",
  description: "Create a new password for your MemeSoundboard.org account.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://memesoundboard.org/reset-password" },
  openGraph: {
    title: "Reset Password - MemeSoundboard.Org",
    url: "https://memesoundboard.org/reset-password",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

type Props = { searchParams: Promise<{ uid?: string; token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams
  const uid = params.uid ?? ""
  const token = params.token ?? ""

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Create new password
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Pick a new password you&apos;ll remember. At least 8 characters!
          </p>
          <ResetPasswordForm uid={uid} token={token} />
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
