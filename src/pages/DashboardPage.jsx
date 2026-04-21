import { useNavigate } from 'react-router-dom'
import {
  FolderKanban, CheckSquare, Clock, TrendingUp, ArrowRight,
  Circle, Plus, Users, BarChart3, Zap, CalendarDays,
  ChevronRight, ArrowUpRight, Timer
} from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { useAuthStore } from '../store/authStore'
import { formatDate, isOverdue } from '../utils/formatDate'

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
  MEDIUM: { label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  LOW:    { label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
}

const statusConfig = {
  TODO:        { label: 'To Do',       dotClass: 'bg-gray-400' },
  IN_PROGRESS: { label: 'In Progress', dotClass: 'bg-blue-500' },
  REVIEW:      { label: 'Review',      dotClass: 'bg-amber-500' },
  DONE:        { label: 'Done',        dotClass: 'bg-green-500' },
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getMotivation() {
  const messages = [
    "Let's make today productive!",
    "Ready to crush some tasks?",
    "Your team is counting on you!",
    "Great things are built one task at a time.",
    "Focus on what matters most today.",
  ]
  return messages[new Date().getDate() % messages.length]
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: projects = [], isLoading } = useProjects()

  const firstProject = projects[0]
  const { data: allTasks = [] } = useTasks(firstProject?.id)

  const myTasks = allTasks.filter(t => t.assignee?.id === user?.id || t.assigneeId === user?.id)
  const totalTasks = allTasks.length
  const inProgress = allTasks.filter(t => t.status === 'IN_PROGRESS').length
  const done = allTasks.filter(t => t.status === 'DONE').length
  const overdue = allTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'DONE').length
  const completionRate = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0

  const firstName = user?.name?.split(' ')[0] || 'there'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  const todoCount = allTasks.filter(t => t.status === 'TODO').length
  const reviewCount = allTasks.filter(t => t.status === 'REVIEW').length

  const quickActions = [
    {
      icon: Plus, label: 'New task', desc: 'Create a task',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-100',
      onClick: () => projects[0] && navigate(`/projects/${projects[0].id}`),
    },
    {
      icon: FolderKanban, label: 'New project', desc: 'Start a project',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-100',
      onClick: () => navigate('/projects'),
    },
    {
      icon: Users, label: 'Manage squad', desc: 'Team members',
      color: 'bg-green-50 text-green-600 border-green-100',
      iconBg: 'bg-green-100',
      onClick: () => navigate('/squads'),
    },
    {
      icon: BarChart3, label: 'Analytics', desc: 'View reports',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-100',
      onClick: () => projects[0] && navigate(`/projects/${projects[0].id}`),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center
              justify-center border border-white/20">
              <span className="text-white text-lg font-bold">{initials}</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {getGreeting()}, {firstName}!
              </h2>
              <p className="text-blue-100 text-sm mt-0.5">{getMotivation()}</p>
            </div>
          </div>

          {/* Quick stats in banner */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <p className="text-blue-200 text-xs">Projects</p>
              <p className="text-white text-lg font-bold">{projects.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <p className="text-blue-200 text-xs">Tasks</p>
              <p className="text-white text-lg font-bold">{totalTasks}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <p className="text-blue-200 text-xs">Done</p>
              <p className="text-white text-lg font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map(({ icon: Icon, label, desc, color, iconBg, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-xl border transition
              hover:shadow-sm cursor-pointer text-left group ${color}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{label}</p>
              <p className="text-xs opacity-70 truncate">{desc}</p>
            </div>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-60 transition flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* ── Kanban summary strip ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Task overview</h3>
          {projects[0] && (
            <button
              onClick={() => navigate(`/projects/${projects[0].id}`)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Open board <ArrowUpRight size={12} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { status: 'TODO', count: todoCount, label: 'To do', color: 'bg-gray-400', bg: 'bg-gray-50' },
            { status: 'IN_PROGRESS', count: inProgress, label: 'In progress', color: 'bg-blue-500', bg: 'bg-blue-50' },
            { status: 'REVIEW', count: reviewCount, label: 'In review', color: 'bg-amber-500', bg: 'bg-amber-50' },
            { status: 'DONE', count: done, label: 'Completed', color: 'bg-green-500', bg: 'bg-green-50' },
          ].map(col => (
            <div key={col.status} className={`rounded-xl p-4 ${col.bg} text-center`}>
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 ${col.color}`} />
              <p className="text-2xl font-bold text-gray-900">{col.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{col.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Sprint progress</span>
              <span className="text-xs font-semibold text-gray-700">{completionRate}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {done > 0 && (
                <div className="bg-green-500 h-full transition-all duration-500"
                  style={{ width: `${(done / totalTasks) * 100}%` }} />
              )}
              {inProgress > 0 && (
                <div className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${(inProgress / totalTasks) * 100}%` }} />
              )}
              {reviewCount > 0 && (
                <div className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${(reviewCount / totalTasks) * 100}%` }} />
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Done
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> In progress
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Review
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main content: Tasks + Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* My Tasks — takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm">My tasks</h3>
              {overdue > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 font-medium">
                  {overdue} overdue
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{myTasks.length} assigned</span>
          </div>

          {myTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <CheckSquare size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No tasks assigned</p>
              <p className="text-xs text-gray-400">Tasks assigned to you will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {myTasks.slice(0, 6).map(task => {
                const taskOverdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                return (
                  <div key={task.id}
                    onClick={() => navigate(`/projects/${task.projectId}`)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50
                      transition cursor-pointer group">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0
                      ${statusConfig[task.status]?.dotClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate group-hover:text-blue-600 transition
                        ${task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 text-xs
                            ${taskOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                            <CalendarDays size={10} />
                            {formatDate(task.dueDate)}
                            {taskOverdue && <span className="font-medium">(overdue)</span>}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                      ${priorityConfig[task.priority]?.class}`}>
                      {priorityConfig[task.priority]?.label}
                    </span>
                    <ArrowRight size={14} className="text-gray-200 group-hover:text-blue-400
                      transition flex-shrink-0" />
                  </div>
                )
              })}
            </div>
          )}

          {myTasks.length > 6 && (
            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <button className="text-xs text-blue-600 hover:underline cursor-pointer">
                View all {myTasks.length} tasks
              </button>
            </div>
          )}
        </div>

        {/* Activity timeline sidebar */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent projects</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              All <ArrowRight size={11} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <FolderKanban size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No projects yet</p>
              <p className="text-xs text-gray-400 mb-3">Create your first project</p>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Create project
              </button>
            </div>
          ) : (
            <div className="px-5 py-3">
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gray-200" />

                <div className="space-y-1">
                  {projects.slice(0, 5).map((project, i) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="relative flex items-start gap-4 p-3 rounded-xl
                        hover:bg-gray-50 transition cursor-pointer group"
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 w-6 h-6 rounded-lg flex items-center
                        justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: project.color }}>
                        {project.name[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate
                          group-hover:text-blue-600 transition">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <CheckSquare size={10} /> {project.taskCount}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Users size={10} /> {project.memberCount}
                          </span>
                        </div>
                      </div>

                      <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-400
                        transition flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total projects', value: projects.length, icon: FolderKanban,
            color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2 this month' },
          { label: 'Active tasks', value: inProgress + todoCount, icon: Zap,
            color: 'text-purple-600', bg: 'bg-purple-50', trend: `${inProgress} in progress` },
          { label: 'Completed', value: done, icon: CheckSquare,
            color: 'text-green-600', bg: 'bg-green-50', trend: `${completionRate}% rate` },
          { label: 'Overdue', value: overdue, icon: Timer,
            color: overdue > 0 ? 'text-red-600' : 'text-gray-400',
            bg: overdue > 0 ? 'bg-red-50' : 'bg-gray-50',
            trend: overdue > 0 ? 'Needs attention' : 'All on track' },
        ].map(({ label, value, icon: Icon, color, bg, trend }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4
            hover:shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{trend}</p>
          </div>
        ))}
      </div>
    </div>
  )
}