import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getSquadsApi, createSquadApi, updateSquadApi, deleteSquadApi,
  addSquadMemberApi, removeSquadMemberApi, updateSquadMemberRoleApi,
} from '../api/squads.api'

export const useSquads = () => useQuery({
  queryKey: ['squads'],
  queryFn: getSquadsApi,
})

export const useCreateSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSquadApi,
    onSuccess: (data) => {
      qc.setQueryData(['squads'], (old = []) => [...old, data])
      toast.success('Squad created!')
    },
    onError: () => toast.error('Failed to create squad'),
  })
}

export const useUpdateSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSquadApi,
    onSuccess: (updated) => {
      qc.setQueryData(['squads'], (old = []) =>
        old.map(s => s.id === updated.id ? updated : s)
      )
      toast.success('Squad updated!')
    },
  })
}

export const useDeleteSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSquadApi,
    onSuccess: (data) => {
      qc.setQueryData(['squads'], (old = []) =>
        old.filter(s => s.id !== data.id)
      )
      toast.success('Squad deleted')
    },
  })
}

export const useAddSquadMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addSquadMemberApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
      toast.success('Member added!')
    },
    onError: (err) => toast.error(err.message || 'Failed to add member'),
  })
}

export const useRemoveSquadMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeSquadMemberApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
      toast.success('Member removed')
    },
  })
}

export const useUpdateSquadMemberRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSquadMemberRoleApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
      toast.success('Role updated!')
    },
  })
}