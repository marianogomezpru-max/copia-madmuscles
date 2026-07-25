import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import Logo from './Logo.jsx'
import Footer from './Footer.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { joinHousehold } from '../lib/db.js'
import { PENDING_JOIN_KEY } from '../lib/pendingJoin.js'

export default function LoginScreen({ t, lang }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const trimmedCode = inviteCode.trim()
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { full_name: fullName.trim() } },
        })
        if (signUpError) throw signUpError

        if (!data.session) {
          // Confirming the email happens outside this tab, so there's no
          // session yet to run the join RPC under — App.jsx finishes it
          // automatically the moment a session shows up.
          if (trimmedCode) {
            localStorage.setItem(PENDING_JOIN_KEY, JSON.stringify({ inviteCode: trimmedCode, displayName: fullName.trim() }))
          }
          setMessage(t.authCheckEmail)
        } else if (trimmedCode) {
          try {
            await joinHousehold(trimmedCode, fullName.trim())
          } catch (joinErr) {
            setError(joinErr.message === 'invalid_invite_code' ? t.joinErrorInvalidCode : t.joinErrorGeneric)
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(t.forgotPasswordNeedsEmail)
      return
    }
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin,
      })
      if (resetError) throw resetError
      setMessage(t.authResetSent)
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center animate-fade-in">
        <Logo className="w-14 h-14 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-2">{t.loginTitle}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">{t.loginSubtitle}</p>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); setMessage('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'signin' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500'}`}
          >
            {t.authSignInTab}
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setMessage('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500'}`}
          >
            {t.authSignUpTab}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div className="text-left">
              <input
                type="text"
                required
                maxLength={80}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
              />
            </div>
          )}
          {mode === 'signup' && (
            <div className="text-left">
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                placeholder={t.inviteCodeFieldPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
              />
              <p className="text-xs text-slate-400 mt-1 ml-1">{t.inviteCodeFieldHint}</p>
            </div>
          )}
          <div className="text-left">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
            />
          </div>
          <div className="text-left">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
            />
            {mode === 'signin' && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold mt-1.5 ml-1"
              >
                {t.forgotPassword}
              </button>
            )}
          </div>

          {error && <p className="text-xs text-red-600 font-semibold text-left">{error}</p>}
          {message && <p className="text-xs text-emerald-600 font-semibold text-left">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {mode === 'signup' ? t.authSignUpBtn : t.authSignInBtn}
          </button>
        </form>
      </div>
      <Footer t={t} lang={lang} />
    </div>
  )
}
