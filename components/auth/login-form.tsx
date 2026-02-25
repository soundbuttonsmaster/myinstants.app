"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const redirectTo = searchParams.get("redirect")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) {
      setError("Enter your email so we know it's you!")
      return
    }
    if (!password) {
      setError("Enter your password.")
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.login(email.trim(), password)
      const data = res.data as { token?: string; user?: { id: number; username: string; email: string; full_name?: string } }
      const token = data?.token
      const user = data?.user
      if (token && user) {
        login(token, {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
        })
        const dest = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/"
        router.push(dest)
        router.refresh()
        return
      }
      setError("Something went wrong. Try again?")
    } catch {
      setError("Wrong email or password. Try again or create an account!")
    } finally {
      setLoading(false)
    }
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
          Email
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
      <div>
        <label htmlFor="password" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
      >
        {loading ? "Signing you in…" : "Sign in"}
      </Button>
      <p className="text-center text-slate-600 dark:text-slate-400 text-base">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
          Create one
        </Link>
      </p>
    </form>
  )
}
