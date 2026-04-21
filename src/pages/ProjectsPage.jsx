import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, FolderKanban, Trash2, ArrowRight, Users, CheckSquare,
  Search, LayoutGrid, Calendar, Target, TrendingUp, ArrowUpRight,
  Clock, ChevronRight, Layers, BarChart3, ExternalLink, Filter
} from 'lucide-react'
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects'
import { useSquads } from '../hooks/useSquads'
import { useTasks } from '../hooks/useTasks'
import { formatDate } from '../utils/formatDate'

const PROJECT_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#84CC16',
]

const statusConfig = {
  TODO:        { label: 'To Do',       dot: 'bg-gray-400',  bg: 'bg-gray-50 text-gray-600' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-blue-500',  bg: 'bg-blue-50 text-blue-600' },
  REVIEW:      { label: 'Review',      dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-600' },
  DONE:        { label: 'Done',        dot: 'bg-green-500', bg: 'bg-green-50 text-green-600' },
}

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
  MEDIUM: { label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  LOW:    { label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
}

// ── Create Project Modal ─────────────────────────────────────
function CreateProjectModal({ onClose, squads }) {
  const { mutate: createProject, isPending } = useCreateProject()
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0])
  const [selectedSquad, setSelectedSquad] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    createProject(
      { name: name.trim(), description: description.trim(), color: selectedColor, squadId: selectedSquad || null },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Create new project</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add a new project to your workspace</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. E-Commerce App" autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description
              <span className="text-gray-400 font-normal"> (optional)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What's this project about?" rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map(color => (
                <button key={color} type="button" onClick={() => setSelectedColor(color)}
                  className="w-7 h-7 rounded-full hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color,
                    outline: selectedColor === color ? `3px solid ${color}` : 'none',
                    outlineOffset: '2px' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign squad
              <span className="text-gray-400 font-normal"> (optional)</span></label>
            <select value={selectedSquad} onChange={e => setSelectedSquad(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
              <option value="">No squad assigned</option>
              {squads.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.members.length} members)</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: selectedColor }}>{name ? name[0].toUpperCase() : 'P'}</div>
            <div>
              <p className="text-sm font-medium text-gray-800">{name || 'Project name'}</p>
              <p className="text-xs text-gray-400">{description || 'No description'}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending || !name.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium cursor-pointer">
              {isPending ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Preview Panel ────────────────────────────────────────────
function ProjectPreview({ project, squads }) {
  const navigate = useNavigate()
  const { data: tasks = [], isLoading } = useTasks(project.id)
  const squad = squads.find(s => s.id === project.squadId)

  const done = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const review = tasks.filter(t => t.status === 'REVIEW').length
  const overdue = tasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
  ).length
  const completionRate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white
              text-base font-bold" style={{ backgroundColor: project.color }}>
              {project.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{project.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Created {formatDate(project.createdAt)}
                {squad && <span> · {squad.name}</span>}
              </p>
            </div>
          </div>
          <button onClick={() => navigate(`/projects/${project.id}`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700
              text-white text-xs font-medium rounded-lg transition cursor-pointer">
            Open <ExternalLink size={12} />
          </button>
        </div>

        {project.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
        )}
      </div>

      {/* Stats grid */}
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total tasks', value: tasks.length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: done, icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'In progress', value: inProgress, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Overdue', value: overdue, icon: Clock, color: overdue > 0 ? 'text-red-600' : 'text-gray-400', bg: overdue > 0 ? 'bg-red-50' : 'bg-gray-50' },
          ].map(stat => (
            <div key={stat.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={13} className={stat.color} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Overall progress</span>
            <span className="text-xs font-bold text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
            {done > 0 && <div className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(done / tasks.length) * 100}%` }} />}
            {review > 0 && <div className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${(review / tasks.length) * 100}%` }} />}
            {inProgress > 0 && <div className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(inProgress / tasks.length) * 100}%` }} />}
          </div>
          <div className="flex items-center gap-4 mt-2">
            {[
              { label: 'Done', count: done, color: 'bg-green-500' },
              { label: 'Review', count: review, color: 'bg-amber-400' },
              { label: 'In Progress', count: inProgress, color: 'bg-blue-500' },
              { label: 'To Do', count: todo, color: 'bg-gray-300' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-xs text-gray-500">{s.label} ({s.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Squad members */}
      {squad && squad.members.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-900">
              Squad · {squad.name}
            </span>
            <span className="text-xs text-gray-400">{squad.members.length} members</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {squad.members.map(m => {
              const initials = m.name.split(' ').map(n => n[0]).join('').toUpperCase()
              const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
                'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600']
              const c = colors[m.name.charCodeAt(0) % colors.length]
              return (
                <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50"
                  title={m.name}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${c}`}>
                    {initials}
                  </div>
                  <span className="text-xs text-gray-700">{m.name}</span>
                  <span className="text-xs text-gray-400">({m.role})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tasks list */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-50">
          <span className="text-xs font-semibold text-gray-900">Recent tasks</span>
          <button onClick={() => navigate(`/projects/${project.id}`)}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
            View all <ArrowRight size={11} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckSquare size={24} className="text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">No tasks yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {tasks.slice(0, 10).map(task => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'
              return (
                <div key={task.id}
                  className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50 transition">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusConfig[task.status]?.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate
                      ${task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                    ${priorityConfig[task.priority]?.class}`}>
                    {priorityConfig[task.priority]?.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                    ${statusConfig[task.status]?.bg}`}>
                    {statusConfig[task.status]?.label}
                  </span>
                  {task.dueDate && (
                    <span className={`text-xs flex-shrink-0 flex items-center gap-1
                      ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                      <Calendar size={10} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.assignee && (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
                      title={task.assignee.name}>
                      <span className="text-blue-600 text-xs font-semibold">
                        {task.assignee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const { data: projects = [], isLoading } = useProjects()
  const { data: squads = [] } = useSquads()
  const { mutate: deleteProject } = useDeleteProject()

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [projects, searchQuery])

  const selectedProject = projects.find(p => p.id === selectedId) || filteredProjects[0]

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Delete this project? This cannot be undone.')) {
      deleteProject(id)
      if (selectedId === id) setSelectedId(null)
    }
  }

  // Auto-select first project
  if (!selectedId && filteredProjects.length > 0 && !isLoading) {
    setSelectedId(filteredProjects[0].id)
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-1 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {projects.length} projects · {filteredProjects.length} shown
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium rounded-lg transition cursor-pointer">
          <Plus size={15} /> New project
        </button>
      </div>

      {/* Split layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">

        {/* Left panel — project list */}
        <div className="w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col bg-white
          rounded-xl border border-gray-200 overflow-hidden">

          {/* Search + filter */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50
                  placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <FolderKanban size={28} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 mb-1">
                  {searchQuery ? 'No matching projects' : 'No projects yet'}
                </p>
                {!searchQuery && (
                  <button onClick={() => setShowModal(true)}
                    className="text-xs text-blue-600 hover:underline cursor-pointer mt-1">
                    Create first project
                  </button>
                )}
              </div>
            )}

            {filteredProjects.map(project => {
              const isSelected = selectedProject?.id === project.id
              const squad = squads.find(s => s.id === project.squadId)
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition
                    border-l-[3px] group
                    ${isSelected
                      ? 'bg-blue-50 border-l-blue-500'
                      : 'border-l-transparent hover:bg-gray-50'
                    }`}
                >
                  {/* Project icon */}
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white
                    text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: project.color }}>
                    {project.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate
                        ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {project.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {project.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckSquare size={10} /> {project.taskCount}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users size={10} /> {project.memberCount}
                      </span>
                      {squad && (
                        <span className="text-xs text-gray-400 truncate">
                          {squad.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete + arrow */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
                        justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-500
                        transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className={`flex-shrink-0 mt-1
                      ${isSelected ? 'text-blue-400' : 'text-gray-200'}`} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom summary */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredProjects.length} projects</span>
              <span>{filteredProjects.reduce((sum, p) => sum + (p.taskCount || 0), 0)} total tasks</span>
            </div>
          </div>
        </div>

        {/* Right panel — project preview */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden min-w-0">
          {selectedProject ? (
            <ProjectPreview project={selectedProject} squads={squads} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Select a project</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Click on a project from the list to preview its details, tasks, and team members
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} squads={squads} />}
    </div>
  )
}