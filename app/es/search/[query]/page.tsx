import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SoundGrid from "@/components/sound/sound-grid"
import SearchLoadMore from "@/components/search/search-load-more"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { SITE } from "@/lib/constants/site"

export const revalidate = 60

interface SearchQueryPageProps {
  params: Promise<{ query: string }>
}

function slugToQuery(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function toTitleCase(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({ params }: SearchQueryPageProps): Promise<Metadata> {
  const { query: slug } = await params
  const searchQuery = slugToQuery(slug)

  let totalItems = 0
  try {
    const response = await apiClient.searchSounds(searchQuery, 1, 1)
    if (response?.data && typeof response.data === 'object' && 'count' in response.data) {
      totalItems = (response.data as { count: number }).count || 0
    }
  } catch {
    // ignore
  }

  const queryTitle = toTitleCase(searchQuery)
  const countStr = totalItems > 0 ? `${totalItems} ` : ""
  const title = `${queryTitle} Soundboard | Botones de Sonido Instantáneos`
  const description = `Reproduce y descarga ${countStr}efectos de sonido ${searchQuery} gratis. Reproducción instantánea y MP3 de alta calidad. Perfecto para memes, TikTok, Discord y creación de contenido.`
  const canonicalUrl = `${SITE.baseUrl}/es/search/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(SITE.baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE.baseUrl}/search/${slug}`,
        es: canonicalUrl,
        fr: `${SITE.baseUrl}/fr/search/${slug}`,
        pt: `${SITE.baseUrl}/pt/search/${slug}`,
        ru: `${SITE.baseUrl}/ru/search/${slug}`,
      },
    },
    openGraph: {
      locale: "es_ES",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE.name,
      images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.domain }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpeg"] },
    robots: { index: true, follow: true },
  }
}

export default async function SpanishSearchQueryPage({ params }: SearchQueryPageProps) {
  const { query: slug } = await params
  const searchQuery = slugToQuery(slug)

  if (!searchQuery || searchQuery.length < 2) notFound()

  const sanitizedQuery = searchQuery.replace(/[<>]/g, '').trim()
  if (sanitizedQuery.length < 2) notFound()

  let sounds: Sound[] = []
  let totalItems = 0
  let hasMore = false

  try {
    const response = await apiClient.searchSounds(sanitizedQuery, 1, 40)
    if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
      sounds = (response.data as { results: Sound[]; count: number; next: string | null }).results || []
      totalItems = (response.data as { count: number }).count || 0
      hasMore = !!(response.data as { next: string | null }).next
    }
  } catch (error) {
    console.error("Error searching sounds:", error)
  }

  const queryTitle = toTitleCase(searchQuery)

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": `${SITE.baseUrl}/es` },
      { "@type": "ListItem", "position": 2, "name": "Buscar", "item": `${SITE.baseUrl}/es/search` },
      { "@type": "ListItem", "position": 3, "name": `${queryTitle} Soundboard`, "item": `${SITE.baseUrl}/es/search/${slug}` },
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
                  <Link href="/es" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</Link>
                </li>
                <li className="flex items-center"><span className="mx-2">/</span></li>
                <li>
                  <Link href="/es/search" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Buscar</Link>
                </li>
                <li className="flex items-center"><span className="mx-2">/</span></li>
                <li><span className="text-gray-700 dark:text-gray-300">{searchQuery}</span></li>
              </ol>
            </nav>

            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-white">
                Botones de Sonido {queryTitle}
              </h1>
              {sounds.length > 0 && (
                <p className="text-lg text-gray-600 dark:text-gray-300">Gratis para reproducir y descargar</p>
              )}
            </div>

            {sounds.length > 0 ? (
              <>
                <div className="mb-8">
                  <SoundGrid sounds={sounds} centerLastRow={true} />
                </div>
                {hasMore && (
                  <div className="flex justify-center mb-8">
                    <SearchLoadMore
                      searchQuery={sanitizedQuery}
                      initialPage={1}
                      initialSounds={sounds}
                    />
                  </div>
                )}
                <article className="mt-16 prose prose-blue dark:prose-invert max-w-none">
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                      Sobre los botones de sonido {searchQuery}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      Encuentra los mejores <strong>botones de sonido {searchQuery}</strong> en {SITE.domain}. Nuestra colección incluye clips de audio gratuitos y de calidad para memes, vídeos, gaming y más. Todos se pueden descargar y escuchar gratis.
                    </p>
                  </section>
                  <section className="mb-8">
                    <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                      Cómo usar los botones de sonido {searchQuery}
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                      <li><strong>Reproducir al instante:</strong> Haz clic en cualquier botón y se reproducirá en tu navegador.</li>
                      <li><strong>Descargar gratis:</strong> Usa el icono de descarga para guardar el sonido en MP3.</li>
                      <li><strong>Compartir:</strong> Usa el botón compartir para enviar el enlace o incrustarlo en tu web.</li>
                      <li><strong>Usar en contenido:</strong> Ideal para memes, vídeos, streaming, TikTok, Discord y más.</li>
                    </ol>
                  </section>
                  <section className="mb-8">
                    <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                      Explorar más botones de sonido
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Link href="/es/trending" className="px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-md text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        Botones en Tendencia
                      </Link>
                      <Link href="/es/new" className="px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-md text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        Nuevos Botones
                      </Link>
                      <Link href="/es/memes-soundboard" className="px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-md text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                        Meme Soundboard
                      </Link>
                    </div>
                  </section>
                </article>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No se encontraron botones de sonido para &quot;{searchQuery}&quot;
                </p>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Prueba con otras palabras o explora nuestras categorías
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/es/search" className="px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-md text-white font-semibold" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                    Ver categorías
                  </Link>
                  <Link href="/es/trending" className="px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-md text-white font-semibold" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    Sonidos en tendencia
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
