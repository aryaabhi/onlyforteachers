import Link from 'next/link'

export const metadata = {
  title: 'Survey Methodology | Only For Teachers',
  description: 'How Only For Teachers creates, runs, and compiles its weekly teacher surveys and the UK Teacher Pulse Index.',
}

export default function SurveyMethodologyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Survey Methodology</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          How we create, run, and compile our weekly teacher surveys — and how we ensure
          the results are meaningful and trustworthy.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Surveys Are Created</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Each weekly survey is created by the Only For Teachers editorial team. Topics are chosen
            based on current issues in UK education, news events affecting teachers, and suggestions
            submitted by the community through our{' '}
            <Link href="/ask-a-question" style={{ color: '#CA9662' }} className="font-medium">
              Ask a Question
            </Link>
            {' '}feature.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every survey contains exactly <strong>5 questions</strong>. Questions are reviewed to
            ensure they are clear, unbiased, and relevant to the full range of UK teaching professionals —
            from primary to secondary, state to independent, early career to senior leadership.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Questions use a mix of formats: Likert scale ratings, multiple choice, and short
            free-text responses. All question formats are designed to be quick to complete and
            easy to understand.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Survey Duration and Access</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Each survey is live for exactly <strong>one week</strong>, opening on Monday and closing
            the following Sunday. Registered members are notified by email when a new survey opens.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Surveys are only accessible to registered members of Only For Teachers. This ensures
            that responses come exclusively from verified UK teaching professionals, maintaining
            the integrity and relevance of our data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Sizes and Representation</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We report the number of respondents for each survey alongside the results. We aim to
            achieve a minimum of 100 responses before publishing results, though we will always
            publish results regardless of sample size with full transparency about participation numbers.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our membership covers teachers across all regions of the UK, all school types, and all
            subject areas and year groups. We do not currently weight responses by these demographics,
            but we report on the composition of our membership to allow readers to interpret results
            in context.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We acknowledge that our sample is self-selected — members have chosen to join the
            platform — which may introduce some bias. We are transparent about this limitation in
            all published results.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Results Are Compiled</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            After a survey closes, responses are aggregated and anonymised. Individual responses
            are never published. Results are presented as percentages, averages, and distributions
            depending on the question type.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Free-text responses are reviewed manually. Representative quotes may be included in
            published results with all identifying information removed. No free-text response
            will ever be attributed to a specific individual.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Results are published on the{' '}
            <Link href="/teacher-index" style={{ color: '#CA9662' }} className="font-medium">
              UK Teacher Pulse Index
            </Link>
            {' '}within 7 days of a survey closing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Integrity</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We implement the following measures to protect the integrity of our survey data:
          </p>
          <ul className="space-y-3 text-gray-600">
            <IntegrityItem text="Each member can complete each survey only once, enforced at the database level" />
            <IntegrityItem text="All responses are timestamped and logged with metadata to detect anomalous patterns" />
            <IntegrityItem text="Survey access is restricted to authenticated members — no anonymous submissions are accepted" />
            <IntegrityItem text="We monitor for and remove duplicate accounts that attempt to game the system" />
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Teacher Pulse Index</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The UK Teacher Pulse Index is a cumulative record of how teachers across the UK are
            thinking and feeling about their profession. It is compiled from the results of all
            closed surveys run on the Only For Teachers platform.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The index does not attempt to create a single composite score. Instead, it presents
            survey-by-survey results across key themes — workload, wellbeing, pay, curriculum,
            leadership, and technology — allowing trends to be tracked over time.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            The index is publicly accessible and free to use for journalistic, research, and
            policy purposes, provided that Only For Teachers UK is credited as the source and
            the sample size and methodology are disclosed.
          </p>
          <Link
            href="/teacher-index"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#CA9662' }}
          >
            View the Teacher Pulse Index
          </Link>
        </section>

        <section className="border-t border-gray-100 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Questions About Our Methodology?</h2>
          <p className="text-gray-600">
            If you have questions about how we run our surveys or use our data, please contact us at{' '}
            <a
              href="mailto:contact@onlyforteachers.co.uk"
              className="font-medium"
              style={{ color: '#CA9662' }}
            >
              contact@onlyforteachers.co.uk
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}

function IntegrityItem({ text }) {
  return (
    <li className="flex items-start gap-3 list-none">
      <span
        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: '#CA9662' }}
      />
      <span>{text}</span>
    </li>
  )
}
