import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSquadsApi, createSquadApi, updateSquadApi, deleteSquadApi,
  addSquadMemberApi, removeSquadMemberApi, updateSquadMemberRoleApi
} from '../api/squads.api'

export const useSquads = () => useQuery({
  queryKey: ['squads'],
  queryFn: getSquadsApi,
})

export const useCreateSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSquadApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useUpdateSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSquadApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useDeleteSquad = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSquadApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useAddSquadMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addSquadMemberApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useRemoveSquadMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeSquadMemberApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}

export const useUpdateSquadMemberRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSquadMemberRoleApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['squads'] })
    },
  })
}