"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which icon to show - use resolvedTheme for better accuracy
  const currentTheme = mounted ? (resolvedTheme || theme) : 'light'
  const isDark = currentTheme === 'dark'

  // Always render button with fixed dimensions to prevent CLS
  // Use opacity transition instead of conditional rendering to prevent hydration mismatch
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
      style={{
        width: '36px', // Fixed width: 20px icon + 8px padding each side
        height: '36px', // Fixed height: 20px icon + 8px padding each side
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      {/* Always render both icons, use opacity to show/hide - prevents hydration mismatch */}
      <Sun 
        className="h-5 w-5 absolute transition-opacity duration-200" 
        style={{ 
          opacity: mounted && isDark ? 1 : 0,
          pointerEvents: 'none'
        }} 
        aria-hidden="true"
      />
      <Moon 
        className="h-5 w-5 absolute transition-opacity duration-200" 
        style={{ 
          opacity: mounted && !isDark ? 1 : (mounted ? 0 : 1), // Show moon by default until mounted
          pointerEvents: 'none'
        }} 
        aria-hidden="true"
      />
    </button>
  )
}
