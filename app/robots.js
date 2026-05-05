export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/profile', '/api', '/auth'],
      },
    ],
    sitemap: 'https://onlyforteachers.co.uk/sitemap.xml',
  }
}
