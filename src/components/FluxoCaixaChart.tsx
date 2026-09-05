import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FLUXO_CAIXA } from '../data'

const RULE = 'rgba(23,23,23,0.10)'
const MUTED = '#737373'
const PETROL = '#087f8c'
const EMBER = '#e76f32'

const AXIS_TICK = {
  fontSize: 10,
  fill: MUTED,
  fontFamily: '"IBM Plex Mono", monospace',
} as const

interface TooltipPayloadEntry {
  value: number
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const fcl = payload[0]?.value ?? 0
  return (
    <div className="rounded-md border border-rule bg-surface px-3 py-2 shadow-[0_4px_16px_rgba(23,23,23,0.08)]">
      <p className="eyebrow mb-1.5">Ano {label}</p>
      <p className="tnum font-mono text-[12px] font-semibold text-ink">
        {fcl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
      </p>
    </div>
  )
}

export function FluxoCaixaChart({ height = 260 }: { height?: number }) {
  const data = FLUXO_CAIXA.map((f) => ({ ano: f.ano, fcl: f.fcl }))
  const dataWithCumulative = data.reduce<(typeof data[number] & { acumulado: number })[]>((acc, d) => {
    const previous = acc[acc.length - 1]?.acumulado ?? 0
    acc.push({ ...d, acumulado: previous + d.fcl })
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={dataWithCumulative} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={RULE} vertical={false} />
        <XAxis dataKey="ano" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: RULE }} dy={4} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(Number(v) / 1000).toLocaleString('pt-BR')}k`}
          width={46}
        />
        <Tooltip cursor={{ fill: 'rgba(23,23,23,0.04)' }} content={<ChartTooltip />} />
        <Bar dataKey="fcl" radius={[3, 3, 0, 0]}>
          {dataWithCumulative.map((d) => (
            <Cell key={d.ano} fill={d.fcl < 0 ? EMBER : PETROL} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="acumulado" stroke="#171717" strokeWidth={1.5} dot={{ r: 2.5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
