// import { mockNotifications } from './mockData'

// export const getNotificationsApi = async () => {
//   await new Promise(r => setTimeout(r, 300))
//   return [...mockNotifications].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   )
// }

// export const markAsReadApi = async (id) => {
//   await new Promise(r => setTimeout(r, 200))
//   const n = mockNotifications.find(n => n.id === id)
//   if (n) n.read = true
//   return { id }
// }

// export const markAllReadApi = async () => {
//   await new Promise(r => setTimeout(r, 300))
//   mockNotifications.forEach(n => n.read = true)
//   return { success: true }
// }

// export const deleteNotificationApi = async (id) => {
//   await new Promise(r => setTimeout(r, 200))
//   const index = mockNotifications.findIndex(n => n.id === id)
//   if (index !== -1) mockNotifications.splice(index, 1)
//   return { id }
// }

// export const clearAllNotificationsApi = async () => {
//   await new Promise(r => setTimeout(r, 300))
//   mockNotifications.length = 0
//   return { success: true }
// }
import api from './axios'

export const getNotificationsApi = async () => {
  const res = await api.get('/notifications')
  return res.data
}

export const markAsReadApi = async (id) => {
  const res = await api.put(`/notifications/${id}/read`)
  return res.data
}

export const markAllReadApi = async () => {
  const res = await api.put('/notifications/read-all')
  return res.data
}

export const deleteNotificationApi = async (id) => {
  const res = await api.delete(`/notifications/${id}`)
  return res.data
}

export const clearAllNotificationsApi = async () => {
  const res = await api.delete('/notifications')
  return res.data
}