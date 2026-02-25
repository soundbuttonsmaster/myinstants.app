import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SoundGrid from "@/components/sound/sound-grid"
import Pagination from "@/components/ui/pagination"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"

interface CategoryPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params
  const categoryId = parseInt(id, 10)

  if (isNaN(categoryId)) {
    return { title: "Categoria não encontrada" }
  }

  try {
    const response = await apiClient.getCategoryById(categoryId)
    if (response?.data) {
      const category = response.data as { name: string }
      const catConst = getCategoryById(categoryId)
      const slug = catConst?.slug || (category.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-soundboard"
      const name = category.name || "Category"
      const title = `${name} Soundboard: Botões de Som | Myinstants.app`
      const description = `Explore o soundboard ${name} com botões de som em alta. Baixe, reproduza e compartilhe efeitos de ${name} para pegadinhas, diversão e entretenimento.`
      const canonicalUrl = `${SITE.baseUrl}/pt/category/${id}`

      return {
        title,
        description,
        metadataBase: new URL(SITE.baseUrl),
        alternates: {
          canonical: canonicalUrl,
          languages: {
            en: `${SITE.baseUrl}/${slug}`,
            es: `${SITE.baseUrl}/es/category/${id}`,
            fr: `${SITE.baseUrl}/fr/category/${id}`,
            pt: canonicalUrl,
            ru: `${SITE.baseUrl}/ru/category/${id}`,
          },
        },
        openGraph: {
          locale: "pt_BR",
          title,
          description,
          url: canonicalUrl,
          images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
        },
        twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
      }
    }
  } catch {
    // fall through
  }

  return { title: "Categoria não encontrada" }
}

export default async function PortugueseCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = await params
  const { page } = await searchParams
  const categoryId = parseInt(id, 10)

  if (isNaN(categoryId)) notFound()

  const currentPage = parseInt(page || "1", 10)
  const pageSize = 40

  let sounds: Sound[] = []
  let categoryName = "Categoria"
  let totalPages = 1
  let count = 0

  try {
    const [soundsResponse, categoryResponse] = await Promise.all([
      apiClient.getSounds({ category: categoryId, page: currentPage, page_size: pageSize }),
      apiClient.getCategoryById(categoryId).catch(() => null),
    ])

    if (soundsResponse?.data && typeof soundsResponse.data === 'object' && 'results' in soundsResponse.data) {
      sounds = (soundsResponse.data as { results: Sound[]; count: number }).results || []
      count = (soundsResponse.data as { count: number }).count || 0
      totalPages = Math.ceil(count / pageSize) || 1
    }

    if (categoryResponse?.data) {
      categoryName = (categoryResponse.data as { name: string }).name || "Categoria"
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    notFound()
  }

  const BASE = SITE.baseUrl
  const categoryUrl = `${BASE}/pt/category/${categoryId}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": `${BASE}/pt` },
      { "@type": "ListItem", "position": 2, "name": "Soundboard", "item": `${BASE}/pt/new` },
      { "@type": "ListItem", "position": 3, "name": categoryName, "item": categoryUrl },
    ],
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": sounds.slice(0, 10).map((s, idx) => {
      const slug = `${s.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || "sound"}-${s.id}`
      return {
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "AudioObject",
          "name": s.name,
          "description": `Botão do soundboard ${categoryName}`,
          "url": `${BASE}/${slug}`,
        },
      }
    }),
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Soundboard de {categoryName}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {count > 0
              ? `${count.toLocaleString('pt-BR')} som${count !== 1 ? "s" : ""} nesta categoria`
              : `Explore os melhores botões do soundboard ${categoryName}. Grátis para reproduzir e baixar.`}
          </p>
        </div>

        {sounds.length > 0 ? (
          <>
            <SoundGrid sounds={sounds} centerLastRow={true} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/pt/category/${categoryId}`}
            />
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400">Nenhum som nesta categoria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
