import { MetadataRoute } from 'next'
import { getActiveCategories } from '@/lib/constants/categories'

const BASE_URL = 'https://memesoundboard.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getActiveCategories()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${BASE_URL}/new`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.95 },
    { url: `${BASE_URL}/play-random`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/upload-sound`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...categoryUrls]
}
