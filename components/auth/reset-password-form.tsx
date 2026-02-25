"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"

export default function ResetPasswordForm({ uid, token }: { uid: string; token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!uid || !token) {
    return (
      <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 px-4 py-4 text-amber-800 dark:text-amber-200 text-center text-base">
        This link is invalid or has expired. Please request a new one from{" "}
        <Link href="/forgot-password" className="font-semibold underline">forgot password</Link>.
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Password must be at least 8 characters. You got this!")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match. Try again!")
      return
    }
    setLoading(true)
    try {
      await apiClient.resetPassword(uid, token, password)
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch {
      setError("Something went wrong. The link may have expired. Try requesting a new one.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-4 py-4 text-green-800 dark:text-green-200 text-center text-base">
        Password updated! Redirecting you to sign in…
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
        <label htmlFor="password" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Same password again"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
