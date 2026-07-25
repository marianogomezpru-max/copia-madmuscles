import { formatMoney } from '../utils/format.js'
import { CATEGORY_COLORS } from '../constants.js'

// Meter spec: fill carries severity, track is a lighter step of the same
// ramp. This is the one place in the app that uses the green/yellow/red
// traffic light — it's tracking degree of spend against the plan, which is
// exactly what that convention is for.
const SEVERITY = {
  good: { fill: '#059669', track: '#d1fae5' },
  warning: { fill: '#eab308', track: '#fef3c7' },
  critical: { fill: '#d03b3b', track: '#f8dada' },
}

function severityFor(pct) {
  if (pct > 90) return 'critical'
  if (pct > 60) return 'warning'
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
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[item.categoryId] }} />
                {t.categories[item.categoryId] || item.categoryId}
              </span>
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
