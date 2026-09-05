/** Cores dos gráficos via variáveis CSS — assim eles acompanham o tema
 * claro/escuro em vez de ficarem hardcoded em hex fixo. */
export const CHART_RULE = 'var(--color-rule)'
export const CHART_CURSOR = 'var(--color-rule-soft)'
export const CHART_MUTED = 'var(--color-muted)'
export const CHART_PETROL = 'var(--color-petrol)'
export const CHART_EMBER = 'var(--color-ember)'
export const CHART_INK = 'var(--color-ink)'

export const AXIS_TICK = {
  fontSize: 10,
  fill: CHART_MUTED,
  fontFamily: '"IBM Plex Mono", monospace',
} as const
