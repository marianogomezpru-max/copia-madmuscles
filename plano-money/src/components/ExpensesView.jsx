import { Trash2 } from 'lucide-react'
import TransactionForm from './TransactionForm.jsx'
import { CATEGORIES, CATEGORY_COLORS, CURRENCY_SYMBOLS } from '../constants.js'
import { formatMoney } from '../utils/format.js'

export default function ExpensesView({ t, db, lang, addExpense, removeExpense, updateBudget }) {
  const sorted = [...db.expenseTransactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 30)
  const profileName = profileId => db.profiles.find(p => p.id === profileId)?.name

  return (
    <div className="space-y-6 animate-fade-in">
      <TransactionForm t={t} lang={lang} onAdd={addExpense} />

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">{t.recentTransactions}</h3>
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-4">{t.noExpensesInPeriod}</p>
        ) : (
          <div className="space-y-2">
            {sorted.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: CATEGORY_COLORS[tx.categoryId] }}
                  />
                  {tx.photo && <img src={tx.photo} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{t.categories[tx.categoryId] || tx.categoryId}</p>
                      {profileName(tx.profileId) && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-accent-500/10 text-accent-600 shrink-0">
                          {profileName(tx.profileId)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{tx.date}{tx.note ? ` · ${tx.note}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-black text-navy-900">{formatMoney(tx.amount, lang)}</span>
                  <button onClick={() => removeExpense(tx.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">{t.budgetsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: CATEGORY_COLORS[cat.id] }} />
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 ml-1.5">{t.categories[cat.id]}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-semibold">
                  {CURRENCY_SYMBOLS[lang] || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={t.noBudget}
                  value={db.budgets[cat.id] ?? ''}
                  onChange={e => updateBudget(cat.id, e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-dashed border-slate-200 rounded-lg text-slate-600 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
