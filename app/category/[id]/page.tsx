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
    return {
      title: "Category Not Found",
    }
  }

  try {
    const response = await apiClient.getCategoryById(categoryId)
    if (response?.data) {
      const category = response.data as { name: string }
      const catConst = getCategoryById(categoryId)
      const slug = catConst?.slug || (category.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-soundboard"
      const title = `${category.name} Soundboard: Instant Sound Buttons | Myinstants.app`
      const description = `Explore our ${category.name} soundboard with trending sound buttons and meme soundboard. Download, play, and share ${category.name} sound effects for pranks, fun & entertainment!`
      return {
        title,
        description,
        alternates: { canonical: `${SITE.baseUrl}/${slug}` },
        openGraph: {
          title,
          description,
          url: `${SITE.baseUrl}/${slug}`,
          images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
        },
        twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
      }
    }
  } catch (error) {
    // Fall through to default
  }

  return {
    title: "Category Not Found",
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = await params
  const { page } = await searchParams
  const categoryId = parseInt(id, 10)

  if (isNaN(categoryId)) {
    notFound()
  }

  const currentPage = parseInt(page || "1", 10)
  const pageSize = 40

  let sounds: Sound[] = []
  let categoryName = "Category"
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
      categoryName = (categoryResponse.data as { name: string }).name || "Category"
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    notFound()
  }

  const BASE = SITE.baseUrl
  const categoryFromConst = getCategoryById(categoryId)
  const categorySlug = categoryFromConst?.slug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-soundboard"
  const categoryUrl = `${BASE}/${categorySlug}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/` },
      { "@type": "ListItem", "position": 2, "name": "Soundboard", "item": `${BASE}/new` },
      { "@type": "ListItem", "position": 3, "name": categoryName, "item": categoryUrl }
    ]
  };

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
          "description": `${categoryName} soundboard button`,
          "url": `${BASE}/${slug}`
        }
      }
    })
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            {categoryName} Soundboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {count > 0
              ? `${count.toLocaleString()} sound${count !== 1 ? "s" : ""} in this category`
              : `Explore the best ${categoryName} soundboard buttons with instant sound effects. Free to play and download!`}
          </p>
        </div>

        {sounds.length > 0 ? (
          <>
            <SoundGrid sounds={sounds} centerLastRow={true} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/category/${categoryId}`}
            />
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400">No sounds found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
