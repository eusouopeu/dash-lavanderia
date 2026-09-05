import {
  BanknotesIcon,
  ClockIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import { KpiCard } from '../components/KpiCard'
import { Panel } from '../components/Panel'
import { FluxoCaixaChart } from '../components/FluxoCaixaChart'
import { PageHeader } from '../layout/PageHeader'
import {
  FRANQUIA_INFO,
  INVESTIMENTO_TOTAL,
  LOCALIZACAO,
  METRICAS_VIABILIDADE,
} from '../data'
import { formatBRLCompact, formatPercent } from '../format'

export function PanoramaGeral() {
  return (
    <>
      <PageHeader
        eyebrow="Estudo de viabilidade econômico-financeira"
        title="Lavanderia Self-Service — Rio Vermelho"
        subtitle={`Franquia ${FRANQUIA_INFO.nome}, dentro do estacionamento RedeMix, ${LOCALIZACAO.endereco.split(',').slice(-3).join(',').trim()}`}
        meta="Horizonte de análise: 5 anos · valores consolidados e reconciliados a partir do estudo original"
      />

      <main className="space-y-5 px-6 py-6 pb-24 lg:px-10 lg:pb-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard
            label="Investimento total"
            value={formatBRLCompact(INVESTIMENTO_TOTAL)}
            detail="Pré-operacionais + ativos fixos + capital de giro"
            accent="ink"
            icon={<BuildingOffice2Icon className="h-4 w-4" />}
          />
          <KpiCard
            label="VPL @ TMA 11,19%"
            value={formatBRLCompact(METRICAS_VIABILIDADE.vpl)}
            detail="Valor presente líquido positivo em 5 anos"
            accent="petrol"
            icon={<BanknotesIcon className="h-4 w-4" />}
          />
          <KpiCard
            label="TIR"
            value={formatPercent(METRICAS_VIABILIDADE.tir, 1)}
            detail="Muito acima da TMA do projeto"
            accent="petrol"
            icon={<ArrowTrendingUpIcon className="h-4 w-4" />}
          />
          <KpiCard
            label="Payback simples"
            value={`${METRICAS_VIABILIDADE.paybackSimplesAnos.toFixed(2).replace('.', ',')} anos`}
            detail={`Descontado: ${METRICAS_VIABILIDADE.paybackDescontadoAnos.toFixed(2).replace('.', ',')} anos`}
            accent="ember"
            icon={<ClockIcon className="h-4 w-4" />}
          />
          <KpiCard
            label="TMA / WACC"
            value={formatPercent(METRICAS_VIABILIDADE.tma, 2)}
            detail="30% dívida (BNB) + 70% capital próprio"
            accent="ink"
            icon={<ScaleIcon className="h-4 w-4" />}
          />
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel
            title="Fluxo de Caixa Livre do Projeto"
            note="Barras: FCL do exercício · linha: FCL acumulado. Ano 0 é negativo (investimento inicial)."
            className="lg:col-span-2"
          >
            <FluxoCaixaChart />
          </Panel>

          <Panel title="O negócio em resumo">
            <dl className="space-y-4 text-[13px] leading-relaxed text-ink">
              <div>
                <dt className="eyebrow mb-1">Modelo</dt>
                <dd className="text-muted">
                  Franquia {FRANQUIA_INFO.nome} — rede internacional com origem argentina (1981), no
                  Brasil desde {FRANQUIA_INFO.brasilDesde}, {FRANQUIA_INFO.unidadesBrasil} unidades.
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Localização</dt>
                <dd className="text-muted">
                  Estacionamento RedeMix, Rua Oswaldo Cruz, {LOCALIZACAO.bairro}, {LOCALIZACAO.cidade} —
                  mesmo espaço de um McDonald's e a ~10 min de uma academia Selfit.
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Formato</dt>
                <dd className="text-muted">
                  Unidade em container de {LOCALIZACAO.area}, self-service, ciclo completo de lavagem +
                  secagem em ~{LOCALIZACAO.cicloDuracaoMin} minutos.
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Veredito</dt>
                <dd className="font-semibold text-petrol">
                  Projeto viável: TIR (78,4% a.a.) muito superior à TMA (11,19% a.a.), com payback abaixo
                  de 1,5 ano.
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </main>
    </>
  )
}
