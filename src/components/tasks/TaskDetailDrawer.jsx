import { useState, useEffect, useRef } from 'react'
import {
  X, MessageSquare, Paperclip, Clock, GitBranch, Link2,
  Send, Trash2, Plus, Check, Upload, Timer, Pencil, ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { formatDate } from '../../utils/formatDate'
import { useUpdateTask } from '../../hooks/useTasks'
import {
  useComments, useAddComment, useDeleteComment,
  useAttachments, useAddAttachment, useDeleteAttachment,
  useTimeLogs, useAddTimeLog, useDeleteTimeLog,
  useSubtasks, useAddSubtask, useToggleSubtask, useDeleteSubtask,
  useLinkedItems, useAddLinkedItem, useDeleteLinkedItem,
} from '../../hooks/useTaskDetail'
import { mockTasks } from '../../api/mockData'
import { useSquads } from '../../hooks/useSquads'
import { useProjects } from '../../hooks/useProjects'
const STATUS_OPTIONS = [
  { value: 'TODO',        label: 'To Do',       class: 'bg-gray-100 text-gray-600' },
  { value: 'IN_PROGRESS', label: 'In Progress',  class: 'bg-blue-50 text-blue-600' },
  { value: 'REVIEW',      label: 'Review',       class: 'bg-amber-50 text-amber-600' },
  { value: 'DONE',        label: 'Done',         class: 'bg-green-50 text-green-600' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW',    label: 'Low',    class: 'bg-green-50 text-green-600 border border-green-100' },
  { value: 'MEDIUM', label: 'Medium', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
  { value: 'HIGH',   label: 'High',   class: 'bg-red-50 text-red-600 border border-red-100' },
]

const LINK_TYPES = ['blocks', 'blocked by', 'related', 'duplicates']
const TABS = [
  { id: 'comments',    label: 'Comments',    icon: MessageSquare },
  { id: 'subtasks',    label: 'Subtasks',    icon: GitBranch },
  { id: 'attachments', label: 'Attachments', icon: Paperclip },
  { id: 'timelog',     label: 'Time log',    icon: Clock },
  { id: 'linked',      label: 'Linked',      icon: Link2 },
]

// ── Dropdown selector ─────────────────────────────────────────
function DropdownSelect({ value, options, onChange, renderValue }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = options.find(o => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium
          cursor-pointer hover:opacity-80 transition ${current?.class}`}
      >
        {renderValue ? renderValue(current) : current?.label}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200
          rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50
                transition cursor-pointer text-left
                ${opt.value === value ? 'font-medium' : ''}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                opt.value === 'DONE' ? 'bg-green-500' :
                opt.value === 'IN_PROGRESS' ? 'bg-blue-500' :
                opt.value === 'REVIEW' ? 'bg-amber-500' :
                opt.value === 'HIGH' ? 'bg-red-500' :
                opt.value === 'MEDIUM' ? 'bg-amber-500' :
                opt.value === 'LOW' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              {opt.label}
              {opt.value === value && <Check size={11} className="ml-auto text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Inline editable text field ────────────────────────────────
function EditableField({ value, placeholder, type = 'text', onSave, currentTaskId }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value || '')
  const ref = useRef(null)

  useEffect(() => { 
    const timer = setTimeout(() => setVal(value || ''), 0)
    return () => clearTimeout(timer)
  }, [value])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const handleSave = () => { onSave(val); setEditing(false) }
  const handleCancel = () => { setVal(value || ''); setEditing(false) }

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        className="group flex items-start gap-2 px-3 py-2 rounded-lg border
          border-transparent hover:border-gray-200 hover:bg-gray-50 cursor-pointer
          transition min-h-[36px]"
      >
        <span className={`text-sm flex-1 leading-relaxed ${value ? 'text-gray-700' : 'text-gray-300'}`}>
          {value || placeholder}
        </span>
        <Pencil size={11} className="text-gray-300 group-hover:text-gray-400 mt-1
          flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <textarea
          ref={ref}
          value={val}
          onChange={e => setVal(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border border-blue-300 text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
        <div className="flex gap-2">
          <button onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg
              hover:bg-blue-700 cursor-pointer">Save</button>
          <button onClick={handleCancel}
            className="px-3 py-1 border border-gray-200 text-gray-500 text-xs
              rounded-lg hover:bg-gray-50 cursor-pointer">Cancel</button>
        </div>
      </div>
    )
  }

  if (type === 'number') {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={ref}
          type="number" min="0"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          placeholder="Hours"
          className="flex-1 px-2.5 py-1.5 rounded-lg border border-blue-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSave}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50
            hover:bg-blue-100 text-blue-600 cursor-pointer"><Check size={13} /></button>
        <button onClick={handleCancel}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100
            text-gray-400 cursor-pointer"><X size={13} /></button>
      </div>
    )
  }

  if (type === 'date') {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={ref}
          type="date"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          className="flex-1 px-2.5 py-1.5 rounded-lg border border-blue-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <button onClick={handleSave}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50
            hover:bg-blue-100 text-blue-600 cursor-pointer"><Check size={13} /></button>
        <button onClick={handleCancel}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100
            text-gray-400 cursor-pointer"><X size={13} /></button>
      </div>
    )
  }

  if (type === 'parent') {
    const options = mockTasks.filter(t => t.id !== currentTaskId)
    return (
      <div className="flex items-center gap-1.5">
        <select
          ref={ref}
          value={val}
          onChange={e => setVal(e.target.value)}
          className="flex-1 px-2.5 py-1.5 rounded-lg border border-blue-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          <option value="">No parent</option>
          {options.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <button onClick={handleSave}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50
            hover:bg-blue-100 text-blue-600 cursor-pointer"><Check size={13} /></button>
        <button onClick={handleCancel}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100
            text-gray-400 cursor-pointer"><X size={13} /></button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={ref}
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
        placeholder={placeholder}
        className="flex-1 px-2.5 py-1.5 rounded-lg border border-blue-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSave}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50
          hover:bg-blue-100 text-blue-600 cursor-pointer"><Check size={13} /></button>
      <button onClick={handleCancel}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100
          text-gray-400 cursor-pointer"><X size={13} /></button>
    </div>
  )
}

// ── Logged hours (auto from time log) ────────────────────────
function LoggedHoursField({ taskId }) {
  const { data: logs = [] } = useTimeLogs(taskId)
  const totalMins = logs.reduce((sum, l) => sum + l.duration, 0)
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  const display = totalMins > 0
    ? hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    : null

  return (
    <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 min-h-[36px] flex items-center">
      <span className={`text-sm ${display ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
        {display || 'No time logged'}
      </span>
    </div>
  )
}

// ── Field row layout ──────────────────────────────────────────
function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-3 items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-medium text-gray-400 pt-2.5">{label}</span>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

// ── Comments Tab ──────────────────────────────────────────────
function CommentsTab({ taskId }) {
  const { user } = useAuthStore()
  const { data: comments = [] } = useComments(taskId)
  const { mutate: addComment, isPending } = useAddComment(taskId)
  const { mutate: deleteComment } = useDeleteComment(taskId)
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const handleSend = () => {
    if (!text.trim()) return
    addComment({ taskId, text: text.trim(), author: user })
    setText('')
  }

  const formatTime = (iso) => new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-4 pb-2">
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare size={28} className="text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No comments yet</p>
            <p className="text-xs text-gray-300 mt-0.5">Be the first to comment</p>
          </div>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 group">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-semibold">
                {c.author?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-800">{c.author?.name}</span>
                <span className="text-xs text-gray-400">{formatTime(c.createdAt)}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 leading-relaxed">
                {c.text}
              </div>
            </div>
            <button
              onClick={() => deleteComment(c.id)}
              className="opacity-0 group-hover:opacity-100 mt-1 w-6 h-6 flex items-center
                justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-500
                transition flex-shrink-0 cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="pt-3 border-t border-gray-100 mt-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Write a comment... (Enter to send)"
            rows={2}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
          />
          <button
            onClick={handleSend}
            disabled={isPending || !text.trim()}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600
              hover:bg-blue-700 disabled:bg-blue-300 text-white transition flex-shrink-0 cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Subtasks Tab ──────────────────────────────────────────────
function SubtasksTab({ taskId }) {
  const { data: subtasks = [] } = useSubtasks(taskId)
  const { mutate: addSubtask } = useAddSubtask(taskId)
  const { mutate: toggleSubtask } = useToggleSubtask(taskId)
  const { mutate: deleteSubtask } = useDeleteSubtask(taskId)
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const done = subtasks.filter(s => s.done).length
  const progress = subtasks.length > 0 ? Math.round((done / subtasks.length) * 100) : 0

  const handleAdd = () => {
    if (!title.trim()) return
    addSubtask({ taskId, title: title.trim() })
    setTitle('')
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      {subtasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">{done} of {subtasks.length} completed</span>
            <span className="text-xs font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <div className="space-y-1">
        {subtasks.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GitBranch size={28} className="text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No subtasks yet</p>
          </div>
        )}
        {subtasks.map(s => (
          <div key={s.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 group">
            <button
              onClick={() => toggleSubtask({ id: s.id, done: !s.done })}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center
                flex-shrink-0 transition cursor-pointer
                ${s.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
            >
              {s.done && <Check size={11} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${s.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {s.title}
            </span>
            <button
              onClick={() => deleteSubtask(s.id)}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
                justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-500
                transition cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {adding && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
            <input
              autoFocus type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setTitle('') } }}
              placeholder="Subtask title..."
              className="flex-1 text-sm px-2 py-1 rounded border border-blue-300
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleAdd}
              className="w-7 h-7 flex items-center justify-center rounded bg-blue-50
                hover:bg-blue-100 text-blue-600 cursor-pointer"><Check size={13} /></button>
            <button onClick={() => { setAdding(false); setTitle('') }}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100
                text-gray-400 cursor-pointer"><X size={13} /></button>
          </div>
        )}
      </div>
      {!adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700
            px-2 py-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer w-full">
          <Plus size={14} /> Add subtask
        </button>
      )}
    </div>
  )
}

// ── Attachments Tab ───────────────────────────────────────────
function AttachmentsTab({ taskId }) {
  const { user } = useAuthStore()
  const { data: attachments = [] } = useAttachments(taskId)
  const { mutate: addAttachment } = useAddAttachment(taskId)
  const { mutate: deleteAttachment } = useDeleteAttachment(taskId)
  const inputRef = useRef(null)

  const typeIcon = (type) => {
    if (type === 'image') return '🖼️'
    if (type === 'pdf') return '📄'
    return '📎'
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    const ext = file.name.split('.').pop().toLowerCase()
    const type = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
      ? 'image' : ext === 'pdf' ? 'pdf' : 'file'
    addAttachment({ taskId, name: file.name,
      size: sizeMB > 1 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`,
      type, uploadedBy: user })
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <button onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed
          border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300
          hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer">
        <Upload size={15} /> Click to upload file
      </button>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} />
      {attachments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Paperclip size={28} className="text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">No attachments yet</p>
        </div>
      )}
      {attachments.map(a => (
        <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200
          hover:border-gray-300 hover:bg-gray-50 transition group">
          <span className="text-xl flex-shrink-0">{typeIcon(a.type)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.size} · {formatDate(a.createdAt)}</p>
          </div>
          <button onClick={() => deleteAttachment(a.id)}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
              justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500
              transition cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Time Log Tab ──────────────────────────────────────────────
function TimeLogTab({ taskId }) {
  const { user } = useAuthStore()
  const { data: logs = [] } = useTimeLogs(taskId)
  const { mutate: addLog, isPending } = useAddTimeLog(taskId)
  const { mutate: deleteLog } = useDeleteTimeLog(taskId)
  const [form, setForm] = useState({ duration: '', note: '' })
  const [adding, setAdding] = useState(false)

  const totalMins = logs.reduce((sum, l) => sum + l.duration, 0)
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const handleAdd = () => {
    if (!form.duration || isNaN(form.duration)) return
    addLog(
      { taskId, duration: Number(form.duration), note: form.note, loggedBy: user },
      { onSuccess: () => { setForm({ duration: '', note: '' }); setAdding(false) } }
    )
  }

  return (
    <div className="space-y-4">
      {logs.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
          <Timer size={18} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-600 font-medium">Total time logged</p>
            <p className="text-lg font-semibold text-blue-700">{formatDuration(totalMins)}</p>
          </div>
        </div>
      )}
      {logs.length === 0 && !adding && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock size={28} className="text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">No time logged yet</p>
        </div>
      )}
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl border
            border-gray-200 hover:bg-gray-50 group">
            <div className="w-12 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-600">{formatDuration(log.duration)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{log.note || 'No note'}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {log.loggedBy?.name} · {formatDate(log.createdAt)}
              </p>
            </div>
            <button onClick={() => deleteLog(log.id)}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
                justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500
                transition cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      {adding && (
        <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes)</label>
              <input autoFocus type="number" min="1"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 60"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
              <input type="text"
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="What did you do?"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={isPending}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm
                font-medium rounded-lg transition cursor-pointer disabled:bg-blue-300">
              {isPending ? 'Logging...' : 'Log time'}
            </button>
            <button onClick={() => { setAdding(false); setForm({ duration: '', note: '' }) }}
              className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm
                rounded-lg hover:bg-white transition cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}
      {!adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700
            px-2 py-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer w-full">
          <Plus size={14} /> Log time
        </button>
      )}
    </div>
  )
}

// ── Linked Items Tab ──────────────────────────────────────────
function LinkedItemsTab({ taskId }) {
  const { data: links = [] } = useLinkedItems(taskId)
  const { mutate: addLink } = useAddLinkedItem(taskId)
  const { mutate: deleteLink } = useDeleteLinkedItem(taskId)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ linkedTaskId: '', type: 'related' })

  const availableTasks = mockTasks.filter(t => t.id !== taskId)

  const handleAdd = () => {
    if (!form.linkedTaskId) return
    addLink(
      { taskId, ...form },
      { onSuccess: () => { setForm({ linkedTaskId: '', type: 'related' }); setAdding(false) } }
    )
  }

  const typeBadge = (type) => {
    const map = {
      'blocks':     'bg-red-50 text-red-600',
      'blocked by': 'bg-orange-50 text-orange-600',
      'related':    'bg-blue-50 text-blue-600',
      'duplicates': 'bg-gray-100 text-gray-600',
    }
    return map[type] || 'bg-gray-100 text-gray-600'
  }

  const statusDot = {
    TODO: 'bg-gray-400', IN_PROGRESS: 'bg-blue-500',
    REVIEW: 'bg-amber-500', DONE: 'bg-green-500',
  }

  return (
    <div className="space-y-3">
      {links.length === 0 && !adding && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Link2 size={28} className="text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">No linked items yet</p>
        </div>
      )}
      {links.map(link => (
        <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl border
          border-gray-200 hover:bg-gray-50 group">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${typeBadge(link.type)}`}>
            {link.type}
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[link.linkedTask?.status]}`} />
            <span className="text-sm text-gray-700 truncate">{link.linkedTask?.title}</span>
          </div>
          <button onClick={() => deleteLink(link.id)}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
              justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500
              transition cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      {adding && (
        <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link type</label>
              <select value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                {LINK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Task</label>
              <select autoFocus value={form.linkedTaskId}
                onChange={e => setForm(f => ({ ...f, linkedTaskId: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                <option value="">Select task</option>
                {availableTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm
                font-medium rounded-lg transition cursor-pointer">Link item</button>
            <button onClick={() => setAdding(false)}
              className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm
                rounded-lg hover:bg-white transition cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
      {!adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700
            px-2 py-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer w-full">
          <Plus size={14} /> Link work item
        </button>
      )}
    </div>
  )
}

// ── Main Drawer ───────────────────────────────────────────────
export default function TaskDetailDrawer({ task, onClose }) {
  const [activeTab, setActiveTab] = useState('comments')
  const [localTask, setLocalTask] = useState(task)
  const { mutate: updateTask } = useUpdateTask(task.projectId)

  useEffect(() => { 
    const timer = setTimeout(() => setLocalTask(task), 0)
    return () => clearTimeout(timer)
  }, [task])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleUpdate = (field, value) => {
    const updated = { ...localTask, [field]: value }
    setLocalTask(updated)
    updateTask({ id: updated.id, ...updated })
  }

  // currentStatus and currentPriority can be computed on demand if needed

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50
        flex flex-col border-l border-gray-200 animate-slide-in">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">

          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <EditableField
              value={localTask.title}
              placeholder="Task title"
              type="text"
              onSave={(val) => handleUpdate('title', val)}
            />
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition
                flex-shrink-0 cursor-pointer mt-1">
              <X size={16} />
            </button>
          </div>

          {/* All fields in a clean label: value layout */}
          <div className="space-y-0 divide-y divide-gray-50">

            <FieldRow label="Status">
              <DropdownSelect
                value={localTask.status}
                options={STATUS_OPTIONS}
                onChange={(val) => handleUpdate('status', val)}
              />
            </FieldRow>

            <FieldRow label="Priority">
              <DropdownSelect
                value={localTask.priority}
                options={PRIORITY_OPTIONS}
                onChange={(val) => handleUpdate('priority', val)}
              />
            </FieldRow>

            <FieldRow label="Due date">
              <EditableField
                value={localTask.dueDate || ''}
                placeholder="Set due date"
                type="date"
                onSave={(val) => handleUpdate('dueDate', val)}
              />
            </FieldRow>

            <FieldRow label="Assignee">
  <AssigneeSelector
    task={localTask}
    onChange={(assigneeId) => handleUpdate('assigneeId', assigneeId)}
  />
</FieldRow>

            <FieldRow label="Description">
              <EditableField
                value={localTask.description}
                placeholder="Add a description..."
                type="textarea"
                onSave={(val) => handleUpdate('description', val)}
              />
            </FieldRow>

            <FieldRow label="Estimate">
              <EditableField
                value={localTask.estimate ? String(localTask.estimate) : ''}
                placeholder="Hours e.g. 4"
                type="number"
                onSave={(val) => handleUpdate('estimate', Number(val))}
              />
            </FieldRow>

            <FieldRow label="Logged hours">
              <LoggedHoursField taskId={localTask.id} />
            </FieldRow>

            <FieldRow label="Parent item">
              <EditableField
                value={localTask.parentId
                  ? mockTasks.find(t => t.id === localTask.parentId)?.title || ''
                  : ''}
                placeholder="Select parent task..."
                type="parent"
                currentTaskId={localTask.id}
                onSave={(val) => handleUpdate('parentId', val)}
              />
            </FieldRow>

          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium
                  border-b-2 whitespace-nowrap transition cursor-pointer
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {activeTab === 'comments'    && <CommentsTab    taskId={localTask.id} />}
          {activeTab === 'subtasks'    && <SubtasksTab    taskId={localTask.id} />}
          {activeTab === 'attachments' && <AttachmentsTab taskId={localTask.id} />}
          {activeTab === 'timelog'     && <TimeLogTab     taskId={localTask.id} />}
          {activeTab === 'linked'      && <LinkedItemsTab taskId={localTask.id} />}
        </div>
      </div>
    </>
  )
}
// ── Assignee Selector ─────────────────────────────────────────
function AssigneeSelector({ task, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { data: squads = [] } = useSquads()
  const { data: projects = [] } = useProjects()

  const project = projects.find(p => p.id === task.projectId)
  const squad = squads.find(s => s.id === project?.squadId)
  const members = squad?.members || []

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  const getColor = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600']
    return colors[(name?.charCodeAt(0) || 0) % colors.length]
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent
          hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition w-full text-left group">
        {task.assignee ? (
          <>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center
              text-xs font-semibold ${getColor(task.assignee.name)}`}>
              {getInitials(task.assignee.name)}
            </div>
            <span className="text-sm text-gray-700 flex-1">{task.assignee.name}</span>
          </>
        ) : (
          <span className="text-sm text-gray-300 flex-1">Unassigned</span>
        )}
        <ChevronDown size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200
          rounded-xl shadow-lg z-50 w-full min-w-[220px] max-h-[250px] overflow-auto">
          <button onClick={() => { onChange(null); setOpen(false) }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-gray-50
              cursor-pointer text-left transition
              ${!task.assignee ? 'bg-blue-50 font-medium' : ''}`}>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={10} className="text-gray-400" />
            </div>
            <span className="text-gray-600">Unassigned</span>
            {!task.assignee && <Check size={11} className="ml-auto text-blue-600" />}
          </button>

          {members.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">
              {project?.squadId ? 'No members in squad' : 'No squad assigned to project'}
            </p>
          )}

          {members.map(m => {
            const isSelected = task.assignee?.id === m.id || task.assigneeId === m.id
            return (
              <button key={m.id}
                onClick={() => { onChange(m.id); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-gray-50
                  cursor-pointer text-left transition
                  ${isSelected ? 'bg-blue-50 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center
                  text-xs font-semibold ${getColor(m.name)}`}>
                  {getInitials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-800 block truncate">{m.name}</span>
                  <span className="text-gray-400 text-xs">{m.role}</span>
                </div>
                {isSelected && <Check size={11} className="ml-auto text-blue-600 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}