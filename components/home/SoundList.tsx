"use client"

import React, { useState, useEffect, Fragment, startTransition, useDeferredValue, useRef, useImperativeHandle, forwardRef } from 'react';
import type { Sound } from '@/lib/types/sound';
import SoundButton from '@/components/sound/sound-button';
import { Button } from '@/components/ui/button';

interface SoundListProps {
  title: string;
  sounds: Sound[];
  initialCount?: number;
  loadMoreCount?: number;
  viewAllLink?: string;
  onLoadMore?: () => Promise<boolean>;
  hasMoreSounds?: boolean;
  maxLines?: number;
  useCardView?: boolean;
  useCompactView?: boolean;
  showLoadMore?: boolean;
  showRedirectButton?: boolean;
  showLoadingIndicator?: boolean;
  customCardComponent?: React.ComponentType<{ sound: Sound; isAboveTheFold?: boolean; onRainEffect?: (imageUrl: string) => void }>;
  onRainEffect?: (imageUrl: string) => void;
  isMobileDevice?: boolean;
}

export interface SoundListRef {
  handleAutoPlay: () => void;
  handleRandomPlay: () => void;
  playRandomSound: () => void;
}

const SoundList = forwardRef<SoundListRef, SoundListProps>(({
  title,
  sounds,
  initialCount = 20,
  loadMoreCount = 10,
  viewAllLink,
  onLoadMore,
  hasMoreSounds = false,
  maxLines = 4,
  useCardView = false,
  useCompactView = false,
  showLoadMore = true,
  showRedirectButton = false,
  showLoadingIndicator = true,
  customCardComponent,
  onRainEffect,
  isMobileDevice: isMobileDeviceProp,
}, ref) => {
  const [loading, setLoading] = useState(false);
  // Use SSR prop for initial state - never switch on mount, only update on actual resize
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileDeviceProp ?? false);
  const [displayedSounds, setDisplayedSounds] = useState<Sound[]>(sounds);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRandomPlaying, setIsRandomPlaying] = useState(false);
  const [currentAutoPlayIndex, setCurrentAutoPlayIndex] = useState(0);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoPlayingRef = useRef(false);
  const isRandomPlayingRef = useRef(false);
  const shuffledIndicesRef = useRef<number[]>([]);
  const currentRandomIndexRef = useRef(0);
  const soundEndedHandlersRef = useRef<Map<number, (e: Event) => void>>(new Map());
  
  // Defer rendering of non-critical sounds to reduce long tasks
  const deferredSounds = useDeferredValue(displayedSounds);

  // Update mobile detection on resize ONLY - never on mount to avoid CLS
  // Server-side detected isMobileDevice prop is the source of truth for initial render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileDevice(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update displayed sounds when new sounds are added - use startTransition to avoid blocking
  useEffect(() => {
    if (sounds.length > displayedSounds.length) {
      startTransition(() => {
        setDisplayedSounds(sounds);
      });
    }
  }, [sounds, displayedSounds.length]);

  const handleLoadMore = async () => {
    if (loading || !onLoadMore) {
      return;
    }
    setLoading(true);
    try {
      await onLoadMore();
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  // Auto-play functionality
  const handleAutoPlay = () => {
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
      setCurrentAutoPlayIndex(0);
      
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
    if (limitedSounds.length === 0) return;
    
    isAutoPlayingRef.current = true;
    setIsAutoPlaying(true);
    setCurrentAutoPlayIndex(0);
    
    // Start playing from the first sound
    const playNextSound = (index: number) => {
      if (!isAutoPlayingRef.current && index > 0) return; // Check if stopped
      
      if (index >= limitedSounds.length) {
        // Finished all sounds
        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);
        setCurrentAutoPlayIndex(0);
        return;
      }

      const sound = limitedSounds[index];
      setCurrentAutoPlayIndex(index);
      
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
  };

  // Random play functionality
  const handleRandomPlay = () => {
    // Stop auto-play if active
    if (isAutoPlayingRef.current) {
      isAutoPlayingRef.current = false;
      setIsAutoPlaying(false);
      setCurrentAutoPlayIndex(0);
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
    if (limitedSounds.length === 0) return;
    
    // Create shuffled array of indices
    const indices = Array.from({ length: limitedSounds.length }, (_, i) => i);
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
        const indices = Array.from({ length: limitedSounds.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffledIndicesRef.current = indices;
        currentRandomIndexRef.current = 0;
      }

      const randomIndex = shuffledIndicesRef.current[currentRandomIndexRef.current];
      const sound = limitedSounds[randomIndex];
      setCurrentAutoPlayIndex(randomIndex);
      
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
  };

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

  // Grid: SSR-prop is initial truth, resize event updates it - no isMounted switch
  const soundsPerRow = useCompactView 
    ? (isMobileDevice ? 4 : 11)
    : useCardView 
      ? (isMobileDevice ? 3 : 9)
      : 3;

  // Group sounds into rows
  const rows: Sound[][] = [];
  
  // Limit the number of sounds based on maxLines - use deferred sounds for better performance
  const maxSounds = maxLines * soundsPerRow;
  const limitedSounds = deferredSounds.slice(0, maxSounds);
  
  for (let i = 0; i < limitedSounds.length; i += soundsPerRow) {
    const row = limitedSounds.slice(i, i + soundsPerRow);
    rows.push(row);
  }

  // Determine if more can be loaded
  const canLoadMore = showLoadMore && (hasMoreSounds || (displayedSounds.length < sounds.length));


  return (
    <section className="w-full py-2 sound-section-container">
      <div className="flex flex-row items-center justify-between mb-2 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
          <span className="whitespace-nowrap truncate">{title}</span>
        </h2>
        {viewAllLink && (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
            <Button 
              className={`px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                isAutoPlaying 
                  ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              }`}
              onClick={handleAutoPlay}
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
            >
              <span className="hidden sm:inline">{isRandomPlaying ? 'Stop Random' : 'Random Play'}</span>
              <span className="sm:hidden">{isRandomPlaying ? 'Stop' : 'Random'}</span>
            </Button>
            <Button 
              className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => window.location.href = viewAllLink}
            >
              <span className="hidden sm:inline">View All →</span>
              <span className="sm:hidden">View →</span>
            </Button>
          </div>
        )}
      </div>
      {displayedSounds.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-lg">No sounds found</p>
        </div>
      ) : (
        <>
          {/* Sound Grid - border-bottom between rows handled by CSS .sound-row-container:not(:last-child) */}
          <div>
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="w-full sound-row-container">
                <div className={`sound-grid ${useCompactView
                  ? "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 md:gap-2 lg:gap-3"
                  : useCardView 
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2 sm:gap-3"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                } sound-grid-container`}>
                  {row.map((sound: Sound, colIndex: number) => {
                    const index = rowIndex * soundsPerRow + colIndex;
                    return (
                      <Fragment key={`${sound.id}-${index}`}>
                        {useCompactView ? (
                          <SoundButton 
                            sound={sound} 
                            isAboveTheFold={index < (isMobileDevice ? 12 : 44)} 
                          />
                        ) : useCardView ? (
                          customCardComponent ? (
                            React.createElement(customCardComponent, {
                              sound: sound,
                              isAboveTheFold: index < (isMobileDevice ? 12 : 18),
                              onRainEffect: onRainEffect
                            })
                          ) : (
                            <SoundButton
                              sound={sound}
                              isAboveTheFold={index < (isMobileDevice ? 12 : 18)}
                            />
                          )
                        ) : (
                          <SoundButton 
                            sound={sound} 
                            isAboveTheFold={index < 10} 
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {canLoadMore && (
            <div className="mt-6 flex justify-center load-more-container">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading && showLoadingIndicator ? 'Loading...' : `Load More ${title}`}
              </Button>
            </div>
          )}
          {showRedirectButton && viewAllLink && (
            <div className="mt-6 flex justify-center load-more-container">
              <Button
                onClick={() => window.location.href = viewAllLink}
                className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                View All {title} →
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
});

SoundList.displayName = 'SoundList';

export default SoundList;
