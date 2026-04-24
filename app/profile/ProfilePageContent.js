'use client'

import { useState } from 'react'
import ProfileForm from './ProfileForm'
import PasswordChange from './PasswordChange'
import DeleteAccount from './DeleteAccount'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'password', label: 'Password' },
  { id: 'account', label: 'Account' },
]

export default function ProfilePageContent({ profile }) {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div>
      <div className="mb-6" style={{ borderBottom: '1px solid #E8DDD0' }}>
        <nav className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: activeTab === tab.id ? '#C94F2C' : 'transparent',
                color: activeTab === tab.id ? '#C94F2C' : '#6B6B6B',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'profile' && <ProfileForm profile={profile} />}
      {activeTab === 'password' && <PasswordChange />}
      {activeTab === 'account' && (
        <div>
          <h2 className="text-base font-semibold text-[#1B3A2D] mb-4">Delete account</h2>
          <DeleteAccount />
        </div>
      )}
    </div>
  )
}
