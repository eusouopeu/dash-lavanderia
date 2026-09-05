/**
 * Estudo de Viabilidade Econômico-Financeira — Lavanderia Self-Service
 * Franquia Laundromat Lavanderias, bairro do Rio Vermelho, Salvador/BA
 * (estacionamento RedeMix, Rua Oswaldo Cruz)
 *
 * Fonte: trabalho acadêmico "Avaliação do Projeto: Lavanderia Self-Service"
 * (UFBA, disciplina ADM154, 2026). O documento original contém múltiplas
 * inconsistências internas — números recalculados em tabelas posteriores
 * que não foram propagados de volta a parágrafos anteriores.
 *
 * Este arquivo guarda os dados de referência (mercado, concorrência,
 * franquia, localização, bibliografia). Os números financeiros derivados
 * (investimento total, fluxo de caixa, VPL, TIR, WACC etc.) vêm de
 * `model.ts`, que os calcula a partir de um conjunto pequeno de premissas
 * em vez de tê-los como constantes digitadas — ver `model.ts` para as
 * fórmulas e o histórico de correções (capital de giro, CAPM, FCFF sem
 * dupla contagem de juros, e a unificação da base de capacidade).
 */

import { GASTOS_PRE_OPERACIONAIS, MODELO_BASE, TOTAL_ATIVOS_FIXOS } from './model'

export type { FluxoAno, Premissas } from './model'
export {
  ATIVOS_FIXOS,
  CENARIOS,
  CSP_ANO1,
  CUSTOS_FIXOS_MENSAIS,
  GASTOS_PRE_OPERACIONAIS,
  IPCA_CRESCIMENTO_ANUAL,
  MODELO_BASE,
  MODELO_OTIMISTA,
  MODELO_PESSIMISTA,
  PREMISSAS_BASE,
  PREMISSAS_OTIMISTA,
  PREMISSAS_PESSIMISTA,
  TICKET_MEDIO_ANO1,
  TOTAL_ATIVOS_FIXOS,
  TOTAL_CUSTOS_FIXOS_MENSAIS,
  calcularCapitalDeGiro,
  calcularCustoCapital,
  calcularFluxo,
  calcularMargemContribuicaoUnitariaAno1,
  calcularModelo,
  paybackDescontado,
  paybackSimples,
  tir,
  vpl,
} from './model'
export type { AtivoFixoItem, CustoFixoItem } from './model'

/* -------------------------------------------------------------------------- */
/*  Reexportações do caso-base — mantidas com os mesmos nomes usados pelas    */
/*  páginas, para que "o caso-base" continue sendo o padrão em toda a app.    */
/* -------------------------------------------------------------------------- */

export const INVESTIMENTO_TOTAL = MODELO_BASE.investimentoTotal
export const CAPITAL_DE_GIRO = MODELO_BASE.capitalDeGiro
export const FINANCIAMENTO = MODELO_BASE.financiamento
export const CUSTO_CAPITAL = MODELO_BASE.custoCapital
export const FLUXO_CAIXA = MODELO_BASE.fluxo
export const METRICAS_VIABILIDADE = MODELO_BASE.metricas
export const CAPACIDADE = MODELO_BASE.capacidade
export const PONTO_EQUILIBRIO = MODELO_BASE.pontoEquilibrio

export const CUSTO_DEPRECIACAO_ANUAL = TOTAL_ATIVOS_FIXOS / 5

/** Margem de contribuição unitária ano a ano — derivada do fluxo do caso-base. */
export const MARGEM_CONTRIBUICAO_UNITARIA = FLUXO_CAIXA.filter((f) => f.ano > 0).map((f) => ({
  ano: f.ano,
  valor: f.margemContribuicaoTotal! / f.clientesAno!,
  percentReceita: f.margemContribuicaoTotal! / f.receita!,
}))

/** Balanço Patrimonial do Ano 0 (Tabela 07, reestruturada em duas colunas
 * ATIVO / PASSIVO + PL — a tabela original mesclava as duas colunas). */
export const BALANCO_PATRIMONIAL_ANO0 = {
  ativos: [
    { label: 'Capital de giro', valor: CAPITAL_DE_GIRO.total },
    { label: 'Gastos pré-operacionais', valor: GASTOS_PRE_OPERACIONAIS.total },
    { label: 'Ativos não circulantes (fixos)', valor: TOTAL_ATIVOS_FIXOS },
  ],
  passivoPatrimonioLiquido: [
    { label: 'Dívidas — BNB FNE MPE (30%)', valor: FINANCIAMENTO.valorDivida },
    { label: 'Capital próprio (70%)', valor: FINANCIAMENTO.valorCapitalProprio },
  ],
  get totalAtivos() {
    return this.ativos.reduce((sum, a) => sum + a.valor, 0)
  },
  get totalPassivoPL() {
    return this.passivoPatrimonioLiquido.reduce((sum, p) => sum + p.valor, 0)
  },
}

/** Valor de mercado estimado dos ativos ao final do Ano 5 — fato lateral,
 * intencionalmente NÃO incorporado ao FCL do Ano 5 (o estudo original
 * propõe somá-lo, mas as métricas finais de payback/VPL/TIR do próprio
 * documento reconciliam apenas sem ele). */
export const VALOR_RESIDUAL_ATIVOS_ANO5 = 78_878.03
export const VALOR_CONTABIL_LIQUIDO_ANO5 = 114_573.55

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
