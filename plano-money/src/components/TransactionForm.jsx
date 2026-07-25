import { useRef, useState } from 'react'
import { Camera, CheckCircle2, Mic } from 'lucide-react'
import { CATEGORIES, GROUPS } from '../constants.js'
import { isSpeechSupported, listenOnce, parseExpensePhrase } from '../utils/speech.js'
import { compressImageFile } from '../utils/image.js'
import { formatCurrency } from '../utils/format.js'
import { toISODate } from '../utils/periods.js'

export default function TransactionForm({ t, lang, onAdd }) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [date, setDate] = useState(toISODate(new Date()))
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [listening, setListening] = useState(false)
  const [voiceConfirmation, setVoiceConfirmation] = useState(null)
  const fileInputRef = useRef(null)

  const reset = () => {
    setAmount('')
    setNote('')
    setPhoto(null)
    setDate(toISODate(new Date()))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const num = Number(amount)
    if (!Number.isFinite(num) || num <= 0) return
    onAdd({ amount: num, categoryId, date, note: note.trim(), photo })
    reset()
  }

  // Dictating a phrase with a recognizable amount adds the expense straight
  // away — no extra tap. If no amount was understood, it falls back to
  // prefilling the form so the user finishes it manually.
  const handleDictate = async () => {
    if (!isSpeechSupported()) {
      alert(t.voiceNotSupported)
      return
    }
    setListening(true)
    setVoiceConfirmation(null)
    try {
      const phrase = await listenOnce(lang)
      const parsed = parseExpensePhrase(phrase, t)
      const num = Number(parsed.amount)
      const resolvedCategory = parsed.categoryId || categoryId

      if (Number.isFinite(num) && num > 0) {
        const today = toISODate(new Date())
        onAdd({ amount: num, categoryId: resolvedCategory, date: today, note: phrase, photo: null })
        setVoiceConfirmation({ amount: num, categoryId: resolvedCategory })
        setTimeout(() => setVoiceConfirmation(null), 4000)
      } else {
        if (parsed.categoryId) setCategoryId(parsed.categoryId)
        setNote(phrase)
      }
    } catch {
      // user cancelled or no speech detected — leave fields as-is
    } finally {
      setListening(false)
    }
  }

  const handlePhoto = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await compressImageFile(file)
    setPhoto(dataUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{t.newTransactionTitle}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDictate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${listening ? 'bg-red-50 border-red-200 text-red-600' : 'bg-brand-50 border-brand-100 text-brand-700 hover:bg-brand-100'}`}
          >
            <Mic className="w-3.5 h-3.5" /> {listening ? t.listeningBtn : t.dictateBtn}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" /> {photo ? t.photoAttached : t.photoBtn}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
        </div>
      </div>

      {voiceConfirmation && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            ${formatCurrency(voiceConfirmation.amount, lang)} · {t.categories[voiceConfirmation.categoryId] || voiceConfirmation.categoryId}
          </span>
        </div>
      )}

      {photo && (
        <div className="flex items-center gap-3">
          <img src={photo} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
          <p className="text-xs text-slate-400">{t.photoAiNote}</p>
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

      <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base">
        {t.addTransactionBtn}
      </button>
    </form>
  )
}
