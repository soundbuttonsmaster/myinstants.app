import { MetadataRoute } from 'next'

const BASE = 'https://memesoundboard.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/admin/'] },
    ],
    host: BASE,
    sitemap: `${BASE}/sitemap.xml`,
  }
}
