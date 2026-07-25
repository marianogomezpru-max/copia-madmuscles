import { Activity, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../utils/format.js'
import DonutChart from './DonutChart.jsx'
import PeriodSelector from './PeriodSelector.jsx'

export default function DashboardView({ t, period, setPeriod, totalIncome, totalExpenses, netBalance, savingsProgress, totalsByGroup, lang }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
        <PeriodSelector t={t} period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-finaraCardGreen"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.income}</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">${formatCurrency(totalIncome, lang)} <span className="text-xs font-normal text-slate-400">US$</span></p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-finaraCardOrange"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.expenses}</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><TrendingDown className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">${formatCurrency(totalExpenses, lang)} <span className="text-xs font-normal text-slate-400">US$</span></p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-finaraCardBlue"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.net}</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity className="w-4 h-4" /></div>
          </div>
          <p className={`text-xl sm:text-2xl font-black ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            ${formatCurrency(netBalance, lang)} <span className="text-xs font-normal text-slate-400">US$</span>
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-finaraCardPurple"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.cards.savings}</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Target className="w-4 h-4" /></div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{savingsProgress}%</p>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">{t.expenseBreakdown}</h3>
        <DonutChart t={t} totalsByGroup={totalsByGroup} total={totalExpenses} lang={lang} />
      </div>
    </div>
  )
}
