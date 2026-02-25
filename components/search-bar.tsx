"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

// Helper to generate slug from query
function generateSlug(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || ''
}

export default function SearchBar({ searchBasePath = "", placeholder }: { searchBasePath?: string; placeholder?: string }) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      const slug = generateSlug(query.trim())
      const base = searchBasePath || ""
      router.push(base ? `${base}/search/${slug}` : `/search/${slug}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg" style={{ minHeight: '40px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? "Search sounds..."}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
        style={{
          height: '40px', // Fixed height to prevent CLS
          boxSizing: 'border-box'
        }}
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" style={{ pointerEvents: 'none' }} />
    </form>
  )
}
