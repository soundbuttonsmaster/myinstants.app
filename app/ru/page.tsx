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

// Russian (ru) - from My Instants website meta content.txt
export const metadata: Metadata = {
  title: "MyInstants | Звуковые Кнопки и Мем Саундборд",
  description: "Myinstants — лучшая коллекция звуковых кнопок, разблокированный мем саундборд с тысячами звуковых эффектов и мем-кнопок для воспроизведения и обмена.",
  keywords: ["звуковые кнопки", "мем саундборд", "звуковые эффекты", "звуки для розыгрышей", "саундборд разблокированный", "Myinstants", "мгновенное воспроизведение"],
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: `${SITE.baseUrl}/ru`,
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
    locale: "ru_RU",
    url: `${SITE.baseUrl}/ru`,
    siteName: SITE.name,
    title: "MyInstants | Звуковые Кнопки и Мем Саундборд",
    description: "Myinstants — лучшая коллекция звуковых кнопок, разблокированный мем саундборд с тысячами звуковых эффектов и мем-кнопок для воспроизведения и обмена.",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyInstants | Звуковые Кнопки и Мем Саундборд",
    description: "Myinstants — лучшая коллекция звуковых кнопок, разблокированный мем саундборд с тысячами звуковых эффектов и мем-кнопок для воспроизведения и обмена.",
    images: ["/og.jpeg"],
  },
  robots: { index: true, follow: true },
};

export default async function RussianHomePage() {
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
    "url": `${BASE}/ru`,
    "description": "Myinstants — лучшая коллекция звуковых кнопок, разблокированный мем саундборд с тысячами звуковых эффектов и мем-кнопок для воспроизведения и обмена.",
    "inLanguage": "ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE}/ru/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": `${BASE}/ru` },
      { "@type": "ListItem", "position": 2, "name": "Новые", "item": `${BASE}/ru/new` },
      { "@type": "ListItem", "position": 3, "name": "В тренде", "item": `${BASE}/ru/trending` },
      ...categories.map((cat: Category, i: number) => ({
        "@type": "ListItem",
        "position": 4 + i,
        "name": `Саундборд ${cat.name}`,
        "item": `${BASE}/ru/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-soundboard'}`,
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
              Myinstants: Более 100K Звуковых Кнопок и Мем Саундборд Разблокированный
            </h1>
            <p className="hero-text-lcp">
              Myinstants — ваш лучший ресурс для разблокированного мем саундборда, звуковых кнопок, эффектов и тысяч вирусных звуков для воспроизведения, создания и мгновенного обмена.
            </p>
            <div className="flex justify-center mt-2 px-2">
              <form
                action="/ru/search"
                method="get"
                className="flex max-w-2xl md:max-w-3xl w-full shadow-lg"
              >
                <div className="relative flex-1">
                  <input
                    type="search"
                    name="q"
                    placeholder="Поиск звуковых кнопок..."
                    className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border-2 border-gray-700 dark:border-gray-700 rounded-l-lg rounded-r-none border-r-0 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Поиск звуковых кнопок"
                  className="h-10 sm:h-12 px-4 sm:px-6 bg-black hover:bg-gray-900 dark:bg-black dark:hover:bg-gray-900 text-white font-bold rounded-l-none rounded-r-lg border-2 border-gray-700 dark:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Поиск</span>
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
                title="Трендовые Звуковые Кнопки"
                sounds={trendingSounds}
                initialCount={isMobile ? 16 : 44}
                loadMoreCount={isMobile ? 8 : 22}
                viewAllLink="/ru/trending"
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
        <h2 id="intro" className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 scroll-mt-20">
          {SITE.name}: Звуковые Кнопки и Мем Саундборд
        </h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Добро пожаловать на {SITE.domain}. Myinstants — ваш лучший ресурс для разблокированного мем саундборда, звуковых кнопок и тысяч вирусных звуков. Воспроизводите, скачивайте и делитесь мгновенно.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Исследуйте нашу коллекцию <Link href="/ru/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">трендовых кнопок</Link>, <Link href="/ru/new" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">новых звуков</Link> и <Link href="/ru/search" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">поиска</Link> звуковых эффектов. Всё бесплатно и без регистрации.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
          <Link href="/ru/trending" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">Смотреть коллекцию</Link> — бесплатно.
        </p>
      </article>
      <Footer />
    </>
  );
}
