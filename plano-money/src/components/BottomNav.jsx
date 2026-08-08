export default function BottomNav({ t, activeTab, setActiveTab, isAdmin }) {
  const handleSelect = key => {
    setActiveTab(key)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const tabs = Object.entries(t.tabs).filter(([key]) => isAdmin || key !== 'perfiles')

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap gap-2 justify-center">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          onClick={() => handleSelect(key)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === key ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
