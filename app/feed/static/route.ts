import { NextResponse } from 'next/server'
import { SITE } from '@/lib/constants/site'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const staticEntries: { url: string; title: string; description: string }[] = [
  { url: SITE.baseUrl, title: `${SITE.name} - Home`, description: "Myinstants is your ultimate destination for unblocked meme soundboard, sound buttons, prank, sound effects, and thousands of viral sounds you can play, create and share instantly." },
  { url: `${SITE.baseUrl}/trending`, title: "Trending Sound Buttons: Most Popular Meme Soundboard", description: "Discover the most popular and trending sound buttons right now" },
  { url: `${SITE.baseUrl}/new`, title: "New Sound Buttons: Latest Meme Soundboard", description: "Find new sound buttons and prank sounds added daily to Myinstants soundboard collection!" },
  { url: `${SITE.baseUrl}/search`, title: 'Search Sound Buttons', description: 'Search sound buttons, sound effects, meme soundboard.' },
  { url: `${SITE.baseUrl}/blog`, title: 'Blog', description: `${SITE.name} blog and updates.` },
  { url: `${SITE.baseUrl}/about`, title: 'About Us', description: `About ${SITE.domain} - sound buttons and meme soundboard.` },
  { url: `${SITE.baseUrl}/contact`, title: 'Contact', description: `Contact ${SITE.domain}.` },
  { url: `${SITE.baseUrl}/terms`, title: 'Terms & Conditions', description: `Terms of use for ${SITE.domain}.` },
  { url: `${SITE.baseUrl}/privacy`, title: 'Privacy Policy', description: `Privacy policy for ${SITE.domain}.` },
  { url: `${SITE.baseUrl}/upload-sound`, title: 'Upload Sound', description: 'Upload your own sound to the soundboard.' },
]

function buildRss(): string {
  const lastBuild = new Date().toUTCString()
  const items = staticEntries
    .map(
      (e) =>
        `  <item>
    <title>${escapeXml(e.title)}</title>
    <link>${escapeXml(e.url)}</link>
    <description>${escapeXml(e.description)}</description>
    <pubDate>${lastBuild}</pubDate>
    <guid isPermaLink="true">${escapeXml(e.url)}</guid>
  </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} - Static Pages</title>
    <link>${SITE.baseUrl}</link>
    <description>${SITE.name} - static pages: home, trending, new, search, blog, about, contact, terms, privacy.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE.baseUrl}/feed/static" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

export async function GET() {
  return new NextResponse(buildRss(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
