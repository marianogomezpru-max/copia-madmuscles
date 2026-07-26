import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'Cuando recibís dinero normalmente...',
    options: [
      'Lo primero que pienso es en comprar algo que deseo.',
      'Pago cuentas y después veo qué sobra.',
      'Separo una parte para ahorrar.',
      'No tengo un plan; simplemente voy gastando.',
    ],
  },
  {
    q: 'Cuando veo un descuento importante...',
    options: [
      'Lo compro antes de que se termine.',
      'Lo pienso un poco, pero normalmente compro.',
      'Solo compro si ya estaba en mi presupuesto.',
      'Generalmente ignoro las promociones.',
    ],
  },
  {
    q: 'Cuando estoy estresado...',
    options: ['Me gusta comprar algo.', 'Pido comida.', 'Busco distraerme.', 'No cambia mi forma de gastar.'],
  },
  {
    q: 'Si aparece un producto nuevo...',
    options: ['Lo quiero inmediatamente.', 'Espero algunas semanas.', 'Investigo mucho antes.', 'Solo lo compro cuando realmente lo necesito.'],
  },
  {
    q: 'Mi mayor problema financiero es...',
    options: ['Comprar por impulso.', 'No saber en qué gasto.', 'No ahorrar.', 'Posponer mis metas.'],
  },
  {
    q: 'Cuando usás tarjeta de crédito...',
    options: ['Compro más de lo planeado.', 'A veces gasto de más.', 'La utilizo con planificación.', 'Prefiero efectivo.'],
  },
  {
    q: 'Las redes sociales...',
    options: ['Me hacen querer comprar.', 'Algunas veces me influyen.', 'Poco.', 'Nada.'],
  },
  {
    q: 'Cuando querés algo caro...',
    options: ['Lo compro.', 'Lo financio.', 'Espero ahorrar.', 'Lo pienso varias veces.'],
  },
]

const PROFILES = {
  A: { name: 'El Comprador Emocional', strength: 'Disfrutás la vida. Sos generoso/a.', weakness: 'Tus emociones suelen decidir por vos.', challenge: 'Aprender a hacer una pausa antes de comprar.' },
  B: { name: 'El Comprador Impulsivo', strength: 'Actuás rápido cuando algo te convence.', weakness: 'Comprás muy rápido, sin comparar.', challenge: 'Necesitás crear sistemas y límites antes de pagar.' },
  C: { name: 'El Comprador Estratégico', strength: 'Ya tenés buenos hábitos financieros.', weakness: 'A veces la planificación te frena de disfrutar.', challenge: 'Solo necesitás mayor constancia.' },
  D: { name: 'El Comprador Inconsciente', strength: 'No gastás exageradamente.', weakness: 'Tampoco observás bien tu dinero.', challenge: 'Empezar a registrar y prestar atención a cada gasto.' },
}

const LETTERS = ['A', 'B', 'C', 'D']
const STORAGE_KEY = 'plano_money_quiz_comprador'

export default function QuizComprador() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [result, setResult] = useState(() => localStorage.getItem(STORAGE_KEY) || null)

  const choose = (qi, letter) => {
    const next = [...answers]
    next[qi] = letter
    setAnswers(next)
  }

  const finish = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    answers.forEach(a => a && counts[a]++)
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    setResult(winner)
    localStorage.setItem(STORAGE_KEY, winner)
  }

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setResult(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const allAnswered = answers.every(a => a !== null)

  if (result) {
    const p = PROFILES[result]
    return (
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
        <p className="text-xs font-bold uppercase text-brand-600">Tu resultado</p>
        <h3 className="text-2xl font-black text-navy-900">{p.name}</h3>
        <div className="grid sm:grid-cols-3 gap-3 text-left mt-4">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 mb-1">Fortaleza</p>
            <p className="text-sm text-slate-700">{p.strength}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700 mb-1">Debilidad</p>
            <p className="text-sm text-slate-700">{p.weakness}</p>
          </div>
          <div className="bg-brand-50 p-3 rounded-xl border border-brand-100">
            <p className="text-xs font-bold text-brand-700 mb-1">Tu desafío</p>
            <p className="text-sm text-slate-700">{p.challenge}</p>
          </div>
        </div>
        <button onClick={restart} className="text-sm font-bold text-brand-600 hover:text-brand-700 mt-2">
          Volver a hacer el test
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-navy-900">¿Qué tipo de comprador sos?</h3>
        <p className="text-xs text-slate-400 mt-1">En menos de 5 minutos vas a descubrir qué comportamiento influye más en tus decisiones de gasto. No hay respuestas correctas o incorrectas.</p>
      </div>
      {QUESTIONS.map((item, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-sm font-bold text-slate-800">{qi + 1}. {item.q}</p>
          <div className="space-y-1.5">
            {item.options.map((opt, oi) => (
              <label key={oi} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-brand-300">
                <input
                  type="radio"
                  name={`q${qi}`}
                  checked={answers[qi] === LETTERS[oi]}
                  onChange={() => choose(qi, LETTERS[oi])}
                  className="mt-0.5 accent-brand-500"
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={finish}
        disabled={!allAnswered}
        className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm"
      >
        {allAnswered ? 'Ver mi resultado' : `Respondé las ${QUESTIONS.length} preguntas para continuar`}
      </button>
    </div>
  )
}
