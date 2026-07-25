import { useState } from 'react'
import { CATEGORIES, GROUPS } from '../constants.js'
import { parseExpensePhrase } from '../utils/speech.js'
import { formatMoney } from '../utils/format.js'
import { toISODate } from '../utils/periods.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

export default function TransactionForm({ t, lang, onAdd, profiles, activeProfileId }) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [date, setDate] = useState(toISODate(new Date()))
  const [note, setNote] = useState('')
  const [voiceMessage, setVoiceMessage] = useState(null)
  const [profileId, setProfileId] = useState(activeProfileId || '')
  const [isPersonal, setIsPersonal] = useState(false)

  const reset = () => {
    setAmount('')
    setNote('')
    setDate(toISODate(new Date()))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) return
    onAdd({ amount: num, categoryId, date, note: note.trim(), photo: null, profileId: profileId || activeProfileId, isPersonal })
    reset()
  }

  // Dictating a phrase with a recognizable amount adds the expense straight
  // away — no extra tap. If no amount was understood, it falls back to
  // prefilling the form so the user finishes it manually.
  const handleTranscript = phrase => {
    const parsed = parseExpensePhrase(phrase, t)
    const num = Number(parsed.amount)
    const resolvedCategory = parsed.categoryId || categoryId

    if (Number.isFinite(num) && num > 0) {
      const today = toISODate(new Date())
      onAdd({ amount: num, categoryId: resolvedCategory, date: today, note: phrase, photo: null, profileId: profileId || activeProfileId })
      setVoiceMessage(`${formatMoney(num, lang)} · ${t.categories[resolvedCategory] || resolvedCategory}`)
      setTimeout(() => setVoiceMessage(null), 4000)
    } else {
      if (parsed.categoryId) setCategoryId(parsed.categoryId)
      setNote(phrase)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-bold text-navy-900">{t.newTransactionTitle}</h3>
        <VoiceButton t={t} lang={lang} onTranscript={handleTranscript} />
      </div>

      <VoiceConfirmationBanner message={voiceMessage} />

      {profiles && profiles.length > 1 && (
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">{t.assignedProfileLabel}</label>
          <select
            value={profileId || activeProfileId}
            onChange={e => setProfileId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="number"
          min="0.01"
          step="any"
          required
          placeholder={t.amountPlaceholder}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {GROUPS.map(group => (
            <optgroup key={group} label={t.groups[group]}>
              {CATEGORIES.filter(c => c.group === group).map(c => (
                <option key={c.id} value={c.id}>{t.categories[c.id]}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          type="date"
          required
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          type="text"
          placeholder={t.notePlaceholder}
          value={note}
          onChange={e => setNote(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          checked={isPersonal}
          onChange={e => setIsPersonal(e.target.checked)}
          className="w-4 h-4 rounded accent-lila-500"
        />
        {t.personalExpenseLabel}
      </label>

      <button type="submit" className="w-full bg-celeste-500 hover:bg-celeste-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base">
        {t.addTransactionBtn}
      </button>
    </form>
  )
}
