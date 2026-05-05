import { client } from '@/lib/sanity'

export default async function sitemap() {
  const baseUrl = 'https://onlyforteachers.co.uk'

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/how-it-works`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/rewards`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/survey-results`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/teacher-index`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/survey-methodology`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${baseUrl}/ask-a-question`, priority: 0.6, changeFrequency: 'monthly' },
  ]

  const posts = await client.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt
    }`
  ).catch(() => [])

  const blogPages = (posts ?? []).map(post => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: post.publishedAt,
    priority: 0.9,
    changeFrequency: 'monthly',
  }))

  return [...staticPages, ...blogPages]
}
