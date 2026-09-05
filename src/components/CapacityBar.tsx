export function CapacityBar({
  label,
  value,
  max,
  valueLabel,
  color = 'var(--color-petrol)',
}: {
  label: string
  value: number
  max: number
  valueLabel: string
  color?: string
}) {
  const width = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-ink">{label}</h3>
        <span className="tnum font-mono text-[12px] font-semibold" style={{ color }}>
          {valueLabel}
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-sm bg-paper">
        <div
          className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
