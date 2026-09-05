import { useMemo, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { KpiCard } from '../components/KpiCard'
import { FluxoCaixaChart } from '../components/FluxoCaixaChart'
import {
  CENARIOS,
  MODELO_BASE,
  PREMISSAS_BASE,
  calcularModelo,
  type Premissas,
} from '../data'
import { formatBRL, formatBRLCompact, formatPercent, formatYears } from '../format'

interface SliderConfig {
  key: keyof Premissas | 'erp' | 'aluguel'
  label: string
  min: number
  max: number
  step: number
  format: (v: number) => string
  get: (p: Premissas) => number
  set: (p: Premissas, v: number) => Premissas
}

const SLIDERS: SliderConfig[] = [
  {
    key: 'ticketMedioAno1',
    label: 'Ticket médio, Ano 1 (R$/cliente)',
    min: 25,
    max: 50,
    step: 0.5,
    format: (v) => formatBRL(v),
    get: (p) => p.ticketMedioAno1,
    set: (p, v) => ({ ...p, ticketMedioAno1: v }),
  },
  {
    key: 'clientesAno',
    label: 'Clientes/ano (demanda)',
    min: 4_000,
    max: 10_800,
    step: 50,
    format: (v) => `${v.toLocaleString('pt-BR')} clientes/ano`,
    get: (p) => p.clientesAno,
    set: (p, v) => ({ ...p, clientesAno: Math.round(v) }),
  },
  {
    key: 'custosFixosMensaisAno1',
    label: 'Custos fixos mensais, Ano 1 (R$, inclui aluguel)',
    min: 4_000,
    max: 12_000,
    step: 100,
    format: (v) => formatBRL(v),
    get: (p) => p.custosFixosMensaisAno1,
    set: (p, v) => ({ ...p, custosFixosMensaisAno1: v }),
  },
  {
    key: 'ipcaAnual',
    label: 'IPCA — reajuste anual (%)',
    min: 0.02,
    max: 0.12,
    step: 0.005,
    format: (v) => formatPercent(v, 1),
    get: (p) => p.ipcaAnual,
    set: (p, v) => ({ ...p, ipcaAnual: v }),
  },
  {
    key: 'erp',
    label: 'Prêmio de risco de mercado — ERP (%, afeta o WACC)',
    min: 0.02,
    max: 0.08,
    step: 0.0025,
    format: (v) => formatPercent(v, 2),
    get: (p) => p.capm.erp,
    set: (p, v) => ({ ...p, capm: { ...p.capm, erp: v } }),
  },
]

function ScenarioRow({ premissas, destaque }: { premissas: Premissas; destaque?: boolean }) {
  const m = useMemo(() => calcularModelo(premissas), [premissas])
  return (
    <tr className={`border-b border-rule-soft last:border-0 ${destaque ? 'bg-petrol-soft/40' : ''}`}>
      <td className="px-3 py-2.5 text-[13px] font-semibold text-ink">{premissas.nome}</td>
      <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">{formatBRLCompact(m.metricas.vpl)}</td>
      <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">{formatPercent(m.metricas.tir, 1)}</td>
      <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">
        {formatYears(m.metricas.paybackSimplesAnos)}
      </td>
      <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">
        {formatYears(m.metricas.paybackDescontadoAnos)}
      </td>
      <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-muted">
        {formatPercent(m.custoCapital.wacc, 2)}
      </td>
    </tr>
  )
}

export function PainelDeCenarios() {
  const [premissas, setPremissas] = useState<Premissas>(PREMISSAS_BASE)
  const modelo = useMemo(() => calcularModelo(premissas), [premissas])
  const isCustomizado = premissas.nome === 'Personalizado'

  function aplicarPreset(preset: Premissas) {
    setPremissas(preset)
  }

  function updateSlider(config: SliderConfig, value: number) {
    setPremissas((prev) => ({ ...config.set(prev, value), nome: 'Personalizado', descricao: 'Cenário construído manualmente pelos sliders abaixo.' }))
  }

  return (
    <>
      <PageHeader
        eyebrow="Explore as premissas"
        title="Painel de Cenários"
        subtitle="Três cenários prontos (pessimista, base, otimista) e sliders para construir o seu — tudo recalculado ao vivo pelas mesmas fórmulas do modelo."
        actions={
          <button
            type="button"
            onClick={() => aplicarPreset(PREMISSAS_BASE)}
            className="flex items-center gap-1.5 rounded-md border border-rule px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-paper"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
            Restaurar caso-base
          </button>
        }
      />

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <section className="space-y-4">
          <SectionHeader
            title="Cenários prontos"
            subtitle="Pessimista e otimista variam demanda, ticket, custos fixos, IPCA e prêmio de risco em relação ao caso-base — ver Fontes e Metodologia para o racional de cada um."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CENARIOS.map((cenario) => {
              const ativo = !isCustomizado && premissas.nome === cenario.nome
              return (
                <button
                  key={cenario.nome}
                  type="button"
                  onClick={() => aplicarPreset(cenario)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    ativo ? 'border-petrol bg-petrol-soft' : 'border-rule bg-surface hover:border-petrol/50'
                  }`}
                >
                  <p className="text-[13px] font-bold text-ink">{cenario.nome}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{cenario.descricao}</p>
                </button>
              )
            })}
          </div>

          <Panel title="Comparação dos três cenários">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="px-3 py-2.5 align-bottom">
                      <span className="eyebrow block">Cenário</span>
                    </th>
                    <th scope="col" className="px-3 py-2.5 align-bottom text-right">
                      <span className="eyebrow block">VPL</span>
                    </th>
                    <th scope="col" className="px-3 py-2.5 align-bottom text-right">
                      <span className="eyebrow block">TIR</span>
                    </th>
                    <th scope="col" className="px-3 py-2.5 align-bottom text-right">
                      <span className="eyebrow block">Payback simples</span>
                    </th>
                    <th scope="col" className="px-3 py-2.5 align-bottom text-right">
                      <span className="eyebrow block">Payback descontado</span>
                    </th>
                    <th scope="col" className="px-3 py-2.5 align-bottom text-right">
                      <span className="eyebrow block">WACC</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CENARIOS.map((cenario) => (
                    <ScenarioRow key={cenario.nome} premissas={cenario} destaque={cenario.nome === 'Base'} />
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Cenário personalizado"
            subtitle={
              isCustomizado
                ? 'Ajustando as premissas abaixo — o modelo inteiro (fluxo, WACC, VPL, TIR, payback) é recalculado a cada mudança.'
                : `Partindo do cenário "${premissas.nome}" — mova qualquer slider para começar a personalizar.`
            }
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Premissas">
              <div className="space-y-5">
                {SLIDERS.map((config) => {
                  const value = config.get(premissas)
                  return (
                    <div key={config.key}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <label htmlFor={`slider-${config.key}`} className="text-[12px] font-medium text-ink">
                          {config.label}
                        </label>
                        <span className="tnum font-mono text-[12px] font-semibold text-petrol">
                          {config.format(value)}
                        </span>
                      </div>
                      <input
                        id={`slider-${config.key}`}
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={value}
                        onChange={(e) => updateSlider(config, Number(e.target.value))}
                        className="w-full accent-petrol"
                        aria-valuetext={config.format(value)}
                      />
                    </div>
                  )
                })}
              </div>
            </Panel>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <KpiCard label="VPL" value={formatBRLCompact(modelo.metricas.vpl)} accent="petrol" />
                <KpiCard label="TIR" value={formatPercent(modelo.metricas.tir, 1)} accent="petrol" />
                <KpiCard
                  label="Payback simples"
                  value={formatYears(modelo.metricas.paybackSimplesAnos)}
                  accent="ember"
                />
                <KpiCard label="WACC / TMA" value={formatPercent(modelo.custoCapital.wacc, 2)} accent="ink" />
              </div>
              <Panel
                title="Fluxo de caixa livre — cenário atual"
                note={
                  modelo.metricas.vpl > 0
                    ? 'VPL positivo: cenário viável ao custo de capital calculado.'
                    : 'VPL negativo: neste cenário, o projeto destrói valor ao custo de capital calculado.'
                }
              >
                <FluxoCaixaChart height={220} fluxo={modelo.fluxo} />
              </Panel>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-muted">
            Referência do caso-base: VPL {formatBRLCompact(MODELO_BASE.metricas.vpl)}, TIR{' '}
            {formatPercent(MODELO_BASE.metricas.tir, 1)}, payback simples{' '}
            {formatYears(MODELO_BASE.metricas.paybackSimplesAnos)}. Todas as fórmulas usadas aqui são as
            mesmas de <code>model.ts</code> — nenhum número nesta página é digitado à mão.
          </p>
        </section>
      </main>
    </>
  )
}
