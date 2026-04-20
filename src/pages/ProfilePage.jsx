import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Lock, Globe, Clock, Trash2,
  Check, X, Eye, EyeOff, AlertTriangle, Save
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const TIMEZONES = [
  'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore',
  'Europe/London', 'Europe/Paris', 'America/New_York',
  'America/Los_Angeles', 'America/Chicago', 'Australia/Sydney',
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'gu', label: 'Gujarati' },
]

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-3 items-start gap-6 py-3 border-b border-gray-50 last:border-0">
      <label className="text-sm font-medium text-gray-600 pt-2">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore()

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    timezone: user?.timezone || 'Asia/Kolkata',
    language: user?.language || 'en',
  })

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false, newPass: false, confirm: false
  })

  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  const initials = profile.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  // ── Profile save ─────────────────────────────────────────────
  const handleSaveProfile = async () => {
    const errs = {}
    if (!profile.name.trim()) errs.name = 'Name is required'
    if (!profile.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errs.email = 'Enter a valid email'
    if (Object.keys(errs).length) { setProfileErrors(errs); return }

    setProfileSaving(true)
    await new Promise(r => setTimeout(r, 700))
    updateUser({ ...user, ...profile })
    setProfileErrors({})
    setProfileSaving(false)
    toast.success('Profile updated!')
  }

  // ── Password save ─────────────────────────────────────────────
  const handleSavePassword = async () => {
    const errs = {}
    if (!passwords.current) errs.current = 'Current password is required'
    if (!passwords.newPass) errs.newPass = 'New password is required'
    else if (passwords.newPass.length < 6) errs.newPass = 'Minimum 6 characters'
    if (passwords.newPass !== passwords.confirm) errs.confirm = "Passwords don't match"
    if (Object.keys(errs).length) { setPasswordErrors(errs); return }

    setPasswordSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setPasswords({ current: '', newPass: '', confirm: '' })
    setPasswordErrors({})
    setPasswordSaving(false)
    toast.success('Password changed!')
  }

  // ── Delete account ────────────────────────────────────────────
  const handleDeleteAccount = () => {
    if (deleteConfirm !== user?.email) {
      toast.error('Email does not match')
      return
    }
    logout()
    navigate('/login')
    toast.success('Account deleted')
  }

  const toggleShow = (field) =>
    setShowPasswords(s => ({ ...s, [field]: !s[field] }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Profile & Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* ── Avatar + name hero ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center
            flex-shrink-0">
            <span className="text-white text-xl font-semibold">{initials}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'Your Name'}</h3>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <p className="text-xs text-gray-400 mt-1">{profile.bio || 'No bio added yet'}</p>
          </div>
        </div>
      </div>

      {/* ── Profile info ── */}
      <SectionCard
        title="Personal information"
        description="Update your name, email and bio"
      >
        <div className="space-y-0">
          <FieldRow label="Full name">
            <input
              type="text"
              value={profile.name}
              onChange={e => {
                setProfile(p => ({ ...p, name: e.target.value }))
                if (profileErrors.name) setProfileErrors(e => ({ ...e, name: null }))
              }}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-400 transition"
            />
            {profileErrors.name && (
              <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
            )}
          </FieldRow>

          <FieldRow label="Email address">
            <input
              type="email"
              value={profile.email}
              onChange={e => {
                setProfile(p => ({ ...p, email: e.target.value }))
                if (profileErrors.email) setProfileErrors(e => ({ ...e, email: null }))
              }}
              placeholder="your@email.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-400 transition"
            />
            {profileErrors.email && (
              <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>
            )}
          </FieldRow>

          <FieldRow label="Bio">
            <textarea
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell your team a bit about yourself..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-400 transition resize-none"
            />
          </FieldRow>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveProfile}
            disabled={profileSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400 text-white text-sm font-medium rounded-lg
              transition cursor-pointer"
          >
            <Save size={14} />
            {profileSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </SectionCard>

      {/* ── Change password ── */}
      <SectionCard
        title="Change password"
        description="Use a strong password of at least 6 characters"
      >
        <div className="space-y-0">
          {[
            { key: 'current', label: 'Current password', placeholder: 'Enter current password' },
            { key: 'newPass', label: 'New password',     placeholder: 'Enter new password' },
            { key: 'confirm', label: 'Confirm password', placeholder: 'Repeat new password' },
          ].map(({ key, label, placeholder }) => (
            <FieldRow key={key} label={label}>
              <div className="relative">
                <input
                  type={showPasswords[key] ? 'text' : 'password'}
                  value={passwords[key]}
                  onChange={e => {
                    setPasswords(p => ({ ...p, [key]: e.target.value }))
                    if (passwordErrors[key]) setPasswordErrors(e => ({ ...e, [key]: null }))
                  }}
                  placeholder={placeholder}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder:text-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                    hover:text-gray-600 cursor-pointer"
                >
                  {showPasswords[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordErrors[key] && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors[key]}</p>
              )}
            </FieldRow>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSavePassword}
            disabled={passwordSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400 text-white text-sm font-medium rounded-lg
              transition cursor-pointer"
          >
            <Lock size={14} />
            {passwordSaving ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </SectionCard>

      {/* ── Preferences ── */}
      <SectionCard
        title="Preferences"
        description="Customize your experience"
      >
        <div className="space-y-0">
          <FieldRow label="Timezone">
            <select
              value={profile.timezone}
              onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </FieldRow>

          <FieldRow label="Language">
            <select
              value={profile.language}
              onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </FieldRow>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              updateUser({ ...user, timezone: profile.timezone, language: profile.language })
              toast.success('Preferences saved!')
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            <Save size={14} /> Save preferences
          </button>
        </div>
      </SectionCard>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-red-700">Danger zone</h3>
          </div>
          <p className="text-xs text-red-400 mt-0.5">
            These actions are permanent and cannot be undone
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-3 items-start gap-6">
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-800">Delete account</p>
              <p className="text-xs text-gray-400 mt-1">
                Permanently delete your account and all associated data.
                Type your email <span className="font-mono font-medium text-gray-600">
                  {user?.email}
                </span> to confirm.
              </p>
              <input
                type="email"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder={user?.email}
                className="mt-3 w-full px-3.5 py-2.5 rounded-lg border border-red-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
                  placeholder:text-gray-300 transition"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== user?.email}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700
                  disabled:bg-red-200 disabled:text-red-300 text-white text-sm font-medium
                  rounded-lg transition cursor-pointer"
              >
                <Trash2 size={14} /> Delete account
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}