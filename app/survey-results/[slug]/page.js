import { client, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "post"] { "slug": slug.current }`
  ).catch(() => [])
  return (slugs ?? []).map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      title, seoTitle, seoDescription, mainImage, publishedAt
    }`,
    { slug }
  ).catch(() => null)

  if (!post) return { title: 'Not Found' }

  return {
    title: post.seoTitle || `${post.title} | Only For Teachers`,
    description: post.seoDescription || post.excerpt || '',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || '',
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }]
        : [],
    },
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-6">
        <div className="rounded-xl overflow-hidden">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="w-full object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-2 text-sm text-center text-gray-500 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mt-10 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 mt-5 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 pl-4 my-4 italic text-gray-600" style={{ borderColor: '#CA9662' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through">{children}</span>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="underline hover:opacity-70"
        style={{ color: '#CA9662' }}
      >
        {children}
      </a>
    ),
  },
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function SurveyReportPage({ params }) {
  const { slug } = await params

  const [post, relatedPosts] = await Promise.all([
    client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title, "slug": slug.current, publishedAt, body, mainImage,
        excerpt, categories, seoTitle, seoDescription
      }`,
      { slug }
    ).catch(() => null),
    client.fetch(
      `*[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0..2] {
        title, "slug": slug.current, publishedAt, excerpt, mainImage
      }`,
      { slug }
    ).catch(() => []),
  ])

  if (!post) notFound()

  const siteUrl = 'https://onlyforteachers.co.uk'
  const postUrl = `${siteUrl}/survey-results/${slug}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + postUrl)}`,
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero image */}
      {post.mainImage && (
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-100">
          <Image
            src={urlFor(post.mainImage).width(1400).height(600).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/survey-results"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
        >
          ← Survey Results
        </Link>

        {/* Title & meta */}
        <div className="mb-8">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map(cat => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: '#CA9662' }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {post.title}
          </h1>
          {post.publishedAt && (
            <p className="text-sm text-gray-400">{formatDate(post.publishedAt)}</p>
          )}
          {post.excerpt && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
          )}
        </div>

        {/* Body */}
        {post.body && (
          <div className="prose max-w-none">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}

        {/* Social share */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-3">Share this report</p>
          <div className="flex gap-3">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Share on X
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-10 rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#FDF8F3' }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Join the community and share your voice
          </h2>
          <p className="text-gray-600 mb-5 text-sm">
            Be part of the data. Complete weekly surveys and help shape the UK Teacher Pulse Index.
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Join Free
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">More Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(related => (
                <Link
                  key={related.slug}
                  href={`/survey-results/${related.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {related.mainImage && (
                    <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={urlFor(related.mainImage).width(400).height(200).url()}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{formatDate(related.publishedAt)}</p>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:opacity-80">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
