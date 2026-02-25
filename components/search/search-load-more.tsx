"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import SoundGrid from "@/components/sound/sound-grid"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

interface SearchLoadMoreProps {
  searchQuery: string
  initialPage: number
  initialSounds: Sound[]
}

export default function SearchLoadMore({ 
  searchQuery, 
  initialPage, 
  initialSounds 
}: SearchLoadMoreProps) {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await apiClient.searchSounds(searchQuery, page + 1, 40)
      if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
        const newSounds = (response.data as { results: Sound[]; next: string | null }).results || []
        setSounds(prev => [...prev, ...newSounds])
        setPage(prev => prev + 1)
        setHasMore(!!(response.data as { next: string | null }).next)
      }
    } catch (error) {
      console.error("Error loading more sounds:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, searchQuery, page])

  if (!hasMore) return null

  return (
    <>
      <Button
        onClick={loadMore}
        disabled={loading}
        className="text-white transition-all shadow-md hover:scale-105 border-0 px-8 py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }}
      >
        {loading ? 'Loading...' : 'Load More Sounds'}
      </Button>
      {sounds.length > initialSounds.length && (
        <div className="mt-8 w-full">
          <SoundGrid sounds={sounds.slice(initialSounds.length)} centerLastRow={true} />
        </div>
      )}
    </>
  )
}
