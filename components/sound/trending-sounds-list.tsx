"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import SoundButton from '@/components/sound/sound-button'
import { apiClient } from '@/lib/api/client'
import type { Sound } from '@/lib/types/sound'

interface TrendingSoundsListProps {
  initialSounds: Sound[]
  pageSize?: number
  isMobileDevice?: boolean
}

export default function TrendingSoundsList({ 
  initialSounds, 
  pageSize = 44,
  isMobileDevice: isMobileDeviceProp
}: TrendingSoundsListProps) {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(initialSounds.length === pageSize)
  const [isMounted, setIsMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileDeviceProp ?? false)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Set mounted flag after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update window width and mobile detection on resize
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return
    
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      if (isMobileDeviceProp === undefined) {
        setIsMobileDevice(width <= 768)
      }
    }
    
    setWindowWidth(window.innerWidth)
    if (isMobileDeviceProp === undefined) {
      setIsMobileDevice(window.innerWidth <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileDeviceProp, isMounted])

  // Use window width for responsive calculation after mount, SSR prop before mount
  const isMobileView = isMounted 
    ? (typeof window !== 'undefined' ? windowWidth <= 768 : isMobileDevice)
    : isMobileDevice

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await apiClient.getTrendingSounds(page + 1, pageSize)
      let newSounds: Sound[] = []
      
      if (result?.data && typeof result.data === 'object' && 'results' in result.data) {
        newSounds = (result.data as { results: Sound[]; next: string | null }).results || []
      }

      if (newSounds.length > 0) {
        setSounds(prev => [...prev, ...newSounds])
        setPage(prev => prev + 1)
        setHasMore(newSounds.length === pageSize)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more sounds:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, pageSize])

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before the element comes into view
        threshold: 0.1
      }
    )

    const currentLoadingRef = loadingRef.current
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef)
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef)
      }
    }
  }, [loadMore, hasMore, loading])

  // Desktop: 11 sounds per row, 4 lines (44 sounds)
  // Mobile: 4 sounds per row, 5 lines (20 sounds)
  const soundsPerRowDesktop = 11
  const soundsPerRowMobile = 4

  return (
    <>
      {/* Sound Grid - Optimized rendering matching sbmain */}
      <div className="trending-sounds-container space-y-6">
        {/* Desktop: 11 sounds per line, 4 lines (44 sounds) */}
        <div className="hidden md:block space-y-4">
          {Array.from({ length: Math.ceil(sounds.length / soundsPerRowDesktop) }, (_, rowIndex) => {
            const soundStartIndex = rowIndex * soundsPerRowDesktop
            const soundEndIndex = Math.min(soundStartIndex + soundsPerRowDesktop, sounds.length)
            const rowSounds = sounds.slice(soundStartIndex, soundEndIndex)
            
            return (
              <div key={`desktop-row-${rowIndex}`}>
                <div className="grid grid-cols-11 gap-4" style={{ 
                  minHeight: '115px',
                  boxSizing: 'border-box',
                  width: '100%',
                  padding: '0',
                  margin: '0',
                  overflow: 'visible'
                }}>
                  {rowSounds.map((sound) => (
                    <SoundButton 
                      key={sound.id} 
                      sound={sound} 
                      isAboveTheFold={rowIndex < 2} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Mobile: 4 sounds per line, 5 lines (20 sounds) */}
        <div className="block md:hidden space-y-4">
          {Array.from({ length: Math.ceil(sounds.length / soundsPerRowMobile) }, (_, rowIndex) => {
            const soundStartIndex = rowIndex * soundsPerRowMobile
            const soundEndIndex = Math.min(soundStartIndex + soundsPerRowMobile, sounds.length)
            const rowSounds = sounds.slice(soundStartIndex, soundEndIndex)
            
            return (
              <div key={`mobile-row-${rowIndex}`}>
                <div 
                  className="grid grid-cols-4 gap-2"
                  style={{
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    boxSizing: 'border-box',
                    minHeight: '140px',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                    overflow: 'visible'
                  }}
                >
                  {rowSounds.map((sound) => (
                    <SoundButton 
                      key={sound.id} 
                      sound={sound} 
                      isAboveTheFold={rowIndex < 2} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center mt-8 py-8">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-gray-600 dark:text-gray-300">Loading more sounds...</span>
            </div>
          ) : (
            <div className="text-lg text-gray-500 dark:text-gray-400">
              Scroll down for more sounds
            </div>
          )}
        </div>
      )}

      {/* End of content indicator */}
      {!hasMore && sounds.length > 0 && (
        <div className="flex justify-center mt-8 py-4">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            You've reached the end of trending sounds!
          </div>
        </div>
      )}
    </>
  )
}
