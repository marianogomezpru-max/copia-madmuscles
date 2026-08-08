import { PERIODS } from '../constants.js'

export default function PeriodSelector({ t, period, setPeriod }) {
  return (
    <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
      {PERIODS.map(p => (
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            period === p ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t.periods[p]}
        </button>
      ))}
    </div>
  )
}
