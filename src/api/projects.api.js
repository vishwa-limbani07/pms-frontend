import api from './axios'

export const getProjectsApi = async () => {
  const res = await api.get('/projects')
  return res.data
}

export const getProjectByIdApi = async (id) => {
  const res = await api.get(`/projects/${id}`)
  return res.data
}

export const createProjectApi = async (data) => {
  const res = await api.post('/projects', data)
  return res.data
}

export const updateProjectApi = async ({ id, ...data }) => {
  const res = await api.put(`/projects/${id}`, data)
  return res.data
}

export const deleteProjectApi = async (id) => {
  const res = await api.delete(`/projects/${id}`)
  return res.data
}