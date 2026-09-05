import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  meta?: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, meta, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-rule px-6 pb-6 pt-8 lg:px-10">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h1 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink lg:text-[32px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        {meta && <p className="mt-1 font-mono text-[11px] text-muted">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
