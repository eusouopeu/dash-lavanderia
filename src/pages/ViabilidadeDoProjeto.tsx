import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { KpiCard } from '../components/KpiCard'
import { FLUXO_CAIXA, METRICAS_VIABILIDADE } from '../data'
import { formatBRL, formatBRLValue, formatPercent, formatYears } from '../format'

function SaldoAcumuladoTable() {
  const rows = FLUXO_CAIXA.reduce<{ ano: number; fcl: number; acumulado: number }[]>((acc, f) => {
    const previous = acc[acc.length - 1]?.acumulado ?? 0
    acc.push({ ano: f.ano, fcl: f.fcl, acumulado: previous + f.fcl })
    return acc
  }, [])
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-rule">
          <th scope="col" className="px-3 py-2.5 align-bottom">
            <span className="eyebrow block">Ano</span>
          </th>
          <th scope="col" className="px-3 py-2.5 align-bottom text-right">
            <span className="eyebrow block">FCL (R$)</span>
          </th>
          <th scope="col" className="px-3 py-2.5 align-bottom text-right">
            <span className="eyebrow block">Saldo acumulado (R$)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.ano} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
            <td className="px-3 py-2.5 text-[13px] font-medium text-ink">Ano {r.ano}</td>
            <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">
              {formatBRLValue(r.fcl)}
            </td>
            <td
              className="tnum px-3 py-2.5 text-right font-mono text-[13px] font-semibold"
              style={{ color: r.acumulado >= 0 ? 'var(--color-petrol)' : 'var(--color-ember)' }}
            >
              {formatBRLValue(r.acumulado)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ViabilidadeDoProjeto() {
  return (
    <>
      <PageHeader
        eyebrow="Métricas de avaliação"
        title="Viabilidade do Projeto"
        subtitle="Payback, VPL e TIR — todos verificados numericamente contra o fluxo de caixa e a TMA de 11,19% a.a."
      />
      <main className="mx-auto max-w-4xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <section className="flex items-start gap-4 rounded-lg border border-petrol/30 bg-petrol-soft p-5">
          <CheckCircleIcon className="mt-0.5 h-6 w-6 shrink-0 text-petrol" aria-hidden />
          <div>
            <p className="text-sm font-bold text-ink">Projeto viável</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/80">
              A TIR estimada ({formatPercent(METRICAS_VIABILIDADE.tir, 1)} a.a.) é muito superior à TMA do
              projeto ({formatPercent(METRICAS_VIABILIDADE.tma, 2)} a.a.), o VPL é positivo e o capital
              investido retorna em {formatYears(METRICAS_VIABILIDADE.paybackDescontadoAnos)} — mesmo pelo
              critério mais conservador (payback descontado).
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KpiCard
            label="Payback simples"
            value={formatYears(METRICAS_VIABILIDADE.paybackSimplesAnos)}
            accent="petrol"
          />
          <KpiCard
            label="Payback descontado"
            value={formatYears(METRICAS_VIABILIDADE.paybackDescontadoAnos)}
            detail="Já considera o custo de capital (TMA)"
            accent="petrol"
          />
          <KpiCard label="VPL @ TMA 11,19%" value={formatBRL(METRICAS_VIABILIDADE.vpl)} accent="ember" />
          <KpiCard label="TIR" value={formatPercent(METRICAS_VIABILIDADE.tir, 1)} accent="ember" />
        </div>

        <section className="space-y-4">
          <SectionHeader
            title="Saldo acumulado do fluxo de caixa"
            subtitle={`O saldo passa a positivo entre o Ano 1 e o Ano 2 — coerente com o payback simples de ${formatYears(METRICAS_VIABILIDADE.paybackSimplesAnos)}.`}
          />
          <Panel title="Fluxo de caixa livre e saldo acumulado">
            <SaldoAcumuladoTable />
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Leitura das métricas" subtitle="O que cada indicador diz sobre o projeto." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Panel title="Payback">
              <p className="text-[13px] leading-relaxed text-muted">
                Indica recuperação do investimento pouco depois do Ano 2, mesmo descontando o capital
                pela TMA — rápido para um investimento deste porte.
              </p>
            </Panel>
            <Panel title="VPL">
              <p className="text-[13px] leading-relaxed text-muted">
                Positivo e expressivo: o projeto gera valor muito além de remunerar o capital investido à
                taxa mínima de atratividade.
              </p>
            </Panel>
            <Panel title="TIR">
              <p className="text-[13px] leading-relaxed text-muted">
                Muito acima da TMA (11,19% a.a.), sugerindo retorno esperado substancialmente superior ao
                custo de capital do projeto.
              </p>
            </Panel>
          </div>
        </section>
      </main>
    </>
  )
}
