import { LOCALE_MAP } from '../i18n.js'
import { CURRENCY_SYMBOLS } from '../constants.js'

export function formatCurrency(value, lang = 'es') {
  const num = Number(value)
  if (!Number.isFinite(num)) return '0'
  return num.toLocaleString(LOCALE_MAP[lang] || 'en-US')
}

// Prefixes the locale-formatted number with the right symbol for the
// language (es/en: $, pt: R$) instead of a hardcoded "$" everywhere.
export function formatMoney(value, lang = 'es') {
  const symbol = CURRENCY_SYMBOLS[lang] || '$'
  return `${symbol}${formatCurrency(value, lang)}`
}

// Clamps free-text number input to a finite, non-negative number instead of
// letting invalid input (empty string, "abc") propagate as NaN through totals.
export function parseNonNegativeNumber(value) {
  if (value === '') return 0
  const num = Number(value)
  return Number.isFinite(num) ? Math.max(0, num) : 0
}

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
