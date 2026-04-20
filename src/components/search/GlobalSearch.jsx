import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, FolderKanban, CheckSquare, Users, UsersRound,
  ArrowRight, Clock, Hash
} from 'lucide-react'
import { useProjects } from '../../hooks/useProjects'
import { useSquads } from '../../hooks/useSquads'
import { mockTasks } from '../../api/mockData'

const CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'projects', label: 'Projects' },
  { id: 'tasks',    label: 'Tasks' },
  { id: 'squads',   label: 'Squads' },
  { id: 'members',  label: 'Members' },
]

const statusColors = {
  TODO:        'bg-gray-400',
  IN_PROGRESS: 'bg-blue-500',
  REVIEW:      'bg-amber-500',
  DONE:        'bg-green-500',
}

const priorityConfig = {
  HIGH:   { label: 'High',   class: 'text-red-500' },
  MEDIUM: { label: 'Medium', class: 'text-amber-500' },
  LOW:    { label: 'Low',    class: 'text-green-500' },
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const { data: projects = [] } = useProjects()
  const { data: squads = [] } = useSquads()

  // Collect all members from squads
  const allMembers = useMemo(() => {
    const map = new Map()
    squads.forEach(s => {
      s.members.forEach(m => {
        if (!map.has(m.email)) {
          map.set(m.email, { ...m, squadName: s.name, squadId: s.id })
        }
      })
    })
    return Array.from(map.values())
  }, [squads])

  // Search results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const items = []

    // Search projects
    if (category === 'all' || category === 'projects') {
      projects
        .filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
        .forEach(p => items.push({
          id: `project-${p.id}`,
          type: 'project',
          title: p.name,
          subtitle: p.description || 'No description',
          icon: FolderKanban,
          color: p.color,
          action: () => navigate(`/projects/${p.id}`),
        }))
    }

    // Search tasks
    if (category === 'all' || category === 'tasks') {
      mockTasks
        .filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
        .forEach(t => {
          const project = projects.find(p => p.id === t.projectId)
          items.push({
            id: `task-${t.id}`,
            type: 'task',
            title: t.title,
            subtitle: project ? `in ${project.name}` : '',
            status: t.status,
            priority: t.priority,
            icon: CheckSquare,
            action: () => navigate(`/projects/${t.projectId}`),
          })
        })
    }

    // Search squads
    if (category === 'all' || category === 'squads') {
      squads
        .filter(s => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
        .forEach(s => items.push({
          id: `squad-${s.id}`,
          type: 'squad',
          title: s.name,
          subtitle: `${s.members.length} members · ${s.description || ''}`,
          icon: UsersRound,
          color: s.color,
          action: () => navigate('/squads'),
        }))
    }

    // Search members
    if (category === 'all' || category === 'members') {
      allMembers
        .filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
        .forEach(m => items.push({
          id: `member-${m.id}-${m.email}`,
          type: 'member',
          title: m.name,
          subtitle: `${m.email} · ${m.squadName}`,
          icon: Users,
          action: () => navigate('/squads'),
        }))
    }

    return items.slice(0, 15)
  }, [query, category, projects, squads, allMembers, navigate])

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms-recent-searches') || '[]') }
    catch { return [] }
  })

  const addToRecent = useCallback((item) => {
    const updated = [
      { title: item.title, type: item.type },
      ...recentSearches.filter(r => r.title !== item.title)
    ].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }, [recentSearches])

  const clearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('pms-recent-searches')
  }

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setQuery('')
        setCategory('all')
        setSelectedIndex(0)
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }

      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        const item = results[selectedIndex]
        addToRecent(item)
        item.action()
        onClose()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, results, selectedIndex, onClose, addToRecent])

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // Reset index when results change
  useEffect(() => {
    setTimeout(() => setSelectedIndex(0), 0)
  }, [query, category])

  if (!open) return null

  const typeIcon = {
    project: FolderKanban,
    task: CheckSquare,
    squad: UsersRound,
    member: Users,
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Search modal */}
<div className="fixed top-[10%] sm:top-[15%] left-1/2 -translate-x-1/2 w-[95%] sm:w-full max-w-xl z-50">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search projects, tasks, squads, members..."
              className="flex-1 text-sm text-gray-900 placeholder:text-gray-400
                focus:outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery('')}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100
                  text-gray-400 cursor-pointer">
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 bg-gray-100
              text-gray-400 text-xs rounded-md font-mono">
              ESC
            </kbd>
          </div>

          {/* Category filters */}
          <div className="flex gap-1.5 px-4 py-2.5 border-b border-gray-50 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                  transition cursor-pointer
                  ${category === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {cat.label}
                {cat.id !== 'all' && query && (
                  <span className="ml-1 opacity-75">
                    {results.filter(r => r.type === cat.id.slice(0, -1)).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto" ref={listRef}>

            {/* No query — show recent searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                    <Clock size={11} /> Recent searches
                  </span>
                  <button onClick={clearRecent}
                    className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">
                    Clear
                  </button>
                </div>
                {recentSearches.map((item, i) => {
                  const Icon = typeIcon[item.type] || Hash
                  return (
                    <div
                      key={i}
                      onClick={() => setQuery(item.title)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50
                        cursor-pointer transition"
                    >
                      <Icon size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item.title}</span>
                      <span className="text-xs text-gray-300 ml-auto capitalize">{item.type}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* No query, no recent */}
            {!query && recentSearches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Search size={28} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">Start typing to search</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  Search across projects, tasks, squads and members
                </p>
              </div>
            )}

            {/* Query but no results */}
            {query && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Search size={28} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No results for "{query}"</p>
                <p className="text-xs text-gray-300 mt-0.5">Try a different search term</p>
              </div>
            )}

            {/* Search results */}
            {results.map((item, index) => {
              const Icon = item.icon
              const avatarColors = [
                'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
                'bg-green-100 text-green-600', 'bg-amber-100 text-amber-600',
              ]

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    addToRecent(item)
                    item.action()
                    onClose()
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition
                    ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  {/* Icon / Avatar */}
                  {item.type === 'member' ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                      text-xs font-semibold flex-shrink-0
                      ${avatarColors[item.title.charCodeAt(0) % avatarColors.length]}`}>
                      {item.title.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  ) : item.color ? (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center
                      text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: item.color }}>
                      {item.title.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center
                      justify-center flex-shrink-0">
                      <Icon size={15} className="text-gray-500" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate
                        ${index === selectedIndex ? 'text-blue-700 font-medium' : 'text-gray-800'}`}>
                        {item.title}
                      </p>

                      {/* Task status dot */}
                      {item.status && (
                        <span className={`w-2 h-2 rounded-full flex-shrink-0
                          ${statusColors[item.status]}`} />
                      )}

                      {/* Task priority */}
                      {item.priority && (
                        <span className={`text-xs flex-shrink-0
                          ${priorityConfig[item.priority]?.class}`}>
                          {priorityConfig[item.priority]?.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>

                  {/* Type badge + arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-300 capitalize">{item.type}</span>
                    <ArrowRight size={12} className={`transition
                      ${index === selectedIndex ? 'text-blue-400' : 'text-gray-200'}`} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center
            gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">↵</kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </>
  )
}