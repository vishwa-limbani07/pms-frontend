import { useState } from 'react'
import { X, Mail, User, Shield } from 'lucide-react'
import { useInviteMember } from '../../hooks/useMembers'

const ROLES = [
  { value: 'ADMIN',  label: 'Admin',  desc: 'Full access, can manage members' },
  { value: 'MEMBER', label: 'Member', desc: 'Can create and edit tasks' },
  { value: 'VIEWER', label: 'Viewer', desc: 'Read-only access' },
]

export default function InviteMemberModal({ projectId, onClose }) {
  const { mutate: inviteMember, isPending } = useInviteMember(projectId)
  const [form, setForm] = useState({ name: '', email: '', role: 'MEMBER' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    inviteMember(
      { projectId, ...form },
      { onSuccess: onClose }
    )
  }

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Invite member</h2>
            <p className="text-xs text-gray-400 mt-0.5">Add someone to this project</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              hover:bg-gray-100 text-gray-400 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Riya Shah"
                autoFocus
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="e.g. riya@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="space-y-2">
              {ROLES.map(role => (
                <label
                  key={role.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer
                    transition hover:border-blue-200 hover:bg-blue-50
                    ${form.role === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.role === role.value}
                    onChange={() => set('role', role.value)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <p className={`text-sm font-medium ${form.role === role.value ? 'text-blue-700' : 'text-gray-700'}`}>
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{role.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium transition cursor-pointer">
              {isPending ? 'Inviting...' : 'Send invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}