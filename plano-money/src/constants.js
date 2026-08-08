// Six clearly distinct hues for the donut chart's 6 category groups — a
// near-monochrome blue/lila set (tried earlier) made adjacent slices too
// similar to tell apart, so this goes back to a validated, CVD-safe spread.
export const GROUP_COLORS = {
  hogar: { light: '#2a78d6', dark: '#2a78d6' },
  deudas: { light: '#eb6834', dark: '#eb6834' },
  movilidad: { light: '#1baf7a', dark: '#1baf7a' },
  social: { light: '#eda100', dark: '#eda100' },
  personal: { light: '#e87ba4', dark: '#e87ba4' },
  otros: { light: '#008300', dark: '#008300' },
}

export const GROUPS = ['hogar', 'deudas', 'movilidad', 'social', 'personal', 'otros']

// Ordered primary → secondary (fixed necessities first, discretionary last) —
// this is also the display order everywhere categories are listed.
export const CATEGORIES = [
  { id: 'alquiler', group: 'hogar' },
  { id: 'supermercado', group: 'hogar' },
  { id: 'servicios', group: 'hogar' },
  { id: 'expensas', group: 'hogar' },
  { id: 'transporte', group: 'movilidad' },
  { id: 'deuda_auto', group: 'deudas' },
  { id: 'deuda_moto', group: 'deudas' },
  { id: 'deuda_personal', group: 'deudas' },
  { id: 'deuda_otra', group: 'deudas' },
  { id: 'seguros', group: 'movilidad' },
  { id: 'mantenimiento_vehiculo', group: 'movilidad' },
  { id: 'salud', group: 'personal' },
  { id: 'educacion', group: 'personal' },
  { id: 'restaurantes', group: 'social' },
  { id: 'reuniones', group: 'social' },
  { id: 'viajes', group: 'movilidad' },
  { id: 'ropa', group: 'personal' },
  { id: 'peluqueria', group: 'personal' },
  { id: 'esteticista', group: 'personal' },
  { id: 'suscripciones', group: 'personal' },
  { id: 'proyecto_especial', group: 'otros' },
  { id: 'gastos_varios', group: 'otros' },
]

export const CATEGORY_IDS = CATEGORIES.map(c => c.id)

// One distinct color per category (not just per group) so expense lists are
// scannable at a glance — evenly spaced hues, skipping the red band since
// red is reserved for "at/over budget" risk states elsewhere in the app.
const RED_BAND_DEGREES = 24
export const CATEGORY_COLORS = Object.fromEntries(
  CATEGORIES.map((cat, i) => {
    const usableSpan = 360 - RED_BAND_DEGREES
    const hue = Math.round(RED_BAND_DEGREES / 2 + (i * usableSpan) / CATEGORIES.length)
    return [cat.id, `hsl(${hue}, 62%, 46%)`]
  }),
)

export const PERIODS = ['mensual', 'bimestral', 'trimestral', 'semestral', 'anual']

export const CURRENCY_SYMBOLS = { es: '$', en: '$', pt: 'R$' }

export const INVESTMENT_TYPES = ['plazo_fijo', 'cripto', 'titulos', 'bonos', 'otro']

// Control Vacaciones — a fully separate tracker with its own fixed budget
// and category list, entirely outside the household's regular
// expenses/categories (different table, different math, never summed
// into the main Dashboard).
export const VACATION_CATEGORY_IDS = [
  'ropa', 'farmacia_perfumeria', 'peluqueria_unas', 'mantenimiento_auto_moto',
  'pasaje_tren', 'pasaje_aereo', 'pasaje_micro', 'pasaje_ferry', 'uber_taxi',
  'combustible', 'peajes', 'tasas_impuestos', 'alquiler', 'supermercado',
  'carpa_parador', 'almuerzo', 'merienda', 'restaurante', 'salidas_paseos',
  'excursiones', 'suvenir',
]

// Same green/yellow/red degree-vs-plan convention as Presupuesto vs. Real,
// with the thresholds the user asked for specifically for vacation
// spending: more headroom before it turns critical.
export const VACATION_SEVERITY_THRESHOLDS = { warning: 65, critical: 87 }
