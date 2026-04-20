import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderKanban, Trash2, ArrowRight, Users, CheckSquare } from 'lucide-react'
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects'
import { useSquads } from '../hooks/useSquads'
import { formatDate } from '../utils/formatDate'

const PROJECT_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#84CC16',
]

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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. E-Commerce App"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-400 transition resize-none"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: color,
                    outline: selectedColor === color ? `3px solid ${color}` : 'none',
                    outlineOffset: '2px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Squad selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign squad <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              value={selectedSquad}
              onChange={e => setSelectedSquad(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="">No squad assigned</option>
              {squads.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.members.length} members)
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: selectedColor }}
            >
              {name ? name[0].toUpperCase() : 'P'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{name || 'Project name'}</p>
              <p className="text-xs text-gray-400">{description || 'No description'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium transition cursor-pointer"
            >
              {isPending ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProjectCard({ project, onDelete, squads }) {
  const navigate = useNavigate()
  const squad = squads.find(s => s.id === project.squadId)

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300
      hover:shadow-sm transition-all group">

      {/* Card top color bar */}
      <div className="h-1.5 rounded-t-xl" style={{ backgroundColor: project.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0]}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{project.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Created {formatDate(project.createdAt)}</p>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center
              rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2rem]">
          {project.description || 'No description provided.'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckSquare size={13} className="text-gray-400" />
            {project.taskCount} tasks
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={13} className="text-gray-400" />
            {project.memberCount} members
          </div>
        </div>

        {/* Squad badge */}
        {squad && (
          <div className="flex items-center gap-2 mb-4 px-2 py-1.5 bg-gray-50 rounded-lg">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: squad.color }}
            >
              {squad.name.charAt(0)}
            </div>
            <span className="text-xs text-gray-600">{squad.name}</span>
            <span className="text-xs text-gray-400 ml-auto">{squad.members.length} members</span>
          </div>
        )}

        {/* Open button */}
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
            border border-gray-200 hover:bg-gray-50 text-sm text-gray-600
            hover:text-gray-900 transition cursor-pointer"
        >
          Open project <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: projects = [], isLoading } = useProjects()
  const { data: squads = [] } = useSquads()
  const { mutate: deleteProject } = useDeleteProject()

  const handleDelete = (id) => {
    if (window.confirm('Delete this project? This cannot be undone.')) {
      deleteProject(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} projects in your workspace</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium rounded-lg transition cursor-pointer"
        >
          <Plus size={16} /> New project
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <FolderKanban size={24} className="text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No projects yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            <Plus size={15} /> Create project
          </button>
        </div>
      )}

      {/* Projects grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              squads={squads}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} squads={squads} />}
    </div>
  )
}