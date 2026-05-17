'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { client } from '@/lib/sanity'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = [
  'All',
  'Budgets',
  'Policy and Ofsted',
  'Wellbeing',
  'Attainment',
  'Student Support',
  'AI',
  'Resources',
  'CPD',
  'Revision and Assessment',
  'School Trips',
  'SEND',
]

function formatShortDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function SurveyResultsContent() {
  const searchParams = useSearchParams()
  const initialCategory = CATEGORIES.includes(searchParams.get('category')) ? searchParams.get('category') : 'All'

  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function load() {
      const [fetchedPosts, supabaseUser] = await Promise.all([
        client.fetch(
          `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
            _id,
            title,
            "slug": slug.current,
            publishedAt,
            excerpt,
            mainImage,
            categories
          }`
        ).catch(() => []),
        createClient().auth.getUser(),
      ])
      setPosts(fetchedPosts ?? [])
      setIsLoggedIn(!!supabaseUser?.data?.user)
      setLoading(false)
    }
    load()
  }, [])

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.categories && p.categories.some(c => c?.toLowerCase() === activeCategory.toLowerCase()))

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-16 pb-0 px-4 text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-4xl mx-auto text-center pb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Insights hub
          </h1>
          <p className="text-lg mb-4" style={{ color: '#D4C9B8' }}>
            Data-driven stories from the UK teaching community.
          </p>
          <Link
            href="/survey-methodology"
            className="text-sm hover:underline"
            style={{ color: '#9A8F82' }}
          >
            All insights follow our published survey methodology - read how →
          </Link>
        </div>
        <div className="w-full leading-[0] overflow-hidden">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="#1B3A2D" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Category filter bar */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#1B3A2D' : '#F5EDE0',
                color: activeCategory === cat ? '#F5EDE0' : '#2C2C2C',
                border: '1px solid #1B3A2D',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Intro */}
        <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto text-center mb-4">
          Every week, Only for Teachers publishes research drawn from our community of UK teachers.
          Each survey produces a data-driven report - giving teachers, school leaders, and
          policymakers an honest picture of life in UK classrooms.
        </p>

        {/* Result count */}
        {!loading && (
          <p className="text-sm text-center mb-8" style={{ color: '#6B6B6B' }}>
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        )}

        {/* Posts grid */}
        <section className="mb-16">
          {loading ? (
            <div className="text-center py-16 text-[#6B6B6B]">Loading insights…</div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => {
                const cats = (post.categories ?? []).filter(c => c && c !== 'Uncategorised')
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    style={{
                      borderColor: '#E8DDD0',
                      textDecoration: 'none',
                      borderLeft: '4px solid #C94F2C',
                    }}
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category pills at top */}
                      {cats.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cats.map(cat => (
                            <span
                              key={cat}
                              className="uppercase"
                              style={{
                                backgroundColor: '#F5EDE0',
                                color: '#C94F2C',
                                border: '1px solid #C94F2C',
                                fontSize: '11px',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                lineHeight: '1.4',
                              }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="font-bold text-[#2C2C2C] mb-2 leading-snug group-hover:text-[#C94F2C] transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-[#6B6B6B] line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                      )}
                      {/* Date at bottom */}
                      <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: '#E8DDD0' }}>
                        <span className="text-xs" style={{ color: '#9A8F82' }}>{formatShortDate(post.publishedAt)}</span>
                        <span className="text-xs text-[#6B6B6B]">3 min read</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#F5EDE0' }}>
              <p className="text-[#6B6B6B]">
                {activeCategory === 'All'
                  ? 'Survey reports will appear here as they are published.'
                  : `No posts in the "${activeCategory}" category yet.`}
              </p>
            </div>
          )}
        </section>

        {/* CTA - only shown to logged-out users */}
        {!isLoggedIn && (
          <section className="mt-16 rounded-2xl p-10 text-white text-center" style={{ backgroundColor: '#1B3A2D' }}>
            <h2 className="text-2xl font-bold mb-3">Add your voice to the data</h2>
            <p className="mb-6 max-w-xl mx-auto" style={{ color: '#D4C9B8' }}>
              Join UK teachers who share their professional opinion in weekly surveys. Free forever, and you earn points for every survey you complete.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3.5 rounded-full text-white font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
            >
              Join for free →
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}

export default function SurveyResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SurveyResultsContent />
    </Suspense>
  )
}
