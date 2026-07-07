import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Prevent search engines from indexing the *.vercel.app preview/prod
        // domains — only onlyforteachers.co.uk should be indexed.
        source: '/:path*',
        has: [{ type: 'host', value: '.*\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/teacher-survey', destination: '/survey-results', permanent: true },
      { source: '/teacher-survey/:path*', destination: '/survey-results', permanent: true },
      { source: '/userregistration-2', destination: '/register', permanent: true },
      { source: '/login-form', destination: '/login', permanent: true },
      { source: '/this-weeks-survey', destination: '/survey', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/userregistration', destination: '/register', permanent: true },
      { source: '/teacher-pulse-index', destination: '/teacher-index', permanent: true },
    ]
  },
};

export default withPWA(nextConfig);
