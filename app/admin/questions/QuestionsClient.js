'use client'

import { useState, useTransition } from 'react'
import { Copy, Check } from 'lucide-react'
import { updateQuestionStatusAction } from '@/app/actions/admin'

const TABS = ['All', 'Pending', 'Featured', 'Archived']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const styles =
    status === 'featured' ? 'bg-green-100 text-green-700'
    : status === 'archived' ? 'bg-gray-100 text-gray-500'
    : 'bg-amber-100 text-amber-700'
  const label =
    status === 'featured' ? 'Featured'
    : status === 'archived' ? 'Archived'
    : 'Pending'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {label}
    </span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy question'}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function QuestionText({ text }) {
  const [expanded, setExpanded] = useState(false)
  const truncated = text && text.length > 100
  const display = truncated && !expanded ? text.slice(0, 100) + '…' : text
  return (
    <span>
      {display}
      {truncated && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-1 text-xs underline text-gray-400 hover:text-gray-600"
        >
          {expanded ? 'collapse' : 'expand'}
        </button>
      )}
    </span>
  )
}

function ActionButtons({ questionId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function update(newStatus) {
    startTransition(async () => {
      const res = await updateQuestionStatusAction(questionId, newStatus)
      if (res?.error) setError(res.error)
      else setStatus(newStatus)
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        {status !== 'featured' && (
          <button
            disabled={isPending}
            onClick={() => update('featured')}
            className="px-2.5 py-1 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#16a34a' }}
          >
            Feature
          </button>
        )}
        {status !== 'archived' && (
          <button
            disabled={isPending}
            onClick={() => update('archived')}
            className="px-2.5 py-1 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 bg-gray-400"
          >
            Archive
          </button>
        )}
        {status !== 'pending' && (
          <button
            disabled={isPending}
            onClick={() => update('pending')}
            className="px-2.5 py-1 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#D97706' }}
          >
            Reset
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function QuestionRow({ q }) {
  const [status] = useState(q.status)
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900">{q.first_name ?? '—'}</p>
        <p className="text-gray-400 text-xs mt-0.5">{q.email ?? '—'}</p>
      </td>
      <td className="px-6 py-4 text-gray-700 max-w-xs">
        <div className="flex items-start gap-2">
          <span className="text-sm leading-snug"><QuestionText text={q.question ?? ''} /></span>
          <div className="shrink-0 mt-0.5"><CopyButton text={q.question ?? ''} /></div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(q.created_at)}</td>
      <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
      <td className="px-6 py-4">
        <ActionButtons questionId={q.id} currentStatus={q.status} />
      </td>
    </tr>
  )
}

export default function QuestionsClient({ questions }) {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = questions.filter(q => {
    if (activeTab === 'All') return true
    if (activeTab === 'Pending') return !q.status || q.status === 'pending'
    if (activeTab === 'Featured') return q.status === 'featured'
    if (activeTab === 'Archived') return q.status === 'archived'
    return true
  })

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === tab ? { backgroundColor: '#CA9662' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          No {activeTab.toLowerCase()} submissions
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Teacher</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Question</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <QuestionRow key={q.id} q={q} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
