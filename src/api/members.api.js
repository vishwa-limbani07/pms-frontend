// import { mockProjectMembers } from './mockData'

// export const getMembersApi = async (projectId) => {
//   await new Promise(r => setTimeout(r, 400))
//   return mockProjectMembers[projectId] || []
// }

// export const inviteMemberApi = async ({ projectId, name, email, role }) => {
//   await new Promise(r => setTimeout(r, 600))
//   const existing = (mockProjectMembers[projectId] || []).find(m => m.email === email)
//   if (existing) throw new Error('Member already exists in this project')
//   const newMember = {
//     id: Date.now().toString(), name, email, role,
//     avatar: null, joinedAt: new Date().toISOString()
//   }
//   if (!mockProjectMembers[projectId]) mockProjectMembers[projectId] = []
//   mockProjectMembers[projectId].push(newMember)
//   return newMember
// }

// export const updateMemberRoleApi = async ({ projectId, memberId, role }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const members = mockProjectMembers[projectId] || []
//   const index = members.findIndex(m => m.id === memberId)
//   if (index === -1) throw new Error('Member not found')
//   members[index].role = role
//   return members[index]
// }

// export const removeMemberApi = async ({ projectId, memberId }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const members = mockProjectMembers[projectId] || []
//   const index = members.findIndex(m => m.id === memberId)
//   if (index === -1) throw new Error('Member not found')
//   members.splice(index, 1)
//   return { memberId }
// }
import api from './axios'

export const getMembersApi = async (projectId) => {
  // Will be real API when project members endpoint is added
  // For now return empty or mock
  try {
    const res = await api.get(`/projects/${projectId}`)
    const project = res.data
    if (project.squad?.members) {
      return project.squad.members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role === 'Lead' ? 'ADMIN' : 'MEMBER',
        avatar: null,
        joinedAt: m.createdAt,
      }))
    }
    return []
  } catch {
    return []
  }
}

export const inviteMemberApi = async ({ projectId, name, email, role }) => {
  return { id: Date.now().toString(), name, email, role, avatar: null, joinedAt: new Date().toISOString() }
}

export const updateMemberRoleApi = async ({ projectId, memberId, role }) => {
  return { id: memberId, role }
}

export const removeMemberApi = async ({ projectId, memberId }) => {
  return { memberId }
}