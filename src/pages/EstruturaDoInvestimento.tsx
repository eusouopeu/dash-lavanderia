import { BanknotesIcon, BuildingOffice2Icon, ScaleIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { KpiCard } from '../components/KpiCard'
import {
  ATIVOS_FIXOS,
  BALANCO_PATRIMONIAL_ANO0,
  CAPITAL_DE_GIRO,
  CUSTO_CAPITAL,
  CUSTOS_FIXOS_MENSAIS,
  FINANCIAMENTO,
  GASTOS_PRE_OPERACIONAIS,
  INVESTIMENTO_TOTAL,
  TOTAL_ATIVOS_FIXOS,
  TOTAL_CUSTOS_FIXOS_MENSAIS,
} from '../data'
import { formatBRL, formatBRLCompact, formatBRLValue, formatPercent } from '../format'

function InvestmentBreakdownBar() {
  const items = [
    { label: 'Gastos pré-operacionais', value: GASTOS_PRE_OPERACIONAIS.total, color: 'var(--color-ember)' },
    { label: 'Ativos fixos', value: TOTAL_ATIVOS_FIXOS, color: 'var(--color-petrol)' },
    { label: 'Capital de giro inicial', value: CAPITAL_DE_GIRO.total, color: '#171717' },
  ]
  return (
    <div>
      <div className="flex h-8 overflow-hidden rounded-md">
        {items.map((it) => (
          <div
            key={it.label}
            style={{ width: `${(it.value / INVESTIMENTO_TOTAL) * 100}%`, backgroundColor: it.color }}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2 text-[12px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: it.color }} />
            <span className="text-muted">{it.label}</span>
            <span className="tnum ml-auto font-mono font-semibold text-ink">{formatBRL(it.value)}</span>
            <span className="tnum w-12 shrink-0 text-right font-mono text-[11px] text-muted">
              {formatPercent(it.value / INVESTIMENTO_TOTAL)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AtivosFixosTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">Investimentos em ativos fixos</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="px-3 py-2.5 align-bottom">
              <span className="eyebrow block">Equipamento</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Qtd.</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Preço unit. (R$)</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Total (R$)</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Vida útil</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ATIVOS_FIXOS.map((item) => (
            <tr key={item.equipamento} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
              <td className="px-3 py-2.5 text-[13px] text-ink">{item.equipamento}</td>
              <td className="tnum px-3 py-2.5 text-right font-mono text-[12px] text-ink/80">{item.qtd}</td>
              <td className="tnum px-3 py-2.5 text-right font-mono text-[12px] text-ink/80">
                {formatBRLValue(item.precoUnit)}
              </td>
              <td className="tnum px-3 py-2.5 text-right font-mono text-[12px] font-semibold text-ink">
                {formatBRLValue(item.total)}
              </td>
              <td className="tnum px-3 py-2.5 text-right font-mono text-[12px] text-ink/80">
                {item.vidaUtilAnos} anos
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <td className="px-3 py-3 text-[13px] font-semibold text-ink">TOTAL</td>
            <td />
            <td />
            <td className="tnum px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
              {formatBRLValue(TOTAL_ATIVOS_FIXOS)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function CapitalDeGiroTable() {
  const rows = [
    { label: 'Estoque inicial', value: CAPITAL_DE_GIRO.estoqueInicial },
    { label: '6 meses de custos fixos', value: CAPITAL_DE_GIRO.seisMesesCustosFixos },
    { label: 'Provisão de prazo de recebimento', value: CAPITAL_DE_GIRO.provisaoPrazoRecebimento },
    { label: 'Fundo de contingência', value: CAPITAL_DE_GIRO.fundoContingencia },
  ]
  return (
    <ul className="divide-y divide-rule-soft">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
          <span className="text-[13px] text-muted">{r.label}</span>
          <span className="tnum font-mono text-[13px] font-semibold text-ink">{formatBRL(r.value)}</span>
        </li>
      ))}
      <li className="flex items-center justify-between gap-3 pt-3">
        <span className="text-[13px] font-semibold text-ink">Total</span>
        <span className="tnum font-mono text-[13px] font-bold text-ink">{formatBRL(CAPITAL_DE_GIRO.total)}</span>
      </li>
    </ul>
  )
}

function CustosFixosMensaisTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="sr-only">Custos fixos mensais, Ano 1</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="px-3 py-2.5 align-bottom">
              <span className="eyebrow block">Item</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Valor mensal (R$)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {CUSTOS_FIXOS_MENSAIS.map((item) => (
            <tr key={item.item} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
              <td className="px-3 py-2.5 text-[13px] text-ink">{item.item}</td>
              <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] font-semibold text-ink">
                {formatBRLValue(item.valor)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <td className="px-3 py-3 text-[13px] font-bold text-ink">TOTAL</td>
            <td className="tnum px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
              {formatBRLValue(TOTAL_CUSTOS_FIXOS_MENSAIS)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function BalancoPatrimonialTable() {
  const linhas = Math.max(
    BALANCO_PATRIMONIAL_ANO0.ativos.length,
    BALANCO_PATRIMONIAL_ANO0.passivoPatrimonioLiquido.length,
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">Balanço patrimonial do Ano 0</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="px-3 py-2.5 align-bottom">
              <span className="eyebrow block">Ativo</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Valor (R$)</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom border-l border-rule pl-4">
              <span className="eyebrow block">Passivo + patrimônio líquido</span>
            </th>
            <th scope="col" className="px-3 py-2.5 align-bottom text-right">
              <span className="eyebrow block">Valor (R$)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: linhas }).map((_, i) => {
            const ativo = BALANCO_PATRIMONIAL_ANO0.ativos[i]
            const passivo = BALANCO_PATRIMONIAL_ANO0.passivoPatrimonioLiquido[i]
            return (
              <tr key={i} className="border-b border-rule-soft last:border-0 hover:bg-paper/60">
                <td className="px-3 py-2.5 text-[13px] text-ink">{ativo?.label ?? ''}</td>
                <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">
                  {ativo ? formatBRLValue(ativo.valor) : ''}
                </td>
                <td className="border-l border-rule-soft px-3 py-2.5 pl-4 text-[13px] text-ink">
                  {passivo?.label ?? ''}
                </td>
                <td className="tnum px-3 py-2.5 text-right font-mono text-[13px] text-ink">
                  {passivo ? formatBRLValue(passivo.valor) : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <td className="px-3 py-3 text-[13px] font-bold text-ink">TOTAL ATIVO</td>
            <td className="tnum px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
              {formatBRLValue(BALANCO_PATRIMONIAL_ANO0.totalAtivos)}
            </td>
            <td className="border-l border-ink px-3 py-3 pl-4 text-[13px] font-bold text-ink">
              TOTAL PASSIVO + PL
            </td>
            <td className="tnum px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
              {formatBRLValue(BALANCO_PATRIMONIAL_ANO0.totalPassivoPL)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export function EstruturaDoInvestimento() {
  return (
    <>
      <PageHeader
        eyebrow="Ano 0 — balanço patrimonial"
        title="Estrutura do Investimento"
        subtitle={`Como os ${formatBRL(INVESTIMENTO_TOTAL)} do investimento inicial se dividem, e de onde vem o financiamento`}
      />
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Investimento total" value={formatBRLCompact(INVESTIMENTO_TOTAL)} accent="ink" />
          <KpiCard
            label="Financiamento — dívida (30%)"
            value={formatBRLCompact(FINANCIAMENTO.valorDivida)}
            detail={FINANCIAMENTO.credor}
            accent="ember"
          />
          <KpiCard
            label="Financiamento — capital próprio (70%)"
            value={formatBRLCompact(FINANCIAMENTO.valorCapitalProprio)}
            accent="petrol"
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              label="WACC / TMA do projeto"
              value={formatPercent(CUSTO_CAPITAL.wacc, 2)}
              detail="30% × Kdr + 70% × Ksr (real)"
              accent="ink"
              icon={<ScaleIcon className="h-4 w-4" />}
            />
            <KpiCard
              label="Custo real da dívida (Kdr)"
              value={formatPercent(CUSTO_CAPITAL.kdr, 2)}
              detail="BNB, linha FNE MPE"
              accent="ember"
              icon={<BanknotesIcon className="h-4 w-4" />}
            />
            <KpiCard
              label="Custo real do capital próprio (Ksr)"
              value={formatPercent(CUSTO_CAPITAL.ksReal, 2)}
              detail="Via CAPM"
              accent="petrol"
              icon={<BuildingOffice2Icon className="h-4 w-4" />}
            />
          </div>
          <p className="text-[11px] leading-relaxed text-muted">
            CAPM: Rf = 14,50% (Selic abr/2026) · ERP (prêmio de risco de mercado) = +4,50% a.a. · βL = 1,29
            (via Hamada) · CRP Brasil = 3,24% · prêmio de liquidez para pequenas empresas +4,00% ·
            deflacionado pelo IPCA (4,39%). O estudo original usava Rm − Rf com Rm = 13,00% &lt; Rf = 14,50%,
            um ERP negativo que reduzia (em vez de aumentar) o custo do capital próprio de um negócio mais
            arriscado que o mercado — ver "Fontes e Metodologia".
          </p>
        </div>

        <section className="space-y-4">
          <SectionHeader
            title="Composição do investimento"
            subtitle="Gastos pré-operacionais, ativos fixos e capital de giro inicial somam o investimento total."
          />
          <Panel title="Distribuição do investimento total">
            <InvestmentBreakdownBar />
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Ativos fixos"
            subtitle="Itens adquiridos para a operação — 13 linhas, coletadas em abril de 2026."
          />
          <Panel title={`Investimentos em ativos fixos · Total ${formatBRL(TOTAL_ATIVOS_FIXOS)}`}>
            <AtivosFixosTable />
            <p className="mt-4 text-[11px] leading-relaxed text-muted">
              O valor total supera em 12,99% a estimativa divulgada pela franqueadora (R$ 165.000,00) —
              atribuído pelos autores à inflação e ao reajuste de preços entre a divulgação da franquia e
              a coleta de preços do estudo.
            </p>
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Custos fixos mensais"
            subtitle="Base do Ano 1 (Tabela 05 do estudo original, com a verba de aluguel incorporada)."
          />
          <Panel title={`Custos fixos mensais · Total ${formatBRL(TOTAL_CUSTOS_FIXOS_MENSAIS)}`}>
            <CustosFixosMensaisTable />
            <p className="mt-4 text-[11px] leading-relaxed text-muted">
              O estudo original pesquisou um aluguel de R$ 5.000,00/mês para o espaço (Anexo I) mas nunca o
              incluiu nas tabelas de custos fixos. Incorporado aqui, reajustado pelo IPCA nos anos
              seguintes — ver "Fontes e Metodologia".
            </p>
          </Panel>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title={`Capital de giro inicial · ${formatBRL(CAPITAL_DE_GIRO.total)}`}>
            <CapitalDeGiroTable />
          </Panel>
          <Panel title={`Gastos pré-operacionais · ${formatBRL(GASTOS_PRE_OPERACIONAIS.total)}`}>
            <ul className="divide-y divide-rule-soft">
              <li className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-[13px] text-muted">Legalização e licenciamento</span>
                <span className="tnum font-mono text-[13px] font-semibold text-ink">
                  {formatBRL(GASTOS_PRE_OPERACIONAIS.legalizacaoLicenciamento)}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-[13px] text-muted">Estrutura, projetos e obra (container + engenharia)</span>
                <span className="tnum font-mono text-[13px] font-semibold text-ink">
                  {formatBRL(GASTOS_PRE_OPERACIONAIS.estruturaProjetosObra)}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3 pt-3">
                <span className="text-[13px] font-semibold text-ink">Total</span>
                <span className="tnum font-mono text-[13px] font-bold text-ink">
                  {formatBRL(GASTOS_PRE_OPERACIONAIS.total)}
                </span>
              </li>
            </ul>
          </Panel>
        </div>

        <section className="space-y-4">
          <SectionHeader
            title="Balanço patrimonial do Ano 0"
            subtitle="Ativo (capital de giro + pré-operacionais + ativos fixos) contra Passivo + PL (dívida + capital próprio)."
          />
          <Panel title="Balanço patrimonial — Ano 0">
            <BalancoPatrimonialTable />
          </Panel>
        </section>
      </main>
    </>
  )
}
