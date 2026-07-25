import { PERIOD_MONTHS } from '../constants.js'

// Returns [startISO, endISO] for the N-month window ending at the end of the
// current calendar month, where N comes from PERIOD_MONTHS[period].
export function getPeriodRange(period, refDate = new Date()) {
  const months = PERIOD_MONTHS[period] || 1
  const end = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0)
  const start = new Date(refDate.getFullYear(), refDate.getMonth() - (months - 1), 1)
  return [toISODate(start), toISODate(end)]
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function inRange(dateStr, startISO, endISO) {
  return dateStr >= startISO && dateStr <= endISO
}

export function isCurrentMonth(dateStr, refDate = new Date()) {
  const [start, end] = getPeriodRange('mensual', refDate)
  return inRange(dateStr, start, end)
}
