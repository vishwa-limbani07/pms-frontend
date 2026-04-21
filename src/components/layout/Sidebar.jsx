import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, UsersRound, Settings,
  LogOut, ChevronLeft, ChevronRight, X,Clock
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderKanban,    label: 'Projects'  },
  { to: '/timelogs',  icon: Clock,            label: 'Time logs' },
  { to: '/squads',    icon: UsersRound,       label: 'Squads'    },
  { to: '/profile',   icon: Settings,         label: 'Settings'  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useUiStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const handleNavClick = () => {
    closeMobileSidebar()
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-gray-200
        ${!sidebarOpen && 'justify-center px-0'} lg:flex`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        {(sidebarOpen || mobileSidebarOpen) && (
          <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">ProjectNest</span>
        )}

        {/* Mobile close button */}
        <button
          onClick={closeMobileSidebar}
          className="lg:hidden ml-auto w-8 h-8 flex items-center justify-center
            rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Desktop toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-[4.5rem] w-6 h-6 bg-white
          border border-gray-200 rounded-full items-center justify-center shadow-sm
          hover:bg-gray-50 transition z-10 cursor-pointer"
      >
        {sidebarOpen
          ? <ChevronLeft size={12} className="text-gray-500" />
          : <ChevronRight size={12} className="text-gray-500" />
        }
      </button>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => Icon && (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
              ${!sidebarOpen && !mobileSidebarOpen && 'lg:justify-center'}
              ${isActive
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
            title={!sidebarOpen ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="whitespace-nowrap">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 pb-4 border-t border-gray-200 pt-3 space-y-1">
        <div className={`flex items-center gap-3 px-3 py-2
          ${!sidebarOpen && !mobileSidebarOpen && 'lg:justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xs font-semibold">{initials}</span>
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-600 hover:bg-red-50 hover:text-red-600 transition cursor-pointer
            ${!sidebarOpen && !mobileSidebarOpen && 'lg:justify-center'}`}
          title={!sidebarOpen ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`
        relative hidden lg:flex flex-col h-screen bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out flex-shrink-0
        ${sidebarOpen ? 'w-60' : 'w-16'}
      `}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeMobileSidebar} />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        z-50 flex flex-col lg:hidden transform transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>
    </>
  )
}