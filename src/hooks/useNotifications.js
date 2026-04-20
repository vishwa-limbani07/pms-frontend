import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getNotificationsApi, markAsReadApi, markAllReadApi,
  deleteNotificationApi, clearAllNotificationsApi,
} from '../api/notifications.api'

export const useNotifications = () => useQuery({
  queryKey: ['notifications'],
  queryFn: getNotificationsApi,
  refetchInterval: 30000,
})

export const useMarkAsRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsReadApi,
    onSuccess: (data) => {
      qc.setQueryData(['notifications'], (old = []) =>
        old.map(n => n.id === data.id ? { ...n, read: true } : n)
      )
    },
  })
}

export const useMarkAllRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllReadApi,
    onSuccess: () => {
      qc.setQueryData(['notifications'], (old = []) =>
        old.map(n => ({ ...n, read: true }))
      )
      toast.success('All marked as read')
    },
  })
}

export const useDeleteNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: (data) => {
      qc.setQueryData(['notifications'], (old = []) =>
        old.filter(n => n.id !== data.id)
      )
    },
  })
}

export const useClearAllNotifications = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearAllNotificationsApi,
    onSuccess: () => {
      qc.setQueryData(['notifications'], [])
      toast.success('All notifications cleared')
    },
  })
}