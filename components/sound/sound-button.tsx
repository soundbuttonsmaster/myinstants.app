"use client"

import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { Heart, Share2, Link as LinkIcon, Download, ThumbsUp } from 'lucide-react';
import { Heart as HeartFilled } from 'lucide-react';
import type { Sound } from '@/lib/types/sound';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { apiClient } from '@/lib/api/client';
import ShareModal from '@/components/share/share-modal';

interface CompactSoundButtonProps {
  sound: Sound;
  isAboveTheFold?: boolean;
  customSize?: number;
  hideLabel?: boolean;
  hideActions?: boolean;
}

// Global audio context
let audioContext: AudioContext | null = null;

// Global audio cache for instant playback - keyed by audio URL
const audioCache = new Map<string, HTMLAudioElement>();
const CACHE_ACCESS_TIMES = new Map<string, number>(); // Track last access for LRU
const MAX_CACHE_SIZE = 50;

const cleanupAudioCache = () => {
  if (audioCache.size <= MAX_CACHE_SIZE) return;
  const entries = Array.from(CACHE_ACCESS_TIMES.entries()).sort((a, b) => a[1] - b[1]);
  const toRemove = Math.max(1, Math.floor(MAX_CACHE_SIZE * 0.25));
  for (let i = 0; i < toRemove && i < entries.length; i++) {
    const [url] = entries[i];
    const audio = audioCache.get(url);
    if (audio) {
      try {
        audio.pause();
        audio.src = '';
        audio.onended = null;
        audio.onpause = null;
        audio.onerror = null;
      } catch (e) { }
    }
    audioCache.delete(url);
    CACHE_ACCESS_TIMES.delete(url);
  }
};

const normalizeAudioUrl = (sound: Sound): string | null => {
  // Use API client for consistent base URL and CORS
  if (sound.id && typeof sound.id === 'number') {
    return apiClient.getSoundAudioUrl(sound.id);
  }
  console.error('Sound missing ID, cannot create audio URL:', sound);
  return null;
};

const createAudio = (audioUrl: string): HTMLAudioElement => {
  if (audioCache.has(audioUrl)) {
    const cached = audioCache.get(audioUrl)!;
    CACHE_ACCESS_TIMES.set(audioUrl, Date.now());
    if (cached.currentTime > 0) cached.currentTime = 0;
    if (!cached.paused) {
      cached.pause();
      cached.currentTime = 0;
    }
    return cached;
  }
  cleanupAudioCache();
  const audio = new Audio(audioUrl);
  audio.preload = 'auto'; // Changed to 'auto' for better loading
  audio.crossOrigin = 'anonymous';
  
  // Add error handling with better logging
  audio.onerror = (e) => {
    console.error('Audio playback error:', {
      url: audioUrl,
      error: e,
      code: (audio as any).error?.code,
      message: (audio as any).error?.message
    });
    const cachedAudio = audioCache.get(audioUrl);
    if (cachedAudio) {
      try {
        cachedAudio.pause();
        cachedAudio.src = '';
      } catch (err) { }
    }
    audioCache.delete(audioUrl);
    CACHE_ACCESS_TIMES.delete(audioUrl);
  };
  
  // Add load error handling
  audio.addEventListener('error', (e) => {
    console.error('Audio load error:', {
      url: audioUrl,
      error: e,
      code: (audio as any).error?.code,
      message: (audio as any).error?.message
    });
  }, { once: true });
  
  audio.load();
  return audio;
};

const CompactSoundButton: React.FC<CompactSoundButtonProps> = ({ sound, isAboveTheFold = false, customSize, hideLabel = false, hideActions = false }) => {
  const router = useRouter();
  const { token } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(!!(sound as { is_liked?: boolean }).is_liked);
  const [likesCount, setLikesCount] = useState(sound.likes_count ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (token) {
      setIsFavorite(!!(sound as { is_favorited?: boolean }).is_favorited);
    } else {
      setIsFavorite(false);
    }
  }, [sound.id, (sound as { is_favorited?: boolean }).is_favorited, token]);

  const soundSlug = React.useMemo(() => {
    const baseSlug = sound.name?.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Keep word characters, spaces, and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single hyphen
      .replace(/^-+|-+$/g, '') || 'sound'; // Remove leading/trailing hyphens
    // Include ID in slug for uniqueness: "fart-123" instead of just "fart"
    // This ensures each sound has a unique URL even if names are duplicate
    return `${baseSlug}-${sound.id}`;
  }, [sound.name, sound.id]);

  const detailUrl = React.useMemo(() => `/${soundSlug}`, [soundSlug]);

  const handlePlay = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (!audioContext) {
        try { audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch (e) { }
      }
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => { });
      }
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    window.dispatchEvent(new CustomEvent('pause-all-sounds', { detail: { exceptId: sound.id } }));

    // Always generate fresh URL from API endpoint (don't cache old S3 URLs)
    let audioUrl = normalizeAudioUrl(sound);
    if (!audioUrl) {
      console.error('Failed to generate audio URL for sound:', sound);
      setIsLoading(false);
      return;
    }
    
    // Clear old audio if URL changed (especially if switching from S3 to API)
    if (audioUrlRef.current && audioUrlRef.current !== audioUrl) {
      // URL changed - clear old audio reference
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        } catch (e) {}
        audioRef.current = null;
      }
      // Remove old S3 URLs from cache if they exist
      if (audioUrlRef.current.includes('s3.us-east-2.amazonaws.com')) {
        audioCache.delete(audioUrlRef.current);
        CACHE_ACCESS_TIMES.delete(audioUrlRef.current);
      }
    }
    
    audioUrlRef.current = audioUrl;

    let audio = audioRef.current;

    // Normalize URL
    const normalizeUrl = (url: string) => {
      try { return new URL(url, window.location.href).href; } catch { return url; }
    };
    const normalizedAudioUrl = normalizeUrl(audioUrl);
    const isNewAudio = !audio || !audio.src || normalizeUrl(audio.src) !== normalizedAudioUrl;

    if (isNewAudio) {
      audio = createAudio(audioUrl);
      audioRef.current = audio;
      if (!audioCache.has(audioUrl)) audioCache.set(audioUrl, audio);

      const audioElement = audio;
      if (!audioElement.onended) {
        audioElement.onended = () => {
          setIsPlaying(false);
          setIsLoading(false);
          setIsPressed(false);
          (audioElement as any)._isPlayingAttempt = false;
          audioElement.currentTime = 0;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          window.dispatchEvent(new CustomEvent('sound-ended', { detail: { soundId: sound.id } }));
        };
        audioElement.onpause = () => {
          const isPlayingAttempt = (audioElement as any)._isPlayingAttempt || false;
          if (audioElement.ended) {
            setIsPressed(false);
            setIsPlaying(false);
            setIsLoading(false);
            (audioElement as any)._isPlayingAttempt = false;
            return;
          }
          if (isPlayingAttempt && !audioElement.ended) {
            setTimeout(() => {
              if (audioElement.paused && !audioElement.ended && (audioElement as any)._isPlayingAttempt) {
                audioElement.play().catch(() => { });
              }
            }, 50);
            return;
          }
          if (audioElement.paused && audioElement.currentTime === 0 && !audioElement.ended && !isPlayingAttempt) {
            setIsPlaying(false);
            setIsLoading(false);
            setIsPressed(false);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          }
        };
        audioElement.oncanplay = () => setIsLoading(false);
        audioElement.oncanplaythrough = () => setIsLoading(false);
        audioElement.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          const cachedAudio = audioCache.get(audioUrl!);
          if (cachedAudio) {
            try { cachedAudio.pause(); cachedAudio.src = ''; } catch (err) { }
          }
          audioCache.delete(audioUrl!);
          CACHE_ACCESS_TIMES.delete(audioUrl!);
        };
      }
    }

    if (!audio) { setIsLoading(false); return; }

    audio.currentTime = 0;
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPressed(true);
    setIsLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

    loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 3000);

    const playAudio = async () => {
      try {
        if (audio.readyState === 0) audio.load();

        const waitForReady = (): Promise<void> => {
          return new Promise((resolve) => {
            if (audio.readyState >= 3) { resolve(); return; }
            const timeout = setTimeout(() => {
              audio.removeEventListener('canplay', onReady);
              audio.removeEventListener('canplaythrough', onReady);
              audio.removeEventListener('loadeddata', onReady);
              resolve();
            }, 2000);
            const onReady = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onReady);
              audio.removeEventListener('canplaythrough', onReady);
              audio.removeEventListener('loadeddata', onReady);
              resolve();
            };
            audio.addEventListener('canplay', onReady, { once: true });
            audio.addEventListener('canplaythrough', onReady, { once: true });
            audio.addEventListener('loadeddata', onReady, { once: true });
            if (audio.readyState >= 2) {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onReady);
              audio.removeEventListener('canplaythrough', onReady);
              audio.removeEventListener('loadeddata', onReady);
              resolve();
            }
          });
        };

        await waitForReady();

        try {
          const audioElement = audio as any;
          if (audioElement._isPlayingAttempt === undefined) audioElement._isPlayingAttempt = false;
          audioElement._isPlayingAttempt = true;

          const playPromise = audio.play();
          if (playPromise !== undefined) await playPromise;

          await new Promise(resolve => setTimeout(resolve, 50));

          const isActuallyPlaying = !audio.paused && !audio.ended;
          if (isActuallyPlaying) {
            setIsPlaying(true);
            setIsLoading(false);
            setIsPressed(false);

            const monitorInterval = setInterval(() => {
              if ((audioElement as any)._isPlayingAttempt && audio.paused && !audio.ended) {
                audio.play().catch(() => { });
              }
              if (audio.ended) {
                setIsPressed(false);
                setIsPlaying(false);
                setIsLoading(false);
                (audioElement as any)._isPlayingAttempt = false;
                clearInterval(monitorInterval);
              }
            }, 100);

            setTimeout(() => {
              clearInterval(monitorInterval);
              audioElement._isPlayingAttempt = false;
              if (audio.ended || (audio.paused && audio.currentTime === 0)) setIsPressed(false);
            }, 1000);

            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          } else {
            audioElement._isPlayingAttempt = false;
            setIsPlaying(false);
            setIsLoading(false);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          }
        } catch (playError: any) {
          console.error('Audio play error:', {
            error: playError,
            name: playError.name,
            url: audioUrl,
            code: (audio as any).error?.code,
            message: (audio as any).error?.message,
            readyState: audio.readyState,
            networkState: audio.networkState
          });
          
          if (playError.name !== 'AbortError' && playError.name !== 'NotAllowedError') {
            // Ensure AudioContext is resumed before retry
            if (audioContext && audioContext.state === 'suspended') {
              try {
                await audioContext.resume();
              } catch (ctxError) {
                console.error('AudioContext resume error:', ctxError);
              }
            }
            
            audio.load();
            await new Promise(resolve => setTimeout(resolve, 500));
            await waitForReady();
            try {
              await audio.play();
              setIsPlaying(true);
              setIsLoading(false);
              if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
            } catch (retryError) {
              console.error('Retry play error:', retryError);
              setIsPlaying(false);
              setIsLoading(false);
            }
          } else {
            setIsPlaying(false);
            setIsLoading(false);
          }
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        }
      } catch (error) {
        setIsPlaying(false);
        setIsLoading(false);
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      }
    };
    playAudio().catch(() => {
      setIsPlaying(false);
      setIsLoading(false);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    });
  }, [isPlaying, sound.id]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(detailUrl);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(detailUrl)}`);
      return;
    }
    const key = 'sb_favorites';
    try {
      if (isFavorite) {
        await apiClient.unfavoriteSound(token, sound.id);
        if (isLiked) {
          await apiClient.unlikeSound(token, sound.id).catch(() => {});
          setIsLiked(false);
          setLikesCount((c) => Math.max(0, c - 1));
        }
      } else {
        await apiClient.favoriteSound(token, sound.id);
        if (!isLiked) {
          await apiClient.likeSound(token, sound.id).catch(() => {});
          setIsLiked(true);
          setLikesCount((c) => c + 1);
        }
      }
      let favs: number[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (isFavorite) {
        setIsFavorite(false);
        favs = favs.filter((id) => id !== sound.id);
        localStorage.setItem(key, JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { action: 'remove', soundId: sound.id } }));
      } else {
        setIsFavorite(true);
        favs.push(sound.id);
        localStorage.setItem(key, JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { action: 'add', soundId: sound.id } }));
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  useEffect(() => {
    const handlePauseAll = (e: Event) => {
      const customEvent = e as CustomEvent<{ exceptId: number | null }>;
      if (customEvent.detail?.exceptId !== sound.id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsLoading(false);
      }
    };
    const handleAutoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ soundId: number }>;
      if (customEvent.detail?.soundId === sound.id) {
        setIsPressed(true); // Visual feedback
        setTimeout(() => setIsPressed(false), 150);
        handlePlay();
      }
    };
    window.addEventListener('pause-all-sounds', handlePauseAll as EventListener);
    window.addEventListener('play-sound-auto', handleAutoPlay as EventListener);
    return () => {
      window.removeEventListener('pause-all-sounds', handlePauseAll as EventListener);
      window.removeEventListener('play-sound-auto', handleAutoPlay as EventListener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [sound.id, handlePlay]);

  // Get inner button hex color - kid-friendly vibrant colors
  const getInnerHexColor = () => {
    const colorPalette = [
      '#FF6B6B', // Bright coral red - fun and energetic
      '#4ECDC4', // Turquoise - playful and fresh
      '#FFE66D', // Sunny yellow - cheerful and happy
      '#95E1D3', // Mint green - soft and friendly
      '#F38181', // Pink coral - warm and inviting
      '#AA96DA', // Lavender purple - dreamy and fun
      '#FCBAD3', // Bubblegum pink - sweet and playful
      '#A8E6CF', // Light green - fresh and natural
      '#FFD3A5', // Peach - soft and warm
      '#C7CEEA', // Periwinkle blue - calm and friendly
      '#FF8B94', // Salmon pink - vibrant and fun
      '#FFD93D', // Golden yellow - bright and cheerful
      '#6BCB77', // Apple green - fresh and energetic
      '#FF6B9D', // Hot pink - bold and fun
      '#C44569', // Berry pink - rich and playful
      '#F8B500', // Orange yellow - warm and sunny
      '#4A90E2', // Sky blue - bright and clear
      '#9B59B6', // Purple - magical and fun
      '#1ABC9C', // Turquoise green - vibrant and fresh
      '#E74C3C', // Bright red - energetic and bold
      '#3498DB', // Bright blue - clear and friendly
      '#F39C12', // Orange - warm and cheerful
    ];

    // Use sound ID to consistently pick a color from the palette
    const colorIndex = sound.id % colorPalette.length;
    return colorPalette[colorIndex];
  };

  const innerHex = getInnerHexColor();

  // Calculate dimensions
  const baseSize = customSize ?? 90;
  const size = Math.floor(baseSize * 0.92);
  const buttonSize = Math.floor(size * 1.15);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 };
  };

  const rgb = hexToRgb(innerHex);
  const buttonId = `button-${sound.id}`;
  const svgSize = buttonSize;

  // Helper to convert RGB object to hex string
  const rgbObjToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  // For detail page, use fixed dimensions
  const isDetailPage = customSize && customSize >= 200;

  return (
    <div className="flex flex-col items-center" style={{
      width: isDetailPage ? `${customSize}px` : '100%',
      height: isDetailPage ? `${customSize}px` : 'auto',
      minHeight: isDetailPage ? `${customSize}px` : 'auto',
      maxHeight: isDetailPage ? `${customSize}px` : 'none',
      minWidth: isDetailPage ? `${customSize}px` : 'auto',
      maxWidth: isDetailPage ? `${customSize}px` : '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box',
      overflow: 'visible',
      gap: '0',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Sound Button - 3D SVG Button */}
      <div className="relative w-full aspect-square mx-auto" style={{
        overflow: 'visible',
        flexShrink: 0,
        boxShadow: 'none',
        width: isDetailPage ? `${customSize}px` : '100%',
        height: isDetailPage ? `${customSize}px` : 'auto',
        minWidth: isDetailPage ? `${customSize}px` : 'auto',
        minHeight: isDetailPage ? `${customSize}px` : 'auto',
        maxWidth: isDetailPage ? `${customSize}px` : '100%',
        maxHeight: isDetailPage ? `${customSize}px` : 'none',
        aspectRatio: isDetailPage ? '1 / 1' : '1 / 1'
      }}>
        <div
          className={`sound-button-container w-full h-full ${isPressed ? 'pressed' : ''}`}
          role="button"
          aria-label={`Play ${sound.name}`}
          onClick={handlePlay}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          style={{
            cursor: 'pointer',
            position: 'relative',
            overflow: 'visible',
            margin: '0 auto',
            width: isDetailPage ? `${customSize}px` : '100%',
            height: isDetailPage ? `${customSize}px` : '100%',
            minWidth: isDetailPage ? `${customSize}px` : 'auto',
            minHeight: isDetailPage ? `${customSize}px` : 'auto',
            maxWidth: isDetailPage ? `${customSize}px` : '100%',
            maxHeight: isDetailPage ? `${customSize}px` : '100%',
            flexShrink: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1000 1000"
            className="w-full h-auto"
            aria-label="Sound button"
            style={{ 
              display: 'block', 
              overflow: 'visible',
              width: isDetailPage ? `${customSize}px` : '100%',
              height: isDetailPage ? `${customSize}px` : 'auto',
              minWidth: isDetailPage ? `${customSize}px` : 'auto',
              minHeight: isDetailPage ? `${customSize}px` : 'auto',
              maxWidth: isDetailPage ? `${customSize}px` : '100%',
              maxHeight: isDetailPage ? `${customSize}px` : 'none',
              flexShrink: 0
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <style>{`
                .cls-1-${buttonId} { fill: #b0aaab; }
                .cls-2-${buttonId} { fill: ${innerHex}; }
                .cls-3-${buttonId} { fill: ${rgbObjToHex(rgb.r - 20, rgb.g - 20, rgb.b - 20)}; }
                .cls-4-${buttonId} { fill: url(#linear-gradient-2-${buttonId}); }
                .cls-5-${buttonId} { fill: url(#linear-gradient-${buttonId}); opacity: .51; }
                .cls-6-${buttonId} { fill: url(#linear-gradient-3-${buttonId}); }
                .cls-7-${buttonId} { fill: #6d6e71; }
                .cls-8-${buttonId} { fill: #58595b; }
                .cls-9-${buttonId} { 
                  fill: ${rgbObjToHex(Math.max(0, rgb.r - 70), Math.max(0, rgb.g - 70), Math.max(0, rgb.b - 70))}; 
                  stroke: ${rgbObjToHex(Math.max(0, rgb.r - 80), Math.max(0, rgb.g - 80), Math.max(0, rgb.b - 80))};
                  stroke-width: 2;
                  stroke-linejoin: round;
                  stroke-linecap: round;
                }
                .button-top-${buttonId} {
                  transition: transform 0.15s ease-out;
                  transform-origin: center;
                }
                .button-top-${buttonId} ellipse.cls-3-${buttonId},
                .button-top-${buttonId} ellipse.cls-2-${buttonId} {
                  stroke: ${rgbObjToHex(Math.max(0, rgb.r - 50), Math.max(0, rgb.g - 50), Math.max(0, rgb.b - 50))};
                  stroke-width: 1.5;
                  stroke-linejoin: round;
                }
              `}</style>
              <linearGradient id={`linear-gradient-${buttonId}`} x1={isPressed ? "855.53" : "855.53"} y1={isPressed ? "143.53" : "143.53"} x2={isPressed ? "180.24" : "180.24"} y2={isPressed ? "533.41" : "533.41"} gradientUnits="userSpaceOnUse">
                <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
                <stop offset=".14" stopColor="#fff" stopOpacity=".75"/>
                <stop offset=".34" stopColor="#fff" stopOpacity=".53"/>
                <stop offset=".62" stopColor="#fff" stopOpacity=".19"/>
                <stop offset=".76" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id={`linear-gradient-2-${buttonId}`} x1={isPressed ? "2970.59" : "2970.59"} y1={isPressed ? "-278.99" : "-278.99"} x2={isPressed ? "2694.81" : "2694.81"} y2={isPressed ? "198.67" : "198.67"} gradientTransform="translate(3323.24 310.96) rotate(-180)" gradientUnits="userSpaceOnUse">
                <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
                <stop offset=".05" stopColor="#fff" stopOpacity=".79"/>
                <stop offset=".09" stopColor="#fff" stopOpacity=".46"/>
                <stop offset=".11" stopColor="#fff" stopOpacity=".33"/>
                <stop offset=".2" stopColor="#fff" stopOpacity=".12"/>
                <stop offset=".25" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id={`linear-gradient-3-${buttonId}`} x1="2689.69" y1="205.23" x2="2967.13" y2="-275.31" xlinkHref={`#linear-gradient-2-${buttonId}`}/>
            </defs>
            {/* Base layer - always static, never moves */}
            <g className="button-base">
              <g>
                <path className={`cls-8-${buttonId}`} d="M894.05,452.22H97.51c-17.87,32.85-27.66,68.5-27.66,105.77v88.11c0,12.4,1.25,24.61,3.88,36.55,27.99,132.45,206.27,234.58,422.06,234.58s394.07-102.13,422.06-234.58c2.56-11.95,3.88-24.15,3.88-36.55v-88.11l-27.66-105.77Z"/>
                <path className={`cls-7-${buttonId}`} d="M921.72,557.99c0,164.39-190.69,297.69-425.94,297.69S69.84,722.38,69.84,557.99c0-37.27,9.79-72.91,27.66-105.77,61.05-112.19,216.32-191.92,398.27-191.92s337.23,79.73,398.27,191.92c17.87,32.85,27.66,68.5,27.66,105.77Z"/>
                <ellipse className={`cls-1-${buttonId}`} cx="497.32" cy="552.26" rx="410.95" ry="280.5"/>
              </g>
            </g>

            {/* Top button layer - moves down when pressed */}
            <g
              className={`button-top button-top-${buttonId}`}
              transform={isPressed ? 'translate(0, 25) scale(0.95, 0.92)' : 'translate(0, 0) scale(1, 1)'}
            >
              <g>
                <path className={`cls-9-${buttonId}`} d="M859.55,349.14v164.23c0,10.49-1.11,20.85-3.32,30.97-23.9,112.22-176.18,198.71-360.44,198.71s-336.54-86.49-360.44-198.71c-2.21-10.12-3.32-20.48-3.32-30.97v-164.23h727.53Z"/>
                <ellipse className={`cls-3-${buttonId}`} cx="495.79" cy="349.14" rx="363.78" ry="243.13"/>
                <ellipse className={`cls-2-${buttonId}`} cx="494.83" cy="349.01" rx="363.47" ry="243.26"/>
              </g>
              <ellipse className={`cls-5-${buttonId}`} cx="497.99" cy={isPressed ? "374.96" : "349.96"} rx="362.84" ry={isPressed ? "217.94" : "242.94"} style={{ transition: 'cy 0.15s ease-out, ry 0.15s ease-out' }}/>
              <path className={`cls-4-${buttonId}`} d="M491.68,591.01c-92.46,0-185.02-22.98-255.63-68.95-69.86-45.44-108.38-106.34-108.47-171.48-.08-64.7,37.85-125.2,106.81-170.35,140.34-91.95,369.43-91.96,510.66-.04,69.86,45.44,108.38,106.33,108.46,171.47.08,64.72-37.86,125.23-106.85,170.39-70.16,45.97-162.51,68.95-254.97,68.96ZM489.42,125.83c-90.09,0-180.07,22.4-248.44,67.19-64.74,42.38-100.35,98.33-100.27,157.53.08,59.64,36.26,116,101.9,158.69h0c137.6,89.56,360.75,89.57,497.44,0,64.77-42.4,100.4-98.36,100.32-157.58-.08-59.64-36.26-115.99-101.89-158.68-68.79-44.78-158.98-67.17-249.05-67.17Z"/>
              <path className={`cls-6-${buttonId}`} d="M495.98,587.22c-93.07,0-186.24-23.11-257.32-69.33-70.33-45.69-109.1-106.93-109.18-172.44-.08-65.06,38.1-125.9,107.51-171.29,141.27-92.46,371.87-92.47,514.03-.04,70.32,45.69,109.09,106.92,109.18,172.42.08,65.07-38.12,125.92-107.56,171.34-70.62,46.22-163.59,69.34-256.66,69.34ZM493.71,119.47c-90.69,0-181.26,22.52-250.08,67.56-65.16,42.62-101.01,98.87-100.94,158.41.08,59.97,36.5,116.64,102.57,159.57h0c138.51,90.06,363.14,90.06,500.73,0,65.2-42.64,101.06-98.91,100.98-158.45-.08-59.97-36.5-116.63-102.57-159.56-69.25-45.03-160.03-67.54-250.7-67.54Z"/>
            </g>
          </svg>

          {/* Loading spinner ring around buttons */}
          {isLoading && (
            <div
              className="loading-ring"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${svgSize + 20}px`,
                height: `${svgSize + 20}px`,
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              <svg
                width={svgSize + 20}
                height={svgSize + 20}
                style={{ display: 'block' }}
              >
                <circle
                  cx={(svgSize + 20) / 2}
                  cy={(svgSize + 20) / 2}
                  r={(svgSize + 20) / 2 - 3}
                  fill="none"
                  stroke={innerHex}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.PI * (svgSize + 20)}`}
                  strokeDashoffset={`${Math.PI * (svgSize + 20) * 0.75}`}
                  opacity="0.6"
                  className="loading-spinner"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .sound-button-container {
          position: relative;
          width: ${svgSize}px;
          height: ${svgSize}px;
          overflow: visible !important;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          box-shadow: none !important;
        }
        
        .sound-button-container * {
          box-shadow: none !important;
        }
        
        .sound-button-container svg {
          display: block;
          box-shadow: none !important;
          transform: none !important;
          transition: none !important;
        }
        
        .sound-button-container svg * {
          box-shadow: none !important;
        }
        
        /* Base stays completely static - no transforms, no animations, no transitions */
        .button-base {
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }
        
        /* Ensure all base elements stay static */
        .button-base * {
          transform: none !important;
          transition: none !important;
        }
        
        /* Top button layer - can be transformed */
        .button-top {
          transform-origin: center;
          transition: transform 0.15s ease-out;
        }
        
        /* SVG container - no transitions needed as we handle it in the group */
        .sound-button-container svg {
          transition: none !important;
        }
        
        /* Loading spinner animation */
        .loading-ring {
          animation: fadeIn 0.2s ease-in;
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
          transform-origin: center;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Sound Name */}
      {!hideLabel && (
        <Link
          href={detailUrl}
          prefetch={isAboveTheFold}
          className="text-center block w-full max-w-[90px] sm:max-w-[95px] md:max-w-[100px] lg:max-w-[104px]"
          style={{
            boxSizing: 'border-box',
            overflow: 'hidden',
            minHeight: '2.5rem', // Fixed height to prevent layout shift
            height: '2.5rem',
            marginTop: '0.25rem',
            marginBottom: '0',
            display: 'block',
            flexShrink: 0
          }}
          aria-label={`${sound.name} - view details`}
        >
          <span
            className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer leading-tight text-center break-words line-clamp-2 px-0.5 block"
            style={{
              width: '100%',
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              padding: '0',
              margin: '0 auto',
              boxSizing: 'border-box',
              minHeight: '2.5rem', // Fixed height to prevent layout shift
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {sound.name}
          </span>
        </Link>
      )}

      {/* Action Icons */}
      {!hideActions && (
        <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-1" style={{ flexShrink: 0 }}>
          <button
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md",
              isFavorite ? 'bg-gradient-to-br from-pink-400 to-red-500' : 'bg-gradient-to-br from-pink-300 to-rose-400'
            )}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              background: isFavorite 
                ? 'linear-gradient(135deg, #f472b6 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, #f9a8d4 0%, #fb7185 100%)'
            }}
          >
            <HeartFilled className="w-4 h-4 text-white drop-shadow-sm" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            title="Share"
            style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'; }}
          >
            <Share2 className="w-4 h-4 text-white drop-shadow-sm" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            title="Download / Details"
            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'; }}
          >
            <Download className="w-4 h-4 text-white drop-shadow-sm" />
          </button>
        </div>
      )}

      <ShareModal
        soundName={sound.name || ''}
        soundId={sound.id}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

// Global cleanup
if (typeof window !== 'undefined') {
  (window as any).cleanupAudioCache = cleanupAudioCache;
  if (!(window as any).__audioCacheCleanupInterval) {
    (window as any).__audioCacheCleanupInterval = setInterval(cleanupAudioCache, 5 * 60 * 1000);
  }
}

export default memo(CompactSoundButton);
