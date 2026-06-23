import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-950 bg-grid-pattern bg-grid">
      <Sidebar />
      <main className="relative flex-1 overflow-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 pt-16 lg:px-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
