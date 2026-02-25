import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"

export const metadata: Metadata = {
  title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard | MemeSoundboard.Org",
  description: "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips. Find the perfect sound for your videos, memes, streams, and more. Free to download and use.",
  keywords: [
    "search sound buttons",
    "search sound effects",
    "search meme sounds",
    "audio search",
    "sound button finder",
    "sound effect search",
    "meme audio search",
    "free sound search",
    "soundboard search"
  ],
  alternates: { canonical: "https://memesoundboard.org/search" },
  openGraph: {
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard",
    description: "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips.",
    url: "https://memesoundboard.org/search",
    siteName: "MemeSoundboard.Org",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Sound Buttons - Find Sound Effects & Meme Soundboard",
    description: "Search our vast collection of sound buttons, sound effects, meme sounds, and audio clips.",
    images: ["/og.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || ''
}

const createSearchUrl = (query: string) => {
  return `/search/${generateSlug(query)}`
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  
  // Redirect query parameters to clean URL format
  if (params.q && params.q.trim()) {
    const slug = generateSlug(params.q.trim())
    if (slug) {
      redirect(`/search/${slug}`)
    }
  }
  
  const categories = getActiveCategories()
  
  // Popular search suggestions
  const popularSearches = [
    'meme sounds',
    'sound effects',
    'audio clips',
    'soundboard',
    'funny sounds',
    'gaming sounds',
    'prank sounds',
    'voice clips',
    'cartoon sounds',
    'music sounds',
    'anime sounds',
    'movie quotes',
    'tiktok sounds',
    'discord sounds',
    'fart sounds'
  ]

  // BreadcrumbList schema only (plain search URLs, no ? or q params)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MemeSoundboard", "item": "https://memesoundboard.org" },
      { "@type": "ListItem", "position": 2, "name": "Sounds", "item": "https://memesoundboard.org/search" }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="w-full max-w-7xl mx-auto px-4">
            {/* Breadcrumb Navigation */}
            <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                </li>
                <li>
                  <span className="text-gray-700 dark:text-gray-300">Search</span>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Search Sound Buttons
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Find the perfect sound effects, meme sounds, and audio clips from our extensive collection
              </p>
            </div>

            {/* Enhanced Search Form */}
            <div className="mb-12">
              <div className="max-w-3xl mx-auto">
                <SearchBar />
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Popular Searches
              </h2>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {popularSearches.map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={createSearchUrl(suggestion)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-medium hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                How to Search Sound Buttons
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use our powerful search feature to find exactly the sound buttons you need. Simply enter your search term in the search box above, and we'll show you all matching sound effects, meme sounds, and audio clips from our extensive library.
              </p>

              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                Search Tips
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Use specific keywords for better results (e.g., "dog bark", "car horn", "meme laugh")</li>
                <li>Try different variations of your search term if you don't find what you're looking for</li>
                <li>Browse popular searches or categories for inspiration</li>
                <li>All sound buttons are free to play, download, and share</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                What Can You Search?
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Sound Effects
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Find thousands of high-quality sound effects for videos, games, and multimedia projects.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Meme Sounds
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover viral meme sounds and audio clips that are perfect for social media content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Audio Clips
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Search for music snippets, voice clips, and other audio content for your projects.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Soundboards
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Browse curated collections of sounds organized by category, theme, or popularity.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Are the sound buttons free?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! All sound buttons on MemeSoundboard.org are completely free to play, download, and use in your projects.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    How do I download a sound button?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Once you find a sound button you like, simply click the download icon on the sound card to save it as an MP3 file to your device.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Can I use these sounds in my videos?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, you can use our sound buttons in your videos, streams, memes, and other creative projects without any restrictions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    How often is the sound library updated?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We regularly add new sound buttons to our library. Check back frequently to discover the latest sounds and trending audio clips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
