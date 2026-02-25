import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Terms & Conditions - ${SITE.domain}`,
  description: `Read the terms and conditions for using ${SITE.domain}. Understand your rights and responsibilities when using our service.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE.baseUrl}/terms` },
  openGraph: {
    title: `Terms & Conditions - ${SITE.domain}`,
    url: `${SITE.baseUrl}/terms`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Terms & Conditions</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Agreement to Terms</h2>
              <p>
                By accessing and using {SITE.domain} ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Use License</h2>
              <p>
                Permission is granted to temporarily access and use {SITE.domain} for personal, non-commercial use only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Conduct</h2>
              <p>You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, 
              restrict or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Harassing, threatening, or abusing other users</li>
                <li>Uploading or transmitting any malicious code, viruses, or harmful content</li>
                <li>Attempting to gain unauthorized access to the Service or its related systems</li>
                <li>Interfering with or disrupting the Service or servers</li>
                <li>Using the Service to violate any applicable laws or regulations</li>
                <li>Impersonating any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by {SITE.domain} and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mt-3">
                The sounds and audio files available on the Service may be subject to copyright protection. You are responsible 
                for ensuring that your use of any sounds complies with applicable copyright laws and the rights of the content owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Disclaimer</h2>
              <p>
                The materials on {SITE.domain} are provided on an 'as is' basis. {SITE.domain} makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>
              <p className="mt-3">
                Further, {SITE.domain} does not warrant or make any representations concerning the accuracy, likely results, 
                or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites 
                linked to this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Limitations</h2>
              <p>
                In no event shall {SITE.domain} or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
                the materials on {SITE.domain}, even if {SITE.domain} or a {SITE.domain} authorized representative 
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Accuracy of Materials</h2>
              <p>
                The materials appearing on {SITE.domain} could include technical, typographical, or photographic errors. 
                {SITE.domain} does not warrant that any of the materials on its website are accurate, complete, or current. 
                {SITE.domain} may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Links</h2>
              <p>
                {SITE.domain} has not reviewed all of the sites linked to its website and is not responsible for the contents 
                of any such linked site. The inclusion of any link does not imply endorsement by {SITE.domain} of the site. 
                Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Modifications</h2>
              <p>
                {SITE.domain} may revise these terms of service for its website at any time without notice. By using this 
                website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably 
                submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Information</h2>
              <p>
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href={`mailto:${SITE.email}`} className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">{SITE.email}</a>
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
