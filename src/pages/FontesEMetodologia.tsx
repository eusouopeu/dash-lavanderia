import { PageHeader } from '../layout/PageHeader'
import { Panel, SectionHeader } from '../components/Panel'
import { MODELO_BASE, PREMISSAS, REFERENCIAS } from '../data'
import { formatBRL, formatPercent, formatYears } from '../format'

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
          <Panel title="4ª revisão: capital de giro, CAPM, dupla contagem de juros e base de capacidade">
            <p className="text-[13px] leading-relaxed text-muted">
              Quatro correções adicionais, agora implementadas como fórmulas vivas em <code>model.ts</code>{' '}
              em vez de números digitados (o que também é o que torna o Painel de Cenários possível — ver
              "Painel de Cenários" no menu):
            </p>
            <ul className="mt-3 space-y-3">
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">Capital de giro sem o aluguel.</strong> A linha
                  "6 meses de custos fixos" do capital de giro continuava usando os custos fixos SEM o
                  aluguel (R$ 1.902,40 × 6 = R$ 11.414,40) — um resíduo da correção anterior, que só havia
                  chegado ao Fluxo de Caixa, não ao capital de giro. Corrigido para R$ 41.414,40 (com
                  aluguel), o investimento total sobe de R$ 277.082,07 para R$ 307.082,07.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">CAPM com prêmio de risco de mercado negativo.</strong>{' '}
                  O estudo original usava Rm = 13,00% &lt; Rf = 14,50% (Selic), produzindo um ERP negativo: o
                  beta alavancado de 1,29 reduzia o custo do capital próprio em vez de aumentá-lo — o oposto
                  do que o CAPM deveria fazer para um negócio mais arriscado que a carteira de mercado.
                  Substituímos por um ERP explícito e positivo de +4,50% a.a. (ordem de grandeza do prêmio
                  histórico do Ibovespa sobre a Selic), o que eleva o custo real do capital próprio de
                  15,65% para {formatPercent(0.2218, 2)} e o WACC/TMA de 11,19% para{' '}
                  {formatPercent(0.1576, 2)} a.a.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">Juros do BNB contados duas vezes.</strong> O
                  fluxo original deduzia os juros do financiamento ("Juros BNB") para chegar ao FCO e, na
                  sequência, descontava o resultado ao WACC — que já embute o custo da dívida (Kdr) na sua
                  composição. É dupla contagem do custo do capital de terceiros. O fluxo agora é um FCFF
                  (fluxo de caixa livre para a firma, sem juros): a estrutura de capital afeta o VPL apenas
                  via WACC, como deveria. Como o Simples Nacional já é deduzido como percentual da receita
                  (dentro da margem de contribuição, não do lucro), a depreciação não gera nenhum escudo
                  fiscal adicional — logo FCO = EBIT + Depreciação = EBITDA em todos os anos.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden />
                <p className="text-[13px] leading-relaxed text-muted">
                  <strong className="font-semibold text-ink">Ponto de equilíbrio em base diferente da utilização projetada.</strong>{' '}
                  A utilização projetada (81,95%) usava a capacidade combinada lavagem + secagem (10.800
                  clientes/ano), mas o ponto de equilíbrio usava a margem de contribuição "somente lavagem"
                  contra a capacidade "somente lavagem" (9.720 ciclos/ano) — duas bases diferentes lado a
                  lado, sugerindo que o projeto operava próximo do limite quando na verdade não estava. Com a
                  mesma base (clientes/ano, lavagem + secagem combinada) em ambos os lados, o ponto de
                  equilíbrio cai para ≈3.125 clientes/ano — cerca de 28,9% da capacidade máxima, uma margem
                  de segurança operacional bem mais folgada do que os ~81,6% sugeridos antes.
                </p>
              </li>
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              O efeito combinado das quatro correções: VPL de R$ 347,6 mil para {formatBRL(MODELO_BASE.metricas.vpl)}
              , TIR de 50,9% para {formatPercent(MODELO_BASE.metricas.tir, 1)} a.a., e payback
              simples/descontado de 1,83/2,15 para {formatYears(MODELO_BASE.metricas.paybackSimplesAnos)} /{' '}
              {formatYears(MODELO_BASE.metricas.paybackDescontadoAnos)} — ainda um projeto claramente viável
              (TIR muito acima da TMA), mas com uma folga bem menor do que os números originais sugeriam. O
              Painel de Cenários mostra o quanto essa folga se estreita ou se alarga sob premissas mais
              pessimistas ou otimistas.
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
