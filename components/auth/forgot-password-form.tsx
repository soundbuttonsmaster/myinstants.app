"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) {
      setError("Enter your email so we know where to send the link!")
      return
    }
    setLoading(true)
    try {
      await apiClient.forgotPassword(email.trim())
      setSent(true)
    } catch {
      setError("Something went wrong. Try again?")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-4 py-4 text-green-800 dark:text-green-200 text-center text-base">
        Check your email! If an account exists, we sent you a link to reset your password.
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
        <label htmlFor="email" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Your email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  )
}
