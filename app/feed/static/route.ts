import { NextResponse } from 'next/server'

const BASE = 'https://memesoundboard.org'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const staticEntries: { url: string; title: string; description: string }[] = [
  { url: BASE, title: 'Meme Soundboard - Home', description: 'Play thousands of free meme sounds, sound effects, and audio clips. Unblocked instant play.' },
  { url: `${BASE}/trending`, title: 'Trending Sounds', description: 'Most popular meme sounds and sound effects.' },
  { url: `${BASE}/new`, title: 'New Sounds', description: 'Latest meme sounds and sound effects added.' },
  { url: `${BASE}/search`, title: 'Search Sounds', description: 'Search meme soundboard - find sound effects and audio clips.' },
  { url: `${BASE}/blog`, title: 'Blog', description: 'Meme soundboard blog and updates.' },
  { url: `${BASE}/about`, title: 'About Us', description: 'About MemeSoundboard.org - free meme sounds and sound effects.' },
  { url: `${BASE}/contact`, title: 'Contact', description: 'Contact MemeSoundboard.org.' },
  { url: `${BASE}/terms`, title: 'Terms & Conditions', description: 'Terms of use for MemeSoundboard.org.' },
  { url: `${BASE}/privacy`, title: 'Privacy Policy', description: 'Privacy policy for MemeSoundboard.org.' },
  { url: `${BASE}/upload-sound`, title: 'Upload Sound', description: 'Upload your own meme sound to the soundboard.' },
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
    <title>Meme Soundboard - Static Pages</title>
    <link>${BASE}</link>
    <description>Meme Soundboard - static pages: home, trending, new, search, blog, about, contact, terms, privacy.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE}/feed/static" rel="self" type="application/rss+xml"/>
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
