import { MetadataRoute } from 'next'

/**
 * Generate sitemap for SEO
 * Requirements: 12.1
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassan-portfolio.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Add more routes as they are created (GUI mode, etc.)
  ]
}
