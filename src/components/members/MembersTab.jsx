import { useState } from 'react'
import { UserPlus, Crown, User, Eye, MoreVertical, Trash2, RefreshCw } from 'lucide-react'
import { useMembers, useUpdateMemberRole, useRemoveMember } from '../../hooks/useMembers'
import { useAuthStore } from '../../store/authStore'
import { formatDate } from '../../utils/formatDate'
import InviteMemberModal from './InviteMemberModal'

const ROLE_CONFIG = {
  ADMIN:  { label: 'Admin',  icon: Crown, class: 'bg-purple-50 text-purple-600 border border-purple-100' },
  MEMBER: { label: 'Member', icon: User,  class: 'bg-blue-50 text-blue-600 border border-blue-100' },
  VIEWER: { label: 'Viewer', icon: Eye,   class: 'bg-gray-100 text-gray-600' },
}

const ROLES = ['ADMIN', 'MEMBER', 'VIEWER']

function MemberCard({ member, projectId, isCurrentUser, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changingRole, setChangingRole] = useState(false)
  const { mutate: updateRole } = useUpdateMemberRole(projectId)
  const { mutate: removeMember } = useRemoveMember(projectId)

  const roleConfig = ROLE_CONFIG[member.role]
  const RoleIcon = roleConfig.icon

  const initials = member.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

  const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-amber-100 text-amber-600',
    'bg-pink-100 text-pink-600',
  ]
  const colorIndex = member.name?.charCodeAt(0) % avatarColors.length || 0
  const avatarClass = avatarColors[colorIndex]

  const handleRoleChange = (role) => {
    updateRole({ projectId, memberId: member.id, role })
    setChangingRole(false)
    setMenuOpen(false)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove ${member.name} from this project?`)) {
      removeMember({ projectId, memberId: member.id })
    }
    setMenuOpen(false)
  }

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition group">

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center
        font-semibold text-sm flex-shrink-0 ${avatarClass}`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
          {isCurrentUser && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">you</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{member.email}</p>
      </div>

      {/* Joined date */}
      <div className="hidden md:block text-xs text-gray-400 flex-shrink-0">
        Joined {formatDate(member.joinedAt)}
      </div>

      {/* Role badge */}
      {!changingRole ? (
        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
          font-medium flex-shrink-0 ${roleConfig.class}`}>
          <RoleIcon size={11} />
          {roleConfig.label}
        </span>
      ) : (
        <select
          autoFocus
          value={member.role}
          onChange={e => handleRoleChange(e.target.value)}
          onBlur={() => setChangingRole(false)}
          className="text-xs px-2 py-1 rounded-lg border border-blue-300 focus:outline-none
            focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          {ROLES.map(r => (
            <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
          ))}
        </select>
      )}

      {/* Actions menu — only for admins, not on themselves */}
      {isAdmin && !isCurrentUser && (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              opacity-0 group-hover:opacity-100 hover:bg-gray-200
              text-gray-400 transition cursor-pointer"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200
              rounded-xl shadow-lg z-10 overflow-hidden min-w-[160px]">
              <button
                onClick={() => { setChangingRole(true); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700
                  hover:bg-gray-50 transition cursor-pointer"
              >
                <RefreshCw size={13} className="text-gray-400" />
                Change role
              </button>
              <button
                onClick={handleRemove}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600
                  hover:bg-red-50 transition cursor-pointer border-t border-gray-100"
              >
                <Trash2 size={13} />
                Remove member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MembersTab({ projectId }) {
  const { user } = useAuthStore()
  const { data: members = [], isLoading } = useMembers(projectId)
  const [showInvite, setShowInvite] = useState(false)

  const currentUserMember = members.find(m => m.email === user?.email)
  const isAdmin = currentUserMember?.role === 'ADMIN'

  const admins  = members.filter(m => m.role === 'ADMIN')
  const others  = members.filter(m => m.role !== 'ADMIN')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {members.length} {members.length === 1 ? 'member' : 'members'} in this project
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium rounded-lg transition cursor-pointer"
            >
              <UserPlus size={15} /> Invite member
            </button>
          )}
        </div>

        {/* Role legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(ROLE_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.class}`}>
                  <Icon size={10} /> {config.label}
                </span>
                <span className="text-gray-400">
                  {key === 'ADMIN' ? '— full access' : key === 'MEMBER' ? '— can edit' : '— read only'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Members list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Admins */}
          {admins.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Admins · {admins.length}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {admins.map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    projectId={projectId}
                    isCurrentUser={member.email === user?.email}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </>
          )}

          {/* Members + Viewers */}
          {others.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Members & Viewers · {others.length}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {others.map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    projectId={projectId}
                    isCurrentUser={member.email === user?.email}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty */}
          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus size={28} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No members yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Invite someone to get started</p>
            </div>
          )}
        </div>
      </div>

      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
        />
      )}
    </>
  )
}