'use client'

import { ArrowDown, ArrowUp, X } from 'lucide-react'

// Rank-in-order-of-preference question. Teachers tap options in the order
// they prefer them; each tap appends to the ranked list. Ranked items can be
// nudged up or down or removed. The answer is the ordered array of options,
// most preferred first, and the question counts as answered once every
// option has been ranked.
//
// `value` is the ordered array (or undefined), `onChange` receives the new
// ordered array.
export default function RankingQuestion({ options, value, onChange, accent = '#C94F2C' }) {
  const ranked = Array.isArray(value) ? value.filter(o => options.includes(o)) : []
  const remaining = options.filter(o => !ranked.includes(o))

  function add(option) {
    onChange([...ranked, option])
  }
  function remove(option) {
    onChange(ranked.filter(o => o !== option))
  }
  function move(index, delta) {
    const target = index + delta
    if (target < 0 || target >= ranked.length) return
    const next = [...ranked]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#6B6B6B]">
        Tap the options in order of preference, starting with the one you find most useful.
        {ranked.length > 0 && ranked.length < options.length && (
          <> {options.length - ranked.length} left to rank.</>
        )}
      </p>

      {ranked.length > 0 && (
        <ol className="space-y-2">
          {ranked.map((option, i) => (
            <li
              key={option}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5 bg-white"
              style={{ borderColor: accent }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: accent }}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-[#2C2C2C]">{option}</span>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${option} up`}
                className="p-1.5 rounded-md text-[#6B6B6B] hover:bg-[#F5EDE0] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === ranked.length - 1}
                aria-label={`Move ${option} down`}
                className="p-1.5 rounded-md text-[#6B6B6B] hover:bg-[#F5EDE0] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(option)}
                aria-label={`Remove ${option} from ranking`}
                className="p-1.5 rounded-md text-[#6B6B6B] hover:bg-[#F5EDE0]"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      {remaining.length > 0 && (
        <div className="space-y-2">
          {remaining.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => add(option)}
              className="w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left bg-white hover:bg-[#F5EDE0] transition-colors"
              style={{ borderColor: '#E8DDD0' }}
            >
              <span
                className="w-7 h-7 rounded-full border-2 border-dashed shrink-0"
                style={{ borderColor: '#D4C9B8' }}
                aria-hidden="true"
              />
              <span className="text-sm text-[#2C2C2C]">{option}</span>
            </button>
          ))}
        </div>
      )}

      {ranked.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs underline text-[#6B6B6B] hover:text-[#2C2C2C]"
        >
          Start again
        </button>
      )}
    </div>
  )
}
