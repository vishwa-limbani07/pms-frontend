import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getMembersApi, inviteMemberApi,
  updateMemberRoleApi, removeMemberApi
} from '../api/members.api'

export const useMembers = (projectId) => useQuery({
  queryKey: ['members', projectId],
  queryFn: () => getMembersApi(projectId),
  enabled: !!projectId,
})

export const useInviteMember = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inviteMemberApi,
    onSuccess: (data) => {
      qc.setQueryData(['members', projectId], (old = []) => [...old, data])
      toast.success('Member invited!')
    },
    onError: (err) => toast.error(err.message || 'Failed to invite member'),
  })
}

export const useUpdateMemberRole = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateMemberRoleApi,
    onSuccess: (updated) => {
      qc.setQueryData(['members', projectId], (old = []) =>
        old.map(m => m.id === updated.id ? updated : m)
      )
      toast.success('Role updated!')
    },
    onError: () => toast.error('Failed to update role'),
  })
}

export const useRemoveMember = (projectId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeMemberApi,
    onSuccess: (data) => {
      qc.setQueryData(['members', projectId], (old = []) =>
        old.filter(m => m.id !== data.memberId)
      )
      toast.success('Member removed')
    },
    onError: () => toast.error('Failed to remove member'),
  })
}