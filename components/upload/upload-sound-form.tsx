"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function UploadSoundForm() {
  const router = useRouter()
  const { token, isReady } = useAuth()
  const [name, setName] = useState("")
  const [tag, setTag] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isReady) return <p className="text-slate-500">Loading…</p>
  if (!token) {
    return (
      <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 px-4 py-4 text-amber-800 dark:text-amber-200 text-center">
        <p className="mb-4">Sign in to upload sounds.</p>
        <Link href="/login" className="inline-block rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600">
          Sign in
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name.trim()) {
      setError("Give your sound a name!")
      return
    }
    if (!file) {
      setError("Please select an audio file to upload.")
      return
    }
    setLoading(true)
    try {
      await apiClient.uploadSound(token, {
        name: name.trim(),
        tag: tag.trim() || undefined,
        sound_file: file,
      })
      setSuccess(true)
      setTimeout(() => router.push("/uploads"), 1500)
    } catch {
      setError("Upload failed. Please check your file and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-4 py-4 text-green-800 dark:text-green-200 text-center">
        Your sound was uploaded! Taking you to My Uploads…
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 px-4 py-3 text-amber-800 dark:text-amber-200 text-center text-base">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Sound name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My cool sound"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="tag" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Tags <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <input
          id="tag"
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="funny, meme"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Audio file <span className="text-slate-500 font-normal">(MP3, WAV, OGG, etc.)</span>
        </label>
        <input
          id="file"
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 cursor-pointer"
          disabled={loading}
        />
        {file && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Selected: <span className="font-medium text-slate-700 dark:text-slate-200">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Only file upload is supported. External links are not accepted.
        </p>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? "Uploading…" : "Upload sound"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        <Link href="/uploads" className="hover:text-blue-600 dark:hover:text-blue-400">
          ← My uploads
        </Link>
      </p>
    </form>
  )
}
