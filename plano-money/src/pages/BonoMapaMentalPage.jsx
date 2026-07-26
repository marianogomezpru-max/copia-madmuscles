import { useState } from 'react'
import ContentGate from '../components/content/ContentGate.jsx'
import Logo from '../components/Logo.jsx'

const SLUG = 'bono-mapa-mental'
const STORAGE_KEY = `plano_money_${SLUG}`

const BRANCHES = [
  { key: 'creencias', label: 'Mis creencias', hint: '¿Qué aprendí sobre el dinero cuando era niño?' },
  { key: 'miedos', label: 'Mis mayores miedos' },
  { key: 'habitos', label: 'Mis hábitos' },
  { key: 'fortalezas', label: 'Mis fortalezas' },
  { key: 'impulsivos', label: 'Mis gastos impulsivos' },
  { key: 'metas', label: 'Mis metas' },
  { key: 'compromiso', label: 'Mi nuevo compromiso' },
]

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function MapaMentalContent() {
  const [state, setState] = useState(loadState)
  const set = (field, value) => {
    const next = { ...state, [field]: value }
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 print:bg-white">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center py-2">
          <Logo className="w-14 h-14 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase text-brand-600">Bono</p>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">Mapa Mental del Dinero</h1>
          <p className="text-sm text-slate-500 mt-1">Una sola hoja, muy visual, para conocer tu relación con el dinero.</p>
        </div>

        <div className="bg-navy-900 text-white text-center py-4 px-4 rounded-2xl font-black text-lg">
          MI RELACIÓN CON EL DINERO
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {BRANCHES.map(b => (
            <div key={b.key} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-navy-900 mb-1">{b.label}</p>
              {b.hint && <p className="text-xs text-slate-400 mb-2">{b.hint}</p>}
              <textarea
                value={state[b.key] || ''}
                onChange={e => set(b.key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          ))}
        </div>

        <button onClick={() => window.print()} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl text-sm print:hidden">
          Guardar como PDF
        </button>
      </div>
    </div>
  )
}

export default function BonoMapaMentalPage() {
  return (
    <ContentGate slug={SLUG}>
      <MapaMentalContent />
    </ContentGate>
  )
}
