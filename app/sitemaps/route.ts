import { NextResponse } from "next/server"

const API_SITEMAP_INDEX =
  "https://play.soundboard.cloud/media/sitemaps/sitemap_index_memesoundboard.org.xml"
const SITE_ORIGIN = "https://memesoundboard.org"
const API_SITEMAPS_PREFIX = "https://play.soundboard.cloud/media/sitemaps/"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch(API_SITEMAP_INDEX, {
      next: { revalidate: 60 },
      headers: { Accept: "application/xml, text/xml, */*" },
    })
    if (!res.ok) {
      return new NextResponse("Sitemap index unavailable", { status: 502 })
    }
    let xml = await res.text()
    // Rewrite child sitemap URLs to our domain so Google fetches from us
    xml = xml.replace(
      new RegExp(API_SITEMAPS_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      `${SITE_ORIGIN}/sitemaps/`
    )
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (e) {
    console.error("Sitemap index proxy error:", e)
    return new NextResponse("Sitemap index error", { status: 502 })
  }
}
