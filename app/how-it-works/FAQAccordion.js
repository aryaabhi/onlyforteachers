'use client'

import { useState } from 'react'

export default function FAQAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="space-y-3">
      {faqs.map(faq => {
        const isOpen = openId === faq.id
        return (
          <div
            key={faq.id}
            className="rounded-xl border overflow-hidden transition-all"
            style={{ borderColor: isOpen ? '#1B3A2D' : '#E8DDD0' }}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              style={{ backgroundColor: isOpen ? '#F0F5F2' : '#fff' }}
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
              <span
                className="shrink-0 text-lg font-bold transition-transform"
                style={{
                  color: '#1B3A2D',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t" style={{ borderColor: '#E8DDD0' }}>
                <p className="pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
