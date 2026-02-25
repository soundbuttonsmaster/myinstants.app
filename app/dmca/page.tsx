import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "DMCA Policy - MemeSoundboard.Org",
  description: "Read MemeSoundboard.org's DMCA (Digital Millennium Copyright Act) policy and learn how to file a takedown request.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://memesoundboard.org/dmca" },
  openGraph: {
    title: "DMCA Policy - MemeSoundboard.Org",
    url: "https://memesoundboard.org/dmca",
    images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "MemeSoundboard.org" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpeg"] },
}

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">DMCA Policy</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Digital Millennium Copyright Act (DMCA) Notice</h2>
              <p>
                MemeSoundboard.org respects the intellectual property rights of others and expects its users to do the same. 
                In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. 
                Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">http://www.copyright.gov/legislation/dmca.pdf</a>, 
                MemeSoundboard.org will respond expeditiously to claims of copyright infringement committed using the Service 
                that are reported to MemeSoundboard.org's Designated Copyright Agent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Filing a DMCA Takedown Notice</h2>
              <p>
                If you are a copyright owner, or authorized to act on behalf of one, and you believe that your copyrighted 
                work has been copied in a way that constitutes copyright infringement, please report your notice of 
                infringement to MemeSoundboard.org by providing our Designated Copyright Agent with the following information:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Identification of the copyrighted work:</strong> A description of the copyrighted work that you 
                  claim has been infringed, including the URL or other specific location on the Service where the material 
                  that you claim is infringing is located.
                </li>
                <li>
                  <strong>Your contact information:</strong> Your full name, mailing address, telephone number, and email address.
                </li>
                <li>
                  <strong>Statement of good faith:</strong> A statement that you have a good faith belief that the disputed 
                  use is not authorized by the copyright owner, its agent, or the law.
                </li>
                <li>
                  <strong>Statement of accuracy:</strong> A statement, under penalty of perjury, that the information in 
                  your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.
                </li>
                <li>
                  <strong>Electronic signature:</strong> Your physical or electronic signature.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Where to Send Your DMCA Notice</h2>
              <p>
                Please send your DMCA takedown notice to our Designated Copyright Agent:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-3">
                <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Copyright Agent</p>
                <p>MemeSoundboard.org</p>
                <p>
                  <strong>Email:</strong> <a href="mailto:play@memesoundboard.org" className="text-blue-700 dark:text-blue-300 underline underline-offset-2 font-medium hover:text-blue-900 dark:hover:text-blue-200">play@memesoundboard.org</a>
                </p>
                <p className="mt-2 text-sm">
                  <strong>Subject Line:</strong> DMCA Takedown Request
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Counter-Notification</h2>
              <p>
                If you believe that your content was removed or disabled by mistake or misidentification, you may file a 
                counter-notification with us. To be effective, a counter-notification must be a written communication that 
                includes the following:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled</li>
                <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled</li>
                <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which MemeSoundboard.org may be found, and that you will accept service of process from the person who provided notification of the alleged infringement</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Repeat Infringers</h2>
              <p>
                It is MemeSoundboard.org's policy to terminate, in appropriate circumstances, the accounts of users who are 
                repeat infringers of intellectual property rights. We reserve the right to terminate accounts that we determine, 
                in our sole discretion, are repeatedly infringing the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">False Claims</h2>
              <p>
                Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that 
                material or activity is infringing may be subject to liability. MemeSoundboard.org reserves the right to seek 
                damages from any party that submits a notification of claimed infringement in violation of the law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Processing Time</h2>
              <p>
                We will process valid DMCA takedown notices promptly and typically respond within 48-72 hours of receipt. 
                Upon receipt of a valid takedown notice, we will remove or disable access to the allegedly infringing content 
                and notify the user who posted the content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Information</h2>
              <p>
                For questions about this DMCA Policy or to submit a DMCA notice, please contact us at:
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
