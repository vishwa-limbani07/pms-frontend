// import { mockSquads } from './mockData'

// export const getSquadsApi = async () => {
//   await new Promise(r => setTimeout(r, 400))
//   return [...mockSquads]
// }

// export const getSquadByIdApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   return mockSquads.find(s => s.id === id) || null
// }

// export const createSquadApi = async (data) => {
//   await new Promise(r => setTimeout(r, 600))
//   const newSquad = {
//     ...data,
//     id: Date.now().toString(),
//     members: [],
//     createdAt: new Date().toISOString(),
//   }
//   mockSquads.push(newSquad)
//   return newSquad
// }

// export const updateSquadApi = async ({ id, ...data }) => {
//   await new Promise(r => setTimeout(r, 500))
//   const index = mockSquads.findIndex(s => s.id === id)
//   if (index === -1) throw new Error('Squad not found')
//   mockSquads[index] = { ...mockSquads[index], ...data }
//   return mockSquads[index]
// }

// export const deleteSquadApi = async (id) => {
//   await new Promise(r => setTimeout(r, 400))
//   const index = mockSquads.findIndex(s => s.id === id)
//   if (index === -1) throw new Error('Squad not found')
//   mockSquads.splice(index, 1)
//   return { id }
// }

// export const addSquadMemberApi = async ({ squadId, name, email, role }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const squad = mockSquads.find(s => s.id === squadId)
//   if (!squad) throw new Error('Squad not found')
//   if (squad.members.find(m => m.email === email)) throw new Error('Already a member')
//   const member = { id: Date.now().toString(), name, email, role }
//   squad.members.push(member)
//   return member
// }

// export const removeSquadMemberApi = async ({ squadId, memberId }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const squad = mockSquads.find(s => s.id === squadId)
//   if (!squad) throw new Error('Squad not found')
//   const index = squad.members.findIndex(m => m.id === memberId)
//   if (index === -1) throw new Error('Member not found')
//   squad.members.splice(index, 1)
//   return { memberId }
// }

// export const updateSquadMemberRoleApi = async ({ squadId, memberId, role }) => {
//   await new Promise(r => setTimeout(r, 300))
//   const squad = mockSquads.find(s => s.id === squadId)
//   if (!squad) throw new Error('Squad not found')
//   const member = squad.members.find(m => m.id === memberId)
//   if (!member) throw new Error('Member not found')
//   member.role = role
//   return member
// }
import api from './axios'

export const getSquadsApi = async () => {
  const res = await api.get('/squads')
  return res.data
}

export const createSquadApi = async (data) => {
  const res = await api.post('/squads', data)
  return res.data
}

export const updateSquadApi = async ({ id, ...data }) => {
  const res = await api.put(`/squads/${id}`, data)
  return res.data
}

export const deleteSquadApi = async (id) => {
  const res = await api.delete(`/squads/${id}`)
  return res.data
}

export const addSquadMemberApi = async ({ squadId, email, name, role }) => {
  const res = await api.post(`/squads/${squadId}/members`, { email, name, role })
  return res.data
}

export const removeSquadMemberApi = async ({ squadId, memberId }) => {
  const res = await api.delete(`/squads/${squadId}/members/${memberId}`)
  return res.data
}

export const updateSquadMemberRoleApi = async ({ squadId, memberId, role }) => {
  const res = await api.put(`/squads/${squadId}/members/${memberId}`, { role })
  return res.data
}