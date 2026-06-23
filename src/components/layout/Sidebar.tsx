import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  UserPlus,
  CreditCard,
  ClipboardList,
  UserMinus,
  FileDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ClubLogo } from '../ClubLogo'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add-player', label: 'Add Player', icon: UserPlus },
  { path: '/add-payment', label: 'Add Payment', icon: CreditCard },
  { path: '/records', label: 'Records', icon: ClipboardList },
  { path: '/delete-player', label: 'Delete Player', icon: UserMinus },
  { path: '/download-report', label: 'Download Report', icon: FileDown },
]

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAuth()

  return (
    <>
      <div className="mb-8 px-1">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 backdrop-blur-sm">
          <ClubLogo size="md" />
          <div>
            <p className="font-display text-sm font-bold leading-tight text-zinc-100">
              Star Badminton
            </p>
            <p className="text-xs font-medium text-cyan-400/80">Club Dargai</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive ? 'nav-link-active' : 'nav-link-inactive'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        className="fixed left-4 top-4 z-40 rounded-xl border border-zinc-700/60 bg-zinc-900/90 p-2.5 text-zinc-300 shadow-glass backdrop-blur-xl lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col border-r border-zinc-800 bg-zinc-950/95 p-5 backdrop-blur-xl">
            <button
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:text-zinc-200"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <aside className="relative hidden w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/80 p-5 backdrop-blur-xl lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />
        <div className="relative flex h-full flex-col">
          <NavContent />
        </div>
      </aside>
    </>
  )
}
