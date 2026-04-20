import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import NotificationDropdown from '../notifications/NotificationDropdown'
import GlobalSearch from '../search/GlobalSearch'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects':  'Projects',
  '/squads':    'Squads',
  '/profile':   'Profile & Settings',
}

export default function Topbar() {
  const { user } = useAuthStore()
  const { openMobileSidebar } = useUiStore()
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  const title = pageTitles[pathname] || 'PMS App'

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center
        justify-between px-4 sm:px-6 flex-shrink-0 gap-3">

        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={openMobileSidebar}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
              hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border
              border-gray-200 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
          >
            <Search size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400 hidden md:block">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white
              border border-gray-200 text-gray-400 text-xs rounded font-mono ml-1">
              Ctrl K
            </kbd>
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Avatar */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xs font-semibold">{initials}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}