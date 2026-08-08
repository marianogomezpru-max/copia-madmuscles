import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { LANGUAGES } from './FlagIcons.jsx'

export default function LanguageSwitcher({ language, onLanguageChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onClickOutside = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Language"
        className="flex items-center gap-1.5 bg-navy-800 px-2 sm:px-3 py-1.5 rounded-xl border border-navy-700 text-xs font-semibold text-white"
      >
        <current.Flag />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 bg-navy-900 border border-navy-700 rounded-xl overflow-hidden shadow-lg z-20 min-w-[140px]">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                onLanguageChange(l.code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left transition-colors ${
                l.code === language ? 'bg-navy-700 text-white' : 'text-slate-300 hover:bg-navy-800'
              }`}
            >
              <l.Flag /> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
