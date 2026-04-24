export const metadata = {
  title: 'Privacy Policy | Only For Teachers',
  description: 'Privacy policy for Only For Teachers UK — how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: April 2025</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        <PolicySection title="1. Who We Are">
          <p>
            Only For Teachers UK (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website onlyforteachers.co.uk.
            We are committed to protecting your personal data and complying with the UK General Data
            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <p>
            For data protection enquiries, please contact us at{' '}
            <a href="mailto:contact@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              contact@onlyforteachers.co.uk
            </a>.
          </p>
        </PolicySection>

        <PolicySection title="2. What Data We Collect">
          <p>We collect the following personal data when you register and use our platform:</p>
          <ul>
            <li><strong>Identity data:</strong> First name, last name</li>
            <li><strong>Contact data:</strong> Email address</li>
            <li><strong>Professional data:</strong> School name, year groups taught, subjects taught, school type</li>
            <li><strong>Survey responses:</strong> Your answers to weekly surveys (anonymised before publication)</li>
            <li><strong>Usage data:</strong> Login timestamps, survey completion dates, points balance</li>
            <li><strong>Technical data:</strong> IP address, browser type, and device information (via cookies)</li>
          </ul>
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
            The lawful basis for processing is <strong>contract performance</strong> (providing our
            service to you) and <strong>legitimate interests</strong> (improving our platform and
            conducting research).
          </p>
        </PolicySection>

        <PolicySection title="4. Third Parties">
          <p>We share your data with the following third parties:</p>
          <ul>
            <li>
              <strong>Supabase:</strong> Our database and authentication provider. Your data is stored
              securely on Supabase infrastructure. See Supabase&apos;s privacy policy for details.
            </li>
            <li>
              <strong>Brevo (formerly Sendinblue):</strong> Our email service provider. We share your
              name and email address with Brevo to send survey notifications and updates. Brevo does
              not use your data for their own marketing purposes.
            </li>
            <li>
              <strong>Vercel:</strong> Our hosting provider. Vercel processes technical data (IP
              addresses, request logs) as part of operating our platform.
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal data with any third party for marketing purposes.
          </p>
        </PolicySection>

        <PolicySection title="5. Your Rights">
          <p>Under UK GDPR, you have the following rights:</p>
          <ul>
            <li><strong>Right of access:</strong> Request a copy of the data we hold about you</li>
            <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to portability:</strong> Request your data in a portable format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data</li>
          </ul>
          <p>
            To exercise any of these rights, please email us at{' '}
            <a href="mailto:contact@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              contact@onlyforteachers.co.uk
            </a>.
            {' '}We will respond within 30 days. You also have the right to lodge a complaint with the
            Information Commissioner&apos;s Office (ICO) at ico.org.uk.
          </p>
        </PolicySection>

        <PolicySection title="6. Data Retention">
          <p>
            We retain your personal data for as long as your account is active. If you delete your
            account, we will delete your personal data within 30 days, except where we are required
            to retain it for legal or regulatory reasons.
          </p>
          <p>
            Anonymised survey responses may be retained indefinitely as part of the Teacher Pulse Index.
          </p>
        </PolicySection>

        <PolicySection title="7. Cookies">
          <p>We use the following types of cookies:</p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> Required for authentication and session management.
              These cannot be disabled.
            </li>
            <li>
              <strong>Analytics cookies:</strong> We may use analytics tools to understand how our
              platform is used. These cookies collect anonymised data only.
            </li>
          </ul>
          <p>
            By using our platform, you consent to the use of essential cookies. You can manage
            analytics cookies through your browser settings.
          </p>
        </PolicySection>

        <PolicySection title="8. Data Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal
            data against unauthorised access, alteration, disclosure, or destruction. Our platform
            uses HTTPS encryption and our database provider (Supabase) implements row-level security.
          </p>
        </PolicySection>

        <PolicySection title="9. Changes to This Policy">
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes by email or by displaying a notice on our platform. The date at the top of this
            page indicates when the policy was last updated.
          </p>
        </PolicySection>

        <PolicySection title="10. Contact Us">
          <p>
            For any questions about this privacy policy or how we handle your data, please contact
            us at{' '}
            <a href="mailto:contact@onlyforteachers.co.uk" style={{ color: '#CA9662' }}>
              contact@onlyforteachers.co.uk
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
