import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FLUXO_CAIXA, type FluxoAno } from '../data'
import { AXIS_TICK, CHART_CURSOR, CHART_EMBER, CHART_PETROL, CHART_RULE } from './chart-theme'

interface Row {
  ano: number
  receita: number
  clientes: number
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { dataKey: string; value: number }[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  const receita = payload.find((p) => p.dataKey === 'receita')?.value ?? 0
  const clientes = payload.find((p) => p.dataKey === 'clientes')?.value ?? 0
  return (
    <div className="rounded-md border border-rule bg-surface px-3 py-2 shadow-[0_4px_16px_rgba(23,23,23,0.08)]">
      <p className="eyebrow mb-1.5">Ano {label}</p>
      <p className="tnum font-mono text-[12px] font-semibold text-ink">
        {receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
      </p>
      <p className="tnum font-mono text-[11px] text-muted">{clientes.toLocaleString('pt-BR')} clientes</p>
    </div>
  )
}

export function ReceitaChart({ height = 260, fluxo = FLUXO_CAIXA }: { height?: number; fluxo?: FluxoAno[] }) {
  const data: Row[] = fluxo
    .filter((f) => f.ano > 0)
    .map((f) => ({
      ano: f.ano,
      receita: f.receita ?? 0,
      clientes: f.clientesAno ?? 0,
    }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={CHART_RULE} vertical={false} />
        <XAxis dataKey="ano" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: CHART_RULE }} dy={4} />
        <YAxis
          yAxisId="left"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(Number(v) / 1000).toLocaleString('pt-BR')}k`}
          width={46}
        />
        <YAxis yAxisId="right" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip cursor={{ fill: CHART_CURSOR }} content={<ChartTooltip />} />
        <Bar yAxisId="left" dataKey="receita" fill={CHART_PETROL} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Line yAxisId="right" type="monotone" dataKey="clientes" stroke={CHART_EMBER} strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
