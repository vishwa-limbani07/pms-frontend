import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getCommentsApi, addCommentApi, deleteCommentApi,
  getAttachmentsApi, addAttachmentApi, deleteAttachmentApi,
  getTimeLogsApi, addTimeLogApi, deleteTimeLogApi,
  getSubtasksApi, addSubtaskApi, toggleSubtaskApi, deleteSubtaskApi,
  getLinkedItemsApi, addLinkedItemApi, deleteLinkedItemApi,
} from '../api/taskDetail.api'

// Comments
export const useComments = (taskId) => useQuery({
  queryKey: ['comments', taskId],
  queryFn: () => getCommentsApi(taskId),
  enabled: !!taskId,
})

export const useAddComment = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addCommentApi,
    onSuccess: (data) => {
      qc.setQueryData(['comments', taskId], (old = []) => [...old, data])
    },
    onError: () => toast.error('Failed to add comment'),
  })
}

export const useDeleteComment = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (data) => {
      qc.setQueryData(['comments', taskId], (old = []) => old.filter(c => c.id !== data.id))
    },
  })
}

// Attachments
export const useAttachments = (taskId) => useQuery({
  queryKey: ['attachments', taskId],
  queryFn: () => getAttachmentsApi(taskId),
  enabled: !!taskId,
})

export const useAddAttachment = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addAttachmentApi,
    onSuccess: (data) => {
      qc.setQueryData(['attachments', taskId], (old = []) => [...old, data])
      toast.success('Attachment added')
    },
  })
}

export const useDeleteAttachment = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAttachmentApi,
    onSuccess: (data) => {
      qc.setQueryData(['attachments', taskId], (old = []) => old.filter(a => a.id !== data.id))
      toast.success('Attachment removed')
    },
  })
}

// Time logs
export const useTimeLogs = (taskId) => useQuery({
  queryKey: ['timelogs', taskId],
  queryFn: () => getTimeLogsApi(taskId),
  enabled: !!taskId,
})

export const useAddTimeLog = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addTimeLogApi,
    onSuccess: (data) => {
      qc.setQueryData(['timelogs', taskId], (old = []) => [...old, data])
      toast.success('Time logged!')
    },
    onError: () => toast.error('Failed to log time'),
  })
}

export const useDeleteTimeLog = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTimeLogApi,
    onSuccess: (data) => {
      qc.setQueryData(['timelogs', taskId], (old = []) => old.filter(t => t.id !== data.id))
    },
  })
}

// Subtasks
export const useSubtasks = (taskId) => useQuery({
  queryKey: ['subtasks', taskId],
  queryFn: () => getSubtasksApi(taskId),
  enabled: !!taskId,
})

export const useAddSubtask = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addSubtaskApi,
    onSuccess: (data) => {
      qc.setQueryData(['subtasks', taskId], (old = []) => [...old, data])
    },
    onError: () => toast.error('Failed to add subtask'),
  })
}

export const useToggleSubtask = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleSubtaskApi,
    onSuccess: (data) => {
      qc.setQueryData(['subtasks', taskId], (old = []) =>
        old.map(s => s.id === data.id ? data : s)
      )
    },
  })
}

export const useDeleteSubtask = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSubtaskApi,
    onSuccess: (data) => {
      qc.setQueryData(['subtasks', taskId], (old = []) => old.filter(s => s.id !== data.id))
    },
  })
}

// Linked items
export const useLinkedItems = (taskId) => useQuery({
  queryKey: ['linkedItems', taskId],
  queryFn: () => getLinkedItemsApi(taskId),
  enabled: !!taskId,
})

export const useAddLinkedItem = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addLinkedItemApi,
    onSuccess: (data) => {
      qc.setQueryData(['linkedItems', taskId], (old = []) => [...old, data])
      toast.success('Item linked!')
    },
  })
}

export const useDeleteLinkedItem = (taskId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteLinkedItemApi,
    onSuccess: (data) => {
      qc.setQueryData(['linkedItems', taskId], (old = []) => old.filter(l => l.id !== data.id))
    },
  })
}