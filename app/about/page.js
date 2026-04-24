import Link from 'next/link'

export const metadata = {
  title: 'About | Only For Teachers',
  description: 'Learn about Only For Teachers — our mission to give UK teachers a voice and reward them for sharing their professional opinions.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Only For Teachers</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">Built by educators, for educators.</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p
            className="text-gray-600 leading-relaxed text-lg border-l-4 pl-6 italic"
            style={{ borderColor: '#CA9662' }}
          >
            &ldquo;We exist to give UK teachers a voice and reward them for sharing their professional opinions.&rdquo;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Only For Teachers is the UK&apos;s first survey platform built exclusively for teaching
            professionals. We run weekly surveys on the topics that matter most in education —
            workload, wellbeing, curriculum, leadership, technology, and more.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every teacher who completes a survey earns points that can be redeemed for real rewards.
            Every month, we draw 5 winners who each receive £50.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The results of each survey are published in the{' '}
            <Link href="/teacher-index" className="font-medium" style={{ color: '#CA9662' }}>
              UK Teacher Pulse Index
            </Link>
            {' '}— a public record of how teachers across the UK think and feel about the issues
            that affect their profession.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <div className="space-y-4">
            <CommitmentCard
              title="Your Privacy Comes First"
              description="We never sell your personal data. Survey responses are anonymised before publication. You control what data you share with us, and you can request deletion at any time."
            />
            <CommitmentCard
              title="No Spam"
              description="We only email you about surveys, rewards, and important account updates. You can unsubscribe at any time. We will never send you irrelevant promotional content."
            />
            <CommitmentCard
              title="Teacher Focused"
              description="Every decision we make is guided by what's best for teachers. Our surveys are designed to surface genuine insights, not generate clickbait headlines."
            />
            <CommitmentCard
              title="Free Forever"
              description="Only For Teachers will always be free to join and use. There are no subscription fees, no hidden costs, and no premium tiers."
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We&apos;d love to hear from you — whether you have a question, a suggestion, or you&apos;d
            like to collaborate with us.
          </p>
          <p className="text-gray-600">
            Email us at{' '}
            <a
              href="mailto:contact@onlyforteachers.co.uk"
              className="font-medium"
              style={{ color: '#CA9662' }}
            >
              contact@onlyforteachers.co.uk
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h2>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/onlyforteachers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-medium transition-colors hover:bg-gray-50 text-sm"
              style={{ borderColor: '#CA9662', color: '#CA9662' }}
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/onlyforteachers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-medium transition-colors hover:bg-gray-50 text-sm"
              style={{ borderColor: '#CA9662', color: '#CA9662' }}
            >
              LinkedIn
            </a>
          </div>
        </section>

        <section className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Want to shape our surveys?</h2>
          <p className="text-gray-600 mb-6">
            Submit a question you&apos;d like asked to the teaching community.
          </p>
          <Link
            href="/ask-a-question"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            Ask a Question
          </Link>
        </section>
      </div>
    </main>
  )
}

function CommitmentCard({ title, description }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-gray-50">
      <div
        className="w-1.5 rounded-full flex-shrink-0 self-stretch"
        style={{ backgroundColor: '#CA9662' }}
      />
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
