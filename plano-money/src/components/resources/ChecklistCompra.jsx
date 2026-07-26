import { useState } from 'react'
import { Check } from 'lucide-react'

const QUESTIONS = [
  '¿Lo necesito realmente?',
  '¿Está dentro de mi presupuesto?',
  '¿Estoy comprando por emoción?',
  '¿Puedo esperar 24 horas?',
  '¿Existe una alternativa más económica?',
  '¿Lo usaré dentro de seis meses?',
  '¿Lo compraría si nadie pudiera verlo?',
  '¿Estoy comprando para impresionar?',
  '¿Esta compra me acerca a mis metas?',
  '¿Mi "yo del futuro" estaría orgulloso?',
]

export default function ChecklistCompra() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))

  const set = (i, value) => {
    const next = [...answers]
    next[i] = value
    setAnswers(next)
  }

  const reset = () => setAnswers(Array(QUESTIONS.length).fill(null))

  const noCount = answers.filter(a => a === false).length
  const allAnswered = answers.every(a => a !== null)
  const shouldWait = noCount > 3

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-navy-900">Pensá antes de comprar</h3>
        <p className="text-xs text-slate-400 mt-1">Antes de confirmar una compra que no tenías planeada, respondé estas preguntas con honestidad.</p>
      </div>
      <div className="space-y-2">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-700">{q}</p>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => set(i, true)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${answers[i] === true ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}
              >
                Sí
              </button>
              <button
                onClick={() => set(i, false)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${answers[i] === false ? 'bg-red-400 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      {allAnswered && (
        <div className={`text-center p-4 rounded-xl border ${shouldWait ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          {shouldWait ? (
            <p className="font-bold text-red-600 flex items-center justify-center gap-2">Respondiste "No" a más de 3 preguntas — mejor esperá antes de comprar.</p>
          ) : (
            <p className="font-bold text-emerald-700 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Parece una decisión consciente. ¡Adelante!</p>
          )}
          <button onClick={reset} className="text-xs font-bold text-brand-600 hover:text-brand-700 mt-2">
            Evaluar otra compra
          </button>
        </div>
      )}
    </div>
  )
}
