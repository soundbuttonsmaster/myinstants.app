"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function ProfilePageClient() {
  const router = useRouter()
  const { user, token, isReady, setUser } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      router.replace("/login")
      return
    }
    let cancelled = false
    apiClient.getUserProfile(token).then((res) => {
      if (cancelled) return
      const d = res.data as { first_name?: string; last_name?: string; phone_number?: string }
      setFirstName(d.first_name ?? "")
      setLastName(d.last_name ?? "")
      setPhone(d.phone_number ?? "")
      setInitialLoad(false)
    }).catch(() => {
      if (!cancelled) setInitialLoad(false)
    })
    return () => { cancelled = true }
  }, [isReady, token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await apiClient.updateUserProfile(token, {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        phone_number: phone.trim() || undefined,
      })
      const updated = (res.data as { user?: { username?: string; email?: string; full_name?: string; first_name?: string; last_name?: string } })?.user
      if (updated && user) {
        setUser({ ...user, full_name: [updated.first_name, updated.last_name].filter(Boolean).join(" ") || updated.full_name || user.full_name })
      }
      setSuccess("Profile updated! Nice.")
    } catch {
      setError("Could not update. Try again?")
    } finally {
      setLoading(false)
    }
  }

  if (!isReady || !token) return null
  if (!user) return null

  if (initialLoad) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800 text-center text-slate-600 dark:text-slate-400">
        Loading your profile…
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        My profile
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        You&apos;re signed in as <strong>{user.username}</strong> ({user.email}). Update your details below if you like!
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 px-4 py-3 text-amber-800 dark:text-amber-200 text-center text-base">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-4 py-3 text-green-800 dark:text-green-200 text-center text-base">
            {success}
          </div>
        )}
        <div>
          <label htmlFor="firstName" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Your last name"
            className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Phone <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg transition-all disabled:opacity-70"
        >
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <Link href="/favorites" className="font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
          My Favorites
        </Link>
        <Link href="/likes" className="font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
          My Likes
        </Link>
        <Link href="/uploads" className="font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
          My Uploads
        </Link>
        <Link href="/" className="text-slate-500 dark:text-slate-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
