'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { surveyHref } from '@/lib/campaigns'

const subscribe = () => () => {}

// "Take the survey" link whose destination is resolved in the browser, so it is
// correct even on statically rendered pages (the home page is force-static and
// would otherwise bake in whichever destination was current at build time).
// The server/hydration snapshot is always /survey; the real destination is
// swapped in after hydration without a mismatch.
export default function SurveyLink({ className, style, onClick, children }) {
  const href = useSyncExternalStore(subscribe, () => surveyHref(), () => '/survey')
  return (
    <Link href={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  )
}
