import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Поиск Звуковых Кнопок - Звуковые Эффекты и Мем Саундборд | ${SITE.domain}`,
  description: "Ищите в нашей коллекции звуковых кнопок, звуковых эффектов, звуков мемов и аудиоклипов на Myinstants. Найдите идеальный звук для ваших видео, мемов и многого другого. Бесплатно скачать.",
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: `${SITE.baseUrl}/ru/search`,
    languages: {
      en: `${SITE.baseUrl}/search`,
      es: `${SITE.baseUrl}/es/search`,
      fr: `${SITE.baseUrl}/fr/search`,
      pt: `${SITE.baseUrl}/pt/search`,
      ru: `${SITE.baseUrl}/ru/search`,
    },
  },
  openGraph: {
    locale: "ru_RU",
    url: `${SITE.baseUrl}/ru/search`,
    title: "Поиск Звуковых Кнопок - Звуковые Эффекты и Мем Саундборд",
    description: "Ищите в нашей коллекции звуковых кнопок, звуковых эффектов, звуков мемов и аудиоклипов на Myinstants.",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  robots: { index: true, follow: true },
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || ''
}

const createSearchUrl = (query: string) => `/ru/search/${generateSlug(query)}`

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function RussianSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  if (params.q && params.q.trim()) {
    const slug = generateSlug(params.q.trim())
    if (slug) redirect(`/ru/search/${slug}`)
  }

  const categories = getActiveCategories()

  const popularSearches = [
    "звуки мемов",
    "звуковые эффекты",
    "аудиоклипы",
    "саундборд",
    "смешные звуки",
    "звуки для игр",
    "звуки для розыгрышей",
    "голоса",
    "звуки из мультиков",
    "музыка",
    "аниме",
    "цитаты из фильмов",
    "звуки тикток",
    "звуки дискорд",
    "звуки пердежа",
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": `${SITE.baseUrl}/ru` },
      { "@type": "ListItem", "position": 2, "name": "Поиск", "item": `${SITE.baseUrl}/ru/search` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="w-full max-w-7xl mx-auto px-4">
            <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/ru" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Главная
                  </Link>
                </li>
                <li className="flex items-center"><span className="mx-2">/</span></li>
                <li><span className="text-gray-700 dark:text-gray-300">Поиск</span></li>
              </ol>
            </nav>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Поиск Звуковых Кнопок
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Найдите звуковые эффекты, звуки мемов и аудиоклипы в нашей коллекции
              </p>
            </div>

            <div className="mb-12">
              <div className="max-w-3xl mx-auto">
                <SearchBar searchBasePath="/ru" />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Популярные запросы
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

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                По категориям
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.id}
                    href={`/ru/${category.slug}`}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-medium hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Как искать звуковые кнопки
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Введите запрос в строку поиска — вы увидите все подходящие звуковые эффекты, звуки мемов и клипы.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                Советы по поиску
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Используйте конкретные слова (например: «лай собаки», «гудок», «смех мем»)</li>
                <li>Попробуйте другие формулировки, если не нашли нужное</li>
                <li>Смотрите популярные запросы и категории для идей</li>
                <li>Все звуковые кнопки можно бесплатно слушать, скачивать и делиться</li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
