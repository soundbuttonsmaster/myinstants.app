import { MetadataRoute } from 'next'
import { getActiveCategories } from '@/lib/constants/categories'
import { SITE } from '@/lib/constants/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getActiveCategories()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.baseUrl}/trending`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${SITE.baseUrl}/new`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${SITE.baseUrl}/play-random`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.baseUrl}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.baseUrl}/upload-sound`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...categoryUrls]
}
