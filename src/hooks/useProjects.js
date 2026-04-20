// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import toast from 'react-hot-toast'
// import { getProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../api/projects.api'

// export const useProjects = () => useQuery({
//   queryKey: ['projects'],
//   queryFn: getProjectsApi,
// })

// export const useCreateProject = () => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: createProjectApi,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['projects'] })
//       toast.success('Project created!')
//     },
//     onError: () => toast.error('Failed to create project'),
//   })
// }

// export const useDeleteProject = () => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: deleteProjectApi,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['projects'] })
//       toast.success('Project deleted')
//     },
//   })
// }
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi
} from '../api/projects.api'

export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: getProjectsApi,
})

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: (newProject) => {
      qc.setQueryData(['projects'], (old = []) => [...old, newProject])
      toast.success('Project created!')
    },
    onError: () => toast.error('Failed to create project'),
  })
}

export const useUpdateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateProjectApi,
    onSuccess: (updated) => {
      qc.setQueryData(['projects'], (old = []) =>
        old.map(p => p.id === updated.id ? updated : p)
      )
      toast.success('Project updated!')
    },
    onError: () => toast.error('Failed to update project'),
  })
}

export const useDeleteProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: (_, id) => {
      qc.setQueryData(['projects'], (old = []) =>
        old.filter(p => p.id !== id)
      )
      toast.success('Project deleted')
    },
    onError: () => toast.error('Failed to delete project'),
  })
}