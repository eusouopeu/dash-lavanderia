import { NavLink } from 'react-router-dom'
import { SECTIONS } from './Sidebar'

const ITEMS = SECTIONS.flatMap((section) => section.items)

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto bg-ink lg:hidden">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          aria-label={item.label}
          title={item.label}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 ${isActive ? 'text-petrol' : 'text-white/45'}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="h-5 w-5" />
              <span
                className={`h-0.5 w-4 rounded-full ${isActive ? 'bg-petrol' : 'bg-transparent'}`}
                aria-hidden
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
