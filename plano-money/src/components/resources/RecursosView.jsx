import { useState } from 'react'
import QuizComprador from './QuizComprador.jsx'
import Reto21Dias from './Reto21Dias.jsx'
import ChecklistCompra from './ChecklistCompra.jsx'

const TOOLS = [
  { id: 'quiz', label: 'Test: ¿Qué comprador sos?', Component: QuizComprador },
  { id: 'reto', label: 'Reto de 21 días', Component: Reto21Dias },
  { id: 'checklist', label: 'Antes de comprar', Component: ChecklistCompra },
]

export default function RecursosView() {
  const [active, setActive] = useState('quiz')
  const Active = TOOLS.find(t => t.id === active).Component

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex bg-slate-100 rounded-xl p-1 flex-wrap gap-1">
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${active === tool.id ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500'}`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  )
}
