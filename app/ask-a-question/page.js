import AskForm from './AskForm'

export const metadata = {
  title: 'Ask The Teaching Community | Only For Teachers',
  description: 'Submit a question you want asked to UK teachers in a future Only For Teachers weekly survey.',
}

export default function AskAQuestionPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ask The Teaching Community</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Is there a question you wish someone would ask UK teachers? Submit it here
          and we&apos;ll consider it for a future weekly survey.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">✍️</div>
            <p className="text-sm text-gray-600">Submit your question</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">👀</div>
            <p className="text-sm text-gray-600">We review all submissions</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-gray-600">Best questions go into surveys</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <AskForm />
        </section>

        <section className="text-sm text-gray-500 leading-relaxed">
          <p>
            By submitting a question, you agree that it may be used (in whole or edited form) in
            a future Only For Teachers survey. We reserve the right to reject or modify submitted
            questions. If you provide your email, we may contact you if your question is selected.
          </p>
        </section>
      </div>
    </main>
  )
}
