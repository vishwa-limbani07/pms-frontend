import { mockProjectMembers } from './mockData'

export const getMembersApi = async (projectId) => {
  await new Promise(r => setTimeout(r, 400))
  return mockProjectMembers[projectId] || []
}

export const inviteMemberApi = async ({ projectId, name, email, role }) => {
  await new Promise(r => setTimeout(r, 600))
  const existing = (mockProjectMembers[projectId] || []).find(m => m.email === email)
  if (existing) throw new Error('Member already exists in this project')
  const newMember = {
    id: Date.now().toString(), name, email, role,
    avatar: null, joinedAt: new Date().toISOString()
  }
  if (!mockProjectMembers[projectId]) mockProjectMembers[projectId] = []
  mockProjectMembers[projectId].push(newMember)
  return newMember
}

export const updateMemberRoleApi = async ({ projectId, memberId, role }) => {
  await new Promise(r => setTimeout(r, 400))
  const members = mockProjectMembers[projectId] || []
  const index = members.findIndex(m => m.id === memberId)
  if (index === -1) throw new Error('Member not found')
  members[index].role = role
  return members[index]
}

export const removeMemberApi = async ({ projectId, memberId }) => {
  await new Promise(r => setTimeout(r, 400))
  const members = mockProjectMembers[projectId] || []
  const index = members.findIndex(m => m.id === memberId)
  if (index === -1) throw new Error('Member not found')
  members.splice(index, 1)
  return { memberId }
}