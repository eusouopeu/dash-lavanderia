import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string
  detail?: string
  accent?: 'petrol' | 'ember' | 'ink'
  icon?: ReactNode
}

const ACCENT_BG: Record<NonNullable<KpiCardProps['accent']>, string> = {
  petrol: 'var(--color-petrol)',
  ember: 'var(--color-ember)',
  ink: 'var(--color-ink)',
}

export function KpiCard({ label, value, detail, accent = 'petrol', icon }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-rule bg-surface px-5 pb-5 pt-6">
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: ACCENT_BG[accent] }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <p className="tnum mt-3 font-mono text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
        {value}
      </p>
      {detail && <p className="mt-2 text-[12px] leading-relaxed text-muted">{detail}</p>}
    </div>
  )
}
