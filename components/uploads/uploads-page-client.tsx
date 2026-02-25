"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import SoundGrid from "@/components/sound/sound-grid"
import type { Sound } from "@/lib/types/sound"

export default function UploadsPageClient() {
  const router = useRouter()
  const { token, isReady } = useAuth()
  const [sounds, setSounds] = useState<Sound[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 40

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      router.replace("/login")
      return
    }
    let cancelled = false
    setLoading(true)
    apiClient.getUserUploadedSounds(token, undefined, 1, pageSize).then((res) => {
      if (cancelled) return
      const data = res.data as { results?: Sound[]; next?: string | null }
      setSounds(data.results ?? [])
      setHasMore(!!data.next)
      setPage(1)
    }).catch(() => {
      if (!cancelled) setSounds([])
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [isReady, token, router])

  const loadMore = async () => {
    if (!token || !hasMore || loading) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await apiClient.getUserUploadedSounds(token, undefined, nextPage, pageSize)
      const data = res.data as { results?: Sound[]; next?: string | null }
      setSounds((prev) => [...prev, ...(data.results ?? [])])
      setHasMore(!!data.next)
      setPage(nextPage)
    } finally {
      setLoading(false)
    }
  }

  if (!isReady || !token) return null

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        My Uploads
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Sounds you&apos;ve uploaded show up here.
      </p>
      {loading && sounds.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
          Loading your uploads…
        </div>
      ) : sounds.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-8 sm:p-12 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You haven&apos;t uploaded any sounds yet.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white hover:from-violet-600 hover:to-purple-700 transition-all"
          >
            Explore sounds
          </Link>
        </div>
      ) : (
        <>
          <SoundGrid sounds={sounds} useCompactView={true} maxCols={8} />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-3 font-semibold text-white hover:from-violet-600 hover:to-purple-700 disabled:opacity-70 transition-all"
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
