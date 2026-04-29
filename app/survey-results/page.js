'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { client } from '@/lib/sanity'

const CATEGORIES = ['All', 'Assessment', 'Wellbeing', 'Technology', 'CPD', 'Policy']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function SurveyResultsPage() {
  const [posts, setPosts] = useState([])
  const [pastSurveys, setPastSurveys] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const now = new Date().toISOString()
      const [fetchedPosts, { data: surveys }] = await Promise.all([
        client.fetch(
          `*[_type == "post"] | order(publishedAt desc) {
            title, "slug": slug.current, publishedAt, excerpt, mainImage, categories
          }`
        ).catch(() => []),
        supabase.from('surveys').select('id, title, ends_at').lt('ends_at', now).order('ends_at', { ascending: false }),
      ])
      setPosts(fetchedPosts ?? [])
      setPastSurveys(surveys ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.categories && p.categories.some(c => c.toLowerCase() === activeCategory.toLowerCase()))

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-16 pb-0 px-4 text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-4xl mx-auto text-center pb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Insights <em>hub</em>
          </h1>
          <p className="text-lg mb-4" style={{ color: '#D4C9B8' }}>
            Data-driven stories from the UK teaching community.
          </p>
          <Link
            href="/survey-methodology"
            className="text-sm hover:underline"
            style={{ color: '#9A8F82' }}
          >
            All insights follow our published survey methodology — read how →
          </Link>
        </div>
        <div className="w-full leading-[0] overflow-hidden">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="#1B3A2D" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#C94F2C' : '#F5EDE0',
                color: activeCategory === cat ? '#fff' : '#2C2C2C',
                border: activeCategory === cat ? 'none' : '1px solid #E8DDD0',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <section className="mb-16">
          {loading ? (
            <div className="text-center py-16 text-[#6B6B6B]">Loading insights…</div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/survey-results/${post.slug}`}
                  className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  style={{
                    borderColor: '#E8DDD0',
                    textDecoration: 'none',
                    borderLeft: '4px solid #C94F2C',
                  }}
                >
                  <div className="p-5 flex flex-col flex-1">
                    {post.categories && post.categories.length > 0 && (
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#C94F2C' }}>
                        {post.categories[0]}
                      </span>
                    )}
                    <h3 className="font-bold text-[#2C2C2C] mt-2 mb-2 leading-snug group-hover:text-[#C94F2C] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-[#6B6B6B] line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    )}
                    <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: '#E8DDD0' }}>
                      <span className="text-xs text-[#6B6B6B]">{formatDate(post.publishedAt)}</span>
                      <span className="text-xs text-[#6B6B6B]">3 min read</span>
                    </div>
                  </div>
                </Link>
              ))}
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

        {/* Past survey data */}
        {pastSurveys.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#1B3A2D] mb-6">Survey Data</h2>
            <div className="space-y-3">
              {pastSurveys.map(survey => (
                <div
                  key={survey.id}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-all"
                  style={{ borderColor: '#E8DDD0', backgroundColor: '#fff' }}
                >
                  <div>
                    <p className="font-medium text-[#2C2C2C]">{survey.title}</p>
                    <p className="text-sm text-[#6B6B6B] mt-0.5">Closed {formatDate(survey.ends_at)}</p>
                  </div>
                  <Link
                    href={`/survey-results/data/${survey.id}`}
                    className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-[#F5EDE0]"
                    style={{ color: '#C94F2C' }}
                  >
                    View data →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
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
            Join free →
          </Link>
        </section>
      </div>
    </main>
  )
}
