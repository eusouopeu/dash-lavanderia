/**
 * Motor de cálculo do Estudo de Viabilidade — fórmulas vivas.
 *
 * Substitui os números estáticos que existiam em `data.ts` (receita, EBITDA,
 * FCO, FCL, VPL, TIR etc. digitados linha a linha) por um modelo que deriva
 * tudo a partir de um conjunto pequeno de premissas (`Premissas`). Isso
 * permite recalcular o estudo inteiro para qualquer cenário (pessimista,
 * otimista, ou qualquer combinação escolhida no Painel de Cenários) sem
 * reescrever tabelas à mão — e faz o próprio caso-base (`PREMISSAS_BASE`)
 * ser apenas mais um cenário, calculado pelas mesmas fórmulas.
 *
 * Três correções metodológicas em relação às revisões anteriores do painel
 * (ver "Fontes e Metodologia" para o detalhe):
 *
 * 1. CAPITAL DE GIRO — a linha "6 meses de custos fixos" usava os custos
 *    fixos mensais SEM o aluguel (R$ 1.902,40 × 6), um resíduo da correção
 *    do aluguel que nunca foi propagado ao capital de giro. Aqui o capital
 *    de giro é derivado de `custosFixosMensaisAno1` (que já inclui o
 *    aluguel), então a correção se propaga automaticamente: investimento
 *    total sobe de R$ 277.082,07 para R$ 307.082,07.
 *
 * 2. CUSTO DE CAPITAL (CAPM) — o estudo original usa Rm = 13,00% < Rf =
 *    14,50%, o que produz um prêmio de risco de mercado (ERP) NEGATIVO: um
 *    beta alavancado de 1,29 reduzia o custo do capital próprio em vez de
 *    aumentá-lo, o oposto do que o CAPM deveria fazer para um negócio mais
 *    arriscado que a carteira de mercado. Aqui o ERP é um parâmetro
 *    explícito e positivo (`capm.erp`, default 4,5% a.a., ordem de grandeza
 *    do prêmio histórico do Ibovespa sobre a Selic) em vez de Rm − Rf.
 *
 * 3. FLUXO DE CAIXA (FCFF, sem dupla contagem de juros) — o fluxo original
 *    deduzia os juros do financiamento BNB (linha "Juros BNB") E descontava
 *    o resultado ao WACC — que já embute o custo da dívida (Kdr) na sua
 *    composição. É dupla contagem do custo do capital de terceiros. Aqui o
 *    fluxo é um FCFF (fluxo de caixa livre para a firma, sem juros): a
 *    estrutura de capital (dívida × capital próprio) afeta o VPL apenas via
 *    WACC, como deveria. Como o Simples Nacional já é deduzido como um
 *    percentual da receita (dentro da margem de contribuição, não do
 *    lucro), a depreciação não gera nenhum escudo fiscal adicional — logo
 *    FCO = EBIT + Depreciação = EBITDA em todos os anos.
 *
 * A capacidade máxima instalada também foi unificada (ver `PREMISSAS_BASE`
 * e `pontoEquilibrio`): utilização projetada e ponto de equilíbrio agora
 * são medidos na mesma base (clientes/ano, lavagem + secagem combinada),
 * eliminando a comparação anterior entre bases diferentes ("somente
 * lavagem" vs. "lavagem + secagem").
 */

/* -------------------------------------------------------------------------- */
/*  Insumos de referência (itens que compõem as premissas do caso-base)      */
/* -------------------------------------------------------------------------- */

export interface AtivoFixoItem {
  equipamento: string
  qtd: number
  precoUnit: number
  total: number
  vidaUtilAnos: number
}

export const ATIVOS_FIXOS: AtivoFixoItem[] = [
  { equipamento: 'Lavadora Speed Queen 10,5 kg', qtd: 3, precoUnit: 56_726.28, total: 170_178.84, vidaUtilAnos: 5 },
  { equipamento: 'Dosador individual Unikit D', qtd: 3, precoUnit: 630.0, total: 1_890.0, vidaUtilAnos: 5 },
  { equipamento: 'Ar-condicionado Inverter LG Dual Voice AI 12.000 BTUs', qtd: 1, precoUnit: 3_699.0, total: 3_699.0, vidaUtilAnos: 5 },
  { equipamento: 'Câmera externa Vip 1220 D Full Color G4', qtd: 2, precoUnit: 363.0, total: 726.0, vidaUtilAnos: 5 },
  { equipamento: 'Totem de autoatendimento Smart SK210 NFC (GMS)', qtd: 1, precoUnit: 4_633.89, total: 4_633.89, vidaUtilAnos: 5 },
  { equipamento: 'Bancada para dobrar roupas (estimativa)', qtd: 1, precoUnit: 2_000.0, total: 2_000.0, vidaUtilAnos: 5 },
  { equipamento: 'Cestos de medição de roupa', qtd: 3, precoUnit: 76.66, total: 229.98, vidaUtilAnos: 5 },
  { equipamento: 'Samsung Smart Monitor TV 43"', qtd: 1, precoUnit: 1_599.0, total: 1_599.0, vidaUtilAnos: 5 },
  { equipamento: 'Roteador Wi-Fi TP-Link Archer AX53', qtd: 1, precoUnit: 235.99, total: 235.99, vidaUtilAnos: 5 },
  { equipamento: 'Cadeira de 3 lugares', qtd: 1, precoUnit: 615.25, total: 615.25, vidaUtilAnos: 5 },
  { equipamento: 'Purificador de água', qtd: 1, precoUnit: 539.0, total: 539.0, vidaUtilAnos: 5 },
  { equipamento: 'Dispenser de copos descartáveis', qtd: 1, precoUnit: 49.25, total: 49.25, vidaUtilAnos: 5 },
  { equipamento: 'Lixeira', qtd: 1, precoUnit: 46.7, total: 46.7, vidaUtilAnos: 5 },
]

/** Derivado — soma dos itens acima (era uma constante digitada; agora é fórmula). */
export const TOTAL_ATIVOS_FIXOS = ATIVOS_FIXOS.reduce((sum, item) => sum + item.total, 0)

export const GASTOS_PRE_OPERACIONAIS = {
  legalizacaoLicenciamento: 6_496.56,
  estruturaProjetosObra: 51_978.21,
  get total() {
    return this.legalizacaoLicenciamento + this.estruturaProjetosObra
  },
}

export interface CustoFixoItem {
  item: string
  valor: number
}

/** Custos fixos mensais do Ano 1 (Tabela 05 do estudo original + a verba de
 * aluguel do espaço no RedeMix, pesquisada no Anexo I mas nunca incorporada
 * às tabelas de custos do documento original). */
export const CUSTOS_FIXOS_MENSAIS: CustoFixoItem[] = [
  { item: 'Aluguel do espaço (estacionamento RedeMix)', valor: 5_000.0 },
  { item: 'Limpeza do espaço', valor: 150.0 },
  { item: 'Limpeza do ar-condicionado', valor: 218.5 },
  { item: 'Parcela fixa da conta de energia elétrica', valor: 300.0 },
  { item: 'Software de gestão', valor: 330.0 },
  { item: 'Fundo de manutenção de máquinas', valor: 200.0 },
  { item: 'Dedetização', valor: 200.0 },
  { item: 'Contador', valor: 195.0 },
  { item: 'Celular (gestão remota) + internet', valor: 128.9 },
  { item: 'Produtos para limpeza do espaço', valor: 100.0 },
  { item: 'Parcela fixa da conta de água', valor: 80.0 },
]

/** Derivado — soma dos itens acima. */
export const TOTAL_CUSTOS_FIXOS_MENSAIS = CUSTOS_FIXOS_MENSAIS.reduce((sum, item) => sum + item.valor, 0)

export const TICKET_MEDIO_ANO1 = {
  lavagem: 18.0,
  secagem: 18.0,
  get total() {
    return this.lavagem + this.secagem
  },
}

export const CSP_ANO1 = {
  cspLavagem: 5.43,
  cspSecagem: 0.18,
  taxaCartao: 0.018,
  simplesNacional: 0.09,
}

export const IPCA_CRESCIMENTO_ANUAL = 0.0516

/* -------------------------------------------------------------------------- */
/*  Premissas — o que varia entre cenários                                    */
/* -------------------------------------------------------------------------- */

export interface CapmPremissas {
  /** Selic ou outra taxa livre de risco nominal. */
  rf: number
  /** Prêmio de risco de mercado (equity risk premium), positivo. */
  erp: number
  /** Beta alavancado (via Hamada). */
  betaL: number
  /** Country risk premium (Damodaran). */
  crpBrasil: number
  /** Prêmio de liquidez/porte para pequenas empresas. */
  premioLiquidez: number
  /** Deflator nominal → real (IPCA). */
  deflator: number
}

export interface CapitalDeGiroPremissas {
  estoqueInicial: number
  mesesCustosFixos: number
  provisaoPrazoRecebimento: number
  fundoContingencia: number
}

export interface Premissas {
  nome: string
  descricao: string
  ticketMedioAno1: number
  clientesAno: number
  ipcaAnual: number
  custosFixosMensaisAno1: number
  gastosPreOperacionais: number
  ativosFixosTotal: number
  capitalGiro: CapitalDeGiroPremissas
  percentDivida: number
  /** Custo real da dívida (BNB, linha FNE MPE). */
  kdr: number
  capm: CapmPremissas
  capacidadeMaximaClientesAno: number
  horizonteAnos: number
  /** Custo variável combinado por cliente (lavagem + secagem), em R$. */
  cspTotal: number
  taxaCartao: number
  simplesNacional: number
}

export const PREMISSAS_BASE: Premissas = {
  nome: 'Base',
  descricao: 'Valores reconciliados a partir do estudo original — ver Fontes e Metodologia.',
  ticketMedioAno1: TICKET_MEDIO_ANO1.total,
  clientesAno: 8_851,
  ipcaAnual: IPCA_CRESCIMENTO_ANUAL,
  custosFixosMensaisAno1: TOTAL_CUSTOS_FIXOS_MENSAIS,
  gastosPreOperacionais: GASTOS_PRE_OPERACIONAIS.total,
  ativosFixosTotal: TOTAL_ATIVOS_FIXOS,
  capitalGiro: { estoqueInicial: 3_000.0, mesesCustosFixos: 6, provisaoPrazoRecebimento: 4_050.0, fundoContingencia: 13_700.0 },
  percentDivida: 0.3,
  kdr: 0.0077,
  capm: { rf: 0.145, erp: 0.045, betaL: 1.29, crpBrasil: 0.0324, premioLiquidez: 0.04, deflator: 0.0439 },
  capacidadeMaximaClientesAno: 10_800,
  horizonteAnos: 5,
  cspTotal: CSP_ANO1.cspLavagem + CSP_ANO1.cspSecagem,
  taxaCartao: CSP_ANO1.taxaCartao,
  simplesNacional: CSP_ANO1.simplesNacional,
}

export const PREMISSAS_PESSIMISTA: Premissas = {
  ...PREMISSAS_BASE,
  nome: 'Pessimista',
  descricao:
    'Demanda 15% abaixo da estimativa de Fermi, aluguel reajustado em +R$ 1.000/mês, IPCA mais alto (7% a.a.) e prêmio de risco de mercado maior (financiamento mais caro).',
  clientesAno: Math.round(PREMISSAS_BASE.clientesAno * 0.85),
  custosFixosMensaisAno1: PREMISSAS_BASE.custosFixosMensaisAno1 + 1_000,
  ipcaAnual: 0.07,
  capm: { ...PREMISSAS_BASE.capm, erp: 0.06 },
}

export const PREMISSAS_OTIMISTA: Premissas = {
  ...PREMISSAS_BASE,
  nome: 'Otimista',
  descricao:
    'Demanda 10% acima da estimativa de Fermi (maior captura de turistas), ticket médio 5% maior, e prêmio de risco de mercado menor (negócio percebido como menos arriscado).',
  clientesAno: Math.round(PREMISSAS_BASE.clientesAno * 1.1),
  ticketMedioAno1: PREMISSAS_BASE.ticketMedioAno1 * 1.05,
  capm: { ...PREMISSAS_BASE.capm, erp: 0.035 },
}

export const CENARIOS: Premissas[] = [PREMISSAS_PESSIMISTA, PREMISSAS_BASE, PREMISSAS_OTIMISTA]

/* -------------------------------------------------------------------------- */
/*  Fórmulas                                                                  */
/* -------------------------------------------------------------------------- */

export interface FluxoAno {
  ano: number
  ticketMedio: number | null
  clientesAno: number | null
  receita: number | null
  margemContribuicaoTotal: number | null
  gastosFixosDesembolsaveis: number | null
  ebitda: number | null
  depreciacao: number | null
  ebit: number | null
  fco: number | null
  investimentos: number | null
  variacaoCapitalGiro: number | null
  fcl: number
}

export function calcularCapitalDeGiro(p: Premissas) {
  const seisMesesCustosFixos = p.custosFixosMensaisAno1 * p.capitalGiro.mesesCustosFixos
  const total =
    p.capitalGiro.estoqueInicial +
    seisMesesCustosFixos +
    p.capitalGiro.provisaoPrazoRecebimento +
    p.capitalGiro.fundoContingencia
  return {
    estoqueInicial: p.capitalGiro.estoqueInicial,
    seisMesesCustosFixos,
    provisaoPrazoRecebimento: p.capitalGiro.provisaoPrazoRecebimento,
    fundoContingencia: p.capitalGiro.fundoContingencia,
    total,
  }
}

export function calcularCustoCapital(p: Premissas) {
  const ksNominal = p.capm.rf + p.capm.betaL * p.capm.erp + p.capm.crpBrasil + p.capm.premioLiquidez
  const ksReal = (1 + ksNominal) / (1 + p.capm.deflator) - 1
  const wacc = p.percentDivida * p.kdr + (1 - p.percentDivida) * ksReal
  return { kdr: p.kdr, ksNominal, ksReal, wacc }
}

/** Margem de contribuição unitária do Ano 1 — receita menos custo variável
 * (CSP lavagem + secagem, taxa de cartão e Simples Nacional). */
export function calcularMargemContribuicaoUnitariaAno1(p: Premissas): number {
  return p.ticketMedioAno1 * (1 - p.taxaCartao - p.simplesNacional) - p.cspTotal
}

export function calcularFluxo(p: Premissas): FluxoAno[] {
  const capitalDeGiroTotal = calcularCapitalDeGiro(p).total
  const investimentoInicial = p.gastosPreOperacionais + p.ativosFixosTotal
  const depreciacaoAnual = p.ativosFixosTotal / 5
  const mcUnitAno1 = calcularMargemContribuicaoUnitariaAno1(p)

  const fluxo: FluxoAno[] = [
    {
      ano: 0,
      ticketMedio: null,
      clientesAno: null,
      receita: null,
      margemContribuicaoTotal: null,
      gastosFixosDesembolsaveis: null,
      ebitda: null,
      depreciacao: null,
      ebit: null,
      fco: null,
      investimentos: -investimentoInicial,
      variacaoCapitalGiro: -capitalDeGiroTotal,
      fcl: -(investimentoInicial + capitalDeGiroTotal),
    },
  ]

  for (let ano = 1; ano <= p.horizonteAnos; ano++) {
    const fatorIpca = Math.pow(1 + p.ipcaAnual, ano - 1)
    const ticketMedio = p.ticketMedioAno1 * fatorIpca
    const receita = ticketMedio * p.clientesAno
    const mcUnit = mcUnitAno1 * fatorIpca
    const margemContribuicaoTotal = mcUnit * p.clientesAno
    const gastosFixosDesembolsaveis = p.custosFixosMensaisAno1 * 12 * fatorIpca
    const ebitda = margemContribuicaoTotal - gastosFixosDesembolsaveis
    const ebit = ebitda - depreciacaoAnual
    // FCFF: sem juros (custo da dívida já embutido no WACC) e sem escudo
    // fiscal de depreciação (o Simples Nacional já foi deduzido como % da
    // receita, não do lucro) — logo FCO = EBIT + Depreciação = EBITDA.
    const fco = ebit + depreciacaoAnual
    const ultimoAno = ano === p.horizonteAnos
    const variacaoCapitalGiro = ultimoAno ? capitalDeGiroTotal : null
    const fcl = fco + (variacaoCapitalGiro ?? 0)

    fluxo.push({
      ano,
      ticketMedio,
      clientesAno: p.clientesAno,
      receita,
      margemContribuicaoTotal,
      gastosFixosDesembolsaveis,
      ebitda,
      depreciacao: depreciacaoAnual,
      ebit,
      fco,
      investimentos: null,
      variacaoCapitalGiro,
      fcl,
    })
  }

  return fluxo
}

export function vpl(taxa: number, fluxos: number[]): number {
  return fluxos.reduce((soma, valor, i) => soma + valor / Math.pow(1 + taxa, i), 0)
}

/** TIR por bisseção — válido para o formato de fluxo deste projeto (um
 * único investimento inicial negativo seguido de retornos positivos, logo
 * VPL(taxa) tem exatamente uma raiz). */
export function tir(fluxos: number[]): number {
  const f = (taxa: number) => vpl(taxa, fluxos)
  let lo = -0.9999
  let hi = 10
  if (f(lo) * f(hi) > 0) return NaN
  for (let i = 0; i < 200; i++) {
    const meio = (lo + hi) / 2
    if (f(meio) > 0) lo = meio
    else hi = meio
  }
  return (lo + hi) / 2
}

function paybackDeSequencia(fluxos: number[]): number {
  let acumulado = fluxos[0]
  for (let i = 1; i < fluxos.length; i++) {
    if (acumulado + fluxos[i] >= 0) return i - 1 + -acumulado / fluxos[i]
    acumulado += fluxos[i]
  }
  return NaN
}

export function paybackSimples(fluxos: number[]): number {
  return paybackDeSequencia(fluxos)
}

export function paybackDescontado(fluxos: number[], taxa: number): number {
  return paybackDeSequencia(fluxos.map((valor, i) => valor / Math.pow(1 + taxa, i)))
}

/* -------------------------------------------------------------------------- */
/*  Modelo completo                                                           */
/* -------------------------------------------------------------------------- */

export interface ModeloResultado {
  premissas: Premissas
  investimentoTotal: number
  capitalDeGiro: ReturnType<typeof calcularCapitalDeGiro>
  financiamento: {
    percentDivida: number
    percentCapitalProprio: number
    valorDivida: number
    valorCapitalProprio: number
    credor: string
  }
  custoCapital: ReturnType<typeof calcularCustoCapital>
  fluxo: FluxoAno[]
  metricas: {
    vpl: number
    tir: number
    paybackSimplesAnos: number
    paybackDescontadoAnos: number
    tma: number
  }
  capacidade: {
    maximaClientesAno: number
    clientesProjetadosAno1: number
    taxaUtilizacaoAno1: number
  }
  pontoEquilibrio: {
    margemContribuicaoUnitariaAno1: number
    clientesBreakeven: number
    taxaUtilizacao: number
  }
}

export function calcularModelo(p: Premissas): ModeloResultado {
  const capitalDeGiro = calcularCapitalDeGiro(p)
  const investimentoTotal = p.gastosPreOperacionais + p.ativosFixosTotal + capitalDeGiro.total
  const custoCapital = calcularCustoCapital(p)
  const fluxo = calcularFluxo(p)
  const fluxos = fluxo.map((f) => f.fcl)

  const mcUnitAno1 = calcularMargemContribuicaoUnitariaAno1(p)
  const gastosFixosAnuaisAno1 = p.custosFixosMensaisAno1 * 12
  const clientesBreakeven = gastosFixosAnuaisAno1 / mcUnitAno1

  return {
    premissas: p,
    investimentoTotal,
    capitalDeGiro,
    financiamento: {
      percentDivida: p.percentDivida,
      percentCapitalProprio: 1 - p.percentDivida,
      valorDivida: investimentoTotal * p.percentDivida,
      valorCapitalProprio: investimentoTotal * (1 - p.percentDivida),
      credor: 'Banco do Nordeste — linha FNE MPE',
    },
    custoCapital,
    fluxo,
    metricas: {
      vpl: vpl(custoCapital.wacc, fluxos),
      tir: tir(fluxos),
      paybackSimplesAnos: paybackSimples(fluxos),
      paybackDescontadoAnos: paybackDescontado(fluxos, custoCapital.wacc),
      tma: custoCapital.wacc,
    },
    capacidade: {
      maximaClientesAno: p.capacidadeMaximaClientesAno,
      clientesProjetadosAno1: p.clientesAno,
      taxaUtilizacaoAno1: p.clientesAno / p.capacidadeMaximaClientesAno,
    },
    pontoEquilibrio: {
      margemContribuicaoUnitariaAno1: mcUnitAno1,
      clientesBreakeven,
      taxaUtilizacao: clientesBreakeven / p.capacidadeMaximaClientesAno,
    },
  }
}

export const MODELO_BASE = calcularModelo(PREMISSAS_BASE)
export const MODELO_PESSIMISTA = calcularModelo(PREMISSAS_PESSIMISTA)
export const MODELO_OTIMISTA = calcularModelo(PREMISSAS_OTIMISTA)
