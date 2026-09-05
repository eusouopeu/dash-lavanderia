import { describe, expect, it } from 'vitest'
import {
  BALANCO_PATRIMONIAL_ANO0,
  CAPACIDADE,
  CAPITAL_DE_GIRO,
  CUSTOS_FIXOS_MENSAIS,
  FINANCIAMENTO,
  FLUXO_CAIXA,
  GASTOS_PRE_OPERACIONAIS,
  INVESTIMENTO_TOTAL,
  METRICAS_VIABILIDADE,
  TOTAL_ATIVOS_FIXOS,
  TOTAL_CUSTOS_FIXOS_MENSAIS,
} from './data'

describe('Investimento total (caso-base)', () => {
  it('soma pré-operacionais + ativos fixos + capital de giro', () => {
    const soma = GASTOS_PRE_OPERACIONAIS.total + TOTAL_ATIVOS_FIXOS + CAPITAL_DE_GIRO.total
    expect(INVESTIMENTO_TOTAL).toBeCloseTo(soma, 2)
  })

  it('capital de giro inclui o aluguel do espaço na linha de 6 meses de custos fixos', () => {
    expect(CAPITAL_DE_GIRO.seisMesesCustosFixos).toBeCloseTo(TOTAL_CUSTOS_FIXOS_MENSAIS * 6, 2)
  })
})

describe('Financiamento', () => {
  it('divide 30% dívida / 70% capital próprio do investimento total', () => {
    expect(FINANCIAMENTO.valorDivida + FINANCIAMENTO.valorCapitalProprio).toBeCloseTo(INVESTIMENTO_TOTAL, 1)
    expect(FINANCIAMENTO.percentDivida + FINANCIAMENTO.percentCapitalProprio).toBe(1)
  })
})

describe('Fluxo de caixa livre', () => {
  it('Ano 0 é igual a menos o investimento total', () => {
    const ano0 = FLUXO_CAIXA.find((f) => f.ano === 0)!
    expect(ano0.fcl).toBeCloseTo(-INVESTIMENTO_TOTAL, 1)
  })

  it('Ano 5 soma FCO do ano + recuperação do capital de giro', () => {
    const ano5 = FLUXO_CAIXA.find((f) => f.ano === 5)!
    expect(ano5.fco! + ano5.variacaoCapitalGiro!).toBeCloseTo(ano5.fcl, 1)
  })

  it('possui 6 pontos no tempo (Ano 0 a Ano 5)', () => {
    expect(FLUXO_CAIXA).toHaveLength(6)
  })

  it('Clientes/ano é constante do Ano 1 ao Ano 5 (não deve crescer com o IPCA)', () => {
    const anos = FLUXO_CAIXA.filter((f) => f.ano > 0)
    const clientesAno1 = anos[0].clientesAno
    for (const f of anos) {
      expect(f.clientesAno).toBe(clientesAno1)
    }
  })

  it('receita de cada ano é igual a clientes × ticket médio', () => {
    for (const f of FLUXO_CAIXA.filter((f) => f.ano > 0)) {
      expect(f.clientesAno! * f.ticketMedio!).toBeCloseTo(f.receita!, 0)
    }
  })

  it('nenhum ano ultrapassa a capacidade máxima instalada', () => {
    for (const f of FLUXO_CAIXA.filter((f) => f.ano > 0)) {
      expect(f.clientesAno!).toBeLessThan(CAPACIDADE.maximaClientesAno)
    }
  })
})

describe('Métricas de viabilidade', () => {
  it('TIR é superior à TMA — projeto viável', () => {
    expect(METRICAS_VIABILIDADE.tir).toBeGreaterThan(METRICAS_VIABILIDADE.tma)
  })

  it('VPL é positivo', () => {
    expect(METRICAS_VIABILIDADE.vpl).toBeGreaterThan(0)
  })
})

describe('Custos fixos mensais (inclui aluguel)', () => {
  it('soma dos itens mensais × 12 é igual aos gastos fixos desembolsáveis do Ano 1', () => {
    const ano1 = FLUXO_CAIXA.find((f) => f.ano === 1)!
    expect(TOTAL_CUSTOS_FIXOS_MENSAIS * 12).toBeCloseTo(ano1.gastosFixosDesembolsaveis!, 1)
  })

  it('inclui uma linha de aluguel do espaço', () => {
    expect(CUSTOS_FIXOS_MENSAIS.some((c) => c.item.toLowerCase().includes('aluguel'))).toBe(true)
  })
})

describe('Balanço Patrimonial do Ano 0', () => {
  it('total do Ativo é igual ao total do Passivo + PL, e ambos ao investimento total', () => {
    expect(BALANCO_PATRIMONIAL_ANO0.totalAtivos).toBeCloseTo(INVESTIMENTO_TOTAL, 1)
    expect(BALANCO_PATRIMONIAL_ANO0.totalPassivoPL).toBeCloseTo(INVESTIMENTO_TOTAL, 1)
  })
})

describe('Capacidade', () => {
  it('clientes/ano projetados não excedem a capacidade máxima combinada', () => {
    expect(CAPACIDADE.clientesProjetadosAno1).toBeLessThan(CAPACIDADE.maximaClientesAno)
  })
})
