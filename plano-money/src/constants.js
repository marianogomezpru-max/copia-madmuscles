export const DB_KEY = 'plano_money_db_v4'

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

export const DEFAULT_DB = {
  userProfile: null,
  language: 'es',
  activeProfileId: null,
  profiles: [],
  fixedIncomes: [],
  variableIncomeTransactions: [],
  expenseTransactions: [],
  budgets: {},
  goals: [],
  savings: [],
  investments: [],
  monthlySavingsGoal: 0,
  // Snapshots of the monthly plan (fixed income / budgets / savings goal) as
  // of the moment each calendar month closed, keyed "YYYY-MM". Editing
  // today's values must never retroactively change how a past month is
  // reported in multi-month periods — lastSeenMonth is how we detect a
  // month has rolled over so we know when to freeze one.
  lastSeenMonth: null,
  monthlySnapshots: {},
}
