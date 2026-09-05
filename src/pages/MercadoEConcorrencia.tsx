import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { CONCORRENTES, FERMI, SWOT_ATRIBUTOS, SWOT_GRID } from '../data'
import { formatNumber, formatPercent } from '../format'

function ConcorrenteCard({ c }: { c: (typeof CONCORRENTES)[number] }) {
  return (
    <article className="flex flex-col rounded-lg border border-rule bg-surface p-5">
      <div className="mb-3">
        <p className="eyebrow">{c.fundacao} · {c.modelo}</p>
        <h3 className="mt-1 text-sm font-bold text-ink">{c.nome}</h3>
      </div>
      <dl className="space-y-2 text-[12px]">
        <div>
          <dt className="font-semibold text-ink">Preço</dt>
          <dd className="text-muted">{c.precos}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Horário</dt>
          <dd className="text-muted">{c.horario}</dd>
        </div>
      </dl>
      <ul className="mt-3 space-y-1.5">
        {c.diferenciais.map((d) => (
          <li key={d} className="flex gap-2 text-[12px] leading-relaxed text-muted">
            <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-petrol" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
      {c.observacoes && (
        <p className="mt-3 rounded-md bg-ember-soft px-3 py-2 text-[11px] leading-relaxed text-[#a84b18]">
          {c.observacoes}
        </p>
      )}
    </article>
  )
}

function SwotGrid() {
  const cols = [...CONCORRENTES.map((c) => c.id), 'proposta']
  const labels: Record<string, string> = {
    bubblebox: 'BubbleBox',
    '60minutos': '60 Min.',
    lavaja: 'Lava Já',
    lavouesecou: 'Lavou&Secou',
    'laundromat-integral': 'LM Integral',
    proposta: 'Nossa Proposta',
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Matriz SWOT comparativa entre concorrentes e a proposta</caption>
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="px-3 py-2.5 align-bottom">
              <span className="eyebrow block">Atributo</span>
            </th>
            {cols.map((id) => (
              <th key={id} scope="col" className="px-3 py-2.5 text-center align-bottom">
                <span className={`eyebrow block ${id === 'proposta' ? '!text-petrol' : ''}`}>{labels[id]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SWOT_ATRIBUTOS.map((attr) => (
            <tr key={attr} className="border-b border-rule-soft last:border-0">
              <td className="px-3 py-2.5 text-[12px] font-medium text-ink">{attr}</td>
              {cols.map((id) => {
                const value = SWOT_GRID[attr][id]
                const isForca = value === 'Força'
                return (
                  <td key={id} className="px-3 py-2.5 text-center">
                    <span
                      className="inline-flex items-center justify-center rounded-sm px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]"
                      style={
                        isForca
                          ? { backgroundColor: 'var(--color-petrol-soft)', color: 'var(--color-petrol)' }
                          : { backgroundColor: 'var(--color-ember-soft)', color: '#a84b18' }
                      }
                    >
                      {value}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FermiBuildup() {
  const rows = [
    { label: 'Domicílios no Rio Vermelho', value: formatNumber(FERMI.domiciliosRioVermelho) },
    { label: '% sem máquina de lavar (metade do índice de Salvador, 38,8%)', value: formatPercent(FERMI.percentSemMaquinaLavar, 1) },
    { label: 'Domicílios sem máquina', value: formatNumber(FERMI.domiciliosSemMaquina) },
    { label: 'Visitas/mês por domicílio', value: `${FERMI.visitasPorMes}×` },
    { label: 'Ciclos locais/mês', value: formatNumber(FERMI.ciclosLocaisPorMes) },
  ]
  const rowsTurismo = [
    { label: 'Domicílios Salvador (base)', value: formatNumber(FERMI.domiciliosSalvador) },
    { label: 'Turistas/ano em Salvador', value: formatNumber(FERMI.turistasAnoSalvador) },
    { label: 'Conversão turística em ciclos', value: formatPercent(FERMI.conversaoTuristica, 0) },
    { label: 'Ciclos turísticos/mês', value: formatNumber(FERMI.ciclosTuristicosPorMes) },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="eyebrow mb-2">Demanda local (moradores)</p>
        <ul className="divide-y divide-rule-soft">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 py-2">
              <span className="text-[12px] text-muted">{r.label}</span>
              <span className="tnum shrink-0 font-mono text-[12px] font-semibold text-ink">{r.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow mb-2">Demanda transiente (turismo)</p>
        <ul className="divide-y divide-rule-soft">
          {rowsTurismo.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 py-2">
              <span className="text-[12px] text-muted">{r.label}</span>
              <span className="tnum shrink-0 font-mono text-[12px] font-semibold text-ink">{r.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-2 rounded-md bg-paper p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow mb-1">Mercado potencial total</p>
            <p className="tnum font-mono text-lg font-bold text-ink">
              {formatNumber(FERMI.totalCiclosPotenciaisPorMes)} ciclos/mês
            </p>
          </div>
          <div>
            <p className="eyebrow mb-1">Market share alvo</p>
            <p className="tnum font-mono text-lg font-bold text-ink">{formatPercent(FERMI.marketShareAlvo, 0)}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">Ciclos da unidade</p>
            <p className="tnum font-mono text-lg font-bold text-petrol">
              ~{formatNumber(FERMI.ciclosUnidadePorMes)}/mês (~{FERMI.ciclosUnidadePorDia}/dia)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MercadoEConcorrencia() {
  return (
    <>
      <PageHeader
        eyebrow="Rio Vermelho, Salvador/BA"
        title="Mercado e Concorrência"
        subtitle="Cinco concorrentes diretos no bairro, dimensionamento de mercado por estimativa de Fermi e análise SWOT"
      />
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <section className="space-y-4">
          <SectionHeader
            title="Concorrentes diretos"
            subtitle="Duas franquias (BubbleBox, 60 Minutos) e três negócios independentes no Rio Vermelho."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CONCORRENTES.map((c) => (
              <ConcorrenteCard key={c.id} c={c} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Matriz SWOT comparativa"
            subtitle="Força/Fraqueza por atributo, frente à proposta da nova unidade."
          />
          <Panel title="Quadro 02 — Análise baseada na metodologia SWOT">
            <SwotGrid />
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Dimensionamento de mercado — estimativa de Fermi"
            subtitle="Construção bottom-up da demanda potencial no bairro, combinando moradores e fluxo turístico."
          />
          <Panel title="Estimativa de Fermi">
            <FermiBuildup />
          </Panel>
        </section>
      </main>
    </>
  )
}
