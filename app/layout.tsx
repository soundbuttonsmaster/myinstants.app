import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import { SITE } from "@/lib/constants/site"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "MyInstants | Play Instant Sound Buttons & Meme Soundboard",
  description: "Myinstants is the ultimate collection of sound buttons, unblocked meme soundboard, prank sounds, with thousands of sound effects and meme buttons.",
  keywords: ["sound buttons", "meme soundboard", "sound effects", "prank sounds", "unblocked soundboard", "instant play", "Myinstants"],
  authors: [{ name: SITE.domain }],
  creator: SITE.domain,
  publisher: SITE.domain,
  metadataBase: new URL(SITE.baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.baseUrl,
    siteName: SITE.name,
    title: "MyInstants | Play Instant Sound Buttons & Meme Soundboard",
    description: "Myinstants is the ultimate collection of sound buttons, unblocked meme soundboard, prank sounds, with thousands of sound effects and meme buttons.",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyInstants | Play Instant Sound Buttons & Meme Soundboard",
    description: "Myinstants is the ultimate collection of sound buttons, unblocked meme soundboard, prank sounds, with thousands of sound effects and meme buttons.",
    images: ["/og.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { rel: "mstile-150x150", url: "/mstile-150x150.png", sizes: "150x150", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.name,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title={`${SITE.name} - Latest Sounds`} href={`${SITE.baseUrl}/feed/sounds`} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE.name} - Categories`} href={`${SITE.baseUrl}/feed/categories`} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE.name} - Static Pages`} href={`${SITE.baseUrl}/feed/static`} />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={SITE.name} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then((registration) => {
                      console.log('SW registered successfully:', registration.scope);
                    })
                    .catch((error) => {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
