import { useState } from 'react'
import {
  Plus, Users, Trash2, Search, ChevronRight, UserPlus, Crown,
  Shield, User, Mail, X, MoreHorizontal, ArrowRight
} from 'lucide-react'
import {
  useSquads, useCreateSquad, useDeleteSquad,
  useAddSquadMember, useRemoveSquadMember, useUpdateSquadMemberRole
} from '../hooks/useSquads'

const SQUAD_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#84CC16',
]

const roleConfig = {
  Lead:   { icon: Crown,  bg: 'bg-amber-50 text-amber-700 border border-amber-200' },
  Member: { icon: User,   bg: 'bg-blue-50 text-blue-700 border border-blue-200' },
}

// ── Create Squad Modal ───────────────────────────────────────
function CreateSquadModal({ onClose }) {
  const { mutate: createSquad, isPending } = useCreateSquad()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(SQUAD_COLORS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    createSquad(
      { name: name.trim(), description: description.trim(), color },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Create new squad</h2>
            <p className="text-sm text-gray-500 mt-0.5">Organize your team into squads</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100
              text-gray-400 cursor-pointer"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Squad name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Frontend Squad" autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description
              <span className="text-gray-400 font-normal"> (optional)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What does this squad work on?" rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Squad color</label>
            <div className="flex gap-2 flex-wrap">
              {SQUAD_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c,
                    outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: color }}>{name ? name[0].toUpperCase() : 'S'}</div>
            <div>
              <p className="text-sm font-medium text-gray-800">{name || 'Squad name'}</p>
              <p className="text-xs text-gray-400">{description || 'No description'}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending || !name.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium cursor-pointer">
              {isPending ? 'Creating...' : 'Create squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add Member Inline ────────────────────────────────────────
function AddMemberForm({ squadId }) {
  const { mutate: addMember, isPending } = useAddSquadMember()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Member')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    addMember(
      { squadId, email: email.trim(), role },
      {
        onSuccess: () => { setEmail(''); setRole('Member') },
        onError: (err) => setError(err.response?.data?.error || 'Failed to add member')
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
        <UserPlus size={12} /> Add member by email
      </p>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="team@example.com"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
          />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="Member">Member</option>
          <option value="Lead">Lead</option>
        </select>
        <button type="submit" disabled={isPending || !email.trim()}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-300 text-white text-sm font-medium cursor-pointer
            flex items-center gap-1.5 flex-shrink-0">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><UserPlus size={14} /> Add</>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </form>
  )
}

// ── Squad Detail Panel ───────────────────────────────────────
function SquadDetail({ squad }) {
  const { mutate: removeMember } = useRemoveSquadMember()
  const { mutate: updateRole } = useUpdateSquadMemberRole()
  const [menuOpen, setMenuOpen] = useState(null)

  const leads = squad.members.filter(m => m.role === 'Lead')
  const members = squad.members.filter(m => m.role === 'Member')

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase()
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600',
      'bg-pink-100 text-pink-600', 'bg-cyan-100 text-cyan-600',
    ]
    return colors[name.charCodeAt(0) % colors.length]
  }

  const handleRemove = (memberId) => {
    if (window.confirm('Remove this member from the squad?')) {
      removeMember({ squadId: squad.id, memberId })
      setMenuOpen(null)
    }
  }

  const handleRoleChange = (memberId, newRole) => {
    updateRole({ squadId: squad.id, memberId, role: newRole })
    setMenuOpen(null)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white
              text-lg font-bold" style={{ backgroundColor: squad.color }}>
              {squad.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{squad.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {squad.description || 'No description'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-2xl font-bold text-blue-700">{squad.members.length}</p>
            <p className="text-xs text-blue-500 mt-0.5">Total members</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <p className="text-2xl font-bold text-amber-700">{leads.length}</p>
            <p className="text-xs text-amber-500 mt-0.5">Leads</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center">
            <p className="text-2xl font-bold text-green-700">{members.length}</p>
            <p className="text-xs text-green-500 mt-0.5">Members</p>
          </div>
        </div>
      </div>

      {/* Members table */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-10
          border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-900">
            Members ({squad.members.length})
          </span>
        </div>

        {squad.members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users size={28} className="text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No members yet</p>
            <p className="text-xs text-gray-300 mt-0.5">Add members using the form below</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                  px-6 py-2.5">Member</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                  px-4 py-2.5">Email</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                  px-4 py-2.5">Role</th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider
                  px-6 py-2.5 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {squad.members.map(member => {
                const RoleIcon = roleConfig[member.role]?.icon || User
                return (
                  <tr key={member.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          text-xs font-semibold ${getAvatarColor(member.name)}`}>
                          {getInitials(member.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{member.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium
                        px-2.5 py-1 rounded-full ${roleConfig[member.role]?.bg}`}>
                        <RoleIcon size={11} />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 inline-flex
                          items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400
                          cursor-pointer transition">
                        <MoreHorizontal size={14} />
                      </button>

                      {/* Dropdown menu */}
                      {menuOpen === member.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-6 top-10 z-30 bg-white border border-gray-200
                            rounded-xl shadow-lg py-1 w-44">
                            {member.role === 'Member' ? (
                              <button
                                onClick={() => handleRoleChange(member.id, 'Lead')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs
                                  text-gray-700 hover:bg-gray-50 cursor-pointer">
                                <Crown size={12} className="text-amber-500" /> Promote to Lead
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(member.id, 'Member')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs
                                  text-gray-700 hover:bg-gray-50 cursor-pointer">
                                <User size={12} className="text-blue-500" /> Change to Member
                              </button>
                            )}
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => handleRemove(member.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs
                                text-red-600 hover:bg-red-50 cursor-pointer">
                              <Trash2 size={12} /> Remove from squad
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add member form */}
      <AddMemberForm squadId={squad.id} />
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function SquadsPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: squads = [], isLoading } = useSquads()
  const { mutate: deleteSquad } = useDeleteSquad()

  const filteredSquads = squads.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedSquad = squads.find(s => s.id === selectedId) || filteredSquads[0]

  // Auto-select first squad
  if (!selectedId && filteredSquads.length > 0 && !isLoading) {
    setSelectedId(filteredSquads[0].id)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Delete this squad? This cannot be undone.')) {
      deleteSquad(id)
      if (selectedId === id) setSelectedId(null)
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-1 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Squads</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {squads.length} squads · {squads.reduce((sum, s) => sum + s.members.length, 0)} total members
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium rounded-lg transition cursor-pointer">
          <Plus size={15} /> New squad
        </button>
      </div>

      {/* Split layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">

        {/* Left panel — squad list */}
        <div className="w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col bg-white
          rounded-xl border border-gray-200 overflow-hidden">

          {/* Search */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search squads..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400" />
            </div>
          </div>

          {/* Squad list */}
          <div className="flex-1 overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && filteredSquads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Users size={28} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 mb-1">
                  {searchQuery ? 'No matching squads' : 'No squads yet'}
                </p>
                {!searchQuery && (
                  <button onClick={() => setShowModal(true)}
                    className="text-xs text-blue-600 hover:underline cursor-pointer mt-1">
                    Create first squad
                  </button>
                )}
              </div>
            )}

            {filteredSquads.map(squad => {
              const isSelected = selectedSquad?.id === squad.id
              return (
                <div key={squad.id} onClick={() => setSelectedId(squad.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition
                    border-l-[3px] group
                    ${isSelected ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent hover:bg-gray-50'}`}>

                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white
                    text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: squad.color }}>
                    {squad.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate
                      ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {squad.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {squad.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users size={10} /> {squad.members.length} members
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Crown size={10} /> {squad.members.filter(m => m.role === 'Lead').length} leads
                      </span>
                    </div>

                    {/* Member avatar stack */}
                    {squad.members.length > 0 && (
                      <div className="flex items-center mt-2 -space-x-1.5">
                        {squad.members.slice(0, 5).map(m => {
                          const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
                            'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600',
                            'bg-pink-100 text-pink-600']
                          const c = colors[m.name.charCodeAt(0) % colors.length]
                          return (
                            <div key={m.id}
                              className={`w-6 h-6 rounded-full flex items-center justify-center
                                text-xs font-semibold border-2 border-white ${c}`}
                              title={m.name}>
                              {m.name[0]}
                            </div>
                          )
                        })}
                        {squad.members.length > 5 && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center
                            text-xs font-medium bg-gray-100 text-gray-500 border-2 border-white">
                            +{squad.members.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button onClick={(e) => handleDelete(e, squad.id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
                        justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-500
                        transition cursor-pointer">
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className={`mt-1
                      ${isSelected ? 'text-blue-400' : 'text-gray-200'}`} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom summary */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredSquads.length} squads</span>
              <span>{filteredSquads.reduce((sum, s) => sum + s.members.length, 0)} members</span>
            </div>
          </div>
        </div>

        {/* Right panel — squad detail */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden min-w-0">
          {selectedSquad ? (
            <SquadDetail squad={selectedSquad} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Users size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Select a squad</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Click on a squad from the list to see members, manage roles, and add new people
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && <CreateSquadModal onClose={() => setShowModal(false)} />}
    </div>
  )
}