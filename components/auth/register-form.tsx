"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!username.trim()) {
      setError("Pick a cool username!")
      return
    }
    if (!email.trim()) {
      setError("We need your email so you can sign in later.")
      return
    }
    if (password.length < 8) {
      setError("Password should be at least 8 characters. Make it strong!")
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.register({
        username: username.trim(),
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
      })
      const data = res.data as Record<string, unknown>
      const token = data?.token as string | undefined
      const userObj = data?.user as Record<string, unknown> | undefined
      if (token && userObj && typeof userObj === "object") {
        login(token, {
          id: Number(userObj.id),
          username: String(userObj.username ?? ""),
          email: String(userObj.email ?? ""),
          full_name: userObj.full_name ? String(userObj.full_name) : undefined,
        })
        router.push("/")
        router.refresh()
        return
      }
      setError("Account created! Please sign in to continue.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("400") || msg.includes("409") || msg.includes("already")) {
        setError("Username or email is already in use. Try another!")
      } else if (msg.includes("401") || msg.includes("403")) {
        setError("Registration is temporarily unavailable. Please try again later.")
      } else {
        setError("Could not create account. Please check your details and try again.")
      }
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
        <label htmlFor="username" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Pick a cool name"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="fullName" className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Your name <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="What should we call you?"
          className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
      >
        {loading ? "Creating your account…" : "Create my account"}
      </Button>
      <p className="text-center text-slate-600 dark:text-slate-400 text-base">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
          Sign in
        </Link>
      </p>
    </form>
  )
}
