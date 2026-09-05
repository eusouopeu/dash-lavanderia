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
import { FLUXO_CAIXA, type FluxoAno } from '../data'
import { CHART_CURSOR, CHART_EMBER, CHART_INK, CHART_PETROL, CHART_RULE, AXIS_TICK } from './chart-theme'

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

export function FluxoCaixaChart({ height = 260, fluxo = FLUXO_CAIXA }: { height?: number; fluxo?: FluxoAno[] }) {
  const data = fluxo.map((f) => ({ ano: f.ano, fcl: f.fcl }))
  const dataWithCumulative = data.reduce<(typeof data[number] & { acumulado: number })[]>((acc, d) => {
    const previous = acc[acc.length - 1]?.acumulado ?? 0
    acc.push({ ...d, acumulado: previous + d.fcl })
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={dataWithCumulative} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={CHART_RULE} vertical={false} />
        <XAxis dataKey="ano" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: CHART_RULE }} dy={4} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(Number(v) / 1000).toLocaleString('pt-BR')}k`}
          width={46}
        />
        <Tooltip cursor={{ fill: CHART_CURSOR }} content={<ChartTooltip />} />
        <Bar dataKey="fcl" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {dataWithCumulative.map((d) => (
            <Cell key={d.ano} fill={d.fcl < 0 ? CHART_EMBER : CHART_PETROL} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="acumulado" stroke={CHART_INK} strokeWidth={1.5} dot={{ r: 2.5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
