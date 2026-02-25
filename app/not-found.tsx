import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "404 - Page Not Found | MemeSoundboard.org",
  description: "The page you're looking for doesn't exist. Browse our collection of meme sounds, sound effects, and trending audio clips.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: { canonical: "https://memesoundboard.org/404" },
  openGraph: {
    title: "404 - Page Not Found | MemeSoundboard.org",
    description: "The page you're looking for doesn't exist. Browse our collection of meme sounds and sound effects.",
    url: "https://memesoundboard.org/404",
    siteName: "MemeSoundboard.org",
    type: "website",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpeg"],
    title: "404 - Page Not Found | MemeSoundboard.org",
    description: "The page you're looking for doesn't exist. Browse our collection of meme sounds and sound effects.",
  },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Oops! The sound or page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What would you like to do?
            </h3>
            <div className="space-y-4">
              <Link
                href="/"
                className="block w-full bg-black hover:bg-gray-900 dark:bg-black dark:hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm border-2 border-gray-700 dark:border-gray-700"
              >
                Go to Homepage
              </Link>
              <Link
                href="/trending"
                className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Browse Trending Sounds
              </Link>
              <Link
                href="/new"
                className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Check Out New Sounds
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              If you believe this is an error, please{" "}
              <Link href="/search" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                search for sounds
              </Link>{" "}
              or return to the{" "}
              <Link href="/" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                homepage
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
