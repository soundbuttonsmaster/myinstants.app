import React from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api/client';
import type { Sound } from '@/lib/types/sound';
import { getActiveCategories, type Category } from '@/lib/constants/categories';
import { SITE } from '@/lib/constants/site';
import SoundList from '@/components/home/SoundList';
import AutoLoadingNewSoundsSection from '@/components/home/AutoLoadingNewSoundsSection';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

export const revalidate = 60;

// Portuguese Brazil (pt) - from My Instants website meta content.txt
export const metadata: Metadata = {
  title: "MyInstants | Botões de Som e Meme Soundboard",
  description: "Myinstants é a coleção definitiva de botões de som, meme soundboard desbloqueado e milhares de efeitos sonoros e botões de memes para reproduzir e compartilhar.",
  keywords: ["botões de som", "meme soundboard", "efeitos sonoros", "sons de pegadinha", "soundboard desbloqueado", "Myinstants", "reprodução instantânea"],
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: `${SITE.baseUrl}/pt`,
    languages: {
      en: SITE.baseUrl,
      es: `${SITE.baseUrl}/es`,
      fr: `${SITE.baseUrl}/fr`,
      pt: `${SITE.baseUrl}/pt`,
      ru: `${SITE.baseUrl}/ru`,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE.baseUrl}/pt`,
    siteName: SITE.name,
    title: "MyInstants | Botões de Som e Meme Soundboard",
    description: "Myinstants é a coleção definitiva de botões de som, meme soundboard desbloqueado e milhares de efeitos sonoros e botões de memes para reproduzir e compartilhar.",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyInstants | Botões de Som e Meme Soundboard",
    description: "Myinstants é a coleção definitiva de botões de som, meme soundboard desbloqueado e milhares de efeitos sonoros e botões de memes para reproduzir e compartilhar.",
    images: ["/og.jpeg"],
  },
  robots: { index: true, follow: true },
};

export default async function PortugueseHomePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') ?? '';
  const mobileHint = headersList.get('sec-ch-ua-mobile');
  const isMobile = mobileHint === '?1' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);

  const trendingCount = isMobile ? 16 : 44;
  const newCount = 22;
  let trendingSounds: Sound[] = [];
  let newSounds: Sound[] = [];

  try {
    const [trendingResult, newResult] = await Promise.allSettled([
      apiClient.getTrendingSounds(1, trendingCount),
      apiClient.getNewSounds(1, newCount),
    ]);
    if (trendingResult.status === 'fulfilled' && trendingResult.value?.data && 'results' in trendingResult.value.data) {
      trendingSounds = (trendingResult.value.data as { results: Sound[] }).results || [];
    }
    if (newResult.status === 'fulfilled' && newResult.value?.data && 'results' in newResult.value.data) {
      newSounds = (newResult.value.data as { results: Sound[] }).results || [];
    }
  } catch (error) {
    console.error('Error fetching sounds:', error);
  }

  const categories = getActiveCategories();
  const BASE = SITE.baseUrl;

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE.name,
    "url": `${BASE}/pt`,
    "description": "Myinstants é a coleção definitiva de botões de som, meme soundboard desbloqueado e milhares de efeitos sonoros e botões de memes para reproduzir e compartilhar.",
    "inLanguage": "pt",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE}/pt/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": `${BASE}/pt` },
      { "@type": "ListItem", "position": 2, "name": "Novos", "item": `${BASE}/pt/new` },
      { "@type": "ListItem", "position": 3, "name": "Em alta", "item": `${BASE}/pt/trending` },
      ...categories.map((cat: Category, i: number) => ({
        "@type": "ListItem",
        "position": 4 + i,
        "name": `Soundboard ${cat.name}`,
        "item": `${BASE}/pt/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-soundboard'}`,
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <section className="hero-section-lcp" suppressHydrationWarning>
        <div className="hero-container-lcp">
          <div className="hero-inner-lcp">
            <h1 className="hero-title-lcp">
              Myinstants: Mais de 100K Botões de Som e Meme Soundboard Desbloqueado
            </h1>
            <p className="hero-text-lcp">
              Myinstants é o seu destino definitivo para meme soundboard desbloqueado, botões de som, efeitos sonoros e milhares de sons virais para reproduzir, criar e compartilhar instantaneamente.
            </p>
            <div className="flex justify-center mt-2 px-2">
              <form
                action="/pt/search"
                method="get"
                className="flex max-w-2xl md:max-w-3xl w-full shadow-lg"
              >
                <div className="relative flex-1">
                  <input
                    type="search"
                    name="q"
                    placeholder="Buscar botões de som..."
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border-2 border-gray-700 dark:border-gray-700 rounded-l-lg rounded-r-none border-r-0 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Buscar botões de som"
                  className="h-10 sm:h-12 px-4 sm:px-6 bg-black hover:bg-gray-900 dark:bg-black dark:hover:bg-gray-900 text-white font-bold rounded-l-none rounded-r-lg border-2 border-gray-700 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Buscar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col bg-background">
        <main className="flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto pt-2 pb-0 px-2 sm:px-4 lg:px-6">
            <div className="trending-sounds-container">
              <SoundList
                title="Botões de Som em Alta"
                sounds={trendingSounds}
                initialCount={isMobile ? 16 : 44}
                loadMoreCount={isMobile ? 8 : 22}
                viewAllLink="/pt/trending"
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
            <div className="new-sounds-container">
              <AutoLoadingNewSoundsSection
                initialSounds={newSounds}
                isMobileDevice={isMobile}
              />
            </div>
          </div>
        </main>
      </div>

      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white dark:bg-gray-900">
        <hr className="mb-8 border-gray-300 dark:border-gray-700" />
        <h2 id="introducao" className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 scroll-mt-20">
          {SITE.name}: Botões de Som e Meme Soundboard
        </h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Bem-vindo ao {SITE.domain}. Myinstants é o seu destino definitivo para meme soundboard desbloqueado, botões de som e milhares de sons virais. Reproduza, baixe e compartilhe na hora.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Explore nossa coleção de <Link href="/pt/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">botões em alta</Link>, <Link href="/pt/new" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">novos sons</Link> e <Link href="/pt/search" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">buscar</Link> efeitos sonoros. Tudo grátis e sem cadastro.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
          <Link href="/pt/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Ver a coleção</Link> — é grátis.
        </p>
      </article>
      <Footer />
    </>
  );
}
