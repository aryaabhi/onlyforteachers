'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FAQAdminClient({ initialFaqs }) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.target)
    const question = fd.get('question')?.toString().trim()
    const answer = fd.get('answer')?.toString().trim()
    if (!question || !answer) return

    startTransition(async () => {
      const position = faqs.length > 0 ? Math.max(...faqs.map(f => f.position ?? 0)) + 1 : 0
      const { data, error: err } = await supabase
        .from('faqs')
        .insert({ question, answer, position, is_active: true })
        .select()
        .single()

      if (err) { setError(err.message); return }
      setFaqs(prev => [...prev, data])
      setShowAdd(false)
      e.target.reset()
    })
  }

  async function handleUpdate(e, faqId) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.target)
    const question = fd.get('question')?.toString().trim()
    const answer = fd.get('answer')?.toString().trim()
    if (!question || !answer) return

    startTransition(async () => {
      const { data, error: err } = await supabase
        .from('faqs')
        .update({ question, answer })
        .eq('id', faqId)
        .select()
        .single()

      if (err) { setError(err.message); return }
      setFaqs(prev => prev.map(f => f.id === faqId ? data : f))
      setEditingId(null)
    })
  }

  async function handleDelete(faqId) {
    startTransition(async () => {
      const { error: err } = await supabase.from('faqs').delete().eq('id', faqId)
      if (!err) setFaqs(prev => prev.filter(f => f.id !== faqId))
    })
  }

  async function handleToggleActive(faq) {
    startTransition(async () => {
      const { data, error: err } = await supabase
        .from('faqs')
        .update({ is_active: !faq.is_active })
        .eq('id', faq.id)
        .select()
        .single()

      if (!err) setFaqs(prev => prev.map(f => f.id === faq.id ? data : f))
    })
  }

  async function handleMove(faqId, direction) {
    const idx = faqs.findIndex(f => f.id === faqId)
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= faqs.length) return

    const newFaqs = [...faqs]
    const [a, b] = [newFaqs[idx], newFaqs[targetIdx]]
    const posA = a.position
    const posB = b.position
    newFaqs[idx] = { ...a, position: posB }
    newFaqs[targetIdx] = { ...b, position: posA }

    startTransition(async () => {
      await Promise.all([
        supabase.from('faqs').update({ position: posB }).eq('id', a.id),
        supabase.from('faqs').update({ position: posA }).eq('id', b.id),
      ])
      setFaqs(newFaqs.sort((x, y) => (x.position ?? 0) - (y.position ?? 0)))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: '#CA9662' }}
        >
          {showAdd ? 'Cancel' : '+ Add FAQ'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add New FAQ</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                name="question"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea
                name="answer"
                required
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: '#CA9662' }}
            >
              {isPending ? 'Saving…' : 'Add FAQ'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {faqs.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">No FAQs yet. Add your first one above.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="p-5">
                {editingId === faq.id ? (
                  <form onSubmit={e => handleUpdate(e, faq.id)} className="space-y-3">
                    <input
                      name="question"
                      defaultValue={faq.question}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none"
                    />
                    <textarea
                      name="answer"
                      defaultValue={faq.answer}
                      required
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold disabled:opacity-60"
                        style={{ backgroundColor: '#CA9662' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 rounded-lg text-gray-600 text-xs font-semibold border border-gray-300 bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMove(faq.id, 'up')}
                        disabled={idx === 0 || isPending}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(faq.id, 'down')}
                        disabled={idx === faqs.length - 1 || isPending}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-0.5">{faq.question}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {faq.is_active ? 'Active' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(faq)}
                        disabled={isPending}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        {faq.is_active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => setEditingId(faq.id)}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
