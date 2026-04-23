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
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#CA9662] text-[#CA9662]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
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
          <h2 className="text-base font-semibold text-gray-900 mb-4">Delete account</h2>
          <DeleteAccount />
        </div>
      )}
    </div>
  )
}
