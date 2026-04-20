import { useState } from 'react'
import {
  Plus, Users, Trash2, MoreVertical, UserPlus, Crown,
  User, X, Check, ChevronRight, ChevronDown
} from 'lucide-react'
import { useSquads, useCreateSquad, useDeleteSquad,
  useAddSquadMember, useRemoveSquadMember, useUpdateSquadMemberRole
} from '../hooks/useSquads'


const SQUAD_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4']
const MEMBER_ROLES = ['Lead', 'Member']

function CreateSquadModal({ onClose }) {
  const { mutate: createSquad, isPending } = useCreateSquad()
  const [form, setForm] = useState({ name: '', description: '', color: SQUAD_COLORS[0] })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    createSquad(form, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Create squad</h2>
            <p className="text-xs text-gray-400 mt-0.5">Create a new team squad</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Squad name</label>
            <input type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Frontend Squad" autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What does this squad do?" rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {SQUAD_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition"
                  style={{ backgroundColor: c,
                    outline: form.color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '2px' }} />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending || !form.name.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium transition cursor-pointer">
              {isPending ? 'Creating...' : 'Create squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddMemberModal({ squadId, onClose }) {
  const { mutate: addMember, isPending } = useAddSquadMember(squadId)
  const [form, setForm] = useState({ name: '', email: '', role: 'Member' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    addMember({ squadId, ...form }, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Riya Shah" autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="riya@company.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
              {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium cursor-pointer">
              {isPending ? 'Adding...' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SquadCard({ squad }) {
  const [expanded, setExpanded] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const { mutate: deleteSquad } = useDeleteSquad()
  const { mutate: removeMember } = useRemoveSquadMember(squad.id)
  const { mutate: updateRole } = useUpdateSquadMemberRole(squad.id)

  const avatarColors = [
    'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600',
    'bg-pink-100 text-pink-600',
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Color bar */}
      <div className="h-1.5" style={{ backgroundColor: squad.color }} />

      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: squad.color }}>
              {squad.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{squad.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {squad.members.length} {squad.members.length === 1 ? 'member' : 'members'}
                {squad.description && ` · ${squad.description}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowAddMember(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50
                text-gray-400 hover:text-blue-600 transition cursor-pointer"
              title="Add member">
              <UserPlus size={15} />
            </button>
            <button onClick={() => {
              if (window.confirm(`Delete "${squad.name}" squad?`)) deleteSquad(squad.id)
            }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50
                text-gray-400 hover:text-red-500 transition cursor-pointer"
              title="Delete squad">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Member avatars row + expand toggle */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center -space-x-2">
            {squad.members.slice(0, 5).map((m) => {
              const initials = m.name.split(' ').map(n => n[0]).join('').toUpperCase()
              const colorClass = avatarColors[m.name.charCodeAt(0) % avatarColors.length]
              return (
                <div key={m.id} className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-semibold border-2 border-white ${colorClass}`}
                  title={m.name}>
                  {initials}
                </div>
              )
            })}
            {squad.members.length > 5 && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-medium bg-gray-100 text-gray-500 border-2 border-white">
                +{squad.members.length - 5}
              </div>
            )}
          </div>

          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600
              transition cursor-pointer">
            {expanded ? 'Hide' : 'Show'} members
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded members list */}
      {expanded && (
        <div className="border-t border-gray-100">
          {squad.members.map(member => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase()
            const colorClass = avatarColors[member.name.charCodeAt(0) % avatarColors.length]
            return (
              <div key={member.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-semibold flex-shrink-0 ${colorClass}`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                  <p className="text-xs text-gray-400 truncate">{member.email}</p>
                </div>

                {/* Role badge / change */}
                <select
                  value={member.role}
                  onChange={e => updateRole({ squadId: squad.id, memberId: member.id, role: e.target.value })}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer
                    border-0 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${member.role === 'Lead'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                {/* Remove */}
                <button
                  onClick={() => removeMember({ squadId: squad.id, memberId: member.id })}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
                    justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500
                    transition cursor-pointer">
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}

          {squad.members.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-gray-400">No members yet</p>
              <button onClick={() => setShowAddMember(true)}
                className="text-sm text-blue-600 hover:underline mt-1 cursor-pointer">
                Add first member
              </button>
            </div>
          )}
        </div>
      )}

      {showAddMember && (
        <AddMemberModal squadId={squad.id} onClose={() => setShowAddMember(false)} />
      )}
    </div>
  )
}

export default function SquadsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const { data: squads = [], isLoading } = useSquads()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Squads</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {squads.length} {squads.length === 1 ? 'squad' : 'squads'} in your organization
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium rounded-lg transition cursor-pointer">
          <Plus size={16} /> New squad
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && squads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={32} className="text-gray-200 mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No squads yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create your first squad to organize teams</p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium rounded-lg cursor-pointer">
            <Plus size={15} /> Create squad
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {squads.map(squad => (
          <SquadCard key={squad.id} squad={squad} />
        ))}
      </div>

      {showCreate && <CreateSquadModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}