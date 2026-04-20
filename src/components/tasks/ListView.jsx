import { useState, useRef, useEffect } from 'react'
import { Trash2, Calendar, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Check, X } from 'lucide-react'
import { useDeleteTask, useUpdateTaskStatus, useUpdateTask } from '../../hooks/useTasks'
import { formatDate, isOverdue } from '../../utils/formatDate'
import TaskDetailDrawer from './TaskDetailDrawer'

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
  MEDIUM: { label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  LOW:    { label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
}

const statusConfig = {
  TODO:        { label: 'To Do',       class: 'bg-gray-100 text-gray-600' },
  IN_PROGRESS: { label: 'In Progress', class: 'bg-blue-50 text-blue-600' },
  REVIEW:      { label: 'Review',      class: 'bg-amber-50 text-amber-600' },
  DONE:        { label: 'Done',        class: 'bg-green-50 text-green-600' },
}

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <ChevronsUpDown size={13} className="text-gray-300" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-blue-500" />
    : <ChevronDown size={13} className="text-blue-500" />
}

function InlineEditCell({ value, onSave, onCancel, type = 'text', options = [] }) {
  const [val, setVal] = useState(value || '')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    if (type === 'text') inputRef.current?.select()
  }, [type])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave(val)
    if (e.key === 'Escape') onCancel()
  }

  if (type === 'select') {
    return (
      <div className="flex items-center gap-1">
        <select
          ref={inputRef}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 rounded-lg border border-blue-300 text-xs focus:outline-none
            focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button onClick={() => onSave(val)}
          className="w-6 h-6 flex items-center justify-center rounded bg-blue-50
            hover:bg-blue-100 text-blue-600 cursor-pointer">
          <Check size={12} />
        </button>
        <button onClick={onCancel}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100
            text-gray-400 cursor-pointer">
          <X size={12} />
        </button>
      </div>
    )
  }

  if (type === 'date') {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="date"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 rounded-lg border border-blue-300 text-xs focus:outline-none
            focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <button onClick={() => onSave(val)}
          className="w-6 h-6 flex items-center justify-center rounded bg-blue-50
            hover:bg-blue-100 text-blue-600 cursor-pointer">
          <Check size={12} />
        </button>
        <button onClick={onCancel}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100
            text-gray-400 cursor-pointer">
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 w-full">
      <input
        ref={inputRef}
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-2.5 py-1.5 rounded-lg border border-blue-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
      />
      <button onClick={() => onSave(val)}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50
          hover:bg-blue-100 text-blue-600 flex-shrink-0 cursor-pointer">
        <Check size={13} />
      </button>
      <button onClick={onCancel}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100
          text-gray-400 flex-shrink-0 cursor-pointer">
        <X size={13} />
      </button>
    </div>
  )
}

export default function ListView({ tasks, projectId }) {
  const { mutate: deleteTask } = useDeleteTask(projectId)
  const { mutate: _updateStatus } = useUpdateTaskStatus(projectId)
  const { mutate: updateTask } = useUpdateTask(projectId)

  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [editing, setEditing] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const startEdit = (e, taskId, field) => {
    e.stopPropagation()
    setEditing({ taskId, field })
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = (task, field, value) => {
    if (!value?.toString().trim()) return cancelEdit()
    updateTask({ id: task.id, ...task, [field]: value })
    setEditing(null)
  }

  const isEditing = (taskId, field) =>
    editing?.taskId === taskId && editing?.field === field

  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }

  const filtered = tasks
    .filter(t => filterStatus === 'ALL' || t.status === filterStatus)
    .filter(t => filterPriority === 'ALL' || t.priority === filterPriority)
    .sort((a, b) => {
      let valA, valB
      if (sortBy === 'priority') {
        valA = priorityOrder[a.priority]; valB = priorityOrder[b.priority]
      } else if (sortBy === 'dueDate') {
        valA = new Date(a.dueDate || 0); valB = new Date(b.dueDate || 0)
      } else if (sortBy === 'title') {
        valA = a.title.toLowerCase(); valB = b.title.toLowerCase()
      } else {
        valA = new Date(a.createdAt || 0); valB = new Date(b.createdAt || 0)
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  return (
    <>
      <div className="space-y-3">

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="ALL">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="ALL">All priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} tasks</span>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Pencil size={11} /> Click task title to open detail · Click badges to edit inline
        </p>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  { key: 'title',    label: 'Task' },
                  { key: 'status',   label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'dueDate',  label: 'Due date' },
                  { key: 'assignee', label: 'Assignee', nosort: true },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => !col.nosort && handleSort(col.key)}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500
                      ${!col.nosort && 'cursor-pointer hover:text-gray-800 select-none'}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {!col.nosort && (
                        <SortIcon field={col.key} sortBy={sortBy} sortDir={sortDir} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    No tasks found
                  </td>
                </tr>
              )}

              {filtered.map(task => {
                const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                return (
                  <tr
                    key={task.id}
                    onClick={() => !editing && setSelectedTask(task)}
                    className="hover:bg-gray-50 transition group cursor-pointer"
                  >

                    {/* Title */}
                    <td className="px-4 py-3 max-w-xs">
                      {isEditing(task.id, 'title') ? (
                        <InlineEditCell
                          value={task.title}
                          onSave={val => saveEdit(task, 'title', val)}
                          onCancel={cancelEdit}
                          type="text"
                        />
                      ) : (
                        <div className="flex items-center gap-2 group/title">
                          <div>
                            <p className={`font-medium text-gray-800 group-hover:text-blue-600
                              transition truncate
                              ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <Pencil
                            size={11}
                            onClick={(e) => startEdit(e, task.id, 'title')}
                            className="text-gray-300 hover:text-blue-400 flex-shrink-0
                              opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          />
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {isEditing(task.id, 'status') ? (
                        <InlineEditCell
                          value={task.status}
                          type="select"
                          options={STATUS_OPTIONS.map(s => ({ value: s, label: statusConfig[s].label }))}
                          onSave={val => saveEdit(task, 'status', val)}
                          onCancel={cancelEdit}
                        />
                      ) : (
                        <span
                          onClick={(e) => startEdit(e, task.id, 'status')}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer
                            hover:opacity-75 transition ${statusConfig[task.status]?.class}`}
                        >
                          {statusConfig[task.status]?.label}
                        </span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      {isEditing(task.id, 'priority') ? (
                        <InlineEditCell
                          value={task.priority}
                          type="select"
                          options={PRIORITY_OPTIONS.map(p => ({
                            value: p,
                            label: p.charAt(0) + p.slice(1).toLowerCase()
                          }))}
                          onSave={val => saveEdit(task, 'priority', val)}
                          onCancel={cancelEdit}
                        />
                      ) : (
                        <span
                          onClick={(e) => startEdit(e, task.id, 'priority')}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer
                            hover:opacity-75 transition ${priorityConfig[task.priority]?.class}`}
                        >
                          {priorityConfig[task.priority]?.label}
                        </span>
                      )}
                    </td>

                    {/* Due date */}
                    <td className="px-4 py-3">
                      {isEditing(task.id, 'dueDate') ? (
                        <InlineEditCell
                          value={task.dueDate || ''}
                          type="date"
                          onSave={val => saveEdit(task, 'dueDate', val)}
                          onCancel={cancelEdit}
                        />
                      ) : (
                        <div
                          onClick={(e) => startEdit(e, task.id, 'dueDate')}
                          className={`flex items-center gap-1.5 text-xs cursor-pointer
                            hover:opacity-75 transition w-fit
                            ${overdue ? 'text-red-500' : task.dueDate ? 'text-gray-500' : 'text-gray-300'}`}
                        >
                          <Calendar size={12} />
                          {task.dueDate ? (
                            <>
                              {formatDate(task.dueDate)}
                              {overdue && <span className="text-red-400">(overdue)</span>}
                            </>
                          ) : 'Set date'}
                        </div>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3">
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-xs font-semibold">
                              {task.assignee.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 hidden lg:block">
                            {task.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">Unassigned</span>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id) }}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
                          justify-center rounded-lg hover:bg-red-50 text-gray-400
                          hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task detail drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}