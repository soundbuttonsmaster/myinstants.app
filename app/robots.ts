import { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/admin/'] },
    ],
    host: SITE.baseUrl,
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
  }
}
