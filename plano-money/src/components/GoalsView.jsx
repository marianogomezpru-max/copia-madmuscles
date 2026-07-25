import { useState } from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'
import { formatMoney, parseNonNegativeNumber } from '../utils/format.js'
import { parseAmountAndLabel } from '../utils/speech.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

function GoalContributionForm({ t, goalId, onAdd }) {
  const [amount, setAmount] = useState('')

  const submit = e => {
    e.preventDefault()
    const num = parseNonNegativeNumber(amount)
    if (num > 0) {
      onAdd(goalId, num)
      setAmount('')
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="number"
        min="0.01"
        step="any"
        placeholder={t.goalContributionPlaceholder}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit"
        className="flex items-center gap-1 bg-lila-500 hover:bg-lila-600 text-white font-bold px-3 py-2 rounded-lg text-sm shrink-0"
      >
        <Plus className="w-4 h-4" /> {t.addGoalContributionBtn}
      </button>
    </form>
  )
}

export default function GoalsView({ t, db, newGoal, setNewGoal, addGoal, addGoalDirect, removeGoal, addGoalContribution, lang }) {
  const [voiceMsg, setVoiceMsg] = useState(null)

  // Dictating "Viaje a Europa cinco mil" creates the goal straight away
  // (saved starts at 0); an unrecognized amount just prefills the name.
  const handleTranscript = phrase => {
    const { amount, label } = parseAmountAndLabel(phrase)
    const num = Number(amount)
    if (Number.isFinite(num) && num > 0 && label) {
      addGoalDirect({ name: label, target: num, saved: 0 })
      setVoiceMsg(`${label} · ${t.goalLabel}: ${formatMoney(num, lang)}`)
      setTimeout(() => setVoiceMsg(null), 4000)
    } else if (label) {
      setNewGoal({ ...newGoal, name: label })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-lila-500" /> {t.newGoalTitle}
          </h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleTranscript} />
        </div>
        <VoiceConfirmationBanner message={voiceMsg} />
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
              step="any"
              placeholder={t.goalTargetPlaceholder}
              value={newGoal.target}
              onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number"
              min="0"
              step="any"
              placeholder={t.goalSavedPlaceholder}
              value={newGoal.saved}
              onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-celeste-500 hover:bg-celeste-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base"
          >
            {t.createGoalBtn}
          </button>
        </form>
        <p className="text-xs text-slate-400">{t.newGoalHint}</p>
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
                <h4 className="font-bold text-navy-900 text-sm sm:text-base">{g.name}</h4>
                <button onClick={() => removeGoal(g.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-lila-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-600">
                <span>{formatMoney(g.saved, lang)} {t.savedLabel}</span>
                <span>{t.goalLabel}: {formatMoney(g.target, lang)}</span>
              </div>
              <GoalContributionForm t={t} goalId={g.id} onAdd={addGoalContribution} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
