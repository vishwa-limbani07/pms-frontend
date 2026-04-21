import { useState, useMemo } from 'react'
import {
  Clock, Plus, Trash2, Search, Calendar, Timer, TrendingUp,
  ChevronDown, FileText, Target, Filter, X
} from 'lucide-react'
import { useAllTimeLogs, useAddTimeLog, useDeleteTimeLog } from '../hooks/useTimeLogs'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { formatDate } from '../utils/formatDate'
import toast from 'react-hot-toast'

const FILTER_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'all', label: 'All time' },
  { id: 'custom', label: 'Custom' },
]

function formatDuration(mins) {
  if (!mins || mins === 0) return '0m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function isToday(date) {
  const d = new Date(date)
  const t = new Date()
  return d.toDateString() === t.toDateString()
}

function isThisWeek(date) {
  const d = new Date(date)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek
}

function isThisMonth(date) {
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function getDateLabel(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Log Entry Form ───────────────────────────────────────────
function LogEntryForm({ projects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')

  const { data: tasks = [] } = useTasks(selectedProjectId || undefined)
  const { mutate: addLog, isPending } = useAddTimeLog()

  const handleProjectChange = (pid) => {
    setSelectedProjectId(pid)
    setSelectedTaskId('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedTaskId) { toast.error('Select a task'); return }

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)
    if (totalMinutes <= 0) { toast.error('Enter a duration'); return }

    addLog(
      { taskId: selectedTaskId, duration: totalMinutes, note: note.trim() },
      {
        onSuccess: () => {
          setHours(''); setMinutes(''); setNote('')
          toast.success('Time logged!')
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Failed to log time')
      }
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Plus size={14} className="text-blue-600" />
          </div>
          Log time
        </h3>
        <p className="text-xs text-gray-400 mt-1">Record time spent on a task</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-5 py-4 space-y-4">

        {/* Project selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Project</label>
          <div className="relative">
            <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={selectedProjectId} onChange={e => handleProjectChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                appearance-none cursor-pointer transition">
              <option value="">Select project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Task</label>
          <div className="relative">
            <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)}
              disabled={!selectedProjectId}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                appearance-none cursor-pointer transition disabled:opacity-50">
              <option value="">{selectedProjectId ? 'Select task...' : 'Select a project first'}</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Duration</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="number" min="0" max="23" value={hours} onChange={e => setHours(e.target.value)}
                placeholder="0" className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                  transition placeholder:text-gray-400" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">hrs</span>
            </div>
            <div className="flex-1 relative">
              <input type="number" min="0" max="59" step="5" value={minutes}
                onChange={e => setMinutes(e.target.value)} placeholder="0"
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
                  transition placeholder:text-gray-400" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">min</span>
            </div>
          </div>
          {(hours || minutes) && (
            <p className="text-xs text-blue-600 mt-1.5 font-medium">
              Total: {formatDuration((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0))}
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Note <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="What did you work on?"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white
              transition placeholder:text-gray-400 resize-none" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={isPending || !selectedTaskId}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600
            hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium
            rounded-xl transition cursor-pointer">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Clock size={15} /> Log time</>
          )}
        </button>
      </form>

      {/* Quick tips */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
        <p className="text-xs text-gray-400 text-center">
          Select project then task, enter time, add a note
        </p>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function TimeLogsPage() {
  const [activeFilter, setActiveFilter] = useState('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const { data: allLogs = [], isLoading } = useAllTimeLogs()
  const { data: projects = [] } = useProjects()
  const { mutate: deleteLog } = useDeleteTimeLog()

  // Filter logs
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      switch (activeFilter) {
        case 'today': return isToday(log.createdAt)
        case 'week': return isThisWeek(log.createdAt)
        case 'month': return isThisMonth(log.createdAt)
        case 'custom':
          if (!customFrom && !customTo) return true
          const d = new Date(log.createdAt)
          if (customFrom && d < new Date(customFrom)) return false
          if (customTo) {
            const to = new Date(customTo)
            to.setHours(23, 59, 59, 999)
            if (d > to) return false
          }
          return true
        default: return true
      }
    })
  }, [allLogs, activeFilter, customFrom, customTo])

  // Group by date
  const grouped = useMemo(() => {
    const groups = {}
    filteredLogs.forEach(log => {
      const key = new Date(log.createdAt).toDateString()
      if (!groups[key]) groups[key] = { date: log.createdAt, logs: [], total: 0 }
      groups[key].logs.push(log)
      groups[key].total += log.duration || 0
    })
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filteredLogs])

  // Stats
  const todayTotal = allLogs.filter(l => isToday(l.createdAt)).reduce((s, l) => s + (l.duration || 0), 0)
  const weekTotal = allLogs.filter(l => isThisWeek(l.createdAt)).reduce((s, l) => s + (l.duration || 0), 0)
  const monthTotal = allLogs.filter(l => isThisMonth(l.createdAt)).reduce((s, l) => s + (l.duration || 0), 0)
  const filteredTotal = filteredLogs.reduce((s, l) => s + (l.duration || 0), 0)

  const handleDelete = (id) => {
    if (window.confirm('Delete this time log?')) {
      deleteLog(id)
      toast.success('Time log deleted')
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-1 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Time logs</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {allLogs.length} entries · {formatDuration(monthTotal)} this month
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 pb-4 flex-shrink-0">
        {[
          { label: 'Today', value: formatDuration(todayTotal), bg: 'bg-blue-50 border-blue-100', color: 'text-blue-700', sub: 'text-blue-500' },
          { label: 'This week', value: formatDuration(weekTotal), bg: 'bg-green-50 border-green-100', color: 'text-green-700', sub: 'text-green-500' },
          { label: 'This month', value: formatDuration(monthTotal), bg: 'bg-amber-50 border-amber-100', color: 'text-amber-700', sub: 'text-amber-500' },
          { label: 'Filtered', value: formatDuration(filteredTotal), bg: 'bg-purple-50 border-purple-100', color: 'text-purple-700', sub: 'text-purple-500' },
        ].map(stat => (
          <div key={stat.label} className={`p-3 rounded-xl border ${stat.bg} text-center`}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className={`text-xs mt-0.5 ${stat.sub}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Split layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">

        {/* Left — log form */}
        <div className="w-[320px] xl:w-[350px] flex-shrink-0 bg-white rounded-xl border
          border-gray-200 overflow-hidden">
          <LogEntryForm projects={projects} />
        </div>

        {/* Right — log list */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden
          flex flex-col min-w-0">

          {/* Filters */}
          <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_OPTIONS.map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer
                    ${activeFilter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                  {f.label}
                </button>
              ))}

              {activeFilter === 'custom' && (
                <div className="flex items-center gap-2 ml-2">
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs
                      focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs
                      focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {(customFrom || customTo) && (
                    <button onClick={() => { setCustomFrom(''); setCustomTo('') }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg
                        hover:bg-gray-100 text-gray-400 cursor-pointer">
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              <span className="ml-auto text-xs text-gray-400">
                {filteredLogs.length} entries
              </span>
            </div>
          </div>

          {/* Log entries grouped by date */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Clock size={32} className="text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 mb-1">No time entries found</p>
                <p className="text-xs text-gray-300">
                  {activeFilter === 'today'
                    ? "You haven't logged any time today"
                    : 'Try changing the filter or log some time'}
                </p>
              </div>
            ) : (
              <div>
                {grouped.map(group => (
                  <div key={group.date}>
                    {/* Date header */}
                    <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100
                      flex items-center justify-between sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">
                          {getDateLabel(group.date)}
                        </span>
                        <span className="text-xs text-gray-400">
                          · {group.logs.length} {group.logs.length === 1 ? 'entry' : 'entries'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {formatDuration(group.total)}
                      </span>
                    </div>

                    {/* Log items */}
                    <div className="divide-y divide-gray-50">
                      {group.logs.map(log => (
                        <div key={log.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition group">

                          {/* Project color dot */}
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: log.task?.project?.color || '#6B7280' }} />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {log.task?.title || 'Unknown task'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">
                                {log.task?.project?.name || 'No project'}
                              </span>
                              {log.note && (
                                <>
                                  <span className="text-gray-200">·</span>
                                  <span className="text-xs text-gray-400 truncate">{log.note}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Duration */}
                          <span className="text-sm font-bold text-gray-900 flex-shrink-0 tabular-nums">
                            {formatDuration(log.duration)}
                          </span>

                          {/* Time */}
                          <span className="text-xs text-gray-400 flex-shrink-0 w-14 text-right">
                            {new Date(log.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>

                          {/* Delete */}
                          <button onClick={() => handleDelete(log.id)}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
                              justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500
                              transition cursor-pointer flex-shrink-0">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom summary */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0
            flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {filteredLogs.length} of {allLogs.length} entries
            </span>
            <span className="text-xs font-bold text-gray-700">
              Total: {formatDuration(filteredTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}