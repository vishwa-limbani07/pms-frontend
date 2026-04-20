// import api from './axios'
import { mockProjects } from './mockData'

export const getProjectsApi = async () => {
  await new Promise(r => setTimeout(r, 500))
  return mockProjects
  // REAL: const res = await api.get('/projects'); return res.data
}

export const createProjectApi = async (data) => {
  await new Promise(r => setTimeout(r, 600))
  return { ...data, id: Date.now().toString(), memberCount: 1, taskCount: 0, createdAt: new Date().toISOString() }
  // REAL: const res = await api.post('/projects', data); return res.data
}

export const updateProjectApi = async ({ id, ...data }) => {
  await new Promise(r => setTimeout(r, 500))
  return { id, ...data }
  // REAL: const res = await api.put(`/projects/${id}`, data); return res.data
}

export const deleteProjectApi = async (id) => {
  await new Promise(r => setTimeout(r, 500))
  return { id }
  // REAL: await api.delete(`/projects/${id}`); return { id }
}