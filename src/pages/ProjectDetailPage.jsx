import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, CheckSquare, Calendar, LayoutGrid, List, Plus, UserPlus } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { useMembers } from '../hooks/useMembers'
import KanbanBoard from '../components/tasks/KanbanBoard'
import ListView from '../components/tasks/ListView'
import MembersTab from '../components/members/MembersTab'
import CreateTaskModal from '../components/tasks/CreateTaskModal'
import { formatDate } from '../utils/formatDate'
import ProjectAnalytics from '../components/analytics/ProjectAnalytics'
import { BarChart3 } from 'lucide-react'
export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState('kanban')
  const [showModal, setShowModal] = useState(false)

  const { data: projects = [] } = useProjects()
  const { data: tasks = [] } = useTasks(id)
  const { data: members = [] } = useMembers(id)

  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 mb-4">Project not found</p>
        <button onClick={() => navigate('/projects')}
          className="text-blue-600 hover:underline text-sm cursor-pointer">
          Back to projects
        </button>
      </div>
    )
  }

  const done = tasks.filter(t => t.status === 'DONE').length
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Back */}
      <button onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition cursor-pointer">
        <ArrowLeft size={16} /> Back to projects
      </button>

      {/* Project header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: project.color }}
          >
            {project.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {project.description || 'No description provided'}
            </p>
            <div className="flex items-center gap-5 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckSquare size={13} className="text-gray-400" />
                {tasks.length} tasks
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users size={13} className="text-gray-400" />
                {members.length} members
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={13} className="text-gray-400" />
                Created {formatDate(project.createdAt)}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-shrink-0 sm:text-right flex sm:block items-center gap-3 w-full sm:w-auto
  pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 mt-2 sm:mt-0">
            <p className="text-2xl font-semibold text-gray-900">{progress}%</p>
            <p className="text-xs text-gray-400 mb-2">completed</p>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: project.color }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">

            {/* Tab toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
  { id: 'kanban',    icon: LayoutGrid, label: 'Kanban' },
  { id: 'list',      icon: List,       label: 'List' },
  { id: 'members',   icon: Users,      label: 'Members' },
  { id: 'analytics', icon: BarChart3,  label: 'Analytics' },
].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs
                      font-medium transition cursor-pointer
                      ${view === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon size={13} /> {tab.label}
                    {tab.id === 'members' && members.length > 0 && (
                      <span className="ml-1 bg-gray-200 text-gray-600 text-xs
                        rounded-full px-1.5 py-0.5 leading-none">
                        {members.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action button — changes based on view */}
          {(view !== 'members' && view !== 'analytics') ? (
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700
      text-white text-sm font-medium rounded-lg transition cursor-pointer"
  >
    <Plus size={15} /> Add task
  </button>
) : null}
        </div>

        {/* View content */}
      {view === 'kanban'    && <KanbanBoard projectId={id} hideAddButton />}
{view === 'list'      && <ListView tasks={tasks} projectId={id} />}
{view === 'members'   && <MembersTab projectId={id} />}
{view === 'analytics' && <ProjectAnalytics projectId={id} />}
      </div>

      {showModal && (
        <CreateTaskModal projectId={id} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}