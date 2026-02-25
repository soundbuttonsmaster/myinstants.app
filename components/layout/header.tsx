"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown, ChevronRight, LogOut, User, Heart, Upload, ThumbsUp, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import SearchBar from "@/components/search-bar"
import { getActiveCategories } from "@/lib/constants/categories"
import { getHeaderFooterTranslations, getLocaleFromPathname } from "@/lib/translations/header-footer"
import { useAuth } from "@/lib/auth/auth-context"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isReady, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const categories = getActiveCategories()
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSubmenuOpen(null)
    setUserDropdownOpen(false)
    setLanguageDropdownOpen(false)
  }, [pathname])

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menu ? null : menu)
  }

  const navLinkClass = "flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white whitespace-nowrap shrink-0"

  // Locale base path for nav links and search (e.g. /es, /fr, /pt, /ru)
  const localeBase = pathname?.startsWith("/ru") ? "/ru" : pathname?.startsWith("/pt") ? "/pt" : pathname?.startsWith("/fr") ? "/fr" : pathname?.startsWith("/es") ? "/es" : ""
  const locale = getLocaleFromPathname(pathname)
  const t = getHeaderFooterTranslations(locale)

  // Language switcher: same page in another locale
  const LOCALES = [
    { code: "en", label: "English", path: "" },
    { code: "es", label: "Español", path: "/es" },
    { code: "fr", label: "Français", path: "/fr" },
    { code: "pt", label: "Português", path: "/pt" },
    { code: "ru", label: "Русский", path: "/ru" },
  ] as const
  const pathWithoutLocale = localeBase ? (pathname?.slice(localeBase.length) || "") || "/" : (pathname || "/")
  const currentLocale = LOCALES.find((l) => l.path === localeBase) || LOCALES[0]
  const getLocaleHref = (path: string) => {
    if (path === "") return pathWithoutLocale === "/" ? "/" : pathWithoutLocale
    return pathWithoutLocale === "/" ? path : `${path}${pathWithoutLocale}`
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 header-bar"
      >
        <div className="flex h-14 w-full items-center gap-4 px-4 lg:px-6">
          {/* Left: Logo only */}
          <div className="flex flex-shrink-0 items-center">
            <Link href={localeBase || "/"} className="shrink-0">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap lg:text-xl">
                MYINSTANTS
              </span>
            </Link>
          </div>

          {/* Center: Menu items */}
          <nav className="hidden min-w-0 flex-1 justify-center md:flex">
            <div className="flex items-center gap-3 lg:gap-4">
              <Link href={localeBase ? `${localeBase}` : "/"} className={navLinkClass}>{t.home}</Link>
              <Link href={localeBase ? `${localeBase}/new` : "/new"} className={navLinkClass}>{t.new}</Link>
              <Link href={localeBase ? `${localeBase}/trending` : "/trending"} className={navLinkClass}>{t.trending}</Link>
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button type="button" className={`${navLinkClass} flex items-center gap-1`}>
                  {t.categories}
                  <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-48 -translate-x-1/2 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50 max-h-96 overflow-y-auto pt-2 transition-opacity duration-200 ${
                    categoryDropdownOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={localeBase ? `${localeBase}/${category.slug}` : `/${category.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setCategoryDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/blog" className={navLinkClass}>{t.blog}</Link>
              <Link href="/play-random" className={navLinkClass}>{t.playRandom}</Link>
              {/* Language dropdown */}
              <div
                className="relative"
                ref={languageDropdownRef}
                onMouseEnter={() => setLanguageDropdownOpen(true)}
                onMouseLeave={() => setLanguageDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`${navLinkClass} flex items-center gap-1`}
                  aria-expanded={languageDropdownOpen}
                  aria-haspopup="true"
                  aria-label={t.selectLanguage}
                >
                  {currentLocale.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${languageDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`absolute right-0 top-full w-40 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50 py-2 transition-opacity duration-200 mt-1 ${
                    languageDropdownOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => setLanguageDropdownOpen(true)}
                  onMouseLeave={() => setLanguageDropdownOpen(false)}
                >
                  {LOCALES.map((loc) => (
                    <Link
                      key={loc.code}
                      href={getLocaleHref(loc.path)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        loc.code === currentLocale.code
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => setLanguageDropdownOpen(false)}
                    >
                      {loc.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Search | Join free (or user) | Theme — fixed width to prevent CLS */}
          <div className="header-right flex flex-shrink-0 items-center gap-3 md:gap-4">
            <div className="hidden w-44 min-w-0 md:block lg:w-52">
              <SearchBar searchBasePath={localeBase || undefined} placeholder={t.searchPlaceholder} />
            </div>
            <span className="hidden text-slate-300 dark:text-slate-600 md:inline" aria-hidden="true">|</span>
            {!isReady ? (
              <span className="header-auth-placeholder" aria-hidden="true" />
            ) : user ? (
              <div className="relative hidden md:block" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white whitespace-nowrap rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {t.hi}, {user.username}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* User dropdown */}
                <div
                  className={`absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 z-50 overflow-hidden transition-all duration-150 origin-top-right ${
                    userDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.signedInAs}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.username}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <User className="h-4 w-4 text-slate-400" />
                      {t.myProfile}
                    </Link>
                    <Link href="/favorites" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Heart className="h-4 w-4 text-slate-400" />
                      {t.myFavorites}
                    </Link>
                    <Link href="/likes" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ThumbsUp className="h-4 w-4 text-slate-400" />
                      {t.myLikes}
                    </Link>
                    <Link href="/uploads" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Star className="h-4 w-4 text-slate-400" />
                      {t.myUploads}
                    </Link>
                    <Link href="/upload-sound" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Upload className="h-4 w-4 text-slate-400" />
                      {t.uploadSound}
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                    <button
                      type="button"
                      onClick={() => { setUserDropdownOpen(false); handleLogout() }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.signOut}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/register"
                className="hidden items-center gap-1 text-sm font-semibold text-white whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 transition-all hover:from-blue-600 hover:to-purple-700 md:inline-flex"
              >
                {t.joinFree}
              </Link>
            )}
            <span className="hidden text-slate-300 dark:text-slate-600 md:inline" aria-hidden="true">|</span>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
              aria-label={t.toggleMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slide in from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t.menu}</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
              aria-label={t.closeMenu}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {/* Search Bar in Mobile Menu */}
              <div className="mb-4">
                <SearchBar searchBasePath={localeBase || undefined} placeholder={t.searchPlaceholder} />
              </div>

              {/* Main Navigation Items */}
              <Link
                href={localeBase ? localeBase : "/"}
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.home}
              </Link>

              <Link
                href={localeBase ? `${localeBase}/new` : "/new"}
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.new}
              </Link>

              <Link
                href={localeBase ? `${localeBase}/trending` : "/trending"}
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.trending}
              </Link>

              {/* Categories with Collapsible Submenu */}
              <div>
                <button
                  onClick={() => toggleMobileSubmenu('categories')}
                  className="w-full flex items-center justify-between py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {t.categories}
                  <ChevronRight className={`h-5 w-5 transition-transform ${mobileSubmenuOpen === 'categories' ? 'rotate-90' : ''}`} />
                </button>
                {mobileSubmenuOpen === 'categories' && (
                  <div className="ml-4 mt-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={localeBase ? `${localeBase}/${category.slug}` : `/${category.slug}`}
                        className="block py-2 px-4 text-base text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/blog" className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t.blog}
              </Link>
              <Link
                href="/play-random"
                className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.playRandom}
              </Link>
              {/* Language switcher - mobile */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.language}
                </p>
                <div className="grid grid-cols-2 gap-2 px-4 mt-2">
                  {LOCALES.map((loc) => (
                    <Link
                      key={loc.code}
                      href={getLocaleHref(loc.path)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                        loc.code === currentLocale.code
                          ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {loc.label}
                    </Link>
                  ))}
                </div>
              </div>
              {isReady && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-slate-600 dark:text-slate-400">
                        {t.hi}, <strong className="text-slate-900 dark:text-white">{user.username}</strong>
                      </p>
                      <Link href="/favorites" className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        {t.myFavorites}
                      </Link>
                      <Link href="/uploads" className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        {t.myUploads}
                      </Link>
                      <Link href="/likes" className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        {t.myLikes}
                      </Link>
                      <Link href="/profile" className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        {t.myProfile}
                      </Link>
                      <Link href="/upload-sound" className="block py-3 px-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>
                        {t.uploadSound}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 py-3 px-4 text-lg font-medium text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        {t.signOut}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-3 px-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t.signIn}
                      </Link>
                      <Link
                        href="/register"
                        className="block py-3 px-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t.createFreeAccount}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
