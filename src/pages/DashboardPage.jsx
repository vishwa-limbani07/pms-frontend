import { useNavigate } from 'react-router-dom'
import { FolderKanban, CheckSquare, Clock, TrendingUp, ArrowRight, Circle } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { useAuthStore } from '../store/authStore'
// import { mockTasks } from '../api/mockData'
import { useTasks } from '../hooks/useTasks'

import { formatDate } from '../utils/formatDate'

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
  MEDIUM: { label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  LOW:    { label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
}

const statusConfig = {
  TODO:        { label: 'To Do',       class: 'text-gray-400' },
  IN_PROGRESS: { label: 'In Progress', class: 'text-blue-500' },
  REVIEW:      { label: 'Review',      class: 'text-amber-500' },
  DONE:        { label: 'Done',        class: 'text-green-500' },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: projects = [], isLoading } = useProjects()

  // const myTasks = mockTasks.filter(t => t.assignee?.id === user?.id)
  // const totalTasks = mockTasks.length
  // const inProgress = mockTasks.filter(t => t.status === 'IN_PROGRESS').length
  // const done = mockTasks.filter(t => t.status === 'DONE').length
const firstProject = projects[0]
const { data: allTasks = [] } = useTasks(firstProject?.id)
const myTasks = allTasks.filter(t => t.assignee?.id === user?.id || t.assigneeId === user?.id)
const totalTasks = allTasks.length
const inProgress = allTasks.filter(t => t.status === 'IN_PROGRESS').length
const done = allTasks.filter(t => t.status === 'DONE').length
  const stats = [
    { label: 'Total projects', value: projects.length, icon: FolderKanban, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total tasks',    value: totalTasks,       icon: CheckSquare,  color: 'bg-purple-50 text-purple-600' },
    { label: 'In progress',    value: inProgress,       icon: Clock,        color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed',      value: done,             icon: TrendingUp,   color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => Icon && (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* My Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm">My tasks</h3>
            <span className="text-xs text-gray-400">{myTasks.length} tasks</span>
          </div>
          <div className="divide-y divide-gray-100">
            {myTasks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No tasks assigned to you</p>
            )}
            {myTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition">
                <Circle
                  size={16}
                  className={`flex-shrink-0 ${statusConfig[task.status]?.class}`}
                  fill={task.status === 'DONE' ? 'currentColor' : 'none'}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Due {formatDate(task.dueDate)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityConfig[task.priority]?.class}`}>
                  {priorityConfig[task.priority]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm">Recent projects</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {projects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{project.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{project.taskCount} tasks · {project.memberCount} members</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}