import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <Sidebar />
      <div id="main-content" className="min-w-0 flex-1" tabIndex={-1}>
        <Outlet />
        <BottomNav />
      </div>
    </div>
  )
}
