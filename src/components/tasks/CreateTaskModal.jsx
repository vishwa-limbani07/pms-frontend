import { useState } from 'react'
import { X } from 'lucide-react'
import { useCreateTask } from '../../hooks/useTasks'
import { useSquads } from '../../hooks/useSquads'
import { useProjects } from '../../hooks/useProjects'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']

export default function CreateTaskModal({ projectId, onClose }) {
  const { mutate: createTask, isPending } = useCreateTask(projectId)
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: ''
  })
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const { data: squads = [] } = useSquads()
  const { data: projects = [] } = useProjects()
  const project = projects.find(p => p.id === projectId)
  const squad = squads.find(s => s.id === project?.squadId)
  const assignableMembers = squad?.members || []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    createTask(
      { projectId, ...form, assigneeId: form.assigneeId || null },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Create new task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Task title</label>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Design landing page" autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Add more details..." rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due date</label>
              <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign to {squad ? <span className="text-gray-400 font-normal">({squad.name})</span> : ''}
            </label>
            {assignableMembers.length > 0 ? (
              <select value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                <option value="">Unassigned</option>
                {assignableMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-gray-400 py-2">
                {project?.squadId
                  ? 'No members in assigned squad'
                  : 'No squad assigned to this project. Assign a squad first.'}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isPending || !form.title.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-300 text-white text-sm font-medium cursor-pointer">
              {isPending ? 'Creating...' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}