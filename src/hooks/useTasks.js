// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import toast from 'react-hot-toast'
// import { getTasksApi, createTaskApi, updateTaskApi, updateTaskStatusApi, deleteTaskApi } from '../api/tasks.api'

// export const useTasks = (projectId) => useQuery({
//   queryKey: ['tasks', projectId],
//   queryFn: () => getTasksApi(projectId),
//   enabled: !!projectId,
// })

// export const useCreateTask = (projectId) => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: createTaskApi,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['tasks', projectId] })
//       toast.success('Task created!')
//     },
//   })
// }

// export const useUpdateTaskStatus = (projectId) => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: updateTaskStatusApi,
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
//   })
// }

// export const useDeleteTask = (projectId) => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: deleteTaskApi,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['tasks', projectId] })
//       toast.success('Task deleted')
//     },
//   })
// }
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getTasksApi, createTaskApi, updateTaskApi,
  updateTaskStatusApi, deleteTaskApi
} from '../api/tasks.api'

export const useTasks = (projectId) => useQuery({
  queryKey: ['tasks', projectId],
  queryFn: () => getTasksApi(projectId),
  enabled: !!projectId,
})

export const useCreateTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: (newTask) => {
      qc.setQueryData(['tasks', projectId], (old = []) => [...old, newTask])
      toast.success('Task created!')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

export const useUpdateTaskStatus = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateTaskStatusApi,
    onSuccess: (updated) => {
      qc.setQueryData(['tasks', projectId], (old = []) =>
        old.map(t => t.id === updated.id ? updated : t)
      )
    },
  })
}

export const useDeleteTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: (data) => {
      qc.setQueryData(['tasks', projectId], (old = []) =>
        old.filter(t => t.id !== data.id)
      )
      toast.success('Task deleted')
    },
  })
}
export const useUpdateTask = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateTaskApi,
    onSuccess: (updated) => {
      qc.setQueryData(['tasks', projectId], (old = []) =>
        old.map(t => t.id === updated.id ? updated : t)
      )
    },
    onError: () => toast.error('Failed to update task'),
  })
}