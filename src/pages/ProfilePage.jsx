import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Lock, Settings, AlertTriangle, Eye, EyeOff,
  Save, Trash2, Globe, Languages, Check, LogOut, Mail, AtSign
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { updateProfileApi, changePasswordApi, deleteAccountApi } from '../api/auth.api'
import toast from 'react-hot-toast'

const TIMEZONES = [
  'Asia/Kolkata', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland',
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
]

const tabs = [
  { id: 'profile',     label: 'Profile',     icon: User,            color: 'text-blue-600 bg-blue-50' },
  { id: 'security',    label: 'Security',    icon: Lock,            color: 'text-purple-600 bg-purple-50' },
  { id: 'preferences', label: 'Preferences', icon: Settings,        color: 'text-green-600 bg-green-50' },
  { id: 'danger',      label: 'Danger zone', icon: AlertTriangle,   color: 'text-red-600 bg-red-50' },
]

// ── Profile Tab ──────────────────────────────────────────────
function ProfileTab({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateProfileApi({ name, email, bio })
      onUpdate(updated)
      setSaved(true)
      toast.success('Profile updated')
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update')
    }
    setSaving(false)
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Profile</h2>
      <p className="text-sm text-gray-500 mb-6">Manage your personal information</p>

      {/* Avatar section */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center
          text-white text-xl font-bold flex-shrink-0">
          {initials || 'U'}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{name || 'Your Name'}</p>
          <p className="text-sm text-gray-400">{email || 'your@email.com'}</p>
          {bio && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{bio}</p>}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                transition placeholder:text-gray-400"
              placeholder="Vishwa Limbani" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                transition placeholder:text-gray-400"
              placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio
            <span className="text-gray-400 font-normal"> (optional)</span></label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
              transition placeholder:text-gray-400 resize-none"
            placeholder="Tell us about yourself..." />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition cursor-pointer">
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <><Check size={15} /> Saved</>
          ) : (
            <><Save size={15} /> Save changes</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Security Tab ─────────────────────────────────────────────
function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async () => {
    setError('')
    if (newPassword.length < 6) { setError('New password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return }

    setSaving(true)
    try {
      await changePasswordApi({ currentPassword, newPassword })
      toast.success('Password updated')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password')
    }
    setSaving(false)
  }

  const PasswordInput = ({ value, onChange, show, setShow, placeholder }) => (
    <div className="relative">
      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
          transition placeholder:text-gray-400" />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Security</h2>
      <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure</p>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <Lock size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Password requirements</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Must be at least 6 characters. Use a mix of letters, numbers, and symbols for a strong password.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
          <PasswordInput value={currentPassword} onChange={setCurrentPassword}
            show={showCurrent} setShow={setShowCurrent} placeholder="Enter current password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
          <PasswordInput value={newPassword} onChange={setNewPassword}
            show={showNew} setShow={setShowNew} placeholder="Enter new password" />
          {newPassword && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all
                  ${newPassword.length >= 10 ? 'w-full bg-green-500'
                    : newPassword.length >= 6 ? 'w-2/3 bg-amber-400' : 'w-1/3 bg-red-400'}`} />
              </div>
              <span className={`text-xs font-medium
                ${newPassword.length >= 10 ? 'text-green-600'
                  : newPassword.length >= 6 ? 'text-amber-600' : 'text-red-500'}`}>
                {newPassword.length >= 10 ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Weak'}
              </span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
          <PasswordInput value={confirmPassword} onChange={setConfirmPassword}
            show={showConfirm} setShow={setShowConfirm} placeholder="Confirm new password" />
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-500 mt-1.5">Passwords don't match</p>
          )}
          {confirmPassword && confirmPassword === newPassword && newPassword.length >= 6 && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <Check size={12} /> Passwords match
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button onClick={handleChange} disabled={saving || !currentPassword || !newPassword}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition cursor-pointer">
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Lock size={15} /> Update password</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Preferences Tab ──────────────────────────────────────────
function PreferencesTab({ user, onUpdate }) {
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata')
  const [language, setLanguage] = useState(user?.language || 'en')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateProfileApi({ timezone, language })
      onUpdate(updated)
      setSaved(true)
      toast.success('Preferences updated')
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      toast.error('Failed to update preferences')
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Preferences</h2>
      <p className="text-sm text-gray-500 mb-6">Customize your experience</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                appearance-none cursor-pointer transition">
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Current time: {new Date().toLocaleTimeString('en-US', { timeZone: timezone })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
          <div className="relative">
            <Languages size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                appearance-none cursor-pointer transition">
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition cursor-pointer">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <><Check size={15} /> Saved</>
            ) : (
              <><Save size={15} /> Save preferences</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Danger Zone Tab ──────────────────────────────────────────
function DangerTab() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmEmail !== user?.email) return
    setDeleting(true)
    try {
      await deleteAccountApi()
      toast.success('Account deleted')
      logout()
      navigate('/login')
    } catch {
      toast.error('Failed to delete account')
    }
    setDeleting(false)
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-red-600 mb-1">Danger zone</h2>
      <p className="text-sm text-gray-500 mb-6">Irreversible and destructive actions</p>

      {/* Logout section */}
      <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Log out</p>
            <p className="text-xs text-gray-500 mt-0.5">Sign out of your account on this device</p>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300
              text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </div>

      {/* Delete account */}
      <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Delete account permanently</p>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
              This will permanently delete your account, all your projects, tasks, squads, and data.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-red-700 mb-1.5">
            Type <span className="font-mono bg-red-100 px-1 py-0.5 rounded">{user?.email}</span> to confirm
          </label>
          <input
            type="email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)}
            placeholder="Enter your email to confirm"
            className="w-full px-4 py-3 rounded-xl border border-red-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 bg-white placeholder:text-red-300" />
        </div>

        <button onClick={handleDelete}
          disabled={deleting || confirmEmail !== user?.email}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700
            disabled:bg-red-300 text-white text-sm font-medium rounded-xl transition cursor-pointer">
          {deleting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Trash2 size={14} /> Delete my account</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main Settings Page ───────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, login } = useAuthStore()
  const token = localStorage.getItem('token')

  const handleProfileUpdate = (updated) => {
    login(updated, token)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':     return <ProfileTab user={user} onUpdate={handleProfileUpdate} />
      case 'security':    return <SecurityTab />
      case 'preferences': return <PreferencesTab user={user} onUpdate={handleProfileUpdate} />
      case 'danger':      return <DangerTab />
      default:            return null
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">

      {/* Top bar */}
      <div className="px-1 pb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Split layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">

        {/* Left — sidebar tabs */}
        <div className="w-[220px] xl:w-[240px] flex-shrink-0 flex flex-col bg-white
          rounded-xl border border-gray-200 overflow-hidden">

          {/* User info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center
                text-white text-sm font-bold flex-shrink-0">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex-1 p-2 space-y-0.5">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                    transition cursor-pointer group
                    ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : tab.id === 'danger'
                        ? 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    transition
                    ${isActive
                      ? tab.color
                      : tab.id === 'danger'
                        ? 'bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Bottom info */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 text-center">ProjectNest v1.0</p>
          </div>
        </div>

        {/* Right — content panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-auto min-w-0">
          <div className="max-w-xl mx-auto px-8 py-6">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  )
}