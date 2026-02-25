import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Mail, MessageSquare, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - MemeSoundboard.Org",
  description: "Get in touch with MemeSoundboard.org. We're here to help with questions, feedback, or support requests.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://memesoundboard.org/contact" },
  openGraph: {
    title: "Contact Us - MemeSoundboard.Org",
    url: "https://memesoundboard.org/contact",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Contact Us</h1>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <p className="text-lg">
                We'd love to hear from you! Whether you have a question, suggestion, feedback, or need support, 
                our team is here to help. Reach out to us using the contact information below.
              </p>
            </section>

            <div className="grid md:grid-cols-1 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Email Us</h3>
                    <p className="mb-3">
                      Send us an email and we'll get back to you as soon as possible.
                    </p>
                    <a 
                      href="mailto:play@memesoundboard.org" 
                      className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      play@memesoundboard.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">General Inquiries</h3>
                    <p className="mb-3">
                      For general questions, feature requests, or feedback about the platform.
                    </p>
                    <a 
                      href="mailto:play@memesoundboard.org?subject=General Inquiry" 
                      className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      play@memesoundboard.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Support & Technical Issues</h3>
                    <p className="mb-3">
                      Experiencing technical difficulties? We're here to help resolve any issues.
                    </p>
                    <a 
                      href="mailto:play@memesoundboard.org?subject=Technical Support" 
                      className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      play@memesoundboard.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Response Time</h2>
              <p>
                We aim to respond to all inquiries within 24-48 hours. For urgent matters, please include "URGENT" 
                in your subject line.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">How do I report a broken sound?</h3>
                  <p className="text-sm">
                    If you encounter a sound that doesn't play or is broken, please email us at{" "}
                    <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                      play@memesoundboard.org
                    </a>{" "}
                    with the sound name and we'll fix it as soon as possible.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Can I request a specific sound?</h3>
                  <p className="text-sm">
                    Yes! We're always looking to add new sounds. Send us your request at{" "}
                    <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                      play@memesoundboard.org
                    </a>{" "}
                    and we'll consider adding it to our library.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">How can I report copyright issues?</h3>
                  <p className="text-sm">
                    If you believe any content infringes on your copyright, please see our{" "}
                    <Link href="/dmca" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                      DMCA Policy
                    </Link>{" "}
                    page for instructions on how to file a takedown request.
                  </p>
                </div>
              </div>
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
