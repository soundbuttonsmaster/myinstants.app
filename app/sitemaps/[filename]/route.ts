import { NextResponse } from "next/server"

const API_SITEMAPS_BASE = "https://play.soundboard.cloud/media/sitemaps/"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Params = { params: Promise<{ filename: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { filename } = await params
  // Only allow known sitemap filenames (no path traversal)
  if (
    !filename ||
    filename.includes("..") ||
    !/^sitemap_memesoundboard\.org_[a-z0-9_.-]+\.xml$/.test(filename)
  ) {
    return new NextResponse("Not Found", { status: 404 })
  }
  try {
    const url = `${API_SITEMAPS_BASE}${encodeURIComponent(filename)}`
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/xml, text/xml, */*" },
    })
    if (!res.ok) {
      return new NextResponse("Sitemap unavailable", { status: 502 })
    }
    const xml = await res.text()
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (e) {
    console.error("Sitemap proxy error:", e)
    return new NextResponse("Sitemap error", { status: 502 })
  }
}
