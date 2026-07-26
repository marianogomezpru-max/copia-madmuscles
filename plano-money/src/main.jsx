import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DominaTuDineroPage from './pages/DominaTuDineroPage.jsx'
import BonoDiarioPage from './pages/BonoDiarioPage.jsx'
import BonoContratoPage from './pages/BonoContratoPage.jsx'
import './index.css'

// Minimal path-based routing — the main app has no router (it's a single
// authenticated shell), but these standalone paid pieces need their own
// public URLs, reachable without ever logging into Plano.Money.
const ROUTES = {
  '/domina-tu-dinero': DominaTuDineroPage,
  '/bono-diario': BonoDiarioPage,
  '/bono-contrato': BonoContratoPage,
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
