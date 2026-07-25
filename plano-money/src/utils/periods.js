// Calendar-aligned periods, not rolling windows:
// - mensual: the current calendar month
// - bimestral/trimestral/semestral: the current calendar block (Ene-Feb,
//   Ene-Feb-Mar, Ene..Jun, etc.) — always the full block, even the part
//   still in the future
// - anual: year-to-date, accumulating month by month (Jan 1 through the
//   end of the current month) — not a fixed 12-month window
export function getPeriodRange(period, refDate = new Date()) {
  const year = refDate.getFullYear()
  const month = refDate.getMonth() // 0-indexed

  const blockSize = { bimestral: 2, trimestral: 3, semestral: 6 }[period]
  if (blockSize) {
    const blockStartMonth = Math.floor(month / blockSize) * blockSize
    const start = new Date(year, blockStartMonth, 1)
    const end = new Date(year, blockStartMonth + blockSize, 0)
    return [toISODate(start), toISODate(end)]
  }

  if (period === 'anual') {
    const start = new Date(year, 0, 1)
    const end = new Date(year, month + 1, 0)
    return [toISODate(start), toISODate(end)]
  }

  // mensual (default)
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return [toISODate(start), toISODate(end)]
}

// How many months' worth of a monthly plan (budget, fixed income, savings
// goal) a period covers. Fixed for calendar blocks; for "anual" it's the
// number of months elapsed so far this year, since that period grows
// month by month instead of jumping straight to a full 12.
export function getPeriodMonthCount(period, refDate = new Date()) {
  if (period === 'anual') return refDate.getMonth() + 1
  return { mensual: 1, bimestral: 2, trimestral: 3, semestral: 6 }[period] || 1
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
