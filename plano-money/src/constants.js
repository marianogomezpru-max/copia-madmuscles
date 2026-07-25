export const DB_KEY = 'plano_money_db_v4'

// Six shades within the app's constrained palette (azul oscuro, azul suave,
// lila, celeste, verde) — chosen for lightness/hue spread so groups stay
// distinguishable even without color, since the donut always pairs them
// with a direct label in the legend.
export const GROUP_COLORS = {
  hogar: { light: '#1e3a8a', dark: '#1e3a8a' }, // azul oscuro
  deudas: { light: '#0ea5e9', dark: '#0ea5e9' }, // celeste
  movilidad: { light: '#8b5cf6', dark: '#8b5cf6' }, // lila
  social: { light: '#93c5fd', dark: '#93c5fd' }, // azul suave
  personal: { light: '#059669', dark: '#059669' }, // verde
  otros: { light: '#1a1652', dark: '#1a1652' }, // navy profundo
}

export const GROUPS = ['hogar', 'deudas', 'movilidad', 'social', 'personal', 'otros']

// Ordered primary → secondary (fixed necessities first, discretionary last) —
// this is also the display order everywhere categories are listed.
export const CATEGORIES = [
  { id: 'alquiler', group: 'hogar' },
  { id: 'supermercado', group: 'hogar' },
  { id: 'servicios', group: 'hogar' },
  { id: 'transporte', group: 'movilidad' },
  { id: 'deuda_auto', group: 'deudas' },
  { id: 'deuda_moto', group: 'deudas' },
  { id: 'deuda_personal', group: 'deudas' },
  { id: 'deuda_otra', group: 'deudas' },
  { id: 'seguros', group: 'movilidad' },
  { id: 'mantenimiento_vehiculo', group: 'movilidad' },
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

export const PERIODS = ['mensual', 'bimestral', 'trimestral', 'semestral', 'anual']

export const PERIOD_MONTHS = {
  mensual: 1,
  bimestral: 2,
  trimestral: 3,
  semestral: 6,
  anual: 12,
}

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
}
