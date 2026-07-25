import { useEffect, useState } from 'react'
import { Plane, Plus, Trash2 } from 'lucide-react'
import { VACATION_CATEGORY_IDS, VACATION_SEVERITY_THRESHOLDS } from '../constants.js'
import { formatMoney, parseNonNegativeNumber } from '../utils/format.js'
import { parseAmountAndLabel } from '../utils/speech.js'
import { toISODate } from '../utils/periods.js'
import { fetchVacationTrips, vacationApi } from '../lib/db.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

const SEVERITY_COLORS = {
  good: { fill: '#059669', track: '#d1fae5' },
  warning: { fill: '#eab308', track: '#fef3c7' },
  critical: { fill: '#d03b3b', track: '#f8dada' },
}

function severityFor(pct) {
  if (pct > VACATION_SEVERITY_THRESHOLDS.critical) return 'critical'
  if (pct > VACATION_SEVERITY_THRESHOLDS.warning) return 'warning'
  return 'good'
}

function matchVacationCategory(phrase, t) {
  const lower = phrase.toLowerCase()
  for (const catId of VACATION_CATEGORY_IDS) {
    const label = (t.vacationCategories[catId] || '').toLowerCase()
    const words = label.split(/[\s/]+/).filter(w => w.length > 3)
    if (words.some(w => lower.includes(w))) return catId
  }
  return ''
}

function NewTripForm({ t, onCreate }) {
  const [name, setName] = useState('')
  const [days, setDays] = useState('')
  const [budget, setBudget] = useState('')

  const submit = e => {
    e.preventDefault()
    const d = parseInt(days, 10)
    const b = parseNonNegativeNumber(budget)
    if (d > 0 && b > 0) {
      onCreate({ name: name.trim() || 'Vacaciones', days: d, budget: b })
      setName('')
      setDays('')
      setBudget('')
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
        <Plane className="w-5 h-5 text-emerald-500" /> {t.newTripTitle}
      </h3>
      <input
        type="text"
        placeholder={t.tripNamePlaceholder}
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="number"
          min="1"
          step="1"
          placeholder={t.tripDaysPlaceholder}
          value={days}
          onChange={e => setDays(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          min="1"
          step="any"
          placeholder={t.tripBudgetPlaceholder}
          value={budget}
          onChange={e => setBudget(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base">
        {t.createTripBtn}
      </button>
    </form>
  )
}

function TripDetail({ t, lang, trip, profiles, activeProfileId, onAddExpense, onRemoveExpense, onRemoveTrip }) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(VACATION_CATEGORY_IDS[0])
  const [note, setNote] = useState('')
  const [voiceMsg, setVoiceMsg] = useState(null)

  const spent = trip.expenses.reduce((a, e) => a + e.amount, 0)
  const remaining = trip.budget - spent
  const pct = trip.budget > 0 ? (spent / trip.budget) * 100 : 0
  const severity = SEVERITY_COLORS[severityFor(pct)]
  const profileName = id => profiles.find(p => p.id === id)?.name

  const submit = e => {
    e.preventDefault()
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) return
    onAddExpense(trip.id, { categoryId, amount: num, date: toISODate(new Date()), note: note.trim() })
    setAmount('')
    setNote('')
  }

  const handleTranscript = phrase => {
    const { amount: parsedAmount, label } = parseAmountAndLabel(phrase)
    const num = Number(parsedAmount)
    const matchedCategory = matchVacationCategory(phrase, t) || categoryId
    if (Number.isFinite(num) && num > 0) {
      onAddExpense(trip.id, { categoryId: matchedCategory, amount: num, date: toISODate(new Date()), note: label || phrase })
      setVoiceMsg(`${formatMoney(num, lang)} · ${t.vacationCategories[matchedCategory]}`)
      setTimeout(() => setVoiceMsg(null), 4000)
    } else {
      setCategoryId(matchedCategory)
      setNote(phrase)
    }
  }

  const sorted = [...trip.expenses].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-lg sm:text-xl font-black">{trip.name}</span>
            <span className="text-white/70 text-sm ml-2">{trip.days} {t.tripDaysLabel}</span>
          </div>
          <button onClick={() => onRemoveTrip(trip.id)} aria-label="Remove trip" className="text-white/70 hover:text-white p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%`, background: severity.fill }} />
        </div>
        <div className="flex justify-between text-xs sm:text-sm font-semibold flex-wrap gap-2">
          <span>{t.tripSpentLabel}: {formatMoney(spent, lang)}</span>
          <span>{t.tripBudgetLabel}: {formatMoney(trip.budget, lang)}</span>
          <span className={remaining < 0 ? 'text-red-300' : ''}>{t.tripRemainingLabel}: {formatMoney(remaining, lang)}</span>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-navy-900">{t.logVacationExpenseTitle}</h3>
          <VoiceButton t={t} lang={lang} onTranscript={handleTranscript} />
        </div>
        <VoiceConfirmationBanner message={voiceMsg} />
        {profiles.length > 1 && (
          <p className="text-xs text-slate-400">{profileName(activeProfileId)}</p>
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
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {VACATION_CATEGORY_IDS.map(catId => (
              <option key={catId} value={catId}>{t.vacationCategories[catId]}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t.notePlaceholder}
            value={note}
            onChange={e => setNote(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:col-span-2 lg:col-span-1"
          />
          <button type="submit" className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> {t.addVacationExpenseBtn}
          </button>
        </div>
      </form>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">{t.vacationMovementsTitle}</h3>
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-4">{t.noVacationExpenses}</p>
        ) : (
          <div className="space-y-2">
            {sorted.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 truncate">{t.vacationCategories[e.categoryId] || e.categoryId}</p>
                    {profileName(e.profileId) && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                        {profileName(e.profileId)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{e.date}{e.note ? ` · ${e.note}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-black text-navy-900">{formatMoney(e.amount, lang)}</span>
                  <button onClick={() => onRemoveExpense(e.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VacationControlView({ t, lang, householdOwnerId, profiles, activeProfileId, onClose }) {
  const [trips, setTrips] = useState(null)
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVacationTrips(householdOwnerId).then(setTrips).catch(err => setError(err.message || String(err)))
  }, [householdOwnerId])

  const createTrip = async ({ name, days, budget }) => {
    const { data, error: err } = await vacationApi.addTrip(householdOwnerId, { name, days, budget })
    if (err) return setError(err.message)
    const newTrip = { id: data.id, name, days, budget, expenses: [] }
    setTrips(prev => [newTrip, ...(prev || [])])
    setSelectedTripId(newTrip.id)
  }

  const removeTrip = id => {
    if (!window.confirm(t.deleteTripConfirm)) return
    setTrips(prev => prev.filter(tr => tr.id !== id))
    if (selectedTripId === id) setSelectedTripId(null)
    vacationApi.removeTrip(id).then(({ error: err }) => err && setError(err.message))
  }

  const addExpense = async (tripId, { categoryId, amount, date, note }) => {
    const { data, error: err } = await vacationApi.addExpense(householdOwnerId, {
      tripId, categoryId, amount, date, note, profileId: activeProfileId,
    })
    if (err) return setError(err.message)
    setTrips(prev => prev.map(tr => tr.id !== tripId ? tr : {
      ...tr,
      expenses: [...tr.expenses, { id: data.id, categoryId, amount, date, note, profileId: activeProfileId }],
    }))
  }

  const removeExpense = id => {
    setTrips(prev => prev.map(tr => ({ ...tr, expenses: tr.expenses.filter(e => e.id !== id) })))
    vacationApi.removeExpense(id).then(({ error: err }) => err && setError(err.message))
  }

  const selectedTrip = trips?.find(tr => tr.id === selectedTripId) || null

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Plane className="w-5 h-5 text-emerald-500" /> {t.vacationControlTitle}
          </h2>
          <p className="text-xs text-slate-400">{t.vacationControlSubtitle}</p>
        </div>
        <button onClick={onClose} className="text-sm font-bold text-brand-600 hover:text-brand-700">
          {t.backToAppBtn}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

      {trips === null ? null : (
        <>
          {selectedTrip ? (
            <>
              <button onClick={() => setSelectedTripId(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                {t.myTripsTitle} ←
              </button>
              <TripDetail
                t={t}
                lang={lang}
                trip={selectedTrip}
                profiles={profiles}
                activeProfileId={activeProfileId}
                onAddExpense={addExpense}
                onRemoveExpense={removeExpense}
                onRemoveTrip={removeTrip}
              />
            </>
          ) : (
            <>
              <NewTripForm t={t} onCreate={createTrip} />
              <div className="space-y-3">
                <h3 className="text-base font-bold text-navy-900">{t.myTripsTitle}</h3>
                {trips.length === 0 && <p className="text-center text-sm text-slate-400 py-4">{t.noTrips}</p>}
                {trips.map(trip => {
                  const spent = trip.expenses.reduce((a, e) => a + e.amount, 0)
                  const pct = trip.budget > 0 ? (spent / trip.budget) * 100 : 0
                  const severity = SEVERITY_COLORS[severityFor(pct)]
                  return (
                    <button
                      key={trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                      className="w-full text-left bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-navy-900 text-sm sm:text-base">{trip.name}</span>
                        <span className="text-xs text-slate-400">{trip.days} {t.tripDaysLabel}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: severity.fill }} />
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{formatMoney(spent, lang)} / {formatMoney(trip.budget, lang)}</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
