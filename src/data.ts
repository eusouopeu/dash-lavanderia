/**
 * Estudo de Viabilidade Econômico-Financeira — Lavanderia Self-Service
 * Franquia Laundromat Lavanderias, bairro do Rio Vermelho, Salvador/BA
 * (estacionamento RedeMix, Rua Oswaldo Cruz)
 *
 * Fonte: trabalho acadêmico "Avaliação do Projeto: Lavanderia Self-Service"
 * (UFBA, disciplina ADM154, 2026). O documento original contém múltiplas
 * inconsistências internas — números recalculados em tabelas posteriores
 * que não foram propagados de volta a parágrafos anteriores. Os valores
 * abaixo são os valores consolidados e reconciliados a partir do estudo
 * original: cada figura foi conferida aritmeticamente contra as tabelas
 * finais (Balanço do Ano 0, Fluxo de Caixa Livre, WACC, Payback/VPL/TIR).
 *
 * CORREÇÃO ADICIONAL (2ª revisão): a planilha original arrastou a fórmula
 * de reajuste inflacionário da coluna "Clientes/ano" do Ano 1 até o Ano 5,
 * fazendo a base de clientes crescer junto com o ticket médio — quando na
 * verdade só o ticket deveria crescer (a demanda, vinda da estimativa de
 * Fermi, é uma constante de mercado, não uma variável monetária). Aqui,
 * Clientes/ano é fixado em 8.851 (valor do Ano 1) em todo o horizonte;
 * apenas o ticket médio segue reajustado pelo IPCA. Isso reduz EBITDA,
 * FCO, FCL, VPL e TIR do estudo original em relação à primeira revisão
 * deste painel — ver "Fontes e Metodologia" para o detalhe do recálculo.
 * Também foram conferidos os valores de financiamento e custo da dívida
 * (juros BNB por ano, custo real Kdr): o cronograma SAC de amortização já
 * usa o valor correto de dívida (R$ 83.124,62, 30% do investimento total
 * corrigido) e reconcilia exatamente com o CET de 5,1922% a.a. — nenhuma
 * correção adicional foi necessária nessa parte.
 *
 * CORREÇÃO ADICIONAL (3ª revisão): os custos fixos mensais (Tabela 05 do
 * estudo original) não incluíam nenhuma verba de aluguel do espaço no
 * estacionamento RedeMix — mas o Anexo I do próprio documento registra uma
 * entrevista com a proprietária de uma lavanderia real informando um
 * aluguel de R$ 2.000,00, "ajustado para R$ 5.000,00" pelos autores para
 * refletir o custo de uma capital como Salvador. Essa verba foi pesquisada
 * e decidida, mas nunca chegou a entrar nas tabelas de custos fixos —
 * omissão que, por si só, explicava boa parte da TIR (78,4%) muito acima
 * do razoável para o setor. Aqui, o aluguel de R$ 5.000,00/mês (reajustado
 * pelo IPCA, como os demais custos fixos) foi incorporado a
 * CUSTOS_FIXOS_MENSAIS e ao Fluxo de Caixa — o que reduz a TIR para
 * ~50,9% a.a., ainda alta, mas na mesma ordem de grandeza dos concorrentes
 * citados no estudo (BubbleBox: payback 18–24 meses, margem até 60%; 60
 * Minutos: payback 12–18 meses, margem 50%).
 *
 * Também foi corrigida a capacidade máxima instalada (lavagem + secagem):
 * o estudo original usa 20.520 clientes/ano num ponto (nota da Tabela 13,
 * "gargalo secadora: 19 ciclos/máq/dia"), mas a própria descrição do ciclo
 * operacional (seção 2.8) deriva explicitamente "10 ciclos diários por
 * [máquina], totalizando 30 atendimentos por dia ou aproximadamente 900
 * ciclos mensais" — ou seja, 10.800 clientes/ano. Usamos essa derivação,
 * mais direta e consistente com o resto do texto.
 * Ver a página "Fontes e Metodologia" para a lista completa de referências.
 */

/* -------------------------------------------------------------------------- */
/*  Investimento — Ano 0                                                      */
/* -------------------------------------------------------------------------- */

export const GASTOS_PRE_OPERACIONAIS = {
  legalizacaoLicenciamento: 6_496.56,
  estruturaProjetosObra: 51_978.21,
  total: 58_474.77,
}

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

export const TOTAL_ATIVOS_FIXOS = 186_442.9

export const CAPITAL_DE_GIRO = {
  estoqueInicial: 3_000.0,
  seisMesesCustosFixos: 11_414.4,
  provisaoPrazoRecebimento: 4_050.0,
  fundoContingencia: 13_700.0,
  total: 32_164.4,
}

export const INVESTIMENTO_TOTAL =
  GASTOS_PRE_OPERACIONAIS.total + TOTAL_ATIVOS_FIXOS + CAPITAL_DE_GIRO.total // 277.082,07

export const FINANCIAMENTO = {
  percentDivida: 0.3,
  percentCapitalProprio: 0.7,
  valorDivida: INVESTIMENTO_TOTAL * 0.3, // 83.124,62
  valorCapitalProprio: INVESTIMENTO_TOTAL * 0.7, // 193.957,45
  credor: 'Banco do Nordeste — linha FNE MPE',
}

/** Balanço Patrimonial do Ano 0 (Tabela 07, reestruturada em duas colunas
 * ATIVO / PASSIVO + PL — a tabela original mesclava as duas colunas). */
export const BALANCO_PATRIMONIAL_ANO0 = {
  ativos: [
    { label: 'Capital de giro', valor: CAPITAL_DE_GIRO.total },
    { label: 'Gastos pré-operacionais', valor: GASTOS_PRE_OPERACIONAIS.total },
    { label: 'Ativos não circulantes (fixos)', valor: TOTAL_ATIVOS_FIXOS },
  ],
  passivoPatrimonioLiquido: [
    { label: 'Dívidas — BNB FNE MPE (30%)', valor: INVESTIMENTO_TOTAL * 0.3 },
    { label: 'Capital próprio (70%)', valor: INVESTIMENTO_TOTAL * 0.7 },
  ],
  get totalAtivos() {
    return this.ativos.reduce((sum, a) => sum + a.valor, 0)
  },
  get totalPassivoPL() {
    return this.passivoPatrimonioLiquido.reduce((sum, p) => sum + p.valor, 0)
  },
}

/** Custos fixos mensais do Ano 1 (Tabela 05 do estudo original + a verba de
 * aluguel do espaço no RedeMix, pesquisada no Anexo I mas nunca incorporada
 * às tabelas de custos do documento original — ver nota no topo do arquivo). */
export const CUSTOS_FIXOS_MENSAIS = [
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

export const TOTAL_CUSTOS_FIXOS_MENSAIS = CUSTOS_FIXOS_MENSAIS.reduce((sum, c) => sum + c.valor, 0) // 6.902,40

/* -------------------------------------------------------------------------- */
/*  Custo de capital                                                          */
/* -------------------------------------------------------------------------- */

export const CUSTO_CAPITAL = {
  kdr: 0.0077, // custo real da dívida (0,77% a.a., BNB FNE MPE)
  ksr: 0.1565, // custo real do capital próprio (CAPM)
  wacc: 0.1119, // TMA / WACC real do projeto — 30% × 0,77% + 70% × 15,65%
  capm: {
    rf: 0.145, // Selic abr/2026
    rm: 0.13, // IBOVESPA histórico
    betaL: 1.29, // via Hamada
    crpBrasil: 0.0324,
    premioLiquidez: 0.04, // prêmio de liquidez para pequenas empresas
    deflator: 0.0439, // IPCA
  },
}

export const CUSTO_DEPRECIACAO_ANUAL = 37_288.58

/* -------------------------------------------------------------------------- */
/*  Fluxo de Caixa Livre do Projeto (Tabela 13, consolidada)                  */
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
  jurosBNB: number | null
  lucroOperacionalLiquido: number | null
  fco: number | null
  investimentos: number | null
  variacaoCapitalGiro: number | null
  fcl: number
}

export const FLUXO_CAIXA: FluxoAno[] = [
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
    jurosBNB: null,
    lucroOperacionalLiquido: null,
    fco: null,
    investimentos: -244_917.67,
    variacaoCapitalGiro: -32_164.4,
    fcl: -277_082.07,
  },
  {
    ano: 1,
    ticketMedio: 36.0,
    clientesAno: 8_851,
    receita: 318_636.0,
    margemContribuicaoTotal: 234_551.5,
    gastosFixosDesembolsaveis: 82_828.8,
    ebitda: 151_722.7,
    depreciacao: 37_288.58,
    ebit: 114_434.12,
    jurosBNB: 4_216.57,
    lucroOperacionalLiquido: 110_217.55,
    fco: 147_506.13,
    investimentos: null,
    variacaoCapitalGiro: null,
    fcl: 147_506.13,
  },
  {
    ano: 2,
    ticketMedio: 37.86,
    clientesAno: 8_851,
    receita: 335_098.86,
    margemContribuicaoTotal: 246_677.37,
    gastosFixosDesembolsaveis: 87_102.77,
    ebitda: 159_574.6,
    depreciacao: 37_288.58,
    ebit: 122_286.02,
    jurosBNB: 2_928.17,
    lucroOperacionalLiquido: 119_357.85,
    fco: 156_646.43,
    investimentos: null,
    variacaoCapitalGiro: null,
    fcl: 156_646.43,
  },
  {
    ano: 3,
    ticketMedio: 39.81,
    clientesAno: 8_851,
    receita: 352_358.31,
    margemContribuicaoTotal: 259_422.81,
    gastosFixosDesembolsaveis: 91_597.27,
    ebitda: 167_825.54,
    depreciacao: 37_288.58,
    ebit: 130_536.96,
    jurosBNB: 409.94,
    lucroOperacionalLiquido: 130_127.02,
    fco: 167_415.6,
    investimentos: null,
    variacaoCapitalGiro: null,
    fcl: 167_415.6,
  },
  {
    ano: 4,
    ticketMedio: 41.87,
    clientesAno: 8_851,
    receita: 370_591.37,
    margemContribuicaoTotal: 272_787.82,
    gastosFixosDesembolsaveis: 96_323.68,
    ebitda: 176_464.14,
    depreciacao: 37_288.58,
    ebit: 139_175.56,
    jurosBNB: 0.0,
    lucroOperacionalLiquido: 139_175.56,
    fco: 176_464.14,
    investimentos: null,
    variacaoCapitalGiro: null,
    fcl: 176_464.14,
  },
  {
    ano: 5,
    ticketMedio: 44.03,
    clientesAno: 8_851,
    receita: 389_709.53,
    margemContribuicaoTotal: 286_860.91,
    gastosFixosDesembolsaveis: 101_293.99,
    ebitda: 185_566.92,
    depreciacao: 37_288.58,
    ebit: 148_278.34,
    jurosBNB: 0.0,
    lucroOperacionalLiquido: 148_278.34,
    fco: 185_566.92,
    investimentos: null,
    variacaoCapitalGiro: 32_164.4,
    fcl: 217_731.32,
  },
]

/** Valor de mercado estimado dos ativos ao final do Ano 5 — fato lateral,
 * intencionalmente NÃO incorporado ao FCL do Ano 5 acima (ver nota
 * metodológica: o estudo original propõe somá-lo, mas as métricas finais de
 * payback/VPL/TIR do próprio documento reconciliam apenas com 336.774,41). */
export const VALOR_RESIDUAL_ATIVOS_ANO5 = 78_878.03
export const VALOR_CONTABIL_LIQUIDO_ANO5 = 114_573.55

/* -------------------------------------------------------------------------- */
/*  Métricas de viabilidade                                                   */
/* -------------------------------------------------------------------------- */

export const METRICAS_VIABILIDADE = {
  paybackSimplesAnos: 1.83,
  paybackDescontadoAnos: 2.15,
  vpl: 347_631.88,
  tir: 0.5091,
  tma: CUSTO_CAPITAL.wacc,
}

/* -------------------------------------------------------------------------- */
/*  Margem de contribuição                                                    */
/* -------------------------------------------------------------------------- */

export const TICKET_MEDIO_ANO1 = {
  lavagem: 18.0,
  secagem: 18.0,
  total: 36.0,
}

export const IPCA_CRESCIMENTO_ANUAL = 0.0516

export const MARGEM_CONTRIBUICAO_UNITARIA = [
  { ano: 1, valor: 26.5, percentReceita: 0.7362 },
  { ano: 2, valor: 27.87, percentReceita: 0.7362 },
  { ano: 3, valor: 29.31, percentReceita: 0.7362 },
  { ano: 4, valor: 30.82, percentReceita: 0.7362 },
  { ano: 5, valor: 32.41, percentReceita: 0.7362 },
]

export const CSP_ANO1 = {
  cspLavagem: 5.43,
  cspSecagem: 0.18,
  taxaCartao: 0.018,
  simplesNacional: 0.09,
}

/* -------------------------------------------------------------------------- */
/*  Capacidade e volumes                                                      */
/* -------------------------------------------------------------------------- */

export const CAPACIDADE = {
  // 10 ciclos/dia por máquina × 3 máquinas × 30 dias × 12 meses = 10.800
  // clientes/ano (seção 2.8 do estudo original) — substitui os 20.520
  // usados numa nota isolada da Tabela 13 ("gargalo secadora: 19
  // ciclos/máq/dia"), inconsistente com a derivação explícita do ciclo
  // operacional. Ver nota no topo do arquivo.
  maximaClientesAno: 10_800, // lavagem + secagem combinada
  maximaSomenteLavagemCiclosAno: 9_720, // base "somente lavagem"
  // Clientes/ano é constante em todo o horizonte (ver nota no topo do arquivo
  // sobre a correção do arrasto de fórmula) — a utilização, portanto, também
  // é constante nos 5 anos, não apenas no Ano 1.
  clientesProjetadosAno1: 8_851,
  taxaUtilizacaoAno1: 8_851 / 10_800, // 81,95% — igual em todos os anos 1–5
}

export const PONTO_EQUILIBRIO = {
  gastosFixosAnuais: TOTAL_CUSTOS_FIXOS_MENSAIS * 12, // 82.828,80 — Tabela 16 Ano 1 + aluguel (ver nota no topo do arquivo)
  margemContribuicaoUnitariaLavagem: 10.44, // R$/cesto — base "somente lavagem"
  cestosAno: (TOTAL_CUSTOS_FIXOS_MENSAIS * 12) / 10.44, // ≈ 7.933,79 cestos/ano
  cestosMes: (TOTAL_CUSTOS_FIXOS_MENSAIS * 12) / 10.44 / 12, // ≈ 661/mês
  taxaUtilizacao: (TOTAL_CUSTOS_FIXOS_MENSAIS * 12) / 10.44 / 9_720, // ≈ 81,6% da capacidade "somente lavagem"
}

/* -------------------------------------------------------------------------- */
/*  Estimativa de Fermi — dimensionamento de mercado                         */
/* -------------------------------------------------------------------------- */

export const FERMI = {
  domiciliosRioVermelho: 7_793,
  percentSemMaquinaLavar: 0.194, // metade do índice de Salvador (38,8%)
  domiciliosSemMaquina: 1_512,
  visitasPorMes: 2,
  ciclosLocaisPorMes: 3_024,
  domiciliosSalvador: 959_423,
  turistasAnoSalvador: 9_400_000,
  conversaoTuristica: 0.25,
  ciclosTuristicosPorMes: 1_586,
  totalCiclosPotenciaisPorMes: 4_610,
  marketShareAlvo: 0.16,
  ciclosUnidadePorMes: 737,
  ciclosUnidadePorDia: 24,
}

/* -------------------------------------------------------------------------- */
/*  Concorrência                                                              */
/* -------------------------------------------------------------------------- */

export interface Concorrente {
  id: string
  nome: string
  fundacao: string
  modelo: string
  precos: string
  horario: string
  diferenciais: string[]
  observacoes?: string
}

export const CONCORRENTES: Concorrente[] = [
  {
    id: 'bubblebox',
    nome: 'BubbleBox',
    fundacao: '2018',
    modelo: 'Franquia — self-service',
    precos: 'R$ 18,00 lavagem + R$ 18,00 secagem',
    horario: 'Todos os dias, 06h–22h',
    diferenciais: [
      'Payback de franquia em 18–24 meses',
      'Margens de até 60%',
      'Inteligência geográfica para escolha de ponto',
      'Linha própria de máquinas profissionais (MyBubble, 2025)',
    ],
  },
  {
    id: '60minutos',
    nome: 'Lavanderia 60 Minutos',
    fundacao: '2015',
    modelo: 'Franquia — self-service (Grupo HI)',
    precos: 'R$ 20,00 até 25 peças',
    horario: 'Dentro de posto Shell',
    diferenciais: [
      'Franquia a partir de R$ 89.900,00',
      'Payback de 12–18 meses, margem de 50%',
      'Personalização de fragrância, suporte humano 24h',
    ],
    observacoes:
      'Reviews recentes (últimos ~3 meses) apontam roupas entregues sujas e falhas de atendimento.',
  },
  {
    id: 'lavaja',
    nome: 'Lava Já Lavanderia Express',
    fundacao: 'mai/2025',
    modelo: 'Independente — self-service',
    precos: 'R$ 33,00 lavagem + secagem (ciclo único)',
    horario: 'Seg-sex 08h–19h · sáb 08h–18h',
    diferenciais: ['Ciclo completo em até 1 hora', 'Atendimento via WhatsApp com chatbot'],
    observacoes: 'Localização afastada das vias principais do Rio Vermelho — visibilidade limitada.',
  },
  {
    id: 'lavouesecou',
    nome: 'Lavou e Secou Lavanderia',
    fundacao: 'set/2024',
    modelo: 'Independente — self-service',
    precos: 'R$ 15,00 lavagem + R$ 15,00 secagem',
    horario: 'Rua Oswaldo Cruz — grande circulação',
    diferenciais: ['Ciclo de ~75 minutos', 'Produtos Omo e Comfort'],
  },
  {
    id: 'laundromat-integral',
    nome: 'LaundroMat Lavanderia Integral',
    fundacao: '2013',
    modelo: 'Ex-franquia, desvinculada há ~2 meses — modelo integral (não self-service)',
    precos: 'R$ 75,00/cesto · edredom R$ 35/45/55 (casal/queen/king)',
    horario: 'Seg-sex 08h–18h · sáb 08h–17h',
    diferenciais: ['Equipe própria para lavagem e passadoria', 'Localização na Rua Oswaldo Cruz'],
    observacoes: 'Reviews recentes negativos: atendimento, falhas na passadoria, sem climatização.',
  },
]

export type SwotAtributo = 'Localização' | 'Horário e Segurança' | 'Qualidade do serviço' | 'Experiência do Cliente' | 'Preço'
export type SwotValor = 'Força' | 'Fraqueza'

export const SWOT_ATRIBUTOS: SwotAtributo[] = [
  'Localização',
  'Horário e Segurança',
  'Qualidade do serviço',
  'Experiência do Cliente',
  'Preço',
]

/** Coluna "Nossa Proposta" incluída como concorrente-id especial. */
export const SWOT_GRID: Record<SwotAtributo, Record<string, SwotValor>> = {
  Localização: {
    bubblebox: 'Força',
    '60minutos': 'Força',
    lavaja: 'Fraqueza',
    lavouesecou: 'Força',
    'laundromat-integral': 'Força',
    proposta: 'Força',
  },
  'Horário e Segurança': {
    bubblebox: 'Força',
    '60minutos': 'Força',
    lavaja: 'Fraqueza',
    lavouesecou: 'Força',
    'laundromat-integral': 'Fraqueza',
    proposta: 'Força',
  },
  'Qualidade do serviço': {
    bubblebox: 'Força',
    '60minutos': 'Fraqueza',
    lavaja: 'Força',
    lavouesecou: 'Força',
    'laundromat-integral': 'Força',
    proposta: 'Força',
  },
  'Experiência do Cliente': {
    bubblebox: 'Força',
    '60minutos': 'Fraqueza',
    lavaja: 'Força',
    lavouesecou: 'Força',
    'laundromat-integral': 'Fraqueza',
    proposta: 'Força',
  },
  Preço: {
    bubblebox: 'Força',
    '60minutos': 'Força',
    lavaja: 'Fraqueza',
    lavouesecou: 'Força',
    'laundromat-integral': 'Fraqueza',
    proposta: 'Força',
  },
}

/* -------------------------------------------------------------------------- */
/*  Negócio e franquia                                                        */
/* -------------------------------------------------------------------------- */

export const FRANQUIA_INFO = {
  nome: 'Laundromat Lavanderias',
  origem: 'Argentina, fundada em 1981 por Juan Carlos López',
  brasilDesde: 1987,
  unidadesBrasil: '400+',
  unidadesSalvador: 7,
  modelo: 'Cessão de equipamentos (o franqueado paga uma taxa de uso das máquinas, sem grande investimento inicial)',
  publicoAlvo: 'Estudantes universitários, casais jovens, turistas, moradores de studios/lofts, nova classe média',
}

export const LOCALIZACAO = {
  bairro: 'Rio Vermelho',
  cidade: 'Salvador/BA',
  endereco: 'Estacionamento RedeMix, Rua Oswaldo Cruz, s/n, Rio Vermelho, Salvador — BA, 41940-000',
  pontosDeReferencia: ['McDonald\'s (dentro do mesmo estacionamento)', 'Academia Selfit (a ~10 min)'],
  area: '15 m² (modelo compacto, expansível)',
  cicloDuracaoMin: 40,
}

/* -------------------------------------------------------------------------- */
/*  Premissas e metodologia                                                   */
/* -------------------------------------------------------------------------- */

export const PREMISSAS = {
  horizonteAnos: 5,
  regimeTributario: 'Simples Nacional — Anexo IV (microempresa)',
  cnae: '9601-7/01 — Lavanderias de autosserviço',
  faturamentoAnualMedioEstimado: 246_000,
}

export interface ReferenciaBibliografica {
  autor: string
  titulo: string
  complemento: string
  url: string
  nota?: string
}

export const REFERENCIAS: ReferenciaBibliografica[] = [
  { autor: 'ANEEL', titulo: 'Bases de dados das tarifas das distribuidoras de energia elétrica', complemento: '', url: 'https://portalrelatorios.aneel.gov.br/luznatarifa/basestarifas' },
  { autor: 'ALTOQI', titulo: 'Precificação de projetos de engenharia', complemento: '', url: 'https://blog.altoqi.com.br/precificacao-de-projetos-de-engenharia' },
  { autor: 'BAHIA. Corpo de Bombeiros Militar da Bahia', titulo: 'Licenciamento de edificações (CLCB)', complemento: '', url: 'http://www.cbm.ba.gov.br/portal/edificacao' },
  { autor: 'BAHIA. Governo do Estado', titulo: 'Turismo da Bahia mantém crescimento contínuo acima da média nacional', complemento: '', url: 'https://www.ba.gov.br/turismo/noticias/2026-04/5906/turismo-da-bahia-mantem-crescimento-continuo-acima-da-media-nacional' },
  { autor: 'BAHIA. Junta Comercial do Estado da Bahia (JUCEB)', titulo: 'Tabelas de preços — capital', complemento: '', url: 'https://www.ba.gov.br/juceb/tabelas-de-precos-capital' },
  { autor: 'BRASIL. Governo Federal', titulo: 'REDESIM: licenciamento', complemento: '', url: 'https://www.gov.br/empresas-e-negocios/pt-br/redesim/ajuda/licenciamento' },
  { autor: 'BRASIL. Ministério do Desenvolvimento Regional', titulo: 'Tabelas de preços referenciais — PISF e segmentos específicos de obras', complemento: '', url: 'https://www.gov.br/mdr' },
  { autor: 'CONTABILIZEI', titulo: 'Anexo IV Simples Nacional: tabela completa de atividades, guias, alíquotas e impostos 2026', complemento: '', url: 'https://www.contabilizei.com.br/contabilidade-online/anexo-4-simples-nacional/' },
  { autor: 'CONTABILIZEI', titulo: 'CNAE 9601-7/01: lavanderias', complemento: '', url: 'https://www.contabilizei.com.br/consulta-cnae/cnae-outras-atividades-de-servicos-pessoais/9601701-lavanderias/' },
  { autor: 'CORREIO 24 HORAS', titulo: 'Na mão ou no tanquinho: só 35% dos baianos têm máquina de lavar roupa', complemento: '', url: 'https://www.correio24horas.com.br/minha-bahia/na-mao-ou-no-tanquinho-so-35-dos-baianos-tem-maquina-de-lavar-roupa-1224' },
  { autor: 'CORREIO 24 HORAS', titulo: 'Salvador recebeu mais de 9 milhões de turistas em 2024 e atingiu R$ 20,7 bilhões em receita no setor', complemento: '', url: 'https://www.correio24horas.com.br/minha-bahia/salvador-recebeu-mais-de-9-milhoes-de-turistas-em-2024-e-atingiu-r-207-bilhoes-em-receita-no-setor-0225' },
  { autor: 'EMBASA', titulo: 'Tarifas 2025', complemento: '', url: 'https://www.embasa.ba.gov.br/w/tarifas-2025' },
  { autor: 'IBGE', titulo: 'Inflação', complemento: '', url: 'https://www.ibge.gov.br/explica/inflacao.php' },
  { autor: 'IBGE', titulo: 'Panorama Censo 2022 — Salvador', complemento: '', url: 'https://cidades.ibge.gov.br/brasil/ba/salvador/pesquisa/10105/328261' },
  { autor: 'INMETRO', titulo: 'Eficiência energética: lavadoras de roupa e secadoras automáticas com abertura frontal (lava e seca)', complemento: '', url: 'http://www.inmetro.gov.br/CONSUMIDOR/pbe/lavaSeca.pdf' },
  { autor: 'OBSERVATÓRIO DE TURISMO DA BAHIA', titulo: 'Relatório Estatístico Salvador 2024', complemento: '', url: 'http://www.observatorio.turismo.ba.gov.br/' },
  { autor: 'SALVADOR. Prefeitura Municipal', titulo: 'Decreto nº 32.636/2020 — licenciamento de atividades econômicas', complemento: '', url: 'https://sedur.salvador.ba.gov.br/' },
  { autor: 'SALVADOR. Secretaria Municipal da Fazenda', titulo: 'Tabelas de Receita — TFF, TLL, TVS', complemento: '', url: 'https://www2.sefaz.salvador.ba.gov.br/' },
  { autor: 'BANCO DO NORDESTE', titulo: 'Simulador de investimento urbano (linha FNE MPE)', complemento: '', url: 'https://www.bnb.gov.br/simuladoresweb/investimentourbano' },
  { autor: 'SINDILAV', titulo: 'Mercado: panorama', complemento: '', url: 'https://sindilav.com.br/mercado-panorama/' },
  { autor: 'SOLUTI', titulo: 'Certificado digital e-CNPJ', complemento: '', url: 'https://www.soluti.com.br/certificado-digital/e-cnpj/' },
  { autor: 'DAMODARAN, Aswath (NYU Stern)', titulo: 'Country default spreads and risk premiums', complemento: 'usado no cálculo do CRP Brasil e do prêmio de risco de mercado (CAPM)', url: 'https://pages.stern.nyu.edu/~adamodar/' },
]
