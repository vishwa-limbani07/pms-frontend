import api from './axios'

export const getAllTimeLogsApi = async () => {
  const res = await api.get('/timelogs')
  return res.data
}

export const addTimeLogApi = async ({ taskId, duration, note }) => {
  const res = await api.post(`/tasks/${taskId}/timelogs`, { duration, note })
  return res.data
}

export const deleteTimeLogApi = async (id) => {
  const res = await api.delete(`/tasks/timelogs/${id}`)
  return res.data
}