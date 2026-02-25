import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { apiClient } from "@/lib/api/client"

type Props = { params: Promise<{ id: string }> }

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  created_at: string
  updated_at: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const numId = Number(id)
  if (!Number.isInteger(numId) || numId < 1) return { title: "Blog - MemeSoundboard.Org" }
  try {
    const res = await apiClient.getBlogById(numId)
    const data = res.data as { title?: string; excerpt?: string }
    return {
      title: `${data.title ?? "Blog"} - MemeSoundboard.Org`,
      description: data.excerpt ?? "Read more on MemeSoundboard.org",
      alternates: { canonical: `https://memesoundboard.org/blog/${id}` },
      openGraph: {
        title: data.title ?? "Blog",
        description: data.excerpt,
        url: `https://memesoundboard.org/blog/${id}`,
        images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
      },
      twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
    }
  } catch {
    return { title: "Blog - MemeSoundboard.Org" }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params
  const numId = Number(id)
  if (!Number.isInteger(numId) || numId < 1) notFound()

  let post: BlogPost | null = null
  try {
    const res = await apiClient.getBlogById(numId)
    post = res.data as BlogPost
  } catch {
    notFound()
  }

  if (!post) notFound()
  const p = post

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
            ← Blog
          </Link>
        </nav>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {p.featured_image && (
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
              <img
                src={apiClient.getBlogImageUrl(p.id)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {p.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {new Date(p.updated_at || p.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {p.excerpt && (
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {p.excerpt}
            </p>
          )}
          {p.content && (
            <div
              className="prose prose-slate dark:prose-invert mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: p.content }}
            />
          )}
        </article>
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
            ← All posts
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
