import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { PanoramaGeral } from './pages/PanoramaGeral'
import { EstruturaDoInvestimento } from './pages/EstruturaDoInvestimento'
import { ProjecoesFinanceiras } from './pages/ProjecoesFinanceiras'
import { ViabilidadeDoProjeto } from './pages/ViabilidadeDoProjeto'
import { MercadoEConcorrencia } from './pages/MercadoEConcorrencia'
import { FontesEMetodologia } from './pages/FontesEMetodologia'
import { PainelDeCenarios } from './pages/PainelDeCenarios'
import { RelatorioCompleto } from './pages/RelatorioCompleto'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<PanoramaGeral />} />
          <Route path="mercado-e-concorrencia" element={<MercadoEConcorrencia />} />
          <Route path="estrutura-do-investimento" element={<EstruturaDoInvestimento />} />
          <Route path="projecoes-financeiras" element={<ProjecoesFinanceiras />} />
          <Route path="viabilidade-do-projeto" element={<ViabilidadeDoProjeto />} />
          <Route path="painel-de-cenarios" element={<PainelDeCenarios />} />
          <Route path="fontes-e-metodologia" element={<FontesEMetodologia />} />
          <Route path="relatorio" element={<RelatorioCompleto />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
