# Estudo de Viabilidade — Lavanderia Self-Service (Rio Vermelho, Salvador/BA)

Dashboard do Estudo de Viabilidade Econômico-Financeira para a implantação de uma
franquia Laundromat Lavanderias, no modelo self-service, dentro do estacionamento
RedeMix na Rua Oswaldo Cruz, bairro do Rio Vermelho, Salvador/BA. React + TypeScript
+ Tailwind CSS 4, gráficos com Recharts, ícones Heroicons, fontes IBM Plex Sans/Mono.

Construído como parte de uma família de dashboards pessoais, reaproveitando a
identidade visual e a arquitetura de `dash-bancos` (Layout com Sidebar/BottomNav,
`PageHeader`, `data.ts` tipado, `format.ts`, HashRouter para hospedagem estática no
GitHub Pages).

## Conteúdo

- **Panorama geral** — KPIs principais (VPL, TIR, Payback, TMA, investimento total) e
  o fluxo de caixa livre do projeto.
- **Estrutura do investimento** — gastos pré-operacionais, ativos fixos (itemizado),
  capital de giro, financiamento (dívida × capital próprio) e custo de capital.
- **Projeções financeiras** — fluxo de caixa livre detalhado ano a ano, margem de
  contribuição, receita vs. capacidade instalada.
- **Viabilidade do projeto** — payback simples/descontado, VPL, TIR e o saldo
  acumulado do fluxo de caixa.
- **Mercado e concorrência** — os cinco concorrentes diretos do bairro, matriz SWOT
  comparativa e a estimativa de Fermi usada para dimensionar a demanda.
- **Fontes e metodologia** — premissas do estudo e a lista de referências.

## Sobre os números

O estudo original (trabalho acadêmico da UFBA, disciplina ADM154) contém
inconsistências internas: alguns valores são recalculados em tabelas posteriores sem
que os parágrafos anteriores sejam atualizados. Este dashboard usa valores
consolidados e reconciliados a partir do estudo original — cada figura foi conferida
aritmeticamente contra as tabelas finais (Balanço do Ano 0, Fluxo de Caixa Livre,
WACC e as tabelas de Payback/VPL/TIR). Ver a página "Fontes e Metodologia" para
detalhes.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy no GitHub Pages

O workflow em `.github/workflows/deploy.yml` publica automaticamente a cada push em
`main`, via GitHub Actions (Settings → Pages → Source: GitHub Actions).

O `base` em `vite.config.ts` está fixado como `/dash-lavanderia/` — ajuste esse valor
se o nome do repositório for diferente.
