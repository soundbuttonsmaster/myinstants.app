import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Buscar Botones de Sonido - Efectos de Sonido y Meme Soundboard | ${SITE.domain}`,
  description: "Busca en nuestra colección de botones de sonido, efectos de sonido, sonidos de memes y clips de audio en Myinstants. Encuentra el sonido perfecto para tus vídeos, memes y más. Gratis para descargar.",
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: `${SITE.baseUrl}/es/search`,
    languages: {
      en: `${SITE.baseUrl}/search`,
      es: `${SITE.baseUrl}/es/search`,
      fr: `${SITE.baseUrl}/fr/search`,
      pt: `${SITE.baseUrl}/pt/search`,
      ru: `${SITE.baseUrl}/ru/search`,
    },
  },
  openGraph: {
    locale: "es_ES",
    url: `${SITE.baseUrl}/es/search`,
    title: "Buscar Botones de Sonido - Efectos de Sonido y Meme Soundboard",
    description: "Busca en nuestra colección de botones de sonido, efectos de sonido, sonidos de memes y clips de audio en Myinstants.",
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

const createSearchUrl = (query: string) => `/es/search/${generateSlug(query)}`

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SpanishSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  if (params.q && params.q.trim()) {
    const slug = generateSlug(params.q.trim())
    if (slug) redirect(`/es/search/${slug}`)
  }

  const categories = getActiveCategories()

  const popularSearches = [
    "sonidos de memes",
    "efectos de sonido",
    "clips de audio",
    "soundboard",
    "sonidos graciosos",
    "sonidos de gaming",
    "sonidos de broma",
    "voces",
    "sonidos de dibujos",
    "música",
    "anime",
    "frases de películas",
    "sonidos de tiktok",
    "sonidos de discord",
    "sonidos de pedos",
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": `${SITE.baseUrl}/es` },
      { "@type": "ListItem", "position": 2, "name": "Buscar", "item": `${SITE.baseUrl}/es/search` },
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
                  <Link href="/es" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center"><span className="mx-2">/</span></li>
                <li><span className="text-gray-700 dark:text-gray-300">Buscar</span></li>
              </ol>
            </nav>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Buscar Botones de Sonido
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Encuentra los efectos de sonido, sonidos de memes y clips de audio que necesitas en nuestra colección
              </p>
            </div>

            <div className="mb-12">
              <div className="max-w-3xl mx-auto">
                <SearchBar searchBasePath="/es" />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Búsquedas Populares
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
                Explorar por Categoría
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.id}
                    href={`/es/${category.slug}`}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-medium hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Cómo Buscar Botones de Sonido
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Usa el buscador para encontrar los botones de sonido que necesitas. Escribe tu término en la caja de búsqueda y verás todos los efectos de sonido, sonidos de memes y clips que coincidan.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                Consejos de Búsqueda
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Usa palabras clave concretas (ej.: &quot;ladrido perro&quot;, &quot;bocina&quot;, &quot;risa meme&quot;)</li>
                <li>Prueba variaciones del término si no encuentras lo que buscas</li>
                <li>Explora búsquedas populares o categorías para inspirarte</li>
                <li>Todos los botones de sonido son gratis para reproducir, descargar y compartir</li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
