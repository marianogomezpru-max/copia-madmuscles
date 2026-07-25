import { LOCALE_MAP } from '../i18n.js'

export function formatCurrency(value, lang = 'es') {
  const num = Number(value)
  if (!Number.isFinite(num)) return '0'
  return num.toLocaleString(LOCALE_MAP[lang] || 'en-US')
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
