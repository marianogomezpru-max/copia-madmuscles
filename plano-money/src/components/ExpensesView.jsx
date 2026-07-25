export default function ExpensesView({ t, db, updateExpense, updateBudget, updateIncome }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">{t.incomeLabel}</label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
          <input
            type="number"
            min="0"
            value={db.income}
            onChange={e => updateIncome(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">{t.manageExpensesTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(db.expenses).map(([key, val]) => (
            <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase block">{t.categories[key] || key}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  value={val}
                  onChange={e => updateExpense(key, e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-semibold">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder={t.budgetLabel}
                  value={db.budgets[key] ?? ''}
                  onChange={e => updateBudget(key, e.target.value)}
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
