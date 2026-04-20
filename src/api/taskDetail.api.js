// import {
//   mockComments, mockAttachments, mockTimeLogs,
//   mockSubtasks, mockLinkedItems, mockTasks
// } from './mockData'
// 
// // Comments
// export const getCommentsApi = async (taskId) => {
//   await new Promise(r => setTimeout(r, 300))
//   return mockComments.filter(c => c.taskId === taskId)
// }

// export const addCommentApi = async ({ taskId, text, author }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const comment = { id: Date.now().toString(), taskId, text, author, createdAt: new Date().toISOString() }
//   mockComments.push(comment)
//   return comment
// }

// export const deleteCommentApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockComments.findIndex(c => c.id === id)
//   if (index !== -1) mockComments.splice(index, 1)
//   return { id }
// }

// // Attachments
// export const getAttachmentsApi = async (taskId) => {
//   await new Promise(r => setTimeout(r, 300))
//   return mockAttachments.filter(a => a.taskId === taskId)
// }

// export const addAttachmentApi = async ({ taskId, name, size, type, uploadedBy }) => {
//   await new Promise(r => setTimeout(r, 500))
//   const attachment = { id: Date.now().toString(), taskId, name, size, type, uploadedBy, createdAt: new Date().toISOString() }
//   mockAttachments.push(attachment)
//   return attachment
// }

// export const deleteAttachmentApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockAttachments.findIndex(a => a.id === id)
//   if (index !== -1) mockAttachments.splice(index, 1)
//   return { id }
// }

// // Time logs
// export const getTimeLogsApi = async (taskId) => {
//   await new Promise(r => setTimeout(r, 300))
//   return mockTimeLogs.filter(t => t.taskId === taskId)
// }

// export const addTimeLogApi = async ({ taskId, duration, note, loggedBy }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const log = { id: Date.now().toString(), taskId, duration: Number(duration), note, loggedBy, createdAt: new Date().toISOString() }
//   mockTimeLogs.push(log)
//   return log
// }

// export const deleteTimeLogApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockTimeLogs.findIndex(t => t.id === id)
//   if (index !== -1) mockTimeLogs.splice(index, 1)
//   return { id }
// }

// // Subtasks
// export const getSubtasksApi = async (taskId) => {
//   await new Promise(r => setTimeout(r, 300))
//   return mockSubtasks.filter(s => s.taskId === taskId)
// }

// export const addSubtaskApi = async ({ taskId, title }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const subtask = { id: Date.now().toString(), taskId, title, done: false }
//   mockSubtasks.push(subtask)
//   return subtask
// }

// export const toggleSubtaskApi = async ({ id, done }) => {
//   await new Promise(r => setTimeout(r, 200))
//   const index = mockSubtasks.findIndex(s => s.id === id)
//   if (index !== -1) mockSubtasks[index].done = done
//   return mockSubtasks[index]
// }

// export const deleteSubtaskApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockSubtasks.findIndex(s => s.id === id)
//   if (index !== -1) mockSubtasks.splice(index, 1)
//   return { id }
// }

// // Linked items
// export const getLinkedItemsApi = async (taskId) => {
//   await new Promise(r => setTimeout(r, 300))
//   const links = mockLinkedItems.filter(l => l.taskId === taskId)
//   return links.map(l => ({
//     ...l,
//     linkedTask: mockTasks.find(t => t.id === l.linkedTaskId)
//   })).filter(l => l.linkedTask)
// }

// export const addLinkedItemApi = async ({ taskId, linkedTaskId, type }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const link = { id: Date.now().toString(), taskId, linkedTaskId, type }
//   mockLinkedItems.push(link)
//   return { ...link, linkedTask: mockTasks.find(t => t.id === linkedTaskId) }
// }

// export const deleteLinkedItemApi = async (id) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockLinkedItems.findIndex(l => l.id === id)
//   if (index !== -1) mockLinkedItems.splice(index, 1)
//   return { id }
// }
import api from './axios'

// Comments
export const getCommentsApi = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}/comments`)
  return res.data
}

export const addCommentApi = async ({ taskId, text }) => {
  const res = await api.post(`/tasks/${taskId}/comments`, { text })
  return res.data
}

export const deleteCommentApi = async (id) => {
  const res = await api.delete(`/tasks/comments/${id}`)
  return res.data
}

// Attachments — keep mock for now (no file upload backend yet)
export const getAttachmentsApi = async () => {
  return []
}

export const addAttachmentApi = async (data) => {
  return { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
}

export const deleteAttachmentApi = async (id) => {
  return { id }
}

// Time logs
export const getTimeLogsApi = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}/timelogs`)
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

// Subtasks — keep mock for now (subtasks use parent task relation)
import { mockSubtasks } from './mockData'

export const getSubtasksApi = async (taskId) => {
  return mockSubtasks.filter(s => s.taskId === taskId)
}

export const addSubtaskApi = async ({ taskId, title }) => {
  const subtask = { id: Date.now().toString(), taskId, title, done: false }
  mockSubtasks.push(subtask)
  return subtask
}

export const toggleSubtaskApi = async ({ id, done }) => {
  const index = mockSubtasks.findIndex(s => s.id === id)
  if (index !== -1) mockSubtasks[index].done = done
  return mockSubtasks[index]
}

export const deleteSubtaskApi = async (id) => {
  const index = mockSubtasks.findIndex(s => s.id === id)
  if (index !== -1) mockSubtasks.splice(index, 1)
  return { id }
}

// Linked items
export const getLinkedItemsApi = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}/linked`)
  return res.data
}

export const addLinkedItemApi = async ({ taskId, linkedTaskId, type }) => {
  const res = await api.post(`/tasks/${taskId}/linked`, { linkedTaskId, type })
  return res.data
}

export const deleteLinkedItemApi = async (id) => {
  const res = await api.delete(`/tasks/linked/${id}`)
  return res.data
}