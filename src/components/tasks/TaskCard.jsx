import { useState } from 'react'
import { Trash2, Calendar } from 'lucide-react'
import { useDeleteTask } from '../../hooks/useTasks'
import { formatDate, isOverdue } from '../../utils/formatDate'
import TaskDetailDrawer from './TaskDetailDrawer'

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
  MEDIUM: { label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  LOW:    { label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
}

export default function TaskCard({ task, projectId }) {
  const { mutate: deleteTask } = useDeleteTask(projectId)
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setDrawerOpen(true)}
        className="bg-white rounded-lg border border-gray-200 p-3.5 hover:border-gray-300
          hover:shadow-sm transition-all group cursor-pointer"
      >
        {/* Priority badge + delete */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority]?.class}`}>
            {priorityConfig[task.priority]?.label}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id) }}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
              justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500
              transition cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-gray-800 leading-snug mb-3">{task.title}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {task.dueDate ? (
            <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
              <Calendar size={11} />
              {formatDate(task.dueDate)}
            </div>
          ) : <span />}

          {task.assignee && (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xs font-semibold">
                {task.assignee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <TaskDetailDrawer
          task={task}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  )
}