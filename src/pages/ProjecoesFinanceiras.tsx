import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { FluxoCaixaChart } from '../components/FluxoCaixaChart'
import { ReceitaChart } from '../components/ReceitaChart'
import { CapacityBar } from '../components/CapacityBar'
import {
  CAPACIDADE,
  CSP_ANO1,
  FLUXO_CAIXA,
  MARGEM_CONTRIBUICAO_UNITARIA,
  PONTO_EQUILIBRIO,
  TICKET_MEDIO_ANO1,
} from '../data'
import { formatBRL, formatNumber, formatPercent } from '../format'

function FluxoTable() {
  const rows: { label: string; key: keyof (typeof FLUXO_CAIXA)[number]; isCurrency?: boolean }[] = [
    { label: 'Ticket médio/cliente', key: 'ticketMedio', isCurrency: true },
    { label: 'Clientes/ano', key: 'clientesAno' },
    { label: 'Receita', key: 'receita', isCurrency: true },
    { label: 'Margem de contribuição total', key: 'margemContribuicaoTotal', isCurrency: true },
    { label: 'Gastos fixos desembolsáveis', key: 'gastosFixosDesembolsaveis', isCurrency: true },
    { label: 'EBITDA', key: 'ebitda', isCurrency: true },
    { label: 'Depreciação', key: 'depreciacao', isCurrency: true },
    { label: 'EBIT', key: 'ebit', isCurrency: true },
    { label: 'Juros BNB', key: 'jurosBNB', isCurrency: true },
    { label: 'Lucro operacional líquido', key: 'lucroOperacionalLiquido', isCurrency: true },
    { label: 'FCO', key: 'fco', isCurrency: true },
    { label: 'Investimentos', key: 'investimentos', isCurrency: true },
    { label: 'Variação capital de giro', key: 'variacaoCapitalGiro', isCurrency: true },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <caption className="sr-only">Fluxo de caixa livre do projeto, ano a ano</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="px-3 py-2.5 align-bottom">
              <span className="eyebrow block">Linha</span>
            </th>
            {FLUXO_CAIXA.map((f) => (
              <th key={f.ano} scope="col" className="px-3 py-2.5 align-bottom text-right">
                <span className="eyebrow block">Ano {f.ano}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
              <td className="whitespace-nowrap px-3 py-2 text-[12px] font-medium text-ink">{row.label}</td>
              {FLUXO_CAIXA.map((f) => {
                const v = f[row.key] as number | null
                return (
                  <td key={f.ano} className="tnum px-3 py-2 text-right font-mono text-[12px] text-ink/80">
                    {v === null
                      ? '—'
                      : row.isCurrency
                        ? formatBRL(v)
                        : formatNumber(v)}
                  </td>
                )
              })}
            </tr>
          ))}
          <tr className="border-t-2 border-ink">
            <td className="px-3 py-3 text-[13px] font-bold text-ink">FLUXO DE CAIXA LIVRE (FCL)</td>
            {FLUXO_CAIXA.map((f) => (
              <td key={f.ano} className="tnum px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
                {formatBRL(f.fcl)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function MargemTable() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-rule">
          <th scope="col" className="px-3 py-2.5 align-bottom">
            <span className="eyebrow block">Ano</span>
          </th>
          <th scope="col" className="px-3 py-2.5 align-bottom text-right">
            <span className="eyebrow block">MC unitária</span>
          </th>
          <th scope="col" className="px-3 py-2.5 align-bottom text-right">
            <span className="eyebrow block">% da receita (IMC)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {MARGEM_CONTRIBUICAO_UNITARIA.map((m) => (
          <tr key={m.ano} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
            <td className="px-3 py-2.5 text-[13px] font-medium text-ink">Ano {m.ano}</td>
            <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">{formatBRL(m.valor)}</td>
            <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-muted">
              {formatPercent(m.percentReceita, 2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ProjecoesFinanceiras() {
  return (
    <>
      <PageHeader
        eyebrow="5 anos de operação"
        title="Projeções Financeiras"
        subtitle="Fluxo de caixa livre, crescimento de receita, margem de contribuição e utilização de capacidade"
      />
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <section className="space-y-4">
          <SectionHeader
            title="Fluxo de caixa livre do projeto"
            subtitle="Linha a linha, do ticket médio ao FCL — Tabela 13 do estudo, valores consolidados."
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="FCL por ano">
              <FluxoCaixaChart />
            </Panel>
            <Panel
              title="Receita e clientes"
              note="Barras: receita (eixo esquerdo) · linha: clientes/ano (eixo direito, constante)."
            >
              <ReceitaChart />
            </Panel>
          </div>
          <Panel title="Demonstrativo completo, ano a ano">
            <FluxoTable />
          </Panel>
          <p className="text-[11px] leading-relaxed text-muted">
            Clientes/ano é mantido constante em 8.851 do Ano 1 ao Ano 5: a planilha original arrastava essa
            célula junto com o reajuste inflacionário do ticket médio, fazendo a base de clientes crescer
            todo ano sem justificativa de mercado — apenas o ticket médio (reajustado pelo IPCA) deveria
            variar. Receita, MC, EBITDA, FCO e FCL de cada ano refletem essa correção.
          </p>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Margem de contribuição"
            subtitle={`Ticket médio Ano 1: lavagem ${formatBRL(TICKET_MEDIO_ANO1.lavagem)} + secagem ${formatBRL(TICKET_MEDIO_ANO1.secagem)} = ${formatBRL(TICKET_MEDIO_ANO1.total)}/cliente, reajustado pelo IPCA (5,16% a.a.) nos anos seguintes.`}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Margem de contribuição unitária">
              <MargemTable />
            </Panel>
            <Panel title="Decomposição do custo variável (Ano 1)">
              <ul className="divide-y divide-rule-soft">
                <li className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-muted">CSP lavagem</span>
                  <span className="tnum font-mono font-semibold text-ink">{formatBRL(CSP_ANO1.cspLavagem)}</span>
                </li>
                <li className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-muted">CSP secagem</span>
                  <span className="tnum font-mono font-semibold text-ink">{formatBRL(CSP_ANO1.cspSecagem)}</span>
                </li>
                <li className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-muted">Taxa de cartão</span>
                  <span className="tnum font-mono font-semibold text-ink">{formatPercent(CSP_ANO1.taxaCartao, 2)}</span>
                </li>
                <li className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-muted">Simples Nacional</span>
                  <span className="tnum font-mono font-semibold text-ink">{formatPercent(CSP_ANO1.simplesNacional, 2)}</span>
                </li>
              </ul>
            </Panel>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Receita vs. capacidade"
            subtitle="Duas bases distintas de capacidade: lavagem+secagem combinada (gargalo secadora) e apenas lavagem."
          />
          <Panel title="Utilização da capacidade instalada">
            <div className="space-y-5">
              <CapacityBar
                label="Clientes projetados (constante, Anos 1–5) vs. capacidade máxima (lavagem + secagem)"
                value={CAPACIDADE.clientesProjetadosAno1}
                max={CAPACIDADE.maximaClientesAno}
                valueLabel={`${formatNumber(CAPACIDADE.clientesProjetadosAno1)} / ${formatNumber(CAPACIDADE.maximaClientesAno)} (${formatPercent(CAPACIDADE.taxaUtilizacaoAno1)})`}
              />
              <CapacityBar
                label="Ponto de equilíbrio — cestos/ano vs. capacidade máxima (somente lavagem)"
                value={PONTO_EQUILIBRIO.cestosAno}
                max={CAPACIDADE.maximaSomenteLavagemCiclosAno}
                valueLabel={`${formatNumber(PONTO_EQUILIBRIO.cestosAno)} / ${formatNumber(CAPACIDADE.maximaSomenteLavagemCiclosAno)} (${formatPercent(PONTO_EQUILIBRIO.taxaUtilizacao)})`}
                color="var(--color-ember)"
              />
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted">
              Ponto de equilíbrio recalculado: gastos fixos anuais ({formatBRL(PONTO_EQUILIBRIO.gastosFixosAnuais)},
              Tabela 16 — Ano 1) ÷ margem de contribuição unitária de {formatBRL(PONTO_EQUILIBRIO.margemContribuicaoUnitariaLavagem)}/cesto
              (base "somente lavagem") ≈ {formatNumber(PONTO_EQUILIBRIO.cestosAno)} cestos/ano
              (~{formatNumber(PONTO_EQUILIBRIO.cestosMes)}/mês). O estudo original mistura essa base com a
              capacidade combinada de 20.520 clientes/ano — aqui as duas capacidades são mantidas
              separadas.
            </p>
          </Panel>
        </section>
      </main>
    </>
  )
}
