export const metadata = {
  title: 'Privacy Policy | Only for Teachers',
  description: 'How Only for Teachers collects, uses and protects your personal data. UK GDPR compliant. All data stored in UK and EU.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: May 2026</p>
        <p className="text-gray-400 text-sm mt-2">
          Previous versions available on request by emailing{' '}
          <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
            hello@onlyforteachers.co.uk
          </a>
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        <PolicySection title="1. Who We Are">
          <p>
            Only for Teachers UK (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website onlyforteachers.co.uk.
            We are committed to protecting your personal data and complying with the UK General Data
            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <p>
            We are registered with the Information Commissioner&apos;s Office (ICO) as a data controller.
          </p>
          <p>
            For data protection enquiries, please contact us at{' '}
            <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              hello@onlyforteachers.co.uk
            </a>.
          </p>
        </PolicySection>

        <PolicySection title="2. What Data We Collect">
          <p>We collect the following personal data when you register and use our platform:</p>
          <ul>
            <li><strong>Identity data:</strong> First name</li>
            <li><strong>Contact data:</strong> Email address</li>
            <li><strong>Professional data:</strong> School name, year groups taught, subjects taught, school type</li>
            <li><strong>Survey responses:</strong> Your answers to weekly surveys (anonymised before publication)</li>
            <li><strong>Usage data:</strong> Login timestamps, survey completion dates, points balance</li>
            <li><strong>Technical data:</strong> IP address, browser type, and device information (via cookies)</li>
          </ul>
          <p>
            <strong>Special category data:</strong> Some survey questions may touch on sensitive topics such as health,
            wellbeing or personal circumstances. Where this applies, we will seek your explicit consent before
            collecting such data.
          </p>
        </PolicySection>

        <PolicySection title="3. How We Use Your Data">
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To create and manage your account</li>
            <li>To send you weekly survey notifications and platform updates</li>
            <li>To calculate and credit your points balance</li>
            <li>To administer the monthly prize draw</li>
            <li>To compile anonymised research insights (the Teacher Pulse Index)</li>
            <li>To improve our platform and personalise your experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p>
            We create automated profiles based on your survey activity (points balance, streak, completion history).
            We do not make decisions with legal or significant effects solely through automated processing.
          </p>
          <p>
            We may use artificial intelligence tools, including Large Language Models (LLMs), to assist with
            analysis of aggregated survey data and generation of research insights. We do not submit personally
            identifiable information to these tools.
          </p>
        </PolicySection>

        <PolicySection title="4. Third Parties">
          <p>We share your data with the following third parties:</p>
          <ul>
            <li>
              <strong>Supabase (London, UK):</strong> Our database and authentication provider. Your data is stored
              securely on Supabase infrastructure. See Supabase&apos;s privacy policy for details.
            </li>
            <li>
              <strong>Brevo (EU — France/Belgium):</strong> Our email service provider. We share your
              name and email address with Brevo to send survey notifications and updates. Brevo does
              not use your data for their own marketing purposes.
            </li>
            <li>
              <strong>Vercel (London, UK):</strong> Our hosting provider. Vercel processes technical data (IP
              addresses, request logs) as part of operating our platform.
            </li>
            <li>
              <strong>Sanity (Belgium, EU):</strong> Our blog content management system. Sanity stores blog
              content only — no personal data is shared with Sanity.
            </li>
            <li>
              <strong>Google Analytics:</strong> We use Google Analytics 4 to understand how our platform is
              used. Analytics cookies are only set after you accept via our cookie consent banner.
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal data with any third party for marketing purposes.
          </p>
        </PolicySection>

        <PolicySection title="5. Lawful Bases for Processing">
          <p>We process your personal data on the following lawful bases:</p>
          <ul>
            <li>
              <strong>Performance of a contract:</strong> To provide our platform, manage your account,
              and deliver the service you have registered for.
            </li>
            <li>
              <strong>Legitimate interests:</strong> To improve our platform, conduct educational research,
              compile the Teacher Pulse Index, and administer our rewards programme. Our legitimate interests
              do not override your rights.
            </li>
            <li>
              <strong>Consent:</strong> For analytics cookies and where survey questions involve special
              category data.
            </li>
            <li>
              <strong>Legal obligation:</strong> Where required by law.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="6. Data Retention">
          <p>We retain your personal data for the following periods:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-900">Data type</th>
                  <th className="text-left py-2 font-semibold text-gray-900">Retention period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 pr-4">Account and profile data</td>
                  <td className="py-2">Duration of account + 6 years</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Survey responses</td>
                  <td className="py-2">6 years; anonymised data held indefinitely</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Points and rewards history</td>
                  <td className="py-2">Duration of account + 6 years</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Email communications</td>
                  <td className="py-2">6 years</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Analytics data</td>
                  <td className="py-2">26 months (Google Analytics default)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Technical/server logs</td>
                  <td className="py-2">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Anonymised survey responses may be retained indefinitely as part of the Teacher Pulse Index.
          </p>
        </PolicySection>

        <PolicySection title="7. Your Rights">
          <p>Under UK GDPR, you have the following rights:</p>
          <ul>
            <li><strong>Right of access:</strong> Request a copy of the data we hold about you</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to portability:</strong> Request your data in a portable format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data</li>
            <li><strong>Right to object to direct marketing:</strong> Opt out of direct marketing at any time</li>
            <li><strong>Right not to be subject to automated decision-making:</strong> You have the right not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects</li>
            <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of processing before withdrawal</li>
          </ul>
          <p>
            To exercise any of these rights, please email us at{' '}
            <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              hello@onlyforteachers.co.uk
            </a>.
            {' '}We will respond within 30 days.
          </p>
          <p>
            You also have the right to complain to the ICO at{' '}
            <a href="https://ico.org.uk" style={{ color: '#CA9662' }}>ico.org.uk</a>{' '}
            if you are unhappy with how we have handled your personal data.
          </p>
        </PolicySection>

        <PolicySection title="8. Data Residency">
          <p>All personal data is stored and processed within the United Kingdom and European Union:</p>
          <ul>
            <li><strong>Teacher profiles, survey data, points:</strong> UK (London)</li>
            <li><strong>Email contact data:</strong> EU (France/Belgium)</li>
            <li><strong>Server processing:</strong> UK (London)</li>
          </ul>
          <p>
            No personal data is transferred outside the UK or EU. Blog content only (no personal data)
            is stored in Belgium, EU.
          </p>
        </PolicySection>

        <PolicySection title="9. Cookies">
          <p>We use the following types of cookies:</p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> Required for authentication (Supabase auth sessions).
              Cannot be disabled.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Google Analytics 4 (_ga, _ga_QB8MZV2H75). Only set after
              you accept via our cookie consent banner. Withdraw consent any time by clearing cookies or
              declining via the banner.
            </li>
          </ul>
          <p>
            We do not use advertising or tracking cookies.
          </p>
        </PolicySection>

        <PolicySection title="10. Governing Law">
          <p>
            This Privacy Policy is governed by the laws of England and Wales. Any disputes will be
            subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </PolicySection>

        <PolicySection title="11. Complaints">
          <p>
            If you are unhappy with how we have handled your personal data, please contact us first at{' '}
            <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              hello@onlyforteachers.co.uk
            </a>.
          </p>
          <p>You also have the right to complain to the Information Commissioner&apos;s Office (ICO):</p>
          <ul>
            <li>
              <strong>Website:</strong>{' '}
              <a href="https://ico.org.uk" style={{ color: '#CA9662' }}>ico.org.uk</a>
            </li>
            <li><strong>Phone:</strong> 0303 123 1113</li>
          </ul>
        </PolicySection>

        <PolicySection title="12. Data Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal
            data against unauthorised access, alteration, disclosure, or destruction. Our platform
            uses HTTPS encryption and our database provider (Supabase) implements row-level security.
          </p>
        </PolicySection>

        <PolicySection title="13. Changes to This Policy">
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes by email or by displaying a notice on our platform. The date at the top of this
            page indicates when the policy was last updated.
          </p>
          <p>
            Previous versions are available on request by emailing{' '}
            <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              hello@onlyforteachers.co.uk
            </a>.
          </p>
        </PolicySection>

        <PolicySection title="14. Contact Us">
          <p>
            For any questions about this privacy policy or how we handle your data, please contact
            us at{' '}
            <a href="mailto:hello@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              hello@onlyforteachers.co.uk
            </a>.
          </p>
        </PolicySection>
      </div>
    </main>
  )
}

function PolicySection({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-2 [&_a]:underline-offset-2 [&_a]:underline">
        {children}
      </div>
    </section>
  )
}
