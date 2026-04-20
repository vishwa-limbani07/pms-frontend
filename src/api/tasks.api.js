// // // import api from './axios'
// // import { mockTasks } from './mockData'

// // export const getTasksApi = async (projectId) => {
// //   await new Promise(r => setTimeout(r, 500))
// //   return mockTasks.filter(t => t.projectId === projectId)
// //   // REAL: const res = await api.get(`/projects/${projectId}/tasks`); return res.data
// // }

// // export const createTaskApi = async ({ projectId, ...data }) => {
// //   await new Promise(r => setTimeout(r, 600))
// //   return { ...data, id: Date.now().toString(), projectId, status: 'TODO' }
// //   // REAL: const res = await api.post(`/projects/${projectId}/tasks`, data); return res.data
// // }

// // export const updateTaskApi = async ({ id, ...data }) => {
// //   await new Promise(r => setTimeout(r, 400))
// //   return { id, ...data }
// //   // REAL: const res = await api.put(`/tasks/${id}`, data); return res.data
// // }

// // export const updateTaskStatusApi = async ({ id, status }) => {
// //   await new Promise(r => setTimeout(r, 300))
// //   return { id, status }
// //   // REAL: const res = await api.put(`/tasks/${id}/status`, { status }); return res.data
// // }

// // export const deleteTaskApi = async (id) => {
// //   await new Promise(r => setTimeout(r, 400))
// //   return { id }
// //   // REAL: await api.delete(`/tasks/${id}`); return { id }
// // }
// import { mockTasks } from './mockData'

// export const getTasksApi = async (projectId) => {
//   await new Promise(r => setTimeout(r, 400))
//   return mockTasks.filter(t => t.projectId === projectId)
// }

// export const createTaskApi = async ({ projectId, ...data }) => {
//   await new Promise(r => setTimeout(r, 500))
//   const newTask = {
//     ...data,
//     id: Date.now().toString(),
//     projectId,
//     status: 'TODO',
//     createdAt: new Date().toISOString(),
//   }
//   mockTasks.push(newTask)
//   return newTask
// }

// export const updateTaskApi = async ({ id, ...data }) => {
//   await new Promise(r => setTimeout(r, 400))
//   const index = mockTasks.findIndex(t => t.id === id)
//   if (index === -1) throw new Error('Task not found')
//   mockTasks[index] = { ...mockTasks[index], ...data }
//   return mockTasks[index]
// }

// export const updateTaskStatusApi = async ({ id, status }) => {
//   await new Promise(r => setTimeout(r, 300))
//   const index = mockTasks.findIndex(t => t.id === id)
//   if (index === -1) throw new Error('Task not found')
//   mockTasks[index].status = status
//   return mockTasks[index]
// }

// export const deleteTaskApi = async (id) => {
//   await new Promise(r => setTimeout(r, 400))
//   const index = mockTasks.findIndex(t => t.id === id)
//   if (index === -1) throw new Error('Task not found')
//   mockTasks.splice(index, 1)
//   return { id }
// }
import api from './axios'

export const getTasksApi = async (projectId) => {
  const res = await api.get(`/tasks/project/${projectId}`)
  return res.data
}

export const createTaskApi = async ({ projectId, ...data }) => {
  const res = await api.post('/tasks', { projectId, ...data })
  return res.data
}

export const updateTaskApi = async ({ id, ...data }) => {
  const res = await api.put(`/tasks/${id}`, data)
  return res.data
}

export const updateTaskStatusApi = async ({ id, status }) => {
  const res = await api.put(`/tasks/${id}/status`, { status })
  return res.data
}

export const deleteTaskApi = async (id) => {
  const res = await api.delete(`/tasks/${id}`)
  return res.data
}