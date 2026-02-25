import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - MemeSoundboard.Org",
  description: "Read MemeSoundboard.org's privacy policy to understand how we collect, use, and protect your information.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://memesoundboard.org/privacy" },
  openGraph: {
    title: "Privacy Policy - MemeSoundboard.Org",
    url: "https://memesoundboard.org/privacy",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Introduction</h2>
              <p>
                At MemeSoundboard.org ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                memesoundboard.org (the "Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Information You Provide</h3>
              <p>
                We may collect information that you voluntarily provide to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address (if you contact us)</li>
                <li>Feedback and messages you send to us</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">Automatically Collected Information</h3>
              <p>
                When you visit our Service, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device identifiers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
                For more information about our use of cookies, please see our{" "}
                <Link href="/cookie-policy" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve our Service</li>
                <li>To analyze how users interact with our Service</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing of your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                  play@memesoundboard.org
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Third-Party Links</h2>
              <p>
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices of 
                these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">play@memesoundboard.org</a>
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
