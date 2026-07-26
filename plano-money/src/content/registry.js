// Single source of truth for every standalone-sold interactive piece
// (ebooks/bonos sold apart from the app subscription). Both the email
// sender (api/_lib/email.js) and the frontend routing (main.jsx) read
// from here — add a new offer by adding one entry, nothing else to touch.
export const CONTENT_REGISTRY = {
  'domina-tu-dinero': {
    title: 'Domina Tu Dinero',
    path: '/domina-tu-dinero',
  },
  'bono-diario': {
    title: 'Emoción y Dinero',
    path: '/bono-diario',
  },
  'bono-contrato': {
    title: 'Mi Nueva Relación con El Dinero',
    path: '/bono-contrato',
  },
  'el-cerebro-y-el-dinero': {
    title: 'El Cerebro y el Dinero',
    path: '/el-cerebro-y-el-dinero',
  },
  'del-somos-dos-al-somos-tres': {
    title: 'Del "Somos Dos" al "Somos Tres"',
    path: '/del-somos-dos-al-somos-tres',
  },
  'bono-mapa-mental': {
    title: 'Mapa Mental del Dinero',
    path: '/bono-mapa-mental',
  },
  'bono-quiz-comprador': {
    title: '¿Qué Comprador Eres?',
    path: '/bono-quiz-comprador',
  },
  'bono-reto-21-dias': {
    title: '21 Días para Reprogramar tu Cerebro Financiero',
    path: '/bono-reto-21-dias',
  },
  'bono-checklist-compra': {
    title: 'Piensa Antes de Comprar',
    path: '/bono-checklist-compra',
  },
}
