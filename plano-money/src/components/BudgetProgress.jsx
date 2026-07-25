import { formatMoney } from '../utils/format.js'

// Meter spec: fill carries severity, track is a lighter step of the same
// ramp. Red is reserved for the one true risk state — at or over budget;
// the "approaching" tier uses celeste (in-palette) instead of amber.
const SEVERITY = {
  good: { fill: '#059669', track: '#d1fae5' },
  warning: { fill: '#0ea5e9', track: '#dbeef9' },
  critical: { fill: '#d03b3b', track: '#f8dada' },
}

function severityFor(pct) {
  if (pct > 100) return 'critical'
  if (pct >= 75) return 'warning'
  return 'good'
}

export default function BudgetProgress({ t, items, lang }) {
  if (items.length === 0) {
    return <p className="text-center text-sm text-slate-400 py-4">{t.noBudgetsSet}</p>
  }

  return (
    <div className="space-y-3">
      {items.map(item => {
        const pct = item.budget > 0 ? (item.spent / item.budget) * 100 : 0
        const severity = SEVERITY[severityFor(pct)]
        return (
          <div key={item.categoryId}>
            <div className="flex items-center justify-between mb-1 text-xs sm:text-sm">
              <span className="font-semibold text-slate-700">{t.categories[item.categoryId] || item.categoryId}</span>
              <span className="font-bold text-navy-900">
                {formatMoney(item.spent, lang)} <span className="text-slate-400 font-normal">/ {formatMoney(item.budget, lang)}</span>
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: severity.track }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, pct)}%`, background: severity.fill }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
