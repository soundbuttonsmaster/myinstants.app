import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: `Cookie Policy - ${SITE.domain}`,
  description: `Learn about how ${SITE.domain} uses cookies and similar tracking technologies to enhance your browsing experience.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE.baseUrl}/cookie-policy` },
  openGraph: {
    title: `Cookie Policy - ${SITE.domain}`,
    url: `${SITE.baseUrl}/cookie-policy`,
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Cookie Policy</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                Cookies are widely used to make websites work more efficiently and to provide information to the website owners.
              </p>
              <p className="mt-3">
                {SITE.domain} uses cookies and similar tracking technologies to track activity on our Service and hold 
                certain information. Cookies are used to enable certain features of our Service, to provide analytics, to store 
                your preferences, and to enable advertisement delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Essential Cookies</h3>
              <p>
                These cookies are necessary for the Service to function and cannot be switched off in our systems. They are 
                usually only set in response to actions made by you which amount to a request for services, such as setting 
                your privacy preferences, logging in, or filling in forms.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">Analytics Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of 
                our Service. They help us to know which pages are the most and least popular and see how visitors move around 
                the site.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">Preference Cookies</h3>
              <p>
                These cookies enable the Service to provide enhanced functionality and personalization. They may be set by 
                us or by third-party providers whose services we have added to our pages.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">Functional Cookies</h3>
              <p>
                These cookies allow the Service to remember choices you make (such as your username, language, or region) and 
                provide enhanced, more personal features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of 
                the Service, deliver advertisements on and through the Service, and so on. These third-party cookies may 
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Analytics Services:</strong> We may use analytics services to help analyze how users use the Service</li>
                <li><strong>Advertising Networks:</strong> We may work with advertising networks to deliver relevant advertisements</li>
                <li><strong>Social Media Platforms:</strong> We may integrate social media features that use cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Control Cookies</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by 
                setting your preferences in your browser settings. Most web browsers allow some control of most cookies through 
                the browser settings.
              </p>
              <p className="mt-3">
                However, please note that if you choose to reject cookies, you may not be able to use all features of the Service.
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Browser-Specific Instructions:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Local Storage</h2>
              <p>
                In addition to cookies, we may use local storage (also known as "localStorage" or "sessionStorage") to store 
                information on your device. Local storage is used to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences (such as theme settings)</li>
                <li>Store your favorite sounds</li>
                <li>Improve the performance of the Service</li>
              </ul>
              <p className="mt-3">
                You can clear local storage through your browser settings, similar to clearing cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Do Not Track Signals</h2>
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want 
                to have your online activity tracked. Currently, there is no standard for how to respond to DNT signals. 
                {SITE.domain} does not currently respond to DNT browser signals or mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
                legal, or regulatory reasons. We will notify you of any changes by posting the new Cookie Policy on this page 
                and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
