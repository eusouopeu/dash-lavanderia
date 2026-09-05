const ptBR = (value: number, digits: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export function formatBRL(value: number, digits = 2): string {
  return `R$ ${ptBR(value, digits)}`
}

export function formatBRLCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `R$ ${ptBR(value / 1_000_000, 2)} mi`
  if (abs >= 1_000) return `R$ ${ptBR(value / 1_000, 1)} mil`
  return formatBRL(value, 0)
}

export function formatPercent(value: number, digits = 1): string {
  return `${ptBR(value * 100, digits)}%`
}

export function formatPercentSigned(value: number, digits = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${ptBR(value * 100, digits)}pp`
}

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function formatYears(value: number, digits = 2): string {
  return `${ptBR(value, digits)} anos`
}
