import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

export function ReceitaChart({ height = 260 }: { height?: number }) {
  const data: Row[] = FLUXO_CAIXA.filter((f) => f.ano > 0).map((f) => ({
    ano: f.ano,
    receita: f.receita ?? 0,
    clientes: f.clientesAno ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={RULE} vertical={false} />
        <XAxis dataKey="ano" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: RULE }} dy={4} />
        <YAxis
          yAxisId="left"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(Number(v) / 1000).toLocaleString('pt-BR')}k`}
          width={46}
        />
        <YAxis yAxisId="right" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip cursor={{ fill: 'rgba(23,23,23,0.04)' }} content={<ChartTooltip />} />
        <Bar yAxisId="left" dataKey="receita" fill={PETROL} radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="clientes" stroke={EMBER} strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
