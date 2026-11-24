// Aggregation helpers for "ranking" questions, whose answers are stored in
// responses.answer_array as the options in the teacher's order of preference
// (index 0 = most preferred).

// Returns one row per option, sorted best-first, with the average rank
// (1 = best) and how many teachers ranked it first.
export function summariseRanking(options, answerArrays) {
  const n = options.length
  const stats = {}
  for (const opt of options) stats[opt] = { sum: 0, count: 0, first: 0 }
  let respondents = 0
  for (const arr of answerArrays) {
    if (!Array.isArray(arr) || arr.length === 0) continue
    respondents++
    arr.forEach((opt, i) => {
      if (!(opt in stats)) return
      stats[opt].sum += i + 1
      stats[opt].count++
      if (i === 0) stats[opt].first++
    })
  }
  const rows = options.map(opt => {
    const s = stats[opt]
    const avg = s.count > 0 ? s.sum / s.count : null
    // 100% = everyone ranked it first, 0% = everyone ranked it last
    const score = avg === null || n <= 1 ? 0 : Math.round(((n - avg) / (n - 1)) * 100)
    return { option: opt, avgRank: avg, firstCount: s.first, score }
  })
  rows.sort((a, b) => {
    if (a.avgRank === null) return 1
    if (b.avgRank === null) return -1
    return a.avgRank - b.avgRank
  })
  return { rows, respondents }
}

export function formatRankedAnswer(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '—'
  return arr.map((opt, i) => `${i + 1}. ${opt}`).join('  ')
}
