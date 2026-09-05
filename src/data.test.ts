import { describe, expect, it } from 'vitest'
import {
  CAPITAL_DE_GIRO,
  CUSTO_CAPITAL,
  FINANCIAMENTO,
  FLUXO_CAIXA,
  GASTOS_PRE_OPERACIONAIS,
  INVESTIMENTO_TOTAL,
  METRICAS_VIABILIDADE,
  TOTAL_ATIVOS_FIXOS,
} from './data'

describe('Investimento total', () => {
  it('soma pré-operacionais + ativos fixos + capital de giro', () => {
    const soma = GASTOS_PRE_OPERACIONAIS.total + TOTAL_ATIVOS_FIXOS + CAPITAL_DE_GIRO.total
    expect(Math.round(soma * 100) / 100).toBeCloseTo(277_082.07, 1)
    expect(Math.round(INVESTIMENTO_TOTAL * 100) / 100).toBeCloseTo(277_082.07, 1)
  })
})

describe('Financiamento', () => {
  it('divide 30% dívida / 70% capital próprio do investimento total', () => {
    expect(FINANCIAMENTO.valorDivida + FINANCIAMENTO.valorCapitalProprio).toBeCloseTo(INVESTIMENTO_TOTAL, 1)
    expect(FINANCIAMENTO.percentDivida + FINANCIAMENTO.percentCapitalProprio).toBe(1)
  })
})

describe('WACC / TMA', () => {
  it('é igual a 30% × Kdr + 70% × Ksr = 11,19% a.a.', () => {
    const wacc = 0.3 * CUSTO_CAPITAL.kdr + 0.7 * CUSTO_CAPITAL.ksr
    expect(wacc).toBeCloseTo(0.1119, 3)
    expect(CUSTO_CAPITAL.wacc).toBeCloseTo(0.1119, 3)
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
})

describe('Métricas de viabilidade', () => {
  it('TIR é muito superior à TMA — projeto viável', () => {
    expect(METRICAS_VIABILIDADE.tir).toBeGreaterThan(METRICAS_VIABILIDADE.tma)
  })

  it('VPL é positivo', () => {
    expect(METRICAS_VIABILIDADE.vpl).toBeGreaterThan(0)
  })
})
