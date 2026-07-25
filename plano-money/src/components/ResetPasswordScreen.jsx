import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import Logo from './Logo.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function ResetPasswordScreen({ t, onDone }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setDone(true)
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[520px] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center animate-fade-in">
        <Logo className="w-14 h-14 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-2">{t.resetPasswordTitle}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">{t.resetPasswordSubtitle}</p>

        {done ? (
          <>
            <p className="text-sm text-emerald-600 font-semibold mb-5">{t.resetPasswordSuccess}</p>
            <button
              onClick={onDone}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base"
            >
              {t.authSignInBtn}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-left">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.newPasswordPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
              />
            </div>
            {error && <p className="text-xs text-red-600 font-semibold text-left">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <KeyRound className="w-5 h-5" /> {t.resetPasswordBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
