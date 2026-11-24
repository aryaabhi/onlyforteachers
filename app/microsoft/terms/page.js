import Link from 'next/link'

const NAVY = '#2B4A7A'

export const metadata = {
  title: 'Microsoft Elevate for Educators Prize Draw Terms & Conditions',
  description:
    'Terms and conditions for the Microsoft Elevate for Educators UK Community survey prize draw on Only for Teachers.',
  alternates: { canonical: '/microsoft/terms' },
  robots: { index: false, follow: true },
}

function Section({ number, title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>
        {number}. {title}
      </h2>
      <div className="space-y-3 text-[#2C2C2C] leading-relaxed">{children}</div>
    </section>
  )
}

export default function MicrosoftTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-14 px-4 text-center text-white" style={{ backgroundColor: NAVY }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3 opacity-70">
          Microsoft Elevate for Educators UK Community – Only For Teachers Survey Prize Draw
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">Terms &amp; Conditions</h1>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <Section number={1} title="Eligibility">
          <p>
            The prize draw is open to educators employed by UK schools, colleges, and educational institutions.
          </p>
          <p>Only one entry per person.</p>
        </Section>

        <Section number={2} title="How to Enter">
          <p>
            To enter, complete and submit the Microsoft Elevate for Educators survey on Only for Teachers during
            the prize draw period. A valid completed survey automatically provides one entry into the prize draw.
          </p>
          <p>No purchase is necessary.</p>
        </Section>

        <Section number={3} title="Prize Draw Period and Winner Announcement">
          <p>The survey opens on Tuesday 1 December 2026 and closes on Monday 7 December 2026 at 11:59pm GMT.</p>
          <p>Entries received after the closing date will not be accepted.</p>
          <p>The winner will be announced by Friday 18 December 2026.</p>
        </Section>

        <Section number={4} title="Prize">
          <p>
            One winner will receive either teacher training or student workshops with a recommended value of
            £1,250, delivered by education specialists from Tablet Academy. The winning school chooses one of the
            two options described on the competition landing page.
          </p>
          <p>No cash alternative is available.</p>
          <p>
            Training or workshops must be booked and delivered within 12 months of the winner being notified.
          </p>
          <p>Delivery is subject to reasonable scheduling and availability.</p>
          <p>
            Microsoft and Tablet Academy reserve the right to substitute the prize with an equivalent alternative
            if necessary.
          </p>
        </Section>

        <Section number={5} title="Winner Selection">
          <p>The winner will be selected at random from eligible completed survey responses.</p>
          <p>
            The winner will be notified using the email address associated with their Only for Teachers account.
          </p>
        </Section>

        <Section number={6} title="Use of Survey Information">
          <p>
            By entering the survey, participants agree that the information provided may be used in aggregated
            and anonymised form for research and community development purposes.
          </p>
          <p>
            Personal data is processed in accordance with the Only for Teachers{' '}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section number={7} title="Publicity">
          <p>
            The winner may be asked to participate in reasonable promotional activity related to the competition.
          </p>
        </Section>

        <Section number={8} title="General">
          <p>Entry into the prize draw constitutes acceptance of these Terms &amp; Conditions.</p>
          <p>
            These Terms &amp; Conditions are governed by the laws of England and Wales.
          </p>
        </Section>

        <div className="pt-6 border-t text-center" style={{ borderColor: '#E8DDD0' }}>
          <Link
            href="/microsoft"
            className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: NAVY, textDecoration: 'none' }}
          >
            ← Back to the Microsoft survey
          </Link>
        </div>
      </div>
    </main>
  )
}
