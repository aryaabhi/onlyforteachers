import { createClient } from '@/lib/supabase/server'
import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Survey Results & Reports | Only For Teachers',
  description: 'Read the latest survey reports and explore aggregate data from UK teacher surveys conducted by Only For Teachers.',
  openGraph: {
    title: 'Survey Results & Reports | Only For Teachers',
    description: 'UK teacher survey data and reports — see what teachers across the country really think.',
    type: 'website',
  },
}

export const revalidate = 3600

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function SurveyResultsPage() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [posts, { data: pastSurveys }] = await Promise.all([
    client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage
      }`
    ).catch(() => []),
    supabase
      .from('surveys')
      .select('id, title, ends_at')
      .lt('ends_at', now)
      .order('ends_at', { ascending: false }),
  ])

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Survey Results &amp; Reports</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Insights from UK teachers — published after each survey closes. All data
          is free to use with attribution.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Survey Reports (Sanity) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Reports</h2>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/survey-results/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.mainImage && (
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={urlFor(post.mainImage).width(600).height(350).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">{formatDate(post.publishedAt)}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:opacity-80 transition-opacity leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    )}
                    <span
                      className="mt-3 inline-block text-sm font-medium"
                      style={{ color: '#CA9662' }}
                    >
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <p className="text-gray-500">Survey reports will appear here as they are published.</p>
            </div>
          )}
        </section>

        {/* Survey Data (Supabase) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Data</h2>

          {pastSurveys && pastSurveys.length > 0 ? (
            <div className="space-y-3">
              {pastSurveys.map(survey => (
                <div
                  key={survey.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{survey.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Closed {formatDate(survey.ends_at)}</p>
                  </div>
                  <Link
                    href={`/survey-results/data/${survey.id}`}
                    className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ color: '#CA9662' }}
                  >
                    View data →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <p className="text-gray-500">Aggregate survey data will appear here once surveys close.</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#FDF8F3' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Add your voice to the data
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Join thousands of UK teachers who share their professional opinion in weekly surveys.
            Free forever, and you earn points for every survey you complete.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Join Free
          </Link>
        </section>
      </div>
    </main>
  )
}
