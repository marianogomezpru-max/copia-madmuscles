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
}
