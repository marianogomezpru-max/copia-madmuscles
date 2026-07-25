import { useState } from 'react'
import { LogIn } from 'lucide-react'
import Logo from './Logo.jsx'

export default function LoginScreen({ t, onLogin }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return
    onLogin({ fullName: fullName.trim(), email: email.trim().toLowerCase() })
  }

  const handleForgotPassword = () => {
    alert(t.passwordResetPending)
  }

  return (
    <div className="w-full min-h-[520px] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center animate-fade-in">
        <Logo className="w-14 h-14 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-2">{t.loginTitle}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">{t.loginSubtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold mt-1.5 ml-1"
            >
              {t.forgotPassword}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-5 h-5" /> {t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
