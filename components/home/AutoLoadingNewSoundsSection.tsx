"use client"

import React, { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SoundButton from '@/components/sound/sound-button';
import { apiClient } from '@/lib/api/client';
import type { Sound } from '@/lib/types/sound';

interface AutoLoadingNewSoundsSectionProps {
  initialSounds: Sound[];
  isMobileDevice: boolean;
  title?: string;
}

export interface AutoLoadingNewSoundsSectionRef {
  handleAutoPlay: () => void;
  handleRandomPlay: () => void;
  playRandomSound: () => void;
}

const AutoLoadingNewSoundsSection = forwardRef<AutoLoadingNewSoundsSectionRef, AutoLoadingNewSoundsSectionProps>(({
  initialSounds,
  isMobileDevice,
  title
}, ref) => {
  const router = useRouter();
  // LIMIT INITIAL DISPLAY: Only show 2 lines initially (22 desktop, 8 mobile)
  const initialDisplayCount = isMobileDevice ? 8 : 22;
  const [sounds, setSounds] = useState<Sound[]>(initialSounds.slice(0, initialDisplayCount));
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  // Always start with hasMore = true, we'll determine the actual state after first load
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false); // Track if user has clicked Load More
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRandomPlaying, setIsRandomPlaying] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const loadMoreButtonRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement>(null); // Track where new content starts
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoPlayingRef = useRef(false);
  const isRandomPlayingRef = useRef(false);
  const shuffledIndicesRef = useRef<number[]>([]);
  const currentRandomIndexRef = useRef(0);
  const soundEndedHandlersRef = useRef<Map<number, (e: Event) => void>>(new Map());
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate sounds per row based on device
  const soundsPerRow = isMobileDevice ? 4 : 11;
  const soundsPerTwoLines = soundsPerRow * 2; // 2 lines per section for initial display
  const soundsPerFourLines = soundsPerRow * 4; // 4 lines per section for ads after first load

  const loadMoreSounds = useCallback(async () => {
    if (loading || !hasMore) return;

    // Save the current scroll position and sound count before loading
    const previousSoundCount = sounds.length;
    const scrollBeforeLoad = window.scrollY;

    setLoading(true);
    try {
      let pageSize: number;
      let newSounds: Sound[];
      if (!hasLoadedOnce) {
        // First load: Load 2 more lines (same as initial)
        pageSize = isMobileDevice ? 8 : 22;
        const response = await apiClient.getNewSounds(page + 1, pageSize);
        if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
          newSounds = (response.data as { results: Sound[] }).results || [];
        } else {
          newSounds = [];
        }
      } else {
        // Subsequent loads: Load 4 lines at a time
        pageSize = isMobileDevice ? 16 : 44;
        const response = await apiClient.getNewSounds(page + 1, pageSize);
        if (response?.data && typeof response.data === 'object' && 'results' in response.data) {
          newSounds = (response.data as { results: Sound[] }).results || [];
        } else {
          newSounds = [];
        }
      }
      
      setSounds(prev => [...prev, ...newSounds]);
      setPage(prev => prev + 1);
      
      // After first manual load, enable auto-loading and scroll to new content
      if (!hasLoadedOnce) {
        setHasLoadedOnce(true);
        // Wait for DOM to update, then scroll to the new content start
        setTimeout(() => {
          if (newContentRef.current) {
            // Scroll to the start of newly loaded content with a small offset
            const offset = 100; // Small offset to show the ad and some context
            const elementPosition = newContentRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth'
            });
          }
        }, 150);
      }
      
      // Check if we've loaded all available sounds
      if (newSounds.length === 0 || newSounds.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      // Silently handle error
    }
    setLoading(false);
  }, [page, loading, hasMore, isMobileDevice, hasLoadedOnce, sounds.length]);

  // Infinite scroll implementation - only active after first manual load
  useEffect(() => {
    if (!hasLoadedOnce) return; // Don't auto-load until user clicks Load More

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreSounds();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before the element comes into view
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [loadMoreSounds, hasMore, loading, hasLoadedOnce]);

  // Auto-play functionality
  const handleAutoPlay = useCallback(() => {
    // Stop random play if active
    if (isRandomPlayingRef.current) {
      isRandomPlayingRef.current = false;
      setIsRandomPlaying(false);
      shuffledIndicesRef.current = [];
      currentRandomIndexRef.current = 0;
    }

    if (isAutoPlayingRef.current) {
      // Stop auto-play - clean up everything
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false);
      
      // Clear timeout
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
      
      // Remove all sound-ended event listeners
      soundEndedHandlersRef.current.forEach((handler) => {
        window.removeEventListener('sound-ended', handler as EventListener);
      });
      soundEndedHandlersRef.current.clear();
      
      // Pause all currently playing sounds
      window.dispatchEvent(new CustomEvent('pause-all-sounds', { detail: { exceptId: null } }));
      return;
    }

    // Start auto-play
    if (sounds.length === 0) return;
    
    isAutoPlayingRef.current = true;
    setIsAutoPlaying(true);
    
    // Start playing from the first sound
    const playNextSound = (index: number) => {
      if (!isAutoPlayingRef.current && index > 0) return; // Check if stopped
      
      if (index >= sounds.length) {
        // Finished all sounds
        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);
        return;
      }

      const sound = sounds[index];
      
      // Dispatch event to play this sound
      window.dispatchEvent(new CustomEvent('play-sound-auto', { 
        detail: { soundId: sound.id } 
      }));

      // Wait for sound to finish
      const handleSoundEnded = (e: Event) => {
        const customEvent = e as CustomEvent<{ soundId: number }>;
        if (customEvent.detail?.soundId === sound.id) {
          window.removeEventListener('sound-ended', handleSoundEnded as EventListener);
          soundEndedHandlersRef.current.delete(sound.id);
          if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
          }
          if (isAutoPlayingRef.current) {
            // Small delay between sounds
            autoPlayTimeoutRef.current = setTimeout(() => {
              playNextSound(index + 1);
            }, 300);
          }
        }
      };

      // Store handler for cleanup
      soundEndedHandlersRef.current.set(sound.id, handleSoundEnded);
      window.addEventListener('sound-ended', handleSoundEnded as EventListener);
      
      // Fallback timeout in case sound-ended event doesn't fire (max 5 seconds per sound)
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      autoPlayTimeoutRef.current = setTimeout(() => {
        window.removeEventListener('sound-ended', handleSoundEnded as EventListener);
        soundEndedHandlersRef.current.delete(sound.id);
        if (isAutoPlayingRef.current) {
          playNextSound(index + 1);
        }
      }, 5000);
    };

    playNextSound(0);
  }, [sounds]);

  // Random play functionality
  const handleRandomPlay = useCallback(() => {
    // Stop auto-play if active
    if (isAutoPlayingRef.current) {
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false);
    }

    if (isRandomPlayingRef.current) {
      // Stop random play - clean up everything
      isRandomPlayingRef.current = false;
      setIsRandomPlaying(false);
      shuffledIndicesRef.current = [];
      currentRandomIndexRef.current = 0;
      
      // Clear timeout
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
      
      // Remove all sound-ended event listeners
      soundEndedHandlersRef.current.forEach((handler) => {
        window.removeEventListener('sound-ended', handler as EventListener);
      });
      soundEndedHandlersRef.current.clear();
      
      // Pause all currently playing sounds
      window.dispatchEvent(new CustomEvent('pause-all-sounds', { detail: { exceptId: null } }));
      return;
    }

    // Start random play
    if (sounds.length === 0) return;
    
    // Create shuffled array of indices
    const indices = Array.from({ length: sounds.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    shuffledIndicesRef.current = indices;
    currentRandomIndexRef.current = 0;
    isRandomPlayingRef.current = true;
    setIsRandomPlaying(true);
    
    // Start playing from the first random sound
    const playNextRandomSound = () => {
      if (!isRandomPlayingRef.current) return; // Check if stopped
      
      if (currentRandomIndexRef.current >= shuffledIndicesRef.current.length) {
        // Finished all sounds, reshuffle and continue
        const indices = Array.from({ length: sounds.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffledIndicesRef.current = indices;
        currentRandomIndexRef.current = 0;
      }

      const randomIndex = shuffledIndicesRef.current[currentRandomIndexRef.current];
      const sound = sounds[randomIndex];
      
      // Dispatch event to play this sound
      window.dispatchEvent(new CustomEvent('play-sound-auto', { 
        detail: { soundId: sound.id } 
      }));

      // Wait for sound to finish
      const handleSoundEnded = (e: Event) => {
        const customEvent = e as CustomEvent<{ soundId: number }>;
        if (customEvent.detail?.soundId === sound.id) {
          window.removeEventListener('sound-ended', handleSoundEnded as EventListener);
          soundEndedHandlersRef.current.delete(sound.id);
          if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
          }
          if (isRandomPlayingRef.current) {
            currentRandomIndexRef.current++;
            // Small delay between sounds
            autoPlayTimeoutRef.current = setTimeout(() => {
              playNextRandomSound();
            }, 300);
          }
        }
      };

      // Store handler for cleanup
      soundEndedHandlersRef.current.set(sound.id, handleSoundEnded);
      window.addEventListener('sound-ended', handleSoundEnded as EventListener);
      
      // Fallback timeout in case sound-ended event doesn't fire (max 5 seconds per sound)
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      autoPlayTimeoutRef.current = setTimeout(() => {
        window.removeEventListener('sound-ended', handleSoundEnded as EventListener);
        soundEndedHandlersRef.current.delete(sound.id);
        if (isRandomPlayingRef.current) {
          currentRandomIndexRef.current++;
          playNextRandomSound();
        }
      }, 5000);
    };

    playNextRandomSound();
  }, [sounds]);

  // Cleanup auto-play and random play on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      soundEndedHandlersRef.current.forEach((handler) => {
        window.removeEventListener('sound-ended', handler as EventListener);
      });
      soundEndedHandlersRef.current.clear();
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false);
      isRandomPlayingRef.current = false;
      setIsRandomPlaying(false);
      shuffledIndicesRef.current = [];
      currentRandomIndexRef.current = 0;
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    handleAutoPlay,
    handleRandomPlay,
    playRandomSound: handleRandomPlay,
  }));

  return (
    <section className="w-full pt-4 pb-0 sound-section-container">
      <div className="flex flex-row items-center justify-between mb-4 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
          <span className="text-lg sm:text-xl md:text-2xl mr-1 sm:mr-2"></span>
          <span className="whitespace-nowrap truncate">{title || 'New Meme Soundboard'}</span>
        </h2>
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
          <Button 
            className={`px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              isAutoPlaying 
                ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
            onClick={handleAutoPlay}
            disabled={sounds.length === 0}
          >
            <span className="hidden sm:inline">{isAutoPlaying ? 'Stop Auto' : 'Auto Play'}</span>
            <span className="sm:hidden">{isAutoPlaying ? 'Stop' : 'Auto'}</span>
          </Button>
          <Button 
            className={`px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              isRandomPlaying 
                ? 'bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            }`}
            onClick={handleRandomPlay}
            disabled={sounds.length === 0}
          >
            <span className="hidden sm:inline">{isRandomPlaying ? 'Stop Random' : 'Random Play'}</span>
            <span className="sm:hidden">{isRandomPlaying ? 'Stop' : 'Random'}</span>
          </Button>
          <Button 
            className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => router.push('/new')}
          >
            <span className="hidden sm:inline">View All →</span>
            <span className="sm:hidden">View →</span>
          </Button>
        </div>
      </div>

      {sounds.length > 0 ? (
        <>
          {/* Sound Grid with conditional ad placement */}
          <div className="space-y-4">
            {!hasLoadedOnce ? (
              // Initial display: 2 lines - border between rows via CSS :not(:last-child)
              <div>
                <div>
                  {Array.from({ length: 2 }, (_, lineIndex) => {
                    const lineStartIndex = lineIndex * soundsPerRow;
                    const lineEndIndex = Math.min(lineStartIndex + soundsPerRow, sounds.length);
                    const lineSounds = sounds.slice(lineStartIndex, lineEndIndex);
                    if (lineSounds.length === 0) return null;
                    return (
                      <div key={lineIndex} className="sound-row-container">
                        <div className="sound-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 md:gap-2 lg:gap-3 sound-grid-container">
                          {lineSounds.map((sound, colIndex) => {
                            const index = lineIndex * soundsPerRow + colIndex;
                            return (
                              <SoundButton 
                                key={sound.id} 
                                sound={sound} 
                                isAboveTheFold={index < (isMobileDevice ? 16 : 44)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {hasMore && <div ref={newContentRef} />}
              </div>
            ) : (
              // After first load: all sounds, border between rows via CSS :not(:last-child)
              Array.from({ length: Math.ceil(sounds.length / soundsPerFourLines) }, (_, sectionIndex) => {
                const startIndex = sectionIndex * soundsPerFourLines;
                const endIndex = Math.min(startIndex + soundsPerFourLines, sounds.length);
                const sectionSounds = sounds.slice(startIndex, endIndex);
                return (
                  <div key={sectionIndex}>
                    <div>
                      {Array.from({ length: Math.ceil(sectionSounds.length / soundsPerRow) }, (_, lineIndex) => {
                        const lineStartIndex = lineIndex * soundsPerRow;
                        const lineEndIndex = Math.min(lineStartIndex + soundsPerRow, sectionSounds.length);
                        const lineSounds = sectionSounds.slice(lineStartIndex, lineEndIndex);
                        if (lineSounds.length === 0) return null;
                        return (
                          <div key={lineIndex} className="sound-row-container">
                            <div className="sound-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 md:gap-2 lg:gap-3 sound-grid-container">
                              {lineSounds.map((sound, colIndex) => {
                                const index = startIndex + lineIndex * soundsPerRow + colIndex;
                                return (
                                  <SoundButton 
                                    key={sound.id} 
                                    sound={sound} 
                                    isAboveTheFold={index < (isMobileDevice ? 16 : 44)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More Button (first time) or Auto-load indicator - Always reserve space */}
          <div ref={loadMoreButtonRef} className={`flex justify-center mt-4 pb-2 load-more-container ${hasMore ? '' : 'hidden'}`}>
            {hasMore && (
              <>
                {!hasLoadedOnce ? (
                  // Show Load More button for first interaction
                  <Button
                    onClick={loadMoreSounds}
                    disabled={loading}
                    className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      'Load More Sounds →'
                    )}
                  </Button>
                ) : (
                  // Show auto-loading indicator after first click
                  <div ref={loadingRef} className="flex justify-center py-4">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-lg text-gray-600 dark:text-gray-300">Loading more sounds...</span>
                      </div>
                    ) : (
                      <div className="text-lg text-gray-500 dark:text-gray-400">
                        Scroll down to load more sounds
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>


          {/* End of content indicator */}
          {!hasMore && sounds.length > 0 && (
            <div className="flex justify-center mt-8 py-4">
              <div className="text-lg text-gray-500 dark:text-gray-400">
                You've reached the end of new sounds!
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No sounds found.
        </div>
      )}
    </section>
  );
});

AutoLoadingNewSoundsSection.displayName = 'AutoLoadingNewSoundsSection';

export default AutoLoadingNewSoundsSection;
