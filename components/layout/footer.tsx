"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getActiveCategories } from "@/lib/constants/categories"
import { SITE } from "@/lib/constants/site"
import { getHeaderFooterTranslations, getLocaleFromPathname } from "@/lib/translations/header-footer"

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61588291024439" },
  { name: "Instagram", href: "https://www.instagram.com/boardmemesound/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/meme-sound-board/" },
  { name: "Threads", href: "https://www.threads.com/@boardmemesound" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UC5X9BP0eOFvu_MC7rIYLCIQ" },
  { name: "Reddit", href: "https://www.reddit.com/user/Memesoundboard1/" },
  { name: "Tumblr", href: "https://www.tumblr.com/blog/memesoundboard" },
  { name: "X", href: "https://x.com/memesoundboard1" },
]

export default function Footer() {
  const pathname = usePathname()
  const localeBase = pathname?.startsWith("/ru") ? "/ru" : pathname?.startsWith("/pt") ? "/pt" : pathname?.startsWith("/fr") ? "/fr" : pathname?.startsWith("/es") ? "/es" : ""
  const locale = getLocaleFromPathname(pathname)
  const t = getHeaderFooterTranslations(locale)
  const categories = getActiveCategories()
  
  const base = localeBase || ""
  const homeHref = base ? base : "/"
  const link = (path: string) => (base ? `${base}${path}` : path)
  
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              {SITE.name.toUpperCase()}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.footerTagline}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{t.links}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={homeHref} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.homeLink}
                </Link>
              </li>
              <li>
                <Link href={link("/play-random")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.playRandomLink}
                </Link>
              </li>
              <li>
                <Link href={link("/new")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.newSoundsLink}
                </Link>
              </li>
              <li>
                <Link href={link("/trending")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.trendingLink}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.signInLink}
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.createAccountLink}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.blogLink}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{t.categoriesSection}</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={link(`/${category.slug}`)} 
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{t.resources}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={link("/about")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href={link("/contact")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.contactUs}
                </Link>
              </li>
              <li>
                <Link href={link("/privacy")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href={link("/terms")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.termsConditions}
                </Link>
              </li>
              <li>
                <Link href={link("/disclaimer")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.disclaimer}
                </Link>
              </li>
              <li>
                <Link href={link("/dmca")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.dmcaPolicy}
                </Link>
              </li>
              <li>
                <Link href={link("/cookie-policy")} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  {t.cookiePolicy}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{t.contact}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {t.haveQuestions}
            </p>
            <a 
              href={`mailto:${SITE.email}`} 
              className="text-sm text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
            >
              {SITE.email}
            </a>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{t.followUs}</h4>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {SITE.domain}. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}
