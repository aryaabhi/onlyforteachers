import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import MagazineForm from '@/app/components/MagazineForm'

export const metadata = {
  title: 'Only for Teachers - The UK Teacher Community That Rewards You',
  description: 'Join Only for Teachers - a free community where UK teachers share insights through quick surveys, see results, and win rewards every week.',
  openGraph: {
    title: 'Only for Teachers - The UK Teacher Community That Rewards You',
    description: 'Join Only for Teachers - a free community where UK teachers share insights through quick surveys, see results, and win rewards every week.',
    url: 'https://onlyforteachers.co.uk',
  },
}

export const revalidate = 604800

export default async function HomePage() {
  const latestPosts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0..3] {
      title, "slug": slug.current, publishedAt, excerpt, mainImage,
      categories
    }`,
    {},
    { next: { revalidate: 604800 } }
  ).catch(() => [])

  return (
    <main>
      {/* Section 1: Hero */}
      <section className="py-24 px-4 text-center" style={{ backgroundColor: '#F5EDE0' }}>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1B3A2D] mb-5 max-w-3xl mx-auto leading-tight">
          Join 2,500+ teachers already making their voice heard.
        </h1>
        <p className="text-lg text-[#6B6B6B] mb-8 max-w-xl mx-auto">
          Free forever. Takes 60 seconds. No spam, ever.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
        >
          Join for free →
        </Link>
        <p className="mt-4 text-sm text-[#6B6B6B]">
          Already a member?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: '#C94F2C' }}>
            Sign in →
          </Link>
        </p>
      </section>

      {/* Section 2: Latest Insights */}
      <InsightsSection posts={latestPosts} showJoin />

      {/* Section 3: How It Works */}
      <section className="py-20 px-4" style={{ backgroundColor: '#F5EDE0' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#C94F2C' }}>
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3A2D] mb-14">
            Simple. Rewarding. Yours.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StepCard number="1" title="Sign up for free" description="Create your account in under 60 seconds. No credit card, no hidden fees - free forever." />
            <StepCard number="2" title="Take the weekly survey" description="5 short questions each week on topics that matter to UK teachers. Takes under 3 minutes." />
            <StepCard number="3" title="Earn points and rewards" description="Collect points for every survey, redeem them for real rewards, and enter the monthly prize draw." />
          </div>
          <div className="mt-12">
            <Link
              href="/register"
              className="inline-block px-8 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
            >
              Join for free
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <TestimonialsSection />

      {/* Section 5: Magazine / Partners */}
      <MagazineSection />

      {/* Section 6: Stats bar */}
      <section className="py-14 px-4 text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <StatItem value="2,500+" label="Teachers in our community" />
          <StatItem value="26" label="Surveys published" />
          <StatItem value="£3,000" label="Paid out to teachers" />
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="py-24 px-4 text-center" style={{ backgroundColor: '#F5EDE0' }}>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3A2D] mb-6">
          Ready to share your voice?
        </h2>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-full text-white font-semibold text-base transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
        >
          Join for free →
        </Link>
      </section>
    </main>
  )
}

function InsightsSection({ posts, showJoin }) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#C94F2C' }}>
            Latest Insights
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3A2D] mb-3">
            Real insights, published every week.
          </h2>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            Every survey produces published research - written, designed, and shared with the UK education community.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
                style={{ borderColor: '#E8DDD0', textDecoration: 'none' }}
              >
                {post.mainImage ? (
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={urlFor(post.mainImage).width(400).height(240).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-[#F5EDE0]" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-[#2C2C2C] mb-2 leading-snug text-sm group-hover:text-[#C94F2C] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#6B6B6B]">Survey reports will appear here as they are published.</div>
        )}

        <div className="text-center">
          <Link
            href="/survey-results"
            className="text-sm font-semibold hover:underline"
            style={{ color: '#C94F2C' }}
          >
            View all insights →
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Only for Teachers provides a platform which is beneficial for teachers and the sector. Finally - a voice for us.",
      name: "Veerle",
    },
    {
      quote: "A great survey to complete weekly, supporting the challenges teachers encounter on a very regular basis.",
      name: "Sarah",
    },
    {
      quote: "A refreshing and trustworthy platform, providing teachers with the ability to share experiences and opportunities, whilst also voicing concerns.",
      name: "Daniel",
    },
  ]

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#E8DDD0' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1B3A2D] text-center mb-12">
          What our members say.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <span className="text-4xl font-bold leading-none" style={{ color: '#C94F2C' }}>"</span>
              <p className="text-sm text-[#2C2C2C] leading-relaxed mt-2 mb-4">{t.quote}</p>
              <div>
                <p className="text-sm font-semibold text-[#1B3A2D]">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MagazineSection() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#1B3A2D' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#D4C9B8' }}>
          The Classroom Compass
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ color: '#F5EDE0' }}>
          Our new teacher magazine
        </h2>
        <p className="mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#C4B9A8' }}>
          We turn our community&apos;s survey responses into a digital magazine - shared with policymakers and read by teachers across the UK.
        </p>
        <MagazineForm />
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#9A8F82' }}>
            Trusted by teachers from
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {['Teachit', 'Pearson', 'The Classroom Compass', 'OUP', 'Hachette'].map(partner => (
              <span key={partner} className="text-sm font-medium" style={{ color: '#C4B9A8' }}>
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center px-4">
      <div
        className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#CA9662' }}
      >
        {number}
      </div>
      <h3 className="text-lg font-bold text-[#1B3A2D] mb-2">{title}</h3>
      <p className="text-sm text-[#6B6B6B] leading-relaxed">{description}</p>
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-bold" style={{ color: '#C94F2C' }}>{value}</p>
      <p className="mt-1 text-sm" style={{ color: '#D4C9B8' }}>{label}</p>
    </div>
  )
}
