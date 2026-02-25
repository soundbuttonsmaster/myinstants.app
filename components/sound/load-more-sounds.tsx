"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import SoundGrid from '@/components/sound/sound-grid'
import type { Sound } from '@/lib/types/sound'
import type { ApiResponse, PaginatedResponse } from '@/lib/api/client'

interface LoadMoreSoundsProps {
  initialSounds: Sound[]
  loadMoreFn: (page: number, pageSize: number) => Promise<ApiResponse<PaginatedResponse<Sound>>>
  pageSize?: number
}

export default function LoadMoreSounds({ 
  initialSounds, 
  loadMoreFn,
  pageSize = 40 
}: LoadMoreSoundsProps) {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(initialSounds.length === pageSize)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await loadMoreFn(page + 1, pageSize)
      const newSounds = result.data.results || []

      if (newSounds.length > 0) {
        setSounds(prev => [...prev, ...newSounds])
        setPage(prev => prev + 1)
        setHasMore(!!result.data.next && newSounds.length === pageSize)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more sounds:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, loadMoreFn, pageSize])

  return (
    <>
      <SoundGrid sounds={sounds} centerLastRow={true} />
      
      {hasMore && (
        <div className="flex justify-center mt-8 pb-4">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            className="rounded-full px-8 py-6 text-base font-semibold shadow-sm hover:shadow-md transition-all border-2"
          >
            {loading ? 'Loading...' : 'Load More Sounds'}
          </Button>
        </div>
      )}

      {!hasMore && sounds.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg">You've reached the end!</p>
        </div>
      )}
    </>
  )
}
