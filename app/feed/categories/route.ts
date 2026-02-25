import { NextResponse } from 'next/server'
import { getActiveCategories } from '@/lib/constants/categories'
import { SITE } from '@/lib/constants/site'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildRss(): string {
  const categories = getActiveCategories()
  const lastBuild = new Date().toUTCString()
  const items = categories
    .map(
      (cat) => {
        const url = `${SITE.baseUrl}/${cat.slug}`
        const title = `${cat.name} Soundboard`
        const description = `Explore our ${cat.name} soundboard - trending sound buttons and meme soundboard.`
        return `  <item>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(url)}</link>
    <description>${escapeXml(description)}</description>
    <pubDate>${lastBuild}</pubDate>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
  </item>`
      }
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} - Categories</title>
    <link>${SITE.baseUrl}</link>
    <description>${SITE.name} categories - browse soundboards by category: Anime, Memes, Reactions, Sound Effects, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE.baseUrl}/feed/categories" rel="self" type="application/rss+xml"/>
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
