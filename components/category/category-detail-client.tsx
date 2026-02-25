"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import type { Category } from "@/lib/constants/categories"

interface CategoryDetailClientProps {
  initialSounds: Sound[]
  category: Category
  initialPage: number
  initialHasMore: boolean
  totalCount: number
  isMobileDevice?: boolean
}

export default function CategoryDetailClient({
  initialSounds,
  category,
  initialPage,
  initialHasMore,
  totalCount,
  isMobileDevice: isMobileDeviceProp
}: CategoryDetailClientProps) {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileDeviceProp ?? false)
  const loadingRef = useRef<HTMLDivElement>(null)
  
  // Check if there are more sounds to load based on total count
  const [hasMore, setHasMore] = useState(() => {
    // Show button if total count is greater than initial sounds loaded
    return totalCount > initialSounds.length || initialHasMore
  })

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

  // Desktop: 44 sounds (4 lines × 11 sounds), Mobile: 20 sounds (5 lines × 4 sounds)
  const pageSize = isMobileDevice ? 20 : 44

  const loadMoreSounds = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await apiClient.getSounds({ 
        category: category.id, 
        page: nextPage, 
        page_size: pageSize 
      })
      
      if (result?.data && typeof result.data === 'object' && 'results' in result.data) {
        const newSounds = (result.data as { results: Sound[]; next: string | null }).results || []
        
        setSounds(prev => {
          const updatedSounds = [...prev, ...newSounds]
          
          // Check if there are more sounds to load
          const responseData = result.data as { results: Sound[]; count: number; next: string | null }
          const totalLoaded = updatedSounds.length
          
          if (!responseData.next || newSounds.length === 0 || totalLoaded >= totalCount) {
            setHasMore(false)
          }
          
          return updatedSounds
        })
        
        setPage(nextPage)
      }
    } catch (error) {
      console.error("Error loading more sounds:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, category.id, totalCount, pageSize])

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreSounds()
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
  }, [loadMoreSounds, hasMore, loading])

  // Desktop: 11 sounds per row, 4 lines (44 sounds)
  // Mobile: 4 sounds per row, 5 lines (20 sounds)
  const soundsPerRowDesktop = 11
  const soundsPerRowMobile = 4

  return (
    <>
      {sounds.length > 0 ? (
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
                You've reached the end of {category.name} sounds!
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="mt-12 prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                About {category.name} Soundboard
              </h2>
              <div className="text-slate-700 dark:text-slate-300 space-y-4">
                <p>
                  Welcome to the {category.name} Soundboard! Here you'll find a curated collection of {totalCount.toLocaleString()}+ 
                  {category.name.toLowerCase()} sound effects, audio clips, and meme sounds. Whether you're looking for the perfect 
                  {category.name.toLowerCase()} sound for your content, stream, or just for fun, you've come to the right place.
                </p>
                <p>
                  Our {category.name} soundboard features instant play buttons, so you can listen to sounds immediately without any 
                  downloads or registration. All sounds are free to use and can be played directly in your browser. You can also 
                  download any sound as an MP3 file for offline use.
                </p>
                <p>
                  Browse through our extensive collection of {category.name.toLowerCase()} sounds, use the search feature to find 
                  specific sounds, or explore trending and new additions. Each sound includes play, like, share, and download options 
                  for your convenience.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    What is a {category.name} Soundboard?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    A {category.name} soundboard is a collection of {category.name.toLowerCase()} sound effects and audio clips that 
                    you can play instantly with a single click. It's perfect for content creators, streamers, gamers, and anyone who 
                    loves {category.name.toLowerCase()} sounds.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    How do I use the {category.name} sounds?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Simply click on any sound button to play it instantly. You can like, share, or download sounds for offline use. 
                    All sounds are free and require no registration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    Can I download {category.name} sounds?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Yes! You can download any sound as an MP3 file by clicking the download button on each sound. Downloads are 
                    completely free and available for personal use.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    Are new {category.name} sounds added regularly?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Yes, we regularly add new {category.name.toLowerCase()} sounds to our collection. Check back often to discover 
                    the latest additions, or browse our "New Sounds" section to see what's recently been added.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    Can I share {category.name} sounds?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Absolutely! You can share any sound using the share button, which allows you to copy the link or share directly 
                    on social media platforms. Share your favorite {category.name.toLowerCase()} sounds with friends and followers!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-slate-500 dark:text-slate-400">No sounds found in this category.</p>
        </div>
      )}
    </>
  )
}
