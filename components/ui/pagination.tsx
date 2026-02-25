"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const createUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: page.toString() })
    return `${baseUrl}?${params.toString()}`
  }

  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <nav className="flex items-center justify-center gap-2 py-8">
      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link
            href={createUrl(1)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              currentPage === 1
                ? "border-sky-600 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-300"
                : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-slate-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createUrl(page)}
          className={cn(
            "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            currentPage === page
              ? "border-sky-600 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-300"
              : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-slate-500">...</span>}
          <Link
            href={createUrl(totalPages)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              currentPage === totalPages
                ? "border-sky-600 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-300"
                : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  )
}
