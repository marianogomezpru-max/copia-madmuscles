import { useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import { CATEGORIES, GROUPS } from '../constants.js'
import VoiceButton from './VoiceButton.jsx'
import VoiceConfirmationBanner from './VoiceConfirmationBanner.jsx'

export default function ProfilesView({ t, db, lang, isAdmin, addProfile, removeProfile, toggleProfileCategory }) {
  const [name, setName] = useState('')
  const [voiceMsg, setVoiceMsg] = useState(null)

  const submit = e => {
    e.preventDefault()
    if (name.trim()) {
      addProfile(name.trim())
      setName('')
    }
  }

  const handleTranscript = phrase => {
    const cleanName = phrase.trim()
    if (!cleanName) return
    addProfile(cleanName)
    setVoiceMsg(cleanName)
    setTimeout(() => setVoiceMsg(null), 4000)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {isAdmin && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" /> {t.addProfileTitle}
            </h3>
            <VoiceButton t={t} lang={lang} onTranscript={handleTranscript} />
          </div>
          <VoiceConfirmationBanner message={voiceMsg} />
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t.profileNamePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md text-sm sm:text-base">
              {t.addProfileBtn}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {db.profiles.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm sm:text-base">{p.name}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.role === 'admin' ? t.adminBadge : t.memberBadge}
                </span>
              </div>
              {isAdmin && p.role !== 'admin' && (
                <button onClick={() => removeProfile(p.id)} aria-label="Remove" className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {p.role !== 'admin' && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t.visibleCategoriesLabel}</p>
                {!isAdmin && <p className="text-xs text-slate-400 mb-2">{t.onlyAdminCanEdit}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {GROUPS.flatMap(group => [
                    <div key={`h-${group}`} className="col-span-full text-[10px] font-bold uppercase text-slate-400 mt-2 first:mt-0">{t.groups[group]}</div>,
                    ...CATEGORIES.filter(c => c.group === group).map(cat => {
                      const visible = p.visibleCategories === null || p.visibleCategories.includes(cat.id)
                      return (
                        <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 py-0.5">
                          <input
                            type="checkbox"
                            disabled={!isAdmin}
                            checked={visible}
                            onChange={() => toggleProfileCategory(p.id, cat.id)}
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                          />
                          {t.categories[cat.id]}
                        </label>
                      )
                    }),
                  ])}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
