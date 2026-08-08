import { Activity, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { formatMoney } from '../utils/format.js'
import DonutChart from './DonutChart.jsx'
import PeriodSelector from './PeriodSelector.jsx'
import BudgetProgress from './BudgetProgress.jsx'

export default function DashboardView({
  t,
  period,
  setPeriod,
  totalIncome,
  totalExpenses,
  netBalance,
  savingsProgress,
  savedInPeriod,
  periodSavingsGoal,
  totalsByGroup,
  budgetProgress,
  lang,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-navy-900">{t.title}</h2>
        <PeriodSelector t={t} period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.income}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-navy-900">{formatMoney(totalIncome, lang)}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-celeste-500"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.expenses}</span>
            <div className="p-2 bg-sky-50 text-celeste-600 rounded-xl"><TrendingDown className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-navy-900">{formatMoney(totalExpenses, lang)}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-navy-900"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.net}</span>
            <div className="p-2 bg-indigo-50 text-navy-900 rounded-xl"><Activity className="w-4 h-4" /></div>
          </div>
          <p className={`text-xl sm:text-2xl font-black ${netBalance >= 0 ? 'text-navy-900' : 'text-red-600'}`}>
            {formatMoney(netBalance, lang)}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-lila-500"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.savings}</span>
            <div className="p-2 bg-purple-50 text-lila-600 rounded-xl"><Target className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-navy-900">{savingsProgress}%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {periodSavingsGoal > 0
              ? `${formatMoney(savedInPeriod, lang)} / ${formatMoney(periodSavingsGoal, lang)}`
              : t.noSavingsGoalSet}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">{t.expenseBreakdown}</h3>
          <DonutChart t={t} totalsByGroup={totalsByGroup} total={totalExpenses} lang={lang} />
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">{t.budgetProgressTitle}</h3>
          <BudgetProgress t={t} items={budgetProgress} lang={lang} />
        </div>
      </div>
    </div>
  )
}
