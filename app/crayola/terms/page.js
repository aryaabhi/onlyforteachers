import Link from 'next/link'

export const metadata = {
  title: 'Crayola Prize Draw Terms & Conditions',
  description:
    'Terms and conditions for the Crayola Creativity Week Only For Teachers survey prize draw.',
  alternates: { canonical: '/crayola/terms' },
  robots: { index: false, follow: true },
}

function Section({ number, title, children }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#1B3A2D] mb-3">
        {number}. {title}
      </h2>
      <div className="space-y-3 text-[#2C2C2C] leading-relaxed">{children}</div>
    </section>
  )
}

export default function CrayolaTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-14 px-4 text-center text-white" style={{ backgroundColor: '#1B3A2D' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3 opacity-70">
          Crayola Creativity Week – Only For Teachers Survey Prize Draw
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">Terms &amp; Conditions</h1>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <Section number={1} title="Promoter">
          <p>
            This prize draw is run by Crayola (Binney &amp; Smith (Europe) Ltd) (the &ldquo;Promoter&rdquo;),
            Forge, 43 Church Street West, Woking, Surrey, GU21 6HT, United Kingdom.
          </p>
        </Section>

        <Section number={2} title="Eligibility">
          <p>Open to residents of the United Kingdom aged 18 years or over.</p>
          <p>
            Employees of the Promoter, its affiliates, subsidiaries or agencies, and their immediate family
            members, are not eligible to enter.
          </p>
        </Section>

        <Section number={3} title="Prize Draw Period">
          <p>The survey prize draw closes on 30th November 2026 at 11:59pm GMT.</p>
          <p>Entries received after the closing date will not be accepted.</p>
        </Section>

        <Section number={4} title="How to Enter">
          <p>
            To enter, participants must complete the Crayola Creativity Week Teacher Survey during the prize
            draw period.
          </p>
          <p>Completion and valid submission of the survey will automatically provide one entry into the prize draw.</p>
          <p>
            Only one entry per person is permitted. Duplicate, incomplete or invalid entries may be disqualified.
          </p>
          <p>No purchase is necessary.</p>
          <p>
            Entrants do not need to opt in to marketing communications to enter. By entering, participants
            agree that the Promoter may contact them if they are selected as a winner.
          </p>
        </Section>

        <Section number={5} title="Prize">
          <p>
            One (1) winner will receive a bundle of Crayola creative supplies with an approximate retail value
            of £300.
          </p>
          <p>
            The contents of the bundle will be selected by the Promoter and may differ from any products shown
            in promotional materials.
          </p>
          <p>The prize is non-transferable and non-refundable. No cash alternative will be offered.</p>
          <p>
            The Promoter reserves the right to substitute the prize with an alternative of equal or greater
            value if circumstances outside its reasonable control make this necessary.
          </p>
        </Section>

        <Section number={6} title="Winner Selection and Notification">
          <p>
            The winner will be selected at random from all eligible entries received during the prize draw
            period.
          </p>
          <p>The draw will take place within 14 days of the closing date.</p>
          <p>The winner will be notified using the contact details supplied with their survey submission.</p>
          <p>
            The winner must respond within 14 days of notification to claim the prize. If the winner does not
            respond within this period, is ineligible or declines the prize, the Promoter reserves the right
            to select an alternative winner at random from the remaining eligible entries.
          </p>
          <p>
            The Promoter may request reasonable proof of identity, age, UK residency and
            education-professional status before awarding the prize.
          </p>
        </Section>

        <Section number={7} title="Publicity and Winner Information">
          <p>
            The Promoter may publish or otherwise make available the winner&apos;s surname and county, as
            required by applicable promotional rules, unless the winner objects. The Promoter may still provide
            this information to a competent authority where required.
          </p>
          <p>
            Any additional publicity, including use of the winner&apos;s first name, school name or photograph,
            will be subject to the winner&apos;s agreement.
          </p>
        </Section>

        <Section number={8} title="Data Protection and Survey Research">
          <p>
            Personal data collected through the survey and prize draw will be used to administer the survey,
            operate the prize draw, contact the winner and deliver the prize.
          </p>
          <p>
            Survey responses may be analysed and reported in aggregated or anonymised form to help Crayola
            understand teachers&apos; needs and challenges relating to creativity in schools and to inform
            future resources, initiatives and brand activity.
          </p>
          <p>Marketing communications will only be sent where the entrant has separately chosen to receive them.</p>
          <p>
            Personal data will be processed in accordance with Crayola&apos;s Privacy Policy, available at{' '}
            <a
              href="https://www.crayola.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              crayola.com/privacy-policy
            </a>
            .
          </p>
        </Section>

        <Section number={9} title="General">
          <p>
            The Promoter reserves the right to amend, suspend or cancel the prize draw where necessary due to
            circumstances beyond its reasonable control.
          </p>
          <p>
            The Promoter reserves the right to disqualify entries that it reasonably believes are fraudulent,
            automated, incomplete, inaccurate or otherwise in breach of these Terms &amp; Conditions.
          </p>
          <p>
            The Promoter&apos;s decision regarding the administration of the prize draw is final. No
            correspondence will be entered into.
          </p>
          <p>Entry into the prize draw constitutes acceptance of these Terms &amp; Conditions.</p>
        </Section>

        <Section number={10} title="Liability">
          <p>
            The Promoter accepts no responsibility for entries that are lost, delayed, incomplete, corrupted or
            not received due to technical or other reasons beyond its reasonable control.
          </p>
          <p>
            Nothing in these Terms &amp; Conditions excludes or limits liability where it would be unlawful to
            do so, including liability for death or personal injury caused by negligence, fraud or fraudulent
            misrepresentation.
          </p>
        </Section>

        <Section number={11} title="Governing Law">
          <p>
            These Terms &amp; Conditions are governed by the laws of England and Wales. Entrants may bring
            proceedings in the courts applicable to their place of residence within the United Kingdom.
          </p>
        </Section>

        <div className="pt-6 border-t text-center" style={{ borderColor: '#E8DDD0' }}>
          <Link
            href="/crayola"
            className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#C94F2C', textDecoration: 'none' }}
          >
            ← Back to the Crayola survey
          </Link>
        </div>
      </div>
    </main>
  )
}
