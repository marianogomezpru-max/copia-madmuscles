import { Activity, LogIn } from 'lucide-react'

export default function LoginScreen({ t, loginName, setLoginName, onSubmit }) {
  return (
    <div className="w-full min-h-[450px] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center animate-fade-in">
        <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{t.loginTitle}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-6">{t.loginSubtitle}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-left">
            <input
              type="text"
              required
              maxLength={60}
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-5 h-5" /> {t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
