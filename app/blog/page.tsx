import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { apiClient } from "@/lib/api/client"

export const metadata: Metadata = {
  title: "Blog - MemeSoundboard.Org",
  description: "Read our blog about meme sounds, soundboards, and fun audio for everyone.",
  openGraph: {
    title: "Blog - MemeSoundboard.Org",
    url: "https://memesoundboard.org/blog",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
  alternates: { canonical: "https://memesoundboard.org/blog" },
  robots: { index: true, follow: true },
}

type BlogItem = { id: number; title: string; slug: string; excerpt: string; featured_image: string | null; created_at: string; published_at: string | null }

export default async function BlogListPage() {
  let blogs: BlogItem[] = []
  let next: string | null = null
  try {
    const res = await apiClient.getBlogs(undefined, 1, 24)
    const data = res.data as { results?: BlogItem[]; next?: string | null }
    blogs = data.results ?? []
    next = data.next ?? null
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          Blog
        </h1>
        <p className="mb-8 text-slate-600 dark:text-slate-300">
          Tips, news, and fun stuff about meme sounds and soundboards.
        </p>
        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
            No posts yet. Check back later!
          </div>
        ) : (
          <ul className="space-y-6">
            {blogs.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                >
                  {post.featured_image && (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
                      <img
                        src={apiClient.getBlogImageUrl(post.id)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-slate-600 dark:text-slate-300 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Draft"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
