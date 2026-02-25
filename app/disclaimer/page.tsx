import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Disclaimer - ${SITE.domain}`,
  description: `Read the disclaimer for ${SITE.domain}. Understand the limitations and responsibilities when using our service.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE.baseUrl}/disclaimer` },
  openGraph: {
    title: `Disclaimer - ${SITE.domain}`,
    url: `${SITE.baseUrl}/disclaimer`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Disclaimer</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">General Information</h2>
              <p>
                The information contained on {SITE.domain} (the "Service") is for general information purposes only. 
                {SITE.domain} assumes no responsibility for errors or omissions in the contents of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">No Warranty</h2>
              <p>
                In no event shall {SITE.domain} be liable for any special, direct, indirect, consequential, or incidental 
                damages or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of 
                or in connection with the use of the Service or the contents of the Service.
              </p>
              <p className="mt-3">
                {SITE.domain} reserves the right to make additions, deletions, or modifications to the contents of the 
                Service at any time without prior notice. {SITE.domain} does not warrant that the Service is free of 
                viruses or other harmful components.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">External Links Disclaimer</h2>
              <p>
                The Service may contain links to external websites that are not provided or maintained by or in any way 
                affiliated with {SITE.domain}. Please note that {SITE.domain} does not guarantee the accuracy, 
                relevance, timeliness, or completeness of any information on these external websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Copyright Disclaimer</h2>
              <p>
                {SITE.domain} provides access to various sound files and audio clips. While we strive to ensure that 
                all content is used appropriately, we cannot guarantee that all sounds are free from copyright restrictions.
              </p>
              <p className="mt-3">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying the copyright status of any sound before using it</li>
                <li>Obtaining necessary permissions or licenses for copyrighted material</li>
                <li>Complying with all applicable copyright laws and regulations</li>
                <li>Using sounds in accordance with fair use principles where applicable</li>
              </ul>
              <p className="mt-3">
                {SITE.domain} is not responsible for any copyright infringement that may occur from the use of sounds 
                available on the Service. If you believe any content infringes on your copyright, please refer to our{" "}
                <Link href="/dmca" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">
                  DMCA Policy
                </Link>{" "}
                for instructions on filing a takedown request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Content Accuracy</h2>
              <p>
                {SITE.domain} makes no representations or warranties of any kind, express or implied, about the 
                completeness, accuracy, reliability, suitability, or availability with respect to the Service or the 
                information, products, services, or related graphics contained on the Service for any purpose.
              </p>
              <p className="mt-3">
                Any reliance you place on such information is therefore strictly at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User-Generated Content</h2>
              <p>
                {SITE.domain} may allow users to interact with content, but we do not endorse, support, represent, 
                or guarantee the completeness, truthfulness, accuracy, or reliability of any content or communications 
                posted via the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, {SITE.domain}, its officers, directors, employees, 
                and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, 
                goodwill, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Service Availability</h2>
              <p>
                {SITE.domain} does not guarantee that the Service will be available at all times or that it will be 
                free from errors, interruptions, or defects. We reserve the right to modify, suspend, or discontinue the 
                Service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Third-Party Services</h2>
              <p>
                The Service may integrate with or link to third-party services. {SITE.domain} is not responsible for 
                the availability, accuracy, or content of such third-party services. Your use of third-party services is 
                subject to their respective terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
              <p>
                If you have any questions about this Disclaimer, please contact us at:
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
