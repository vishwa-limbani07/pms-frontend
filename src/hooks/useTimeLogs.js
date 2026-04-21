import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllTimeLogsApi, addTimeLogApi, deleteTimeLogApi } from '../api/timeLogs.api'

export const useAllTimeLogs = () => useQuery({
  queryKey: ['all-timelogs'],
  queryFn: getAllTimeLogsApi,
})

export const useAddTimeLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addTimeLogApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all-timelogs'] })
    },
  })
}

export const useDeleteTimeLog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTimeLogApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all-timelogs'] })
    },
  })
}