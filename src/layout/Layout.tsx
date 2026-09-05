import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  )
}
