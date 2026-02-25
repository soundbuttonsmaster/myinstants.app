import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "About Us - MemeSoundboard.Org",
  description: "Learn about MemeSoundboard.org - the free platform for playing and sharing meme sounds, sound effects, and audio clips.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://memesoundboard.org/about" },
  openGraph: {
    title: "About Us - MemeSoundboard.Org",
    url: "https://memesoundboard.org/about",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">About Us</h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Welcome to MemeSoundboard.org</h2>
              <p>
                MemeSoundboard.org is a free, user-friendly platform dedicated to providing access to thousands of meme sounds, 
                sound effects, and audio clips. Our mission is to make it easy for everyone to discover, play, and share their 
                favorite sounds without any registration or payment required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Extensive Sound Library:</strong> Access over 100,000+ sound effects and meme sounds</li>
                <li><strong>Easy to Use:</strong> Simple, intuitive interface that works on all devices</li>
                <li><strong>No Registration:</strong> Play sounds instantly without creating an account</li>
                <li><strong>Free Forever:</strong> All sounds are completely free to use</li>
                <li><strong>Trending Sounds:</strong> Discover the most popular meme sounds of the moment</li>
                <li><strong>New Sounds Daily:</strong> Fresh content added regularly</li>
                <li><strong>Download Options:</strong> Download sounds as MP3 files for personal use</li>
                <li><strong>Share & Embed:</strong> Share your favorite sounds with friends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Our Mission</h2>
              <p>
                We believe that sound effects and meme sounds should be accessible to everyone. Whether you're a content creator, 
                streamer, gamer, or just someone who loves memes, MemeSoundboard.org provides a seamless experience to find and 
                use the sounds you need.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">🔍 Smart Search</h3>
                  <p className="text-sm">Find sounds quickly with our powerful search functionality</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">📱 Mobile Friendly</h3>
                  <p className="text-sm">Works perfectly on phones, tablets, and desktops</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">⚡ Fast Loading</h3>
                  <p className="text-sm">Optimized for speed and performance</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">🌙 Dark Mode</h3>
                  <p className="text-sm">Comfortable viewing in any lighting condition</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
              <p>
                Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">play@memesoundboard.org</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Thank You</h2>
              <p>
                Thank you for using MemeSoundboard.org! We're constantly working to improve the platform and add new features. 
                Your support and feedback help us make MemeSoundboard.org the best soundboard platform on the web.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
