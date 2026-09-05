import { describe, expect, it } from 'vitest'
import {
  ATIVOS_FIXOS,
  CENARIOS,
  MODELO_BASE,
  MODELO_OTIMISTA,
  MODELO_PESSIMISTA,
  PREMISSAS_BASE,
  TOTAL_ATIVOS_FIXOS,
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

describe('vpl / tir — funções financeiras genéricas', () => {
  it('vpl de um fluxo com taxa 0 é a soma simples dos fluxos', () => {
    const fluxos = [-100, 40, 40, 40]
    expect(vpl(0, fluxos)).toBeCloseTo(20, 6)
  })

  it('vpl decresce à medida que a taxa de desconto aumenta', () => {
    const fluxos = [-100, 60, 60, 60]
    expect(vpl(0.05, fluxos)).toBeGreaterThan(vpl(0.2, fluxos))
  })

  it('tir é a taxa que zera o vpl do próprio fluxo', () => {
    const fluxos = [-100, 60, 60, 60]
    const taxa = tir(fluxos)
    expect(vpl(taxa, fluxos)).toBeCloseTo(0, 4)
  })

  it('tir de um fluxo sempre positivo (sem investimento inicial negativo) é NaN', () => {
    expect(tir([100, 60, 60])).toBeNaN()
  })

  it('payback simples encontra o ano fracionário em que o saldo acumulado zera', () => {
    // -100, depois +50/ano: acumulado zera aos 2 anos exatos
    expect(paybackSimples([-100, 50, 50, 50])).toBeCloseTo(2, 6)
  })

  it('payback descontado é sempre maior ou igual ao payback simples (mesma taxa > 0)', () => {
    const fluxos = [-200, 90, 90, 90, 90]
    expect(paybackDescontado(fluxos, 0.1)).toBeGreaterThanOrEqual(paybackSimples(fluxos))
  })
})

describe('calcularCapitalDeGiro', () => {
  it('a linha de 6 meses de custos fixos usa o custo fixo mensal informado (com aluguel)', () => {
    const cg = calcularCapitalDeGiro(PREMISSAS_BASE)
    expect(cg.seisMesesCustosFixos).toBeCloseTo(PREMISSAS_BASE.custosFixosMensaisAno1 * 6, 6)
  })

  it('total é a soma de todas as parcelas', () => {
    const cg = calcularCapitalDeGiro(PREMISSAS_BASE)
    const soma =
      cg.estoqueInicial + cg.seisMesesCustosFixos + cg.provisaoPrazoRecebimento + cg.fundoContingencia
    expect(cg.total).toBeCloseTo(soma, 6)
  })
})

describe('calcularCustoCapital', () => {
  it('wacc é a média ponderada de Kdr e Ksr pelas proporções de dívida e capital próprio', () => {
    const cc = calcularCustoCapital(PREMISSAS_BASE)
    const esperado = PREMISSAS_BASE.percentDivida * cc.kdr + (1 - PREMISSAS_BASE.percentDivida) * cc.ksReal
    expect(cc.wacc).toBeCloseTo(esperado, 10)
  })

  it('um erp maior sempre produz um wacc maior (CAPM com prêmio de risco positivo)', () => {
    const ccBase = calcularCustoCapital(PREMISSAS_BASE)
    const ccMaisRisco = calcularCustoCapital({
      ...PREMISSAS_BASE,
      capm: { ...PREMISSAS_BASE.capm, erp: PREMISSAS_BASE.capm.erp + 0.02 },
    })
    expect(ccMaisRisco.wacc).toBeGreaterThan(ccBase.wacc)
  })
})

describe('calcularFluxo — FCFF sem dupla contagem de juros', () => {
  const fluxo = calcularFluxo(PREMISSAS_BASE)

  it('possui 6 pontos no tempo (Ano 0 a Ano 5)', () => {
    expect(fluxo).toHaveLength(6)
  })

  it('Ano 0 é igual a menos (gastos pré-operacionais + ativos fixos + capital de giro)', () => {
    const cg = calcularCapitalDeGiro(PREMISSAS_BASE)
    const esperado = -(PREMISSAS_BASE.gastosPreOperacionais + PREMISSAS_BASE.ativosFixosTotal + cg.total)
    expect(fluxo[0].fcl).toBeCloseTo(esperado, 2)
  })

  it('FCO de cada ano é igual ao EBITDA (Simples Nacional já deduzido na margem, sem escudo fiscal de depreciação)', () => {
    for (const f of fluxo.filter((f) => f.ano > 0)) {
      expect(f.fco).toBeCloseTo(f.ebitda!, 6)
    }
  })

  it('nenhuma linha carrega juros de financiamento (FCFF: estrutura de capital só entra via WACC)', () => {
    for (const f of fluxo) {
      expect(f).not.toHaveProperty('jurosBNB')
    }
  })

  it('Ano 5 soma FCO do ano + recuperação do capital de giro', () => {
    const ano5 = fluxo.find((f) => f.ano === 5)!
    expect(ano5.fco! + ano5.variacaoCapitalGiro!).toBeCloseTo(ano5.fcl, 6)
  })

  it('clientes/ano é constante do Ano 1 ao Ano 5 (não deve crescer com o IPCA)', () => {
    const anos = fluxo.filter((f) => f.ano > 0)
    for (const f of anos) expect(f.clientesAno).toBe(anos[0].clientesAno)
  })

  it('receita de cada ano é igual a clientes × ticket médio', () => {
    for (const f of fluxo.filter((f) => f.ano > 0)) {
      expect(f.clientesAno! * f.ticketMedio!).toBeCloseTo(f.receita!, 4)
    }
  })

  it('ticket médio cresce exatamente pelo IPCA anual', () => {
    const anos = fluxo.filter((f) => f.ano > 0)
    for (let i = 1; i < anos.length; i++) {
      const crescimento = anos[i].ticketMedio! / anos[i - 1].ticketMedio! - 1
      expect(crescimento).toBeCloseTo(PREMISSAS_BASE.ipcaAnual, 6)
    }
  })

  it('margem de contribuição como % da receita é constante ao longo dos anos (custo variável reajustado junto)', () => {
    const anos = fluxo.filter((f) => f.ano > 0)
    const percentuais = anos.map((f) => f.margemContribuicaoTotal! / f.receita!)
    for (const p of percentuais) expect(p).toBeCloseTo(percentuais[0], 6)
  })

  it('nenhum ano ultrapassa a capacidade máxima instalada', () => {
    for (const f of fluxo.filter((f) => f.ano > 0)) {
      expect(f.clientesAno!).toBeLessThan(PREMISSAS_BASE.capacidadeMaximaClientesAno)
    }
  })
})

describe('calcularModelo — caso-base', () => {
  it('investimento total é a soma de pré-operacionais + ativos fixos + capital de giro', () => {
    const m = MODELO_BASE
    expect(m.investimentoTotal).toBeCloseTo(
      PREMISSAS_BASE.gastosPreOperacionais + PREMISSAS_BASE.ativosFixosTotal + m.capitalDeGiro.total,
      2,
    )
  })

  it('financiamento (dívida + capital próprio) soma o investimento total', () => {
    const m = MODELO_BASE
    expect(m.financiamento.valorDivida + m.financiamento.valorCapitalProprio).toBeCloseTo(
      m.investimentoTotal,
      2,
    )
  })

  it('VPL do modelo é igual a vpl(wacc, fcl) recalculado de fora', () => {
    const m = MODELO_BASE
    expect(m.metricas.vpl).toBeCloseTo(vpl(m.custoCapital.wacc, m.fluxo.map((f) => f.fcl)), 2)
  })

  it('projeto é viável no caso-base: TIR > TMA e VPL > 0', () => {
    expect(MODELO_BASE.metricas.tir).toBeGreaterThan(MODELO_BASE.metricas.tma)
    expect(MODELO_BASE.metricas.vpl).toBeGreaterThan(0)
  })

  it('ponto de equilíbrio e utilização projetada usam a mesma base de capacidade (clientes/ano combinado)', () => {
    const m = MODELO_BASE
    expect(m.pontoEquilibrio.clientesBreakeven).toBeLessThan(m.capacidade.maximaClientesAno)
    expect(m.pontoEquilibrio.clientesBreakeven).toBeLessThan(m.capacidade.clientesProjetadosAno1)
  })

  it('ativos fixos totais é a soma dos itens da tabela (fórmula, não constante digitada)', () => {
    expect(TOTAL_ATIVOS_FIXOS).toBeCloseTo(
      ATIVOS_FIXOS.reduce((s, a) => s + a.total, 0),
      6,
    )
  })
})

describe('Cenários — base, pessimista e otimista', () => {
  it('CENARIOS contém exatamente os três cenários, em ordem pessimista → base → otimista', () => {
    expect(CENARIOS.map((c) => c.nome)).toEqual(['Pessimista', 'Base', 'Otimista'])
  })

  it('todos os três cenários são viáveis (VPL > 0 e TIR > TMA)', () => {
    for (const m of [MODELO_PESSIMISTA, MODELO_BASE, MODELO_OTIMISTA]) {
      expect(m.metricas.vpl).toBeGreaterThan(0)
      expect(m.metricas.tir).toBeGreaterThan(m.metricas.tma)
    }
  })

  it('VPL: pessimista < base < otimista', () => {
    expect(MODELO_PESSIMISTA.metricas.vpl).toBeLessThan(MODELO_BASE.metricas.vpl)
    expect(MODELO_BASE.metricas.vpl).toBeLessThan(MODELO_OTIMISTA.metricas.vpl)
  })

  it('TIR: pessimista < base < otimista', () => {
    expect(MODELO_PESSIMISTA.metricas.tir).toBeLessThan(MODELO_BASE.metricas.tir)
    expect(MODELO_BASE.metricas.tir).toBeLessThan(MODELO_OTIMISTA.metricas.tir)
  })

  it('payback simples: otimista < base < pessimista', () => {
    expect(MODELO_OTIMISTA.metricas.paybackSimplesAnos).toBeLessThan(MODELO_BASE.metricas.paybackSimplesAnos)
    expect(MODELO_BASE.metricas.paybackSimplesAnos).toBeLessThan(MODELO_PESSIMISTA.metricas.paybackSimplesAnos)
  })

  it('cada cenário customizado recalcula o modelo inteiro (sliders do Painel de Cenários)', () => {
    const customizado = calcularModelo({
      ...PREMISSAS_BASE,
      clientesAno: 5_000,
    })
    expect(customizado.capacidade.clientesProjetadosAno1).toBe(5_000)
    expect(customizado.fluxo[1].clientesAno).toBe(5_000)
    expect(customizado.metricas.vpl).toBeLessThan(MODELO_BASE.metricas.vpl)
  })
})

describe('calcularMargemContribuicaoUnitariaAno1', () => {
  it('é igual ao ticket líquido de taxa de cartão e Simples Nacional, menos o custo variável (CSP)', () => {
    const mc = calcularMargemContribuicaoUnitariaAno1(PREMISSAS_BASE)
    const esperado =
      PREMISSAS_BASE.ticketMedioAno1 * (1 - PREMISSAS_BASE.taxaCartao - PREMISSAS_BASE.simplesNacional) -
      PREMISSAS_BASE.cspTotal
    expect(mc).toBeCloseTo(esperado, 6)
  })
})
