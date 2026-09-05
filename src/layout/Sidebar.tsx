import {
  BanknotesIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  HomeIcon,
  ScaleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { METRICAS_VIABILIDADE } from '../data'
import { formatBRLCompact, formatPercent } from '../format'

export interface NavItem {
  label: string
  to: string
  icon: typeof HomeIcon
  end?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

export const SECTIONS: NavSection[] = [
  {
    title: 'Visão geral',
    items: [{ label: 'Panorama geral', to: '/', icon: HomeIcon, end: true }],
  },
  {
    title: 'Mercado',
    items: [{ label: 'Mercado e concorrência', to: '/mercado-e-concorrencia', icon: UsersIcon }],
  },
  {
    title: 'Estudo financeiro',
    items: [
      { label: 'Estrutura do investimento', to: '/estrutura-do-investimento', icon: BuildingLibraryIcon },
      { label: 'Projeções financeiras', to: '/projecoes-financeiras', icon: ChartBarIcon },
      { label: 'Viabilidade do projeto', to: '/viabilidade-do-projeto', icon: ScaleIcon },
    ],
  },
  {
    title: 'Sobre',
    items: [{ label: 'Fontes e metodologia', to: '/fontes-e-metodologia', icon: BanknotesIcon }],
  },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="mb-9 px-1">
        <p className="eyebrow !text-white/45">Estudo de viabilidade</p>
        <p className="mt-2 text-[15px] font-semibold leading-tight text-paper">
          Lavanderia Self-Service
          <br />
          Rio Vermelho
        </p>
        <p className="mt-2 font-mono text-[11px] text-white/45">Franquia Laundromat · Salvador/BA</p>
      </div>

      <nav className="flex flex-1 flex-col gap-7">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="eyebrow mb-2.5 px-1 !text-white/40">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-white/10 font-semibold text-paper'
                          : 'font-medium text-white/60 hover:bg-white/5 hover:text-paper'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`h-4.5 w-4.5 ${isActive ? 'text-petrol' : 'text-white/40 group-hover:text-white/70'}`}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-4">
        <p className="eyebrow mb-2.5 px-1 !text-white/40">Métricas-chave</p>
        <ul className="space-y-1.5 px-1">
          <li className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-white/70">TMA</span>
            <span className="font-mono text-[11px] text-white/40">
              {formatPercent(METRICAS_VIABILIDADE.tma, 2)} a.a.
            </span>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-white/70">TIR</span>
            <span className="font-mono text-[11px] text-white/40">
              {formatPercent(METRICAS_VIABILIDADE.tir, 1)} a.a.
            </span>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-white/70">VPL</span>
            <span className="font-mono text-[11px] text-white/40">
              {formatBRLCompact(METRICAS_VIABILIDADE.vpl)}
            </span>
          </li>
        </ul>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink px-4 py-7 lg:flex">
      <SidebarContent />
    </aside>
  )
}
