import { Target, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/format.js'

export default function GoalsView({ t, db, newGoal, setNewGoal, addGoal, removeGoal, lang }) {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-finaraCardPurple" /> {t.newGoalTitle}
        </h3>
        <form onSubmit={addGoal} className="space-y-4">
          <input
            type="text"
            placeholder={t.goalNamePlaceholder}
            maxLength={80}
            value={newGoal.name}
            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              min="1"
              placeholder={t.goalTargetPlaceholder}
              value={newGoal.target}
              onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number"
              min="0"
              placeholder={t.goalSavedPlaceholder}
              value={newGoal.saved}
              onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base"
          >
            {t.createGoalBtn}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {db.goals.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-4">{t.noGoals}</p>
        )}
        {db.goals.map(g => {
          const progress = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0
          return (
            <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{g.name}</h4>
                <button onClick={() => removeGoal(g.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-finaraCardPurple h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-600">
                <span>${formatCurrency(g.saved, lang)} {t.savedLabel}</span>
                <span>{t.goalLabel}: ${formatCurrency(g.target, lang)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
