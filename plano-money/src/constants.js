export const DB_KEY = 'plano_money_db_v4'

// Fixed hue order from the validated categorical palette — never reorder or
// recolor per-category; adjacent slices must keep the CVD-safe adjacency.
export const GROUP_COLORS = {
  hogar: { light: '#2a78d6', dark: '#3987e5' },
  deudas: { light: '#eb6834', dark: '#d95926' },
  movilidad: { light: '#1baf7a', dark: '#199e70' },
  social: { light: '#eda100', dark: '#c98500' },
  personal: { light: '#e87ba4', dark: '#d55181' },
  otros: { light: '#008300', dark: '#008300' },
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
}
