import { PrinterIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '../layout/PageHeader'
import {
  CENARIOS,
  CONCORRENTES,
  CUSTOS_FIXOS_MENSAIS,
  FERMI,
  FLUXO_CAIXA,
  FRANQUIA_INFO,
  LOCALIZACAO,
  MODELO_BASE,
  PREMISSAS,
  calcularModelo,
} from '../data'
import { formatBRL, formatBRLValue, formatNumber, formatPercent, formatYears } from '../format'

function Secao({
  numero,
  titulo,
  children,
  quebrarPagina,
}: {
  numero: string
  titulo: string
  children: React.ReactNode
  quebrarPagina?: boolean
}) {
  return (
    <section className={`space-y-4 ${quebrarPagina ? 'print-page-break' : ''}`}>
      <h2 className="border-b-2 border-ink pb-2 text-lg font-bold tracking-[-0.01em] text-ink">
        <span className="mr-2 font-mono text-petrol">{numero}</span>
        {titulo}
      </h2>
      <div className="space-y-3 text-[13px] leading-relaxed text-ink/85">{children}</div>
    </section>
  )
}

function TabelaSimples({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | number)[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-[12px]">
        <thead>
          <tr className="border-b border-ink/40">
            {headers.map((h, i) => (
              <th key={h} scope="col" className={`px-2 py-2 font-semibold text-ink ${i > 0 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-rule-soft last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-2 py-1.5 ${ci > 0 ? 'tnum text-right font-mono' : ''} text-ink/85`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RelatorioCompleto() {
  const m = MODELO_BASE

  return (
    <>
      <PageHeader
        eyebrow="Documento completo, pronto para exportação"
        title="Relatório do Estudo de Viabilidade"
        subtitle="Versão aprimorada e reconciliada do trabalho acadêmico original — clique em 'Exportar PDF' e use 'Salvar como PDF' na caixa de impressão do navegador."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print flex items-center gap-1.5 rounded-md bg-ink px-3.5 py-2 text-[12px] font-semibold text-paper transition-opacity hover:opacity-90"
          >
            <PrinterIcon className="h-4 w-4" />
            Exportar PDF
          </button>
        }
      />

      <main className="mx-auto max-w-3xl space-y-12 px-6 py-10 pb-24 lg:px-10 lg:pb-10">
        <header className="space-y-2 border-b-4 border-ink pb-6">
          <p className="eyebrow">Estudo de viabilidade econômico-financeira</p>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-ink">
            Lavanderia Self-Service — Franquia {FRANQUIA_INFO.nome}
            <br />
            {LOCALIZACAO.bairro}, {LOCALIZACAO.cidade}
          </h1>
          <p className="text-[13px] text-muted">
            {LOCALIZACAO.endereco}. Horizonte de análise: {PREMISSAS.horizonteAnos} anos. Regime tributário:{' '}
            {PREMISSAS.regimeTributario} (CNAE {PREMISSAS.cnae}).
          </p>
          <p className="font-mono text-[11px] text-muted">
            Baseado no trabalho acadêmico "Avaliação do Projeto: Lavanderia Self-Service" (UFBA, disciplina
            ADM154) — valores reconciliados e recalculados por fórmulas vivas (ver Seção 2).
          </p>
        </header>

        <Secao numero="0" titulo="Resumo executivo">
          <p>
            O projeto avalia a implantação de uma unidade da franquia {FRANQUIA_INFO.nome} no formato
            self-service, dentro do estacionamento RedeMix na Rua Oswaldo Cruz, bairro do Rio Vermelho,
            Salvador/BA. O investimento inicial total é de {formatBRL(m.investimentoTotal)}, financiado 30%
            por dívida (BNB, linha FNE MPE) e 70% por capital próprio, a um custo de capital (WACC/TMA) real
            de {formatPercent(m.custoCapital.wacc, 2)} a.a.
          </p>
          <p>
            Ao longo do horizonte de 5 anos, o projeto gera um Valor Presente Líquido (VPL) de{' '}
            {formatBRL(m.metricas.vpl)}, uma Taxa Interna de Retorno (TIR) de{' '}
            {formatPercent(m.metricas.tir, 1)} a.a. — substancialmente acima da TMA — e recupera o capital
            investido em {formatYears(m.metricas.paybackSimplesAnos)} (payback simples) ou{' '}
            {formatYears(m.metricas.paybackDescontadoAnos)} (payback descontado). O projeto é considerado{' '}
            <strong className="font-semibold text-ink">viável</strong>, com uma margem de segurança
            operacional confortável: a demanda projetada para o Ano 1 ({formatNumber(m.capacidade.clientesProjetadosAno1)}{' '}
            clientes/ano) opera a {formatPercent(m.capacidade.taxaUtilizacaoAno1)} da capacidade máxima
            instalada, enquanto o ponto de equilíbrio requer apenas {formatPercent(m.pontoEquilibrio.taxaUtilizacao)}{' '}
            dessa capacidade.
          </p>
          <p>
            Esta versão corrige seis inconsistências identificadas no documento acadêmico original — desde
            uma célula de planilha arrastada incorretamente até uma dupla contagem do custo da dívida no
            fluxo de caixa — detalhadas na Seção 2. O efeito líquido das correções é uma TIR bem mais
            conservadora do que a do estudo original (78,4% a.a. antes de qualquer correção), mas ainda
            claramente superior ao custo de capital do projeto.
          </p>
        </Secao>

        <Secao numero="1" titulo="Localização e modelo de negócio">
          <p>
            A unidade opera em formato container de {LOCALIZACAO.area}, dentro do estacionamento RedeMix —
            o mesmo espaço de um McDonald's, a cerca de 10 minutos de uma academia Selfit. O ciclo completo
            de lavagem e secagem dura aproximadamente {LOCALIZACAO.cicloDuracaoMin} minutos.
          </p>
          <p>
            A franquia {FRANQUIA_INFO.nome} tem origem {FRANQUIA_INFO.origem}, opera no Brasil desde{' '}
            {FRANQUIA_INFO.brasilDesde} com {FRANQUIA_INFO.unidadesBrasil} unidades ({FRANQUIA_INFO.unidadesSalvador}{' '}
            em Salvador), sob o modelo de {FRANQUIA_INFO.modelo.toLowerCase()}. O público-alvo declarado é:{' '}
            {FRANQUIA_INFO.publicoAlvo.toLowerCase()}.
          </p>
          <p>
            A estimativa de Fermi que sustenta a demanda projetada combina domicílios locais sem máquina de
            lavar ({formatNumber(FERMI.domiciliosSemMaquina)}, {formatPercent(FERMI.percentSemMaquinaLavar)}{' '}
            dos {formatNumber(FERMI.domiciliosRioVermelho)} domicílios do Rio Vermelho) com uma fração dos{' '}
            {formatNumber(FERMI.turistasAnoSalvador)} turistas/ano de Salvador, chegando a{' '}
            {formatNumber(FERMI.totalCiclosPotenciaisPorMes)} ciclos/mês potenciais na região e um market
            share alvo de {formatPercent(FERMI.marketShareAlvo)} para esta unidade.
          </p>
        </Secao>

        <Secao numero="2" titulo="Metodologia e correções aplicadas" quebrarPagina>
          <p>
            O estudo original contém inconsistências internas típicas de um documento que evoluiu por
            revisões sucessivas: valores recalculados em tabelas posteriores sem que os parágrafos
            anteriores fossem atualizados. Esta versão usa exclusivamente valores reconciliados e
            recalculados por um pequeno conjunto de premissas (ver <code>model.ts</code> no código-fonte),
            de forma que cada número decorre de uma fórmula, não de uma célula digitada. Seis correções
            foram necessárias:
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-ink">Clientes/ano arrastado com o IPCA.</strong> A
              planilha original reajustava a base de clientes pela mesma fórmula usada para o ticket médio,
              fazendo a demanda crescer artificialmente todo ano. Corrigido: clientes/ano é constante em{' '}
              {formatNumber(m.capacidade.clientesProjetadosAno1)} do Ano 1 ao Ano 5.
            </li>
            <li>
              <strong className="font-semibold text-ink">Aluguel pesquisado, mas nunca lançado.</strong> O
              Anexo I do estudo original registra um aluguel de R$ 5.000,00/mês para o espaço, nunca
              incorporado às tabelas de custos fixos. Incorporado aqui.
            </li>
            <li>
              <strong className="font-semibold text-ink">Capacidade máxima subestimada em uma nota isolada.</strong>{' '}
              Usamos a derivação explícita do ciclo operacional (10 ciclos/dia/máquina × 3 máquinas × 360
              dias = {formatNumber(m.capacidade.maximaClientesAno)} clientes/ano), não os 20.520 de uma nota
              isolada inconsistente com o resto do texto.
            </li>
            <li>
              <strong className="font-semibold text-ink">Capital de giro sem o aluguel.</strong> A linha "6
              meses de custos fixos" do capital de giro não havia incorporado o aluguel corrigido no item 2
              — investimento total corrigido de R$ 277.082,07 para {formatBRL(m.investimentoTotal)}.
            </li>
            <li>
              <strong className="font-semibold text-ink">CAPM com prêmio de risco de mercado negativo.</strong>{' '}
              Rm (13,00%) menor que Rf (14,50%) produzia um ERP negativo. Substituído por um ERP explícito
              de +4,50% a.a., elevando o WACC/TMA para {formatPercent(m.custoCapital.wacc, 2)} a.a.
            </li>
            <li>
              <strong className="font-semibold text-ink">Juros do financiamento contados duas vezes.</strong>{' '}
              O fluxo original deduzia juros do BNB e ainda descontava ao WACC — que já embute o custo da
              dívida. Corrigido para um fluxo FCFF (sem juros); a estrutura de capital afeta o resultado
              apenas via WACC.
            </li>
          </ol>
          <p>
            O efeito combinado: TIR de 78,4% a.a. (estudo original) para {formatPercent(m.metricas.tir, 1)}{' '}
            a.a. — ainda um projeto viável, mas com uma folga bem mais realista do que os números originais
            sugeriam.
          </p>
        </Secao>

        <Secao numero="3" titulo="Estrutura do investimento">
          <p>
            O investimento total de {formatBRL(m.investimentoTotal)} se divide em gastos pré-operacionais,
            ativos fixos e capital de giro inicial, financiados 30% por dívida (
            {formatBRL(m.financiamento.valorDivida)}, {m.financiamento.credor}) e 70% por capital próprio (
            {formatBRL(m.financiamento.valorCapitalProprio)}).
          </p>
          <TabelaSimples
            headers={['Custos fixos mensais (Ano 1)', 'Valor (R$)']}
            rows={CUSTOS_FIXOS_MENSAIS.map((c) => [c.item, formatBRLValue(c.valor)])}
          />
          <p className="text-[12px] text-muted">
            Total de custos fixos mensais: {formatBRL(CUSTOS_FIXOS_MENSAIS.reduce((s, c) => s + c.valor, 0))}{' '}
            (já com a verba de aluguel incorporada — ver Seção 2, correção 2).
          </p>
        </Secao>

        <Secao numero="4" titulo="Projeções financeiras" quebrarPagina>
          <p>
            O fluxo de caixa livre para a firma (FCFF) do projeto, ano a ano, é reproduzido abaixo. Como o
            Simples Nacional já é deduzido como percentual da receita, a depreciação não gera escudo fiscal
            adicional: o fluxo de caixa operacional (FCO) é igual ao EBITDA em todos os anos.
          </p>
          <TabelaSimples
            headers={['Ano', 'Ticket médio', 'Clientes', 'Receita', 'EBITDA', 'FCL']}
            rows={FLUXO_CAIXA.map((f) => [
              f.ano,
              f.ticketMedio ? formatBRLValue(f.ticketMedio) : '—',
              f.clientesAno ? formatNumber(f.clientesAno) : '—',
              f.receita ? formatBRLValue(f.receita) : '—',
              f.ebitda ? formatBRLValue(f.ebitda) : '—',
              formatBRLValue(f.fcl),
            ])}
          />
        </Secao>

        <Secao numero="5" titulo="Viabilidade e cenários">
          <p>
            No caso-base, o projeto é viável: VPL de {formatBRL(m.metricas.vpl)}, TIR de{' '}
            {formatPercent(m.metricas.tir, 1)} a.a. (frente a uma TMA de {formatPercent(m.custoCapital.wacc, 2)}{' '}
            a.a.) e payback simples/descontado de {formatYears(m.metricas.paybackSimplesAnos)} /{' '}
            {formatYears(m.metricas.paybackDescontadoAnos)}. A tabela abaixo mostra como essas métricas se
            movem sob premissas mais pessimistas ou mais otimistas (ver Painel de Cenários na aplicação para
            explorar cenários intermediários).
          </p>
          <TabelaSimples
            headers={['Cenário', 'VPL (R$)', 'TIR', 'Payback simples', 'WACC']}
            rows={CENARIOS.map((c) => {
              const cm = calcularModelo(c)
              return [
                c.nome,
                formatBRLValue(cm.metricas.vpl),
                formatPercent(cm.metricas.tir, 1),
                formatYears(cm.metricas.paybackSimplesAnos),
                formatPercent(cm.custoCapital.wacc, 2),
              ]
            })}
          />
          <p className="text-[12px] text-muted">
            Mesmo no cenário pessimista (demanda 15% menor, aluguel R$ 1.000/mês mais caro, IPCA de 7% a.a.
            e prêmio de risco maior), o projeto permanece viável — um indicador de robustez frente a
            revisões anteriores deste painel, cuja TIR de ponto único (sem faixa de cenários) escondia o
            quanto o resultado dependia de premissas específicas.
          </p>
        </Secao>

        <Secao numero="6" titulo="Mercado e concorrência" quebrarPagina>
          <p>
            Cinco concorrentes diretos foram identificados no bairro do Rio Vermelho e proximidades,
            variando entre franquias nacionais consolidadas e operações independentes recentes:
          </p>
          <TabelaSimples
            headers={['Concorrente', 'Fundação', 'Modelo', 'Preço']}
            rows={CONCORRENTES.map((c) => [c.nome, c.fundacao, c.modelo, c.precos])}
          />
          <p>
            Frente a esses concorrentes, a proposta se posiciona com localização de alta circulação
            (compartilhando o estacionamento com um McDonald's), operação self-service 24h, e preços
            alinhados à média do mercado local — sem os problemas de atendimento e climatização relatados
            recentemente contra dois dos concorrentes diretos.
          </p>
        </Secao>

        <Secao numero="7" titulo="Conclusão">
          <p>
            O estudo, após reconciliação aritmética completa e correção de seis inconsistências
            metodológicas, confirma a viabilidade econômico-financeira do projeto: TIR de{' '}
            {formatPercent(m.metricas.tir, 1)} a.a. frente a uma TMA de {formatPercent(m.custoCapital.wacc, 2)}{' '}
            a.a., VPL positivo de {formatBRL(m.metricas.vpl)}, e retorno do capital investido em menos de{' '}
            {formatYears(Math.ceil(m.metricas.paybackDescontadoAnos))}. A análise de cenários (Seção 5)
            mostra que essa conclusão é robusta mesmo sob premissas adversas — o que não seria visível numa
            leitura de ponto único do estudo original.
          </p>
        </Secao>
      </main>
    </>
  )
}
