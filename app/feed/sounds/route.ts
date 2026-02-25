import { NextResponse } from 'next/server'
import { apiClient } from '@/lib/api/client'
import type { Sound } from '@/lib/types/sound'

const BASE = 'https://memesoundboard.org'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function soundToSlug(sound: Sound): string {
  const name = (sound.name || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const id = sound.id ?? 0
  return name ? `${name}-${id}` : `sound-${id}`
}

export async function GET() {
  try {
    const response = await apiClient.getNewSounds(1, 100)
    const results =
      response?.data && typeof response.data === 'object' && 'results' in response.data
        ? (response.data.results as Sound[])
        : []

    const lastBuild = new Date().toUTCString()
    const items = results
      .map((sound) => {
        const slug = soundToSlug(sound)
        const url = `${BASE}/${slug}`
        const title = `${sound.name} Soundboard: Instant Sound Effect Button`
        const description = `Play ${sound.name} - free meme sound, sound effect. ${sound.views?.toLocaleString() ?? 0} views · ${sound.likes_count?.toLocaleString() ?? 0} likes.`
        const pubDate = sound.created_at
          ? new Date(sound.created_at).toUTCString()
          : lastBuild
        return `  <item>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(url)}</link>
    <description>${escapeXml(description)}</description>
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
  </item>`
      })
      .join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Meme Soundboard - Latest Sounds</title>
    <link>${BASE}/new</link>
    <description>Latest meme sounds and sound effects - free instant play sound buttons. New sounds added regularly.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE}/feed/sounds" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600, s-maxage=600',
      },
    })
  } catch (e) {
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Meme Soundboard - Latest Sounds</title>
    <link>${BASE}/new</link>
    <description>Latest meme sounds</description>
  </channel>
</rss>`
    return new NextResponse(fallback, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
  }
}
