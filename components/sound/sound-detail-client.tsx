"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ThumbsUp, Download, Share2, Play, Code } from "lucide-react"
import Header from "@/components/layout/header"
import ShareModal from "@/components/share/share-modal"
import Footer from "@/components/layout/footer"
import SoundButton from "@/components/sound/sound-button"
import SoundGrid from "@/components/sound/sound-grid"
import { Button } from "@/components/ui/button"
import type { Sound } from "@/lib/types/sound"
import { getCategoryById } from "@/lib/constants/categories"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"

interface SoundDetailClientProps {
  sound: Sound
  relatedSounds: Sound[]
  isMobileDevice?: boolean
}

export default function SoundDetailClient({ sound, relatedSounds, isMobileDevice }: SoundDetailClientProps) {
  const { token } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLiked, setIsLiked] = useState(!!(sound as { is_liked?: boolean }).is_liked)
  const [likeCount, setLikeCount] = useState(sound.likes_count)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [visibleSoundsCount, setVisibleSoundsCount] = useState(isMobileDevice ? 16 : 44)

  useEffect(() => {
    if (token) {
      setIsFavorited(!!(sound as { is_favorited?: boolean }).is_favorited)
    } else {
      setIsFavorited(false)
    }
  }, [sound.id, (sound as { is_favorited?: boolean }).is_favorited, token])

  const getCategoryName = () => {
    if (sound.category_id && typeof sound.category_id === 'number') {
      const category = getCategoryById(sound.category_id)
      return category?.name || sound.category_name || "Sound Effects"
    }
    return sound.category_name || "Sound Effects"
  }

  const getCategorySlug = () => {
    if (sound.category_id && typeof sound.category_id === 'number') {
      const category = getCategoryById(sound.category_id)
      return category?.slug || "sound-effects-soundboard"
    }
    return "sound-effects-soundboard"
  }

  const handleFavorite = async () => {
    if (!token) {
      const slug = sound.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') || `sound-${sound.id}`
      window.location.href = `/login?redirect=${encodeURIComponent(`/${slug}-${sound.id}`)}`
      return
    }
    try {
      if (isFavorited) await apiClient.unfavoriteSound(token, sound.id)
      else await apiClient.favoriteSound(token, sound.id)
      const key = 'sb_favorites'
      let favs: number[] = JSON.parse(localStorage.getItem(key) || "[]")
      if (isFavorited) {
        setIsFavorited(false)
        favs = favs.filter((id) => id !== sound.id)
      } else {
        setIsFavorited(true)
        favs.push(sound.id)
      }
      localStorage.setItem(key, JSON.stringify(favs))
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { action: isFavorited ? 'remove' : 'add', soundId: sound.id } }))
    } catch (err) {
      console.error("Error favoriting sound:", err)
    }
  }

  const handleLike = async () => {
    if (!token) return
    try {
      if (isLiked) {
        await apiClient.unlikeSound(token, sound.id)
        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        await apiClient.likeSound(token, sound.id)
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (err) {
      console.error("Error liking sound:", err)
    }
  }

  const downloadUrl = sound.id && typeof sound.id === 'number'
    ? apiClient.getSoundDownloadUrl(sound.id)
    : sound.sound_file

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `sound-${sound.id}`
  }

  const soundSlug = `${generateSlug(sound.name)}-${sound.id}`

  const canonicalUrl = `https://memesoundboard.org/${soundSlug}`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MemeSoundboard", "item": "https://memesoundboard.org" },
      { "@type": "ListItem", "position": 2, "name": "Sounds", "item": "https://memesoundboard.org/search" },
      { "@type": "ListItem", "position": 3, "name": sound.name, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-4 sm:py-5">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 flex justify-center">
            <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/new" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sounds</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/${getCategorySlug()}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">{getCategoryName()}</Link></li>
              <li aria-hidden="true">/</li>
              <li><span className="text-slate-900 dark:text-white font-medium" aria-current="page">{sound.name}</span></li>
            </ol>
          </nav>

          {/* Main Sound Card — compact */}
          <article className="w-full mx-auto">
            <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Top: title + meta row */}
              <div className="px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                  {sound.name}: Instant Play Sound Effect Button
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <Link
                    href={`/${getCategorySlug()}`}
                    className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {getCategoryName()}
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400">
                    {sound.views?.toLocaleString() ?? 0} views
                  </span>
                  {sound.likes_count > 0 && (
                    <span className="text-slate-500 dark:text-slate-400">
                      {sound.likes_count.toLocaleString()} likes
                    </span>
                  )}
                </div>
              </div>

              {/* Play area — reduced height, no huge box */}
              <div className="flex items-center justify-center py-4 px-4 sm:py-5">
                <div className="flex items-center justify-center w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] shrink-0">
                  <SoundButton sound={sound} hideActions={true} customSize={160} hideLabel={true} />
                </div>
              </div>

              {/* Action buttons — same size, same style */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <a
                    href={downloadUrl}
                    download={`${sound.name}.mp3`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <Button
                    type="button"
                    onClick={handleFavorite}
                    className="h-10 px-4 rounded-lg text-sm font-medium gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Heart className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} />
                    {isFavorited ? "Saved" : "Favorite"}
                  </Button>
                  {token && (
                    <Button
                      type="button"
                      onClick={handleLike}
                      className="h-10 px-4 rounded-lg text-sm font-medium gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                      {isLiked ? `Liked (${likeCount})` : `Like (${likeCount})`}
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="h-10 px-4 rounded-lg text-sm font-medium gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowEmbedModal(true)}
                    className="h-10 px-4 rounded-lg text-sm font-medium gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    Embed
                  </Button>
                </div>
              </div>
            </div>

            {/* You Might Like — same content */}
            {relatedSounds.length > 0 && (
              <div className="mt-6 w-full">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                    <Play className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    You Might Like
                  </h2>
                  <Link
                    href="/new"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    See all →
                  </Link>
                </div>
                <SoundGrid
                  sounds={relatedSounds.slice(0, Math.min(visibleSoundsCount, relatedSounds.length))}
                  useCompactView={true}
                  isMobileDevice={isMobileDevice}
                  maxCols={8}
                />
                {relatedSounds.length > visibleSoundsCount && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => setVisibleSoundsCount(prev => Math.min(prev + (isMobileDevice ? 16 : 44), relatedSounds.length))}
                      variant="outline"
                      className="rounded-lg text-sm font-medium"
                    >
                      Load more ({relatedSounds.length - Math.min(visibleSoundsCount, relatedSounds.length)} left)
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Rich content for SEO — same content, tighter layout */}
            <div className="space-y-4 mt-6">
              <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">About This Sound</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">
                  The <strong className="text-slate-800 dark:text-slate-200">{sound.name}</strong> sound button is a popular audio clip perfect for your meme soundboard, content creation, and entertainment. This high-quality sound effect is part of MemeSoundboard.org's extensive collection of free, unblocked sound buttons that work on all devices - from smartphones to desktop computers.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Play and download the <strong className="text-slate-800 dark:text-slate-200">{sound.name}</strong> sound effect buttons instantly! Ideal for memes, pranks, gaming, editing, and sharing fun moments with everyone.
                </p>
              </section>

              <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">How to Use This Sound</h2>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-sm">
                  <li><strong className="text-slate-800 dark:text-slate-200">Play instantly:</strong> Click the sound button above to play the {sound.name} sound immediately in your browser.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">Download for free:</strong> Click the "Download" button to save this sound to your device for offline use.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">Use in content:</strong> Perfect for memes, TikTok videos, YouTube content, Discord servers, streaming, and more.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">Share with friends:</strong> Use the share button to send this sound to others or embed it on your website.</li>
                </ol>
              </section>

              <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Popular Uses</h2>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-sm">
                  <li>Meme creation and viral content</li>
                  <li>TikTok videos and social media posts</li>
                  <li>Discord soundboards and voice chat</li>
                  <li>Streaming and live broadcasts</li>
                  <li>YouTube videos and content creation</li>
                  <li>Gaming streams and reactions</li>
                  <li>Notification sounds and ringtones</li>
                </ul>
              </section>

              <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Explore More Sounds</h2>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${getCategorySlug()}`} className="inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors">
                    More {getCategoryName()} Sounds
                  </Link>
                  <Link href="/trending" className="inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Trending
                  </Link>
                  <Link href="/new" className="inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">
                    New Sounds
                  </Link>
                  <Link href="/memes-soundboard" className="inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Meme Soundboard
                  </Link>
                </div>
              </section>
            </div>

            {/* Share Modal */}
            <ShareModal
              soundName={sound.name}
              soundId={sound.id}
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
            />

            {/* Embed Modal */}
            {showEmbedModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowEmbedModal(false)}>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-5 w-full max-w-md relative border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                    aria-label="Close"
                    onClick={() => setShowEmbedModal(false)}
                    type="button"
                  >
                    &times;
                  </button>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Embed this sound</h3>
                  <textarea
                    readOnly
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none font-mono mb-3"
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                    value={`<iframe src="https://memesoundboard.org/embed/${soundSlug}" width="300" height="90" style="max-width:100%;border:0;" loading="lazy"></iframe>`}
                    aria-label="Embed code for this sound"
                  />
                  <Button
                    onClick={() => {
                      const code = `<iframe src="https://memesoundboard.org/embed/${soundSlug}" width="300" height="90" style="max-width:100%;border:0;" loading="lazy"></iframe>`;
                      navigator.clipboard.writeText(code).then(() => {
                        setShowEmbedModal(false);
                      }).catch(() => {});
                    }}
                    className="w-full h-10 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Copy embed code
                  </Button>
                </div>
              </div>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </>
  )
}
