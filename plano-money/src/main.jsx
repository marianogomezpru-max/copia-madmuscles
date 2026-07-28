import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DominaTuDineroPage from './pages/DominaTuDineroPage.jsx'
import BonoDiarioPage from './pages/BonoDiarioPage.jsx'
import BonoContratoPage from './pages/BonoContratoPage.jsx'
import ElCerebroYElDineroPage from './pages/ElCerebroYElDineroPage.jsx'
import DelSomosDosAlSomosTresPage from './pages/DelSomosDosAlSomosTresPage.jsx'
import BonoMapaMentalPage from './pages/BonoMapaMentalPage.jsx'
import BonoQuizCompradorPage from './pages/BonoQuizCompradorPage.jsx'
import BonoReto21DiasPage from './pages/BonoReto21DiasPage.jsx'
import BonoChecklistCompraPage from './pages/BonoChecklistCompraPage.jsx'
import QuizPlanoMoneyPage from './pages/QuizPlanoMoneyPage.jsx'
import UpsellDominaTuDineroPage from './pages/UpsellDominaTuDineroPage.jsx'
import DownsellEmocionYDineroPage from './pages/DownsellEmocionYDineroPage.jsx'
import './index.css'

// Minimal path-based routing — the main app has no router (it's a single
// authenticated shell), but these standalone paid pieces need their own
// public URLs, reachable without ever logging into Plano.Money.
const ROUTES = {
  '/domina-tu-dinero': DominaTuDineroPage,
  '/bono-diario': BonoDiarioPage,
  '/bono-contrato': BonoContratoPage,
  '/el-cerebro-y-el-dinero': ElCerebroYElDineroPage,
  '/del-somos-dos-al-somos-tres': DelSomosDosAlSomosTresPage,
  '/bono-mapa-mental': BonoMapaMentalPage,
  '/bono-quiz-comprador': BonoQuizCompradorPage,
  '/bono-reto-21-dias': BonoReto21DiasPage,
  '/bono-checklist-compra': BonoChecklistCompraPage,
  '/quiz': QuizPlanoMoneyPage,
  '/upsell-domina-tu-dinero': UpsellDominaTuDineroPage,
  '/downsell-emocion-y-dinero': DownsellEmocionYDineroPage,
}

const RootComponent = ROUTES[window.location.pathname] || App

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
