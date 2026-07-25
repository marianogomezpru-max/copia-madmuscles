import { useState } from 'react'
import { PiggyBank, TrendingUp, Trash2 } from 'lucide-react'
import { formatMoney, parseNonNegativeNumber } from '../utils/format.js'
import { parseAmountAndLabel } from '../utils/speech.js'
import { CURRENCY_SYMBOLS, INVESTMENT_TYPES } from '../constants.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

export default function SavingsInvestmentsView({
  t,
  db,
  lang,
  addSaving,
  removeSaving,
  addInvestment,
  removeInvestment,
  setMonthlySavingsGoal,
}) {
  const [savingName, setSavingName] = useState('')
  const [savingAmount, setSavingAmount] = useState('')
  const [savingVoiceMsg, setSavingVoiceMsg] = useState(null)

  const [investmentType, setInvestmentType] = useState(INVESTMENT_TYPES[0])
  const [investmentName, setInvestmentName] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investmentVoiceMsg, setInvestmentVoiceMsg] = useState(null)

  // Includes what's already marked "ahorrado" on each Meta, not just the
  // Ahorros/Inversiones ledger — a goal's progress is money set aside too.
  // If the same peso is logged both as a goal's "ya ahorrado" and as a
  // Saving/Investment entry, it gets counted twice here; the hint below
  // says so.
  const totalPatrimonio =
    db.savings.reduce((a, s) => a + s.amount, 0) +
    db.investments.reduce((a, i) => a + i.amount, 0) +
    db.goals.reduce((a, g) => a + (g.saved || 0), 0)

  const submitSaving = e => {
    e.preventDefault()
    const amount = parseNonNegativeNumber(savingAmount)
    if (savingName.trim() && amount > 0) {
      addSaving({ name: savingName.trim(), amount })
      setSavingName('')
      setSavingAmount('')
    }
  }

  const handleSavingTranscript = phrase => {
    const { amount, label } = parseAmountAndLabel(phrase)
    const num = Number(amount)
    if (Number.isFinite(num) && num > 0 && label) {
      addSaving({ name: label, amount: num })
      setSavingVoiceMsg(`${formatMoney(num, lang)} · ${label}`)
      setTimeout(() => setSavingVoiceMsg(null), 4000)
    } else {
      if (label) setSavingName(label)
      if (amount) setSavingAmount(amount)
    }
  }

  const submitInvestment = e => {
    e.preventDefault()
    const amount = parseNonNegativeNumber(investmentAmount)
    if (investmentName.trim() && amount > 0) {
      addInvestment({ type: investmentType, name: investmentName.trim(), amount })
      setInvestmentName('')
      setInvestmentAmount('')
    }
  }

  // Voice can't reliably pick an investment type from a dictated phrase, so
  // it defaults to "otro" — the user can delete and re-add with the right
  // type if it matters, same add/remove-only pattern as the rest of the app.
  const handleInvestmentTranscript = phrase => {
    const { amount, label } = parseAmountAndLabel(phrase)
    const num = Number(amount)
    if (Number.isFinite(num) && num > 0 && label) {
      addInvestment({ type: 'otro', name: label, amount: num })
      setInvestmentVoiceMsg(`${formatMoney(num, lang)} · ${label}`)
      setTimeout(() => setInvestmentVoiceMsg(null), 4000)
    } else {
      if (label) setInvestmentName(label)
      if (amount) setInvestmentAmount(amount)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-navy-900 to-accent-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-white/80">{t.totalPatrimonioLabel}</span>
          <span className="text-2xl sm:text-3xl font-black">{formatMoney(totalPatrimonio, lang)}</span>
        </div>
        <p className="text-xs text-white/60 mt-2">{t.totalPatrimonioHint}</p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">{t.monthlySavingsGoalLabel}</label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
            {CURRENCY_SYMBOLS[lang] || '$'}
          </span>
          <input
            type="number"
            min="0"
            step="any"
            placeholder={t.monthlySavingsGoalPlaceholder}
            value={db.monthlySavingsGoal || ''}
            onChange={e => setMonthlySavingsGoal(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{t.monthlySavingsGoalHint}</p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-brand-500" /> {t.savingsTitle}
          </h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleSavingTranscript} />
        </div>
        <VoiceConfirmationBanner message={savingVoiceMsg} />
        <form onSubmit={submitSaving} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder={t.savingNamePlaceholder}
            value={savingName}
            onChange={e => setSavingName(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:col-span-1"
          />
          <input
            type="number"
            min="0.01"
            step="any"
            placeholder={t.amountPlaceholder}
            value={savingAmount}
            onChange={e => setSavingAmount(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm">
            {t.addSavingBtn}
          </button>
        </form>
        <div className="space-y-2">
          {db.savings.length === 0 && <p className="text-center text-sm text-slate-400 py-2">{t.noSavings}</p>}
          {db.savings.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-bold text-slate-800">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-navy-900">{formatMoney(s.amount, lang)}</span>
                <button onClick={() => removeSaving(s.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-500" /> {t.investmentsTitle}
          </h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleInvestmentTranscript} />
        </div>
        <VoiceConfirmationBanner message={investmentVoiceMsg} />
        <form onSubmit={submitInvestment} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select
            value={investmentType}
            onChange={e => setInvestmentType(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {INVESTMENT_TYPES.map(type => (
              <option key={type} value={type}>{t.investmentTypes[type]}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t.investmentNamePlaceholder}
            value={investmentName}
            onChange={e => setInvestmentName(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="number"
            min="0.01"
            step="any"
            placeholder={t.amountPlaceholder}
            value={investmentAmount}
            onChange={e => setInvestmentAmount(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2.5 rounded-xl text-sm">
            {t.addInvestmentBtn}
          </button>
        </form>
        <div className="space-y-2">
          {db.investments.length === 0 && <p className="text-center text-sm text-slate-400 py-2">{t.noInvestments}</p>}
          {db.investments.map(inv => (
            <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-600 shrink-0">
                  {t.investmentTypes[inv.type] || inv.type}
                </span>
                <span className="text-sm font-bold text-slate-800 truncate">{inv.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-black text-navy-900">{formatMoney(inv.amount, lang)}</span>
                <button onClick={() => removeInvestment(inv.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
