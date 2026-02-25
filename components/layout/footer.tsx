import Link from "next/link"
import { getActiveCategories } from "@/lib/constants/categories"

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
  const categories = getActiveCategories()
  
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              MEME SOUNDBOARD
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Free meme soundboard with thousands of sounds. Play, share, and enjoy!
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/play-random" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Play Random
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  New Sounds
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`} 
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Contact</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Have questions or feedback?
            </p>
            <a 
              href="mailto:play@memesoundboard.org" 
              className="text-sm text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
            >
              play@memesoundboard.org
            </a>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Follow Us</h4>
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
          <p>© {new Date().getFullYear()} memesoundboard.org. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
