import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Buscar Botões de Som - Efeitos Sonoros e Meme Soundboard | ${SITE.domain}`,
  description: "Busque em nossa coleção de botões de som, efeitos sonoros, sons de memes e clipes de áudio no Myinstants. Encontre o som ideal para seus vídeos, memes e mais. Grátis para baixar.",
  metadataBase: new URL(SITE.baseUrl),
  alternates: {
    canonical: `${SITE.baseUrl}/pt/search`,
    languages: {
      en: `${SITE.baseUrl}/search`,
      es: `${SITE.baseUrl}/es/search`,
      fr: `${SITE.baseUrl}/fr/search`,
      pt: `${SITE.baseUrl}/pt/search`,
      ru: `${SITE.baseUrl}/ru/search`,
    },
  },
  openGraph: {
    locale: "pt_BR",
    url: `${SITE.baseUrl}/pt/search`,
    title: "Buscar Botões de Som - Efeitos Sonoros e Meme Soundboard",
    description: "Busque em nossa coleção de botões de som, efeitos sonoros, sons de memes e clipes de áudio no Myinstants.",
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

const createSearchUrl = (query: string) => `/pt/search/${generateSlug(query)}`

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function PortugueseSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  if (params.q && params.q.trim()) {
    const slug = generateSlug(params.q.trim())
    if (slug) redirect(`/pt/search/${slug}`)
  }

  const categories = getActiveCategories()

  const popularSearches = [
    "sons de memes",
    "efeitos sonoros",
    "clipes de áudio",
    "soundboard",
    "sons engraçados",
    "sons de games",
    "sons de pegadinha",
    "vozes",
    "sons de desenho",
    "música",
    "anime",
    "frases de filmes",
    "sons do tiktok",
    "sons do discord",
    "sons de peido",
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": SITE.name, "item": `${SITE.baseUrl}/pt` },
      { "@type": "ListItem", "position": 2, "name": "Buscar", "item": `${SITE.baseUrl}/pt/search` },
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
                  <Link href="/pt" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Início
                  </Link>
                </li>
                <li className="flex items-center"><span className="mx-2">/</span></li>
                <li><span className="text-gray-700 dark:text-gray-300">Buscar</span></li>
              </ol>
            </nav>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Buscar Botões de Som
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Encontre os efeitos sonoros, sons de memes e clipes de áudio que você precisa na nossa coleção
              </p>
            </div>

            <div className="mb-12">
              <div className="max-w-3xl mx-auto">
                <SearchBar searchBasePath="/pt" />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Buscas Populares
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
                Explorar por Categoria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.id}
                    href={`/pt/${category.slug}`}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-medium hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-16 prose prose-blue dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Como Buscar Botões de Som
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use a barra de busca para encontrar os botões de som que você precisa. Digite seu termo na caixa de busca e veja todos os efeitos sonoros, sons de memes e clipes correspondentes.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                Dicas de Busca
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Use palavras-chave específicas (ex.: &quot;latido de cachorro&quot;, &quot;buzina&quot;, &quot;risada meme&quot;)</li>
                <li>Teste variações do termo se não encontrar o que procura</li>
                <li>Explore buscas populares ou categorias para se inspirar</li>
                <li>Todos os botões de som são grátis para reproduzir, baixar e compartilhar</li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
