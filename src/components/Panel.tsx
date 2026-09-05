import type { ReactNode } from 'react'

export function Panel({
  title,
  note,
  children,
  className = '',
  action,
}: {
  title: string
  note?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={`rounded-lg border border-rule bg-surface p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
          {note && <p className="mt-1 text-[11px] leading-relaxed text-muted">{note}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}

/** Cabeçalho de bloco: filete à esquerda, título e uma linha dizendo o que vem abaixo. */
export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-l-2 border-ink pl-4">
      <h2 className="text-lg font-bold tracking-[-0.015em] text-ink">{title}</h2>
      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">{subtitle}</p>
    </header>
  )
}
