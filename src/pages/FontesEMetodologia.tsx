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
          <Panel title="Correção: erro de arrasto de fórmula em Clientes/ano">
            <p className="text-[13px] leading-relaxed text-muted">
              A planilha original reajustava a coluna "Clientes/ano" do fluxo de caixa pela mesma taxa de
              inflação (IPCA, 5,16% a.a.) usada para reajustar o ticket médio — um erro de arrastar a
              fórmula do Ano 1 até o Ano 5 na célula errada. O número de clientes é uma projeção de demanda
              (estimativa de Fermi), não um valor monetário: não deveria crescer com o reajuste de preços, e
              no estudo original chegava a se aproximar da capacidade máxima instalada nos últimos anos do
              horizonte. Este painel mantém Clientes/ano fixo em 8.851 (o valor correto do Ano 1) em todo o
              horizonte de 5 anos — apenas o ticket médio segue reajustado pelo IPCA. Como consequência,
              receita, margem de contribuição, EBITDA, FCO, FCL, VPL e TIR de todos os anos foram
              recalculados; os valores de financiamento (dívida de R$ 83.124,62, 30% do investimento) e o
              cronograma de juros do BNB (SAC, 12 meses de carência + 18 de amortização, CET 5,1922% a.a.)
              foram conferidos separadamente e já estavam corretos no documento original — nenhum ajuste foi
              necessário nessa parte.
            </p>
          </Panel>
          <Panel title="Correção: aluguel do espaço, pesquisado mas nunca lançado nos custos fixos">
            <p className="text-[13px] leading-relaxed text-muted">
              Depois da correção acima, a TIR do projeto (78,4% a.a.) ainda soava alta demais frente à TMA
              (11,19% a.a.). O motivo: o Anexo I do estudo original registra uma entrevista com a
              proprietária de uma lavanderia self-service real, informando um aluguel de R$ 2.000,00 —
              "ajustado para R$ 5.000,00" pelos próprios autores para refletir o custo de uma capital como
              Salvador. Essa verba foi pesquisada e decidida, mas nunca chegou a entrar na Tabela 05 (custos
              fixos mensais) nem na Tabela 16 (gastos fixos anuais) do documento original — uma unidade
              dentro do estacionamento do RedeMix, no Rio Vermelho, dificilmente operaria sem custo de
              locação. Este painel incorpora o aluguel de R$ 5.000,00/mês (reajustado pelo IPCA, como os
              demais custos fixos) a CUSTOS_FIXOS_MENSAIS e a todo o Fluxo de Caixa, o que reduz a TIR para
              ~50,9% a.a., o VPL de R$ 653,3 mil para R$ 347,6 mil, e o payback simples/descontado de
              1,32/1,51 para 1,83/2,15 anos — ainda um projeto viável, e com margens compatíveis com as dos
              concorrentes citados no próprio estudo (BubbleBox: payback 18–24 meses, margem até 60%; 60
              Minutos: payback 12–18 meses, margem 50%).
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Também foi corrigida a capacidade máxima instalada (lavagem + secagem): o estudo original usa
              20.520 clientes/ano numa nota isolada da Tabela 13 ("gargalo secadora: 19 ciclos/máq/dia"),
              mas a descrição do ciclo operacional (seção 2.8) deriva explicitamente "10 ciclos diários por
              [máquina], totalizando 30 atendimentos por dia ou aproximadamente 900 ciclos mensais" — ou
              seja, 10.800 clientes/ano. Usamos essa derivação, mais direta e consistente com o resto do
              texto; a utilização projetada do Ano 1 passa de 43,1% para 81,95% da capacidade.
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
