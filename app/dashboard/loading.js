export default function DashboardLoading() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EDE0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Greeting */}
        <div className="mb-8">
          <div className="h-9 w-56 rounded-lg bg-gray-200 animate-pulse mb-2" />
          <div className="h-5 w-44 rounded bg-gray-100 animate-pulse" />
        </div>

        {/* Survey card */}
        <div className="rounded-2xl p-6 mb-6 animate-pulse" style={{ backgroundColor: '#d1d5db', height: '112px' }} />

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0' }}>
              <div className="h-4 w-28 rounded bg-gray-200 animate-pulse mb-3" />
              <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#E8DDD0' }}>
          <div className="h-5 w-36 rounded bg-gray-200 animate-pulse mb-5" />
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: '#F5EDE0' }}>
              <div>
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-1.5" />
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse" style={{ borderColor: '#E8DDD0' }}>
              <div className="h-5 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Referral box */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0' }}>
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-4 w-64 rounded bg-gray-100 animate-pulse mb-4" />
          <div className="h-10 rounded-lg bg-gray-200 animate-pulse" />
        </div>

      </div>
    </main>
  )
}
