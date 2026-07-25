import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { formatMoney, parseNonNegativeNumber } from '../utils/format.js'
import { parseAmountAndLabel } from '../utils/speech.js'
import { toISODate } from '../utils/periods.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

export default function IncomeView({ t, db, lang, isFullAccess, addFixedIncome, removeFixedIncome, addVariableIncome, removeVariableIncome }) {
  const [fixedName, setFixedName] = useState('')
  const [fixedAmount, setFixedAmount] = useState('')
  const [varName, setVarName] = useState('')
  const [varAmount, setVarAmount] = useState('')
  const [varDate, setVarDate] = useState(toISODate(new Date()))
  const [fixedVoiceMsg, setFixedVoiceMsg] = useState(null)
  const [varVoiceMsg, setVarVoiceMsg] = useState(null)
  const [varIsPersonal, setVarIsPersonal] = useState(false)

  const submitFixed = e => {
    e.preventDefault()
    const amount = parseNonNegativeNumber(fixedAmount)
    if (fixedName.trim() && amount > 0) {
      addFixedIncome({ name: fixedName.trim(), amount })
      setFixedName('')
      setFixedAmount('')
    }
  }

  const submitVariable = e => {
    e.preventDefault()
    const amount = parseNonNegativeNumber(varAmount)
    if (varName.trim() && amount > 0) {
      addVariableIncome({ name: varName.trim(), amount, date: varDate, isPersonal: varIsPersonal })
      setVarName('')
      setVarAmount('')
    }
  }

  // Dictating "Sueldo cuatro mil" (transcribed as "Sueldo 4000") adds the
  // fixed income straight away; incomplete phrases just prefill the form.
  const handleFixedTranscript = phrase => {
    const { amount, label } = parseAmountAndLabel(phrase)
    const num = Number(amount)
    if (Number.isFinite(num) && num > 0 && label) {
      addFixedIncome({ name: label, amount: num })
      setFixedVoiceMsg(`${formatMoney(num, lang)}/mes · ${label}`)
      setTimeout(() => setFixedVoiceMsg(null), 4000)
    } else {
      if (label) setFixedName(label)
      if (amount) setFixedAmount(amount)
    }
  }

  const handleVariableTranscript = phrase => {
    const { amount, label } = parseAmountAndLabel(phrase)
    const num = Number(amount)
    const today = toISODate(new Date())
    if (Number.isFinite(num) && num > 0 && label) {
      addVariableIncome({ name: label, amount: num, date: today })
      setVarVoiceMsg(`${formatMoney(num, lang)} · ${label}`)
      setTimeout(() => setVarVoiceMsg(null), 4000)
    } else {
      if (label) setVarName(label)
      if (amount) setVarAmount(amount)
    }
  }

  const sortedVariable = [...db.variableIncomeTransactions].sort((a, b) => (a.date < b.date ? 1 : -1))
  const profileName = profileId => db.profiles.find(p => p.id === profileId)?.name

  return (
    <div className="space-y-6 animate-fade-in">
      {isFullAccess && (
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900">{t.fixedIncomeTitle}</h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleFixedTranscript} />
        </div>
        <p className="text-xs text-slate-400 -mt-2">{t.fixedIncomeHint}</p>
        <VoiceConfirmationBanner message={fixedVoiceMsg} />
        <form onSubmit={submitFixed} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder={t.fixedIncomeNamePlaceholder}
            value={fixedName}
            onChange={e => setFixedName(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 sm:col-span-1"
          />
          <input
            type="number"
            min="0.01"
            step="any"
            placeholder={t.fixedIncomeAmountPlaceholder}
            value={fixedAmount}
            onChange={e => setFixedAmount(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm">
            {t.addFixedIncomeBtn}
          </button>
        </form>
        <div className="space-y-2">
          {db.fixedIncomes.length === 0 && <p className="text-center text-sm text-slate-400 py-2">{t.noIncomes}</p>}
          {db.fixedIncomes.map(inc => (
            <div key={inc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-bold text-slate-800">{inc.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-navy-900">{formatMoney(inc.amount, lang)}/mes</span>
                <button onClick={() => removeFixedIncome(inc.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900">{t.variableIncomeTitle}</h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleVariableTranscript} />
        </div>
        <VoiceConfirmationBanner message={varVoiceMsg} />
        <form onSubmit={submitVariable} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder={t.variableIncomeNamePlaceholder}
            value={varName}
            onChange={e => setVarName(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="number"
            min="0.01"
            step="any"
            placeholder={t.amountPlaceholder}
            value={varAmount}
            onChange={e => setVarAmount(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="date"
            value={varDate}
            onChange={e => setVarDate(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 rounded-xl text-sm">
            {t.addVariableIncomeBtn}
          </button>
        </form>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer -mt-2">
          <input
            type="checkbox"
            checked={varIsPersonal}
            onChange={e => setVarIsPersonal(e.target.checked)}
            className="w-4 h-4 rounded accent-lila-500"
          />
          {t.personalIncomeLabel}
        </label>
        <div className="space-y-2">
          {sortedVariable.length === 0 && <p className="text-center text-sm text-slate-400 py-2">{t.noIncomes}</p>}
          {sortedVariable.map(inc => (
            <div key={inc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-800">{inc.name}</span>
                <span className="text-xs text-slate-400 ml-2">{inc.date}</span>
                {inc.isPersonal && (
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-lila-500/10 text-lila-600 ml-2">
                    {t.personalBadge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-navy-900">{formatMoney(inc.amount, lang)}</span>
                <button onClick={() => removeVariableIncome(inc.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
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
