"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Copy, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

function generateSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface ShareModalProps {
  soundName: string
  soundId: number
  isOpen: boolean
  onClose: () => void
}

const ShareModal = ({ soundName, soundId, isOpen, onClose }: ShareModalProps) => {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseSlug = generateSlug(soundName)
  const fullSlug = baseSlug ? `${baseSlug}-${soundId}` : `sound-${soundId}`
  const soundUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${fullSlug}`
      : `https://memesoundboard.org/${fullSlug}`
  const encodedUrl = encodeURIComponent(soundUrl)
  const encodedText = encodeURIComponent(`Check out this sound: ${soundName}`)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const platforms = [
    {
      name: "X (Twitter)",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      label: "Share on X",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      label: "Share on WhatsApp",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      label: "Share on Telegram",
    },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      label: "Share on Reddit",
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedText}&body=Check out this sound: ${encodedUrl}`,
      label: "Share via Email",
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(soundUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: soundName,
          text: `Check out this sound: ${soundName}`,
          url: soundUrl,
        })
        onClose()
      } catch {
        // User cancelled or error
      }
    }
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700"
        role="dialog"
        aria-labelledby="share-modal-title"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
              <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Share sound
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                {soundName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                title={p.label}
              >
                {p.name}
              </a>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Copy className="h-4 w-4" />
              Copy link
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={soundUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
                aria-label="Share URL"
              />
              <Button onClick={copyToClipboard} size="sm" variant={copied ? "secondary" : "outline"} className="shrink-0">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full mt-4"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Share via device
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ShareModal
