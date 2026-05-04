'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

function calcOverall(c, w, s, o) {
  const vals = [c, w, s, o].map(v => parseInt(v) || 0)
  return Math.round(vals.reduce((a, b) => a + b, 0) / 4)
}

export default function TPIAdminClient({ initialScores }) {
  const [scores, setScores] = useState(initialScores)
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.target)
    const entry = buildEntry(fd)

    startTransition(async () => {
      const { data, error: err } = await supabase
        .from('tpi_scores')
        .insert(entry)
        .select()
        .single()

      if (err) { setError(err.message); return }
      setScores(prev => [data, ...prev])
      setShowAdd(false)
      e.target.reset()
    })
  }

  async function handleUpdate(e, id) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.target)
    const entry = buildEntry(fd)

    startTransition(async () => {
      const { data, error: err } = await supabase
        .from('tpi_scores')
        .update(entry)
        .eq('id', id)
        .select()
        .single()

      if (err) { setError(err.message); return }
      setScores(prev => prev.map(s => s.id === id ? data : s))
      setEditingId(null)
    })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this TPI entry?')) return
    startTransition(async () => {
      await supabase.from('tpi_scores').delete().eq('id', id)
      setScores(prev => prev.filter(s => s.id !== id))
    })
  }

  function buildEntry(fd) {
    const confidence = parseInt(fd.get('confidence') || '0')
    const workload = parseInt(fd.get('workload') || '0')
    const support = parseInt(fd.get('support') || '0')
    const optimism = parseInt(fd.get('optimism') || '0')
    const overallRaw = fd.get('overall_tpi')
    const overall_tpi = overallRaw ? parseInt(overallRaw) : calcOverall(confidence, workload, support, optimism)
    return {
      survey_date: fd.get('survey_date'),
      survey_topic: fd.get('survey_topic'),
      confidence,
      workload,
      support,
      optimism,
      overall_tpi,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Pulse Index Scores</h1>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: '#CA9662' }}
        >
          {showAdd ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add New TPI Entry</h2>
          <TPIForm onSubmit={handleAdd} isPending={isPending} submitLabel="Add Entry" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {scores.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">No TPI scores yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Topic</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">Conf.</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">Work.</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">Support</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">Optim.</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">TPI</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {scores.map(s => (
                  editingId === s.id ? (
                    <tr key={s.id} className="border-b border-gray-50">
                      <td colSpan={8} className="px-4 py-4">
                        <TPIForm
                          defaultValues={s}
                          onSubmit={e => handleUpdate(e, s.id)}
                          isPending={isPending}
                          submitLabel="Save"
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {new Date(s.survey_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{s.survey_topic}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.confidence}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.workload}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.support}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{s.optimism}</td>
                      <td className="px-3 py-3 text-center">
                        <TPIBadge score={s.overall_tpi} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-3 justify-end">
                          <button onClick={() => setEditingId(s.id)} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function TPIForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }) {
  const [confidence, setConfidence] = useState(defaultValues?.confidence ?? 50)
  const [workload, setWorkload] = useState(defaultValues?.workload ?? 50)
  const [support, setSupport] = useState(defaultValues?.support ?? 50)
  const [optimism, setOptimism] = useState(defaultValues?.optimism ?? 50)
  const [overrideOverall, setOverrideOverall] = useState(false)
  const autoOverall = calcOverall(confidence, workload, support, optimism)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Survey Date</label>
          <input
            name="survey_date"
            type="date"
            defaultValue={defaultValues?.survey_date ?? ''}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Survey Topic</label>
          <input
            name="survey_topic"
            defaultValue={defaultValues?.survey_topic ?? ''}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Confidence', name: 'confidence', value: confidence, set: setConfidence },
          { label: 'Workload', name: 'workload', value: workload, set: setWorkload },
          { label: 'Support', name: 'support', value: support, set: setSupport },
          { label: 'Optimism', name: 'optimism', value: optimism, set: setOptimism },
        ].map(({ label, name, value, set }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label} (0–100)</label>
            <input
              name={name}
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={e => set(parseInt(e.target.value) || 0)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked={overrideOverall} onChange={e => setOverrideOverall(e.target.checked)} className="rounded" />
            Override Overall TPI (auto: {autoOverall})
          </label>
        </div>
        {overrideOverall ? (
          <div>
            <input
              name="overall_tpi"
              type="number"
              min="0"
              max="100"
              defaultValue={defaultValues?.overall_tpi ?? autoOverall}
              className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
            />
          </div>
        ) : (
          <input type="hidden" name="overall_tpi" value={autoOverall} />
        )}
        <span className="text-sm text-gray-500">Auto Overall: <strong>{autoOverall}</strong></span>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: '#CA9662' }}
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-gray-600 text-sm font-semibold border border-gray-300 bg-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function TPIBadge({ score }) {
  let label, cls
  if (score >= 80) { label = 'Very Positive'; cls = 'bg-green-100 text-green-800' }
  else if (score >= 60) { label = 'Positive'; cls = 'bg-emerald-100 text-emerald-700' }
  else if (score >= 40) { label = 'Neutral/Mixed'; cls = 'bg-amber-100 text-amber-700' }
  else if (score >= 20) { label = 'Negative'; cls = 'bg-orange-100 text-orange-700' }
  else { label = 'Very Negative'; cls = 'bg-red-100 text-red-700' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {score} · {label}
    </span>
  )
}
