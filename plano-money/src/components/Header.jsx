import { Activity, Globe, LogOut, Menu, X } from 'lucide-react'

export default function Header({
  t,
  userName,
  language,
  onLanguageChange,
  onLogout,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <>
      <div className="bg-navy-900 text-white px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 p-2.5 rounded-xl shadow-md">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Plano.Money</h1>
            <p className="text-xs text-slate-400 truncate max-w-[140px] sm:max-w-none">{userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-800 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold gap-1.5">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500 shrink-0" />
            <select
              aria-label="Language"
              value={language}
              onChange={e => onLanguageChange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="es" className="bg-slate-900">Español</option>
              <option value="en" className="bg-slate-900">English</option>
              <option value="pt" className="bg-slate-900">Português</option>
            </select>
          </div>

          <button
            onClick={onLogout}
            aria-label={t.logout}
            className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-red-500/20 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className="flex md:hidden justify-between items-center px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.tabs[activeTab]}</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="p-2 bg-slate-100 rounded-lg text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col md:hidden border-t border-slate-100 bg-slate-50 p-2 space-y-1">
            {Object.entries(t.tabs).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setMobileMenuOpen(false) }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === key ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="hidden md:flex flex-wrap">
          {Object.entries(t.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3.5 px-4 text-xs lg:text-sm font-semibold transition-all flex justify-center items-center gap-2 border-b-2 ${activeTab === key ? 'border-brand-500 text-brand-600 bg-brand-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
