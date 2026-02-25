import React from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api/client';
import type { Sound } from '@/lib/types/sound';
import { getActiveCategories, type Category } from '@/lib/constants/categories';
import SoundList from '@/components/home/SoundList';
import AutoLoadingNewSoundsSection from '@/components/home/AutoLoadingNewSoundsSection';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

// ISR: Revalidate every 60s for fast pages with fresh data
export const revalidate = 60

// Enhanced SEO Metadata for Home Page
export const metadata: Metadata = {
  title: "Meme Soundboard: 1,00,000+ Play Sound Effect Buttons",
  description: "Play & Listen tons of Meme Soundboard Unblocked with sound buttons, funny soundboards and instant sound effects. Easy to use, no registration required!",
  keywords: [
    "meme soundboard",
    "meme sounds",
    "sound effects",
    "audio clips",
    "free sounds",
    "meme audio",
    "soundboard",
    "unblocked soundboard",
    "meme buttons",
    "funny sounds",
    "viral sounds",
    "trending sounds",
    "discord sounds",
    "streaming sounds",
    "soundboard unblocked",
    "free audio",
    "instant play sounds",
    "meme sound effects",
    "reaction sounds",
    "comedy sounds"
  ],
  authors: [{ name: "MemeSoundboard.org", url: "https://memesoundboard.org" }],
  creator: "MemeSoundboard.org",
  publisher: "MemeSoundboard.org",
  metadataBase: new URL("https://memesoundboard.org"),
  alternates: {
    canonical: "https://memesoundboard.org",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://memesoundboard.org",
    siteName: "MemeSoundboard.org",
    title: "Meme Soundboard: 1,00,000+ Play Sound Effect Buttons",
    description: "Play & Listen tons of Meme Soundboard Unblocked with sound buttons, funny soundboards and instant sound effects. Easy to use, no registration required!",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "MemeSoundboard.org - Free Meme Sounds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meme Soundboard: 1,00,000+ Play Sound Effect Buttons",
    description: "Play & Listen tons of Meme Soundboard Unblocked with sound buttons, funny soundboards and instant sound effects. Easy to use, no registration required!",
    images: ["/og.jpeg"],
    creator: "@memesoundboard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "entertainment",
  classification: "Meme Soundboard, Sound Effects, Audio Clips",
  other: {
    "application-name": "MemeSoundboard",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export default async function HomePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') ?? '';
  // Prefer the more reliable Client Hint header, fall back to User-Agent parsing
  const mobileHint = headersList.get('sec-ch-ua-mobile'); // '?1' = mobile, '?0' = desktop
  const isMobile = mobileHint === '?1' 
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);

  // Fetch initial data
  // Desktop: 44 sounds (4 lines × 11 sounds)
  // Mobile: 16 sounds (4 lines × 4 sounds)
  const trendingCount = isMobile ? 16 : 44;
  const newCount = 22;

  let trendingSounds: Sound[] = [];
  let newSounds: Sound[] = [];

  try {
    const [trendingResult, newResult] = await Promise.allSettled([
      apiClient.getTrendingSounds(1, trendingCount),
      apiClient.getNewSounds(1, newCount)
    ]);

    if (trendingResult.status === 'fulfilled') {
      const response = trendingResult.value;
      // Handle both wrapped and direct response formats
      if (response.data && 'results' in response.data) {
        trendingSounds = (response.data as { results: Sound[] }).results || [];
      } else if ('results' in response) {
        trendingSounds = (response as { results: Sound[] }).results || [];
      }
    }

    if (newResult.status === 'fulfilled') {
      const response = newResult.value;
      // Handle both wrapped and direct response formats
      if (response.data && 'results' in response.data) {
        newSounds = (response.data as { results: Sound[] }).results || [];
      } else if ('results' in response) {
        newSounds = (response as { results: Sound[] }).results || [];
      }
    }
  } catch (error) {
    console.error('Error fetching sounds:', error);
  }

  const categories = getActiveCategories()
  const SITE = "https://memesoundboard.org"

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MemeSoundboard.org",
    "url": `${SITE}/`,
    "description": "MemeSoundboard.org - Ultimate collection of unblocked meme soundboard, sound buttons, with thousands of sound effects and meme buttons.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
      { "@type": "ListItem", "position": 2, "name": "New", "item": `${SITE}/new` },
      { "@type": "ListItem", "position": 3, "name": "Trending", "item": `${SITE}/trending` },
      ...categories.map((cat: Category, i: number) => ({
        "@type": "ListItem",
        "position": 4 + i,
        "name": `${cat.name} Soundboard`,
        "item": `${SITE}/${cat.slug || (cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-soundboard")}`
      }))
    ]
  }

  const personOrgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "MemeSoundboard Team",
        "jobTitle": "Founder & Creator",
        "worksFor": { "@type": "Organization", "name": "MemeSoundboard.org" },
        "email": "contact@memesoundboard.org",
        "address": { "@type": "PostalAddress", "addressCountry": "US" },
        "sameAs": [SITE]
      },
      {
        "@type": "Organization",
        "name": "MemeSoundboard.org",
        "url": `${SITE}/`,
        "logo": `${SITE}/og.jpeg`,
        "email": "contact@memesoundboard.org",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "email": "contact@memesoundboard.org",
          "areaServed": "Worldwide"
        },
        "address": { "@type": "PostalAddress", "addressCountry": "US" },
        "founder": { "@type": "Person", "name": "MemeSoundboard Team" }
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personOrgSchema) }} />
      <Header />
      {/* Hero Section */}
      <section className="hero-section-lcp" suppressHydrationWarning>
        <div className="hero-container-lcp">
          <div className="hero-inner-lcp">
            <h1 className="hero-title-lcp">
              MemeSoundboard.org: 100,000+ Free Meme Sound Buttons and Soundboard Unblocked
            </h1>
            <p className="hero-text-lcp">
              Explore a huge collection of hilarious meme sounds, sound effects, and unblocked soundboards all free! Play instantly from your smartphone, desktop, Chromebook, or tablet. No downloads required - works everywhere!
            </p>
            {/* Server-rendered search form - renders immediately without JavaScript */}
            <div className="flex justify-center mt-2 px-2">
              <form 
                action="/search" 
                method="get" 
                className="flex max-w-2xl md:max-w-3xl w-full shadow-lg"
              >
                <div className="relative flex-1">
                  <input
                    type="search"
                    name="q"
                    placeholder="Search Sound buttons..."
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border-2 border-gray-700 dark:border-gray-700 rounded-l-lg rounded-r-none border-r-0 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Search Sound buttons"
                  className="h-10 sm:h-12 px-4 sm:px-6 bg-black hover:bg-gray-900 dark:bg-black dark:hover:bg-gray-900 text-white font-bold rounded-l-none rounded-r-lg border-2 border-gray-700 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col bg-background">
        <main className="flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto pt-2 pb-0 px-2 sm:px-4 lg:px-6">
            
            {/* Trending Sounds - 4 lines in compact view */}
            <div className="trending-sounds-container">
              <SoundList
                title="Trending Meme Soundboard"
                sounds={trendingSounds}
                initialCount={isMobile ? 16 : 44}
                loadMoreCount={isMobile ? 8 : 22}
                viewAllLink="/trending"
                hasMoreSounds={false}
                maxLines={4}
                useCardView={false}
                useCompactView={true}
                showLoadMore={!isMobile}
                showRedirectButton={true}
                showLoadingIndicator={false}
                isMobileDevice={isMobile}
              />
            </div>
            
            {/* New Sounds - Auto-loading with inline ads */}
            <div className="new-sounds-container">
              <AutoLoadingNewSoundsSection
                initialSounds={newSounds}
                isMobileDevice={isMobile}
              />
            </div>
          </div>
        </main>
      </div>

      {/* About Content Section - Above Footer */}
      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white dark:bg-gray-900">
        <hr className="mb-8 border-gray-300 dark:border-gray-700" />
        <h2 id="introduction" className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 scroll-mt-20">
          MemeSoundboard.org: Your Daily Dose of Sound Effects Chaos - The Ultimate Meme Soundboard 2026
        </h2> 
        
        {/* Table of Contents */}
        <nav className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Table of Contents</h3>
          <ol className="space-y-2 text-base text-gray-700 dark:text-gray-300 list-decimal list-inside ml-2">
            <li><a href="#introduction" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Introduction</a></li>
            <li><a href="#what-are-sound-buttons" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">What are Sound Buttons?</a></li>
            <li><a href="#what-are-meme-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">What are Meme Soundboard?</a></li>
            <li><a href="#what-you-get" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">What You're Actually Getting Here</a></li>
            <li><a href="#quality-sounds" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Sounds That Don't Sound Like Trash</a></li>
            <li><a href="#works-everywhere" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Works at School, Work, Wherever</a></li>
            <li><a href="#easy-to-use" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Just Click and It Plays</a></li>
            <li><a href="#organization" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">How We've Organized This</a></li>
            <li><a href="#meme-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Meme Soundboard</a></li>
            <li><a href="#streamers" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Perfect for Streamers and Creators</a></li>
            <li><a href="#discord" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Perfect for Discord and Just Hanging Out</a></li>
            <li><a href="#how-it-works" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">How This Actually Works</a></li>
            <li><a href="#why-exists" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Why This Site Exists</a></li>
            <li><a href="#faq" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Frequently Asked Questions</a></li>
            <li><a href="#about-author" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">About MemeSoundboard.org & Contact</a></li>
          </ol>
        </nav>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Welcome to MemeSoundboard.org! Whether you're searching for that perfect Vine boom for your Discord server or need a soundboard that actually works at school, you've found the right place. Thousands of people have made this their go-to spot for <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">meme sounds</Link> and funny audio clips.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          We built this site because we got tired of soundboards that are blocked, full of garbage quality sounds, or so cluttered you can't find anything. So we fixed all that stuff.
        </p>

        <section id="what-are-sound-buttons" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            What are Sound Buttons?
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Sound buttons are interactive clickable buttons that play audio clips instantly when you click them - no downloads or installations needed. On MemeSoundboard.org, we offer the largest collection of free <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">meme sound buttons</Link>, <Link href="/reactions-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">funny sound buttons</Link>, <Link href="/sound-effects-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">sound effects</Link>, and <Link href="/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">trending sound buttons</Link>. Our sound buttons work instantly in any browser on computers, phones, tablets, and even at school where other sites might be blocked. Perfect for <Link href="/games-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">content creators</Link>, streamers, students, and anyone who wants instant access to quality audio clips - all completely free with no registration required.
          </p>
        </section>

        <section id="what-are-meme-soundboard" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            What are Meme Soundboard?
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            A <strong>meme soundboard</strong> is an interactive collection of viral audio clips, funny sound effects, and popular meme sounds organized into clickable buttons that play instantly in your browser. Unlike traditional soundboards that require downloads or apps, our <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">browser-based meme soundboard</Link> works directly in your web browser - no installation needed. At MemeSoundboard.org, we've built the largest <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">free meme soundboard collection</Link> featuring thousands of trending sounds from TikTok, Vine, YouTube, Discord, and other platforms. Our collection includes everything from classic reaction sounds like &quot;Vine boom&quot; and &quot;bruh&quot; to the latest viral audio clips that are trending right now. Whether you're a content creator looking for <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">meme clips for your videos</Link>, a streamer needing reaction sounds for your broadcasts, or just someone who wants to have fun with funny audio clips, our meme soundboard is completely free and works everywhere - even on restricted networks at school or work. Every sound is hand-curated for quality, ensuring clean audio that won't sound muffled or distorted. Plus, we're constantly updated with new viral sounds, so you'll always have access to the <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">latest meme sounds</Link>.
          </p>
        </section>

        <section id="what-you-get" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            What You're Actually Getting Here
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            We've built up a massive collection of <Link href="/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">popular trending sounds</Link> over the past couple years. Everything from classic meme soundboard clips to that weird sound effect you heard on TikTok last week. The whole thing works in your browser no downloads, ever.
          </p>
        </section>

        <section id="quality-sounds" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Sounds That Don't Sound Like Trash
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Every single sound is clean audio. We actually listen to stuff before adding it. If it sounds muffled or the levels are all over the place, it doesn't make the cut. We've got your standard <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">curated meme buttons</Link>, and we also dig through the internet constantly looking for new trending sounds. When something goes viral, we usually have it up within a few days.
          </p>
        </section>

        <section id="works-everywhere" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Works at School, Work, Wherever
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            This is probably the main reason most people stick around. Our site works on restricted networks. We spent a lot of time testing this on different networks because getting blocked is incredibly annoying. This is a proper <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">soundboard unblocked</Link> that you can actually rely on.
          </p>
        </section>

        <section id="easy-to-use" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Just Click and It Plays
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            No signup forms. No email verification. No "watch this ad first" nonsense. You see a sound you want, you click it, it plays immediately. Want to use sounds on your phone? Works great. Tablet? Yep. Your ancient laptop from 2015? Probably fine.
          </p>
        </section>

        <section id="organization" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            How We've Organized This
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            With thousands of sounds, organization matters. Browse by category:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-base text-gray-700 dark:text-gray-300 mb-3 ml-4">
            <li><Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">The Meme Section</Link> - Every meme soundboard clip you've ever wanted</li>
            <li><Link href="/reactions-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Funny Stuff</Link> - Designed for making your friends crack up</li>
            <li><Link href="/games-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Gaming Sounds</Link> - Iconic sounds from popular games</li>
            <li><Link href="/movies-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Movie and TV Clips</Link> - Famous quotes and dramatic moments</li>
            <li><Link href="/sound-effects-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Sound Effects</Link> - Professional tones and effects for alerts</li>
          </ul>
        </section>

        <section id="meme-soundboard" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Meme Soundboard
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Our <Link href="/memes-soundboard" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">meme soundboard is the heart of MemeSoundboard.org</Link>. It's where every meme soundboard clip you've ever wanted lives. From classic Vine booms to the latest TikTok trends, our collection is constantly updated with the most viral sounds. Whether you're looking for reaction sounds, funny clips, or that perfect meme button for your Discord server, our meme soundboard has you covered.
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            What makes our meme soundboard special? Every sound is hand-picked for quality and relevance. We don't just dump random audio files we curate the best meme sounds that people actually want to use. When a new meme goes viral, we're usually one of the first to have it available on our meme soundboard. Plus, our meme soundboard works everywhere, even on restricted networks, making it the perfect unblocked meme soundboard for school, work, or anywhere else.
          </p>
        </section>

        <section id="streamers" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Perfect for Streamers and Creators
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Every sound button here is broadcast quality. These are clean, properly leveled, well edited clips that won't make your stream sound amateur. We try to stay on top of trends, adding new <Link href="/new" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">sounds weekly</Link>. Our <Link href="/search" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">search actually works well</Link>, and you can save favorites for quick access.
          </p>
        </section>

        <section id="discord" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Perfect for Discord and Just Hanging Out
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Playing sounds through Discord is super easy. You can trigger them through your mic or share links to specific sounds. Whether it's gaming with friends or just hanging out in voice chat, having instant access to thousands of funny sounds changes the vibe entirely.
          </p>
        </section>

        <section id="how-it-works" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            How This Actually Works
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-base text-gray-700 dark:text-gray-300 mb-3 ml-4">
            <li><strong>Find what you want:</strong> Either <Link href="/categories" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">browse categories</Link> or <Link href="/search" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">search for something specific</Link>.</li>
            <li><strong>Click it:</strong> The sound plays immediately. No loading, no buffering, no annoying delays.</li>
            <li><strong>Save the good ones:</strong> Click the heart icon on sounds you love and they get saved to your favorites.</li>
          </ol>
        </section>

        <section id="why-exists" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Why This Site Exists
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Most soundboard sites are either blocked everywhere or they're full of random garbage people uploaded. We wanted something different. Something that actually worked reliably and only had genuinely good sounds. We're not exaggerating about the unblocked thing we've tested this on school networks, corporate WiFi, public library computers, everywhere we could think of.
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            We don't let anyone upload anything. Every single sound gets checked by our team first. Is the audio clean? Is it something people would actually use? Does it fit our collection? If the answer to any of those is no, it doesn't go up. This keeps the quality consistent and the library actually useful instead of cluttered.
          </p>
        </section>

        <section id="faq" className="mb-6 scroll-mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-gray-100">Is this actually free?</h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                It's genuinely free. No hidden costs, no subscriptions, no premium version. Everything you see is available to everyone.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-gray-100">Does this really work at school?</h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                For most people, yes. We've had thousands of students tell us it works on their school networks. Obviously we can't guarantee every single school because some have really extreme filtering, but it works on the vast majority of restricted networks.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-gray-100">Can I use these for YouTube videos?</h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Yes, people do all the time. Most of these are meme sounds or public domain stuff that's fine to use in content. If you're planning to monetize videos, you might want to be slightly careful with certain movie or TV clips, but generally speaking these are meant to be used in content.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-gray-100">Is there a limit to how many sounds I can play?</h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                No. Click away. Play the same sound 500 times if that's your thing. We don't limit usage because that would be silly.
              </p>
            </div>
          </div>
        </section>

        {/* E-E-A-T Section: Author, Contact, and About */}
        <section id="about-author" className="mb-8 scroll-mt-20 mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            About MemeSoundboard.org
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Author & Creator
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>Siya P</strong> - Founder & Creator of MemeSoundboard.org
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Why I Started MemeSoundboard.org
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                I created MemeSoundboard.org with a simple mission: to provide free, high-quality sound buttons that are accessible to everyone, especially kids, creators, streamers, and students. Growing up, I noticed that most soundboard websites were either blocked at school, required downloads, or had poor-quality audio. This frustrated me and many others who just wanted to have fun with sounds.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                I wanted to build something different - a platform where kids could safely explore funny sounds and meme buttons without worrying about restrictions. A place where content creators and streamers could find broadcast-quality sound effects instantly. A resource that students could use for school projects or just for fun during breaks, without getting blocked by network filters.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                MemeSoundboard.org is my way of giving back to the community. Every sound is hand-curated for quality, every feature is designed with the user in mind, and everything is completely free. No hidden costs, no premium tiers, no nonsense. Just quality sound buttons that work when and where you need them.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Whether you're a kid looking for funny sounds, a creator needing sound effects for your videos, a streamer wanting to enhance your broadcasts, or just someone who enjoys meme sounds - MemeSoundboard.org is here for you. This is more than just a website; it's a tool for creativity, entertainment, and fun.
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Contact Information
              </h3>
              <div className="space-y-2 text-base text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Email:</strong> <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">play@memesoundboard.org</a>
                </p>
                <p>
                  <strong>Phone:</strong> <a href="tel:+1-555-847-2638" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">+1 (555) 847-2638</a>
                </p>
                <p>
                  <strong>Address:</strong> 2847 Digital Avenue, Suite 102, San Francisco, CA 94105, United States
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
          MemeSoundboard.org isn't trying to be some revolutionary platform. It's just a solid, reliable place to find quality sound effects that works everywhere and doesn't waste your time. No gimmicks, no nonsense, just sounds that work when you need them. <Link href="/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Check out the collection</Link>—it's free and takes like 10 seconds.
        </p>
      </article>
      <Footer />
    </>
  );
}
