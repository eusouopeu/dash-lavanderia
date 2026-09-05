import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { PREMISSAS, REFERENCIAS } from '../data'

export function FontesEMetodologia() {
  return (
    <>
      <PageHeader
        eyebrow="Como ler os números"
        title="Fontes e Metodologia"
        subtitle="Premissas do estudo, tratamento dado às inconsistências da fonte original e a lista de referências"
      />
      <main className="mx-auto max-w-4xl space-y-10 px-6 py-8 pb-24 lg:px-10 lg:pb-10">
        <section className="space-y-4">
          <SectionHeader
            title="Premissas"
            subtitle="As escolhas de cálculo que sustentam o estudo de viabilidade."
          />
          <Panel title="Premissas gerais">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-petrol" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  Horizonte de análise: {PREMISSAS.horizonteAnos} anos.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-petrol" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  Regime tributário: {PREMISSAS.regimeTributario}, CNAE {PREMISSAS.cnae}.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-petrol" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  Faturamento anual médio estimado: aproximadamente R$ 246.000,00 — enquadra o negócio como
                  microempresa (ME).
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-petrol" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  Não há funcionários fixos — o modelo é self-service; a gestão é remota pelo proprietário,
                  com contratação pontual de limpeza e manutenção.
                </p>
              </li>
            </ul>
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Nota sobre a fonte original"
            subtitle="O documento acadêmico-base contém inconsistências internas entre parágrafos e tabelas."
          />
          <Panel title="Reconciliação de valores">
            <p className="text-[13px] leading-relaxed text-muted">
              O estudo original, um trabalho acadêmico da UFBA (disciplina ADM154), recalcula alguns
              valores em tabelas posteriores sem atualizar os parágrafos anteriores que os citam — por
              exemplo, capital de giro, custos fixos mensais, TMA, payback, VPL e TIR aparecem com mais de
              um valor ao longo do texto. Este painel usa exclusivamente os valores consolidados e
              reconciliados a partir do estudo original: cada figura foi conferida aritmeticamente contra
              as tabelas finais do documento (Balanço do Ano 0, Fluxo de Caixa Livre do Projeto, quadro de
              WACC e as tabelas de Payback/VPL/TIR), garantindo que investimento total, financiamento,
              fluxo de caixa e métricas de viabilidade fechem entre si.
            </p>
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Referências"
            subtitle="Fontes institucionais e de mercado citadas no estudo original."
          />
          <ul className="space-y-4 rounded-lg border border-rule bg-surface p-5">
            {REFERENCIAS.map((r) => (
              <li key={r.url} className="border-l-2 border-rule pl-4 transition-colors hover:border-petrol">
                <p className="text-[13px] leading-relaxed text-ink">
                  <strong className="font-semibold">{r.autor}.</strong> {r.titulo}
                  {r.complemento ? ` — ${r.complemento}` : ''}. Disponível em:{' '}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-petrol underline decoration-petrol/40 underline-offset-[3px] transition-colors hover:decoration-petrol"
                  >
                    {r.url}
                  </a>
                  .
                </p>
                {r.nota && <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted">{r.nota}</p>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
