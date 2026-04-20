import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, UserPlus, CheckCircle, MessageSquare, ArrowRight,
  Trash2, CheckCheck, X, Inbox
} from 'lucide-react'
import {
  useNotifications, useMarkAsRead, useMarkAllRead,
  useDeleteNotification, useClearAllNotifications,
} from '../../hooks/useNotifications'

const TYPE_CONFIG = {
  task_assigned:   { icon: ArrowRight,   color: 'bg-blue-100 text-blue-600', label: 'Assigned' },
  status_changed:  { icon: CheckCircle,  color: 'bg-green-100 text-green-600', label: 'Status' },
  comment_added:   { icon: MessageSquare, color: 'bg-purple-100 text-purple-600', label: 'Comment' },
  member_invited:  { icon: UserPlus,     color: 'bg-amber-100 text-amber-600', label: 'Invited' },
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const ref = useRef(null)
  const navigate = useNavigate()

  const { data: notifications = [] } = useNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const { mutate: markAllRead } = useMarkAllRead()
  const { mutate: deleteNotification } = useDeleteNotification()
  const { mutate: clearAll } = useClearAllNotifications()

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter)

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleClick = (notification) => {
    if (!notification.read) markAsRead(notification.id)
    if (notification.projectId) {
      navigate(`/projects/${notification.projectId}`)
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={ref}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg
          hover:bg-gray-100 transition cursor-pointer"
      >
        <Bell size={18} className="text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center
            justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[400px]
  bg-white border border-gray-200
          rounded-2xl shadow-xl z-50 overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700
                      px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    title="Mark all as read">
                    <CheckCheck size={13} /> Read all
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={() => clearAll()}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500
                      px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Clear all">
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { id: 'all',             label: 'All' },
                { id: 'unread',          label: 'Unread' },
                { id: 'task_assigned',   label: 'Assigned' },
                { id: 'status_changed',  label: 'Status' },
                { id: 'comment_added',   label: 'Comments' },
                { id: 'member_invited',  label: 'Members' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                    transition cursor-pointer
                    ${filter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Inbox size={28} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            )}

            {filtered.map(notification => {
              const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.task_assigned
              const Icon = config.icon
              return (
                <div
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer
                    border-b border-gray-50 last:border-0 group
                    ${!notification.read ? 'bg-blue-50/30' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    flex-shrink-0 mt-0.5 ${config.color}`}>
                    <Icon size={14} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${!notification.read ? 'text-gray-600' : 'text-gray-400'}`}>
                      {notification.message}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id) }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center
                      justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-500
                      transition flex-shrink-0 mt-0.5 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">
                {notifications.length} total · {unreadCount} unread
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}