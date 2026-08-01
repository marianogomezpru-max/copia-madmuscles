import { useEffect, useState } from 'react'
import { ChevronLeft, Check, Sparkles } from 'lucide-react'
import Logo from '../Logo.jsx'
import GaugeMeter from './GaugeMeter.jsx'

function stepVisible(step, answers) {
  if (!step.showIf) return true
  const value = answers[step.showIf.key]
  if (step.showIf.equals !== undefined) return value === step.showIf.equals
  if (step.showIf.notEquals !== undefined) return value !== step.showIf.notEquals
  return true
}

const ACCENTS = ['border-lila-500 bg-lila-50', 'border-celeste-500 bg-celeste-50', 'border-brand-500 bg-brand-50']

function ProgressHeader({ title, pct, onBack, showBack }) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pt-4 pb-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center gap-3">
        {showBack ? (
          <button onClick={onBack} className="p-1 text-slate-400 hover:text-navy-900 shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}
        <p className="text-sm font-bold text-navy-900 truncate flex-1 text-center">{title}</p>
        <p className="text-xs font-bold text-slate-400 w-9 text-right shrink-0">{pct}%</p>
      </div>
      <div className="max-w-md mx-auto h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  )
}

function OptionCard({ option, selected, onClick, multi, accentIndex }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-colors ${
        selected ? ACCENTS[accentIndex % ACCENTS.length] : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {option.icon && <span className="text-3xl shrink-0">{option.icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-navy-900 text-base">{option.label}</p>
        {option.sublabel && <p className="text-sm text-slate-400">{option.sublabel}</p>}
      </div>
      <div className={`w-6 h-6 shrink-0 flex items-center justify-center border-2 ${multi ? 'rounded-md' : 'rounded-full'} ${selected ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
        {selected && <Check className="w-4 h-4 text-white" />}
      </div>
    </button>
  )
}

function SummaryRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-400 font-semibold shrink-0">{label}</span>
      <span className="text-navy-900 font-bold text-right">{value}</span>
    </div>
  )
}

function Blobs() {
  return (
    <>
      <div className="absolute -top-16 -left-20 w-64 h-64 bg-lila-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-24 -right-16 w-64 h-64 bg-celeste-400/20 rounded-full blur-3xl -z-10" />
    </>
  )
}

// Revela cada mensaje en secuencia con su propia barra de progreso, en vez
// de un único spinner con un mensaje fijo — sube el valor percibido del
// análisis sin necesitar ninguna cifra (de usuarios, etc.) que no podamos
// respaldar.
function LoadingStages({ messages, duration }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= messages.length - 1) return
    const perStage = duration / messages.length
    const t = setTimeout(() => setActiveIndex(i => i + 1), perStage)
    return () => clearTimeout(t)
  }, [activeIndex, messages.length, duration])

  return (
    <div className="py-6 space-y-5">
      <div className="w-16 h-16 mx-auto border-[6px] border-lila-100 border-t-lila-500 rounded-full animate-spin" />
      <div className="space-y-3 max-w-xs mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`text-left transition-opacity duration-300 ${i <= activeIndex ? 'opacity-100' : 'opacity-30'}`}>
            <p className="text-sm font-bold text-navy-900">{msg}</p>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-lila-500 to-celeste-500 transition-all ease-linear ${
                  i < activeIndex ? 'w-full duration-300' : i === activeIndex ? 'w-full duration-[1500ms]' : 'w-0 duration-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EMOJI_SCALE = ['👎', '👎', '🤷', '👍', '👍']

export default function QuizEngine({ data }) {
  const [stepIndex, setStepIndex] = useState(-1) // -1 = landing
  const [answers, setAnswers] = useState({})

  const visibleSteps = data.steps.filter(s => stepVisible(s, answers))
  const step = stepIndex >= 0 ? visibleSteps[stepIndex] : null
  const pct = stepIndex < 0 ? 0 : Math.round(((stepIndex + 1) / visibleSteps.length) * 100)

  const setAnswer = (key, value) => setAnswers(a => ({ ...a, [key]: value }))

  const goNext = () => {
    if (stepIndex + 1 >= visibleSteps.length) return
    setStepIndex(i => i + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => {
    if (stepIndex <= 0) { setStepIndex(-1); return }
    setStepIndex(i => i - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (step?.type === 'loading') {
      const t = setTimeout(goNext, step.duration || 2200)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  const name = answers.name || ''
  // La gente a veces pone nombre y apellido acá — usamos solo el primer
  // nombre para que se sienta cercano, no como un formulario.
  const firstName = name.trim().split(/\s+/)[0] || ''
  const deseoLabel = data.deseoLabels?.[answers.deseo] || 'lograr lo que te propongas'
  const fill = str => str.replace('{{name}}', firstName).replace('{{deseo}}', deseoLabel)
  const profile = data.computeProfile(answers)
  const score = data.computeScore(answers)
  const scoreZone = score < 33.3
    ? { label: 'Zona Roja', bg: 'bg-red-600' }
    : score < 66.7
      ? { label: 'Zona Amarilla', bg: 'bg-amber-500' }
      : { label: 'Zona Verde', bg: 'bg-emerald-600' }
  const offerUrl = `/oferta?p=${profile.key}`

  // ---------- Landing ----------
  if (stepIndex === -1) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-lila-50 via-celeste-50/40 to-white flex items-center justify-center p-4 overflow-hidden">
        <Blobs />
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-5">
          <Logo className="w-20 h-20 mx-auto" />
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">{data.landing.kicker}</p>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">{data.landing.title}</h1>
          <p className="text-slate-500 text-base">{data.landing.subtitle}</p>
          <button
            onClick={goNext}
            className="w-full bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-4 rounded-full text-base shadow-lg shadow-accent-600/30 transition hover:scale-105"
          >
            {data.landing.cta}
          </button>
        </div>
      </div>
    )
  }

  const answer = answers[step.key]
  const canContinue = (() => {
    if (step.optional) return true
    switch (step.type) {
      case 'name': return !!(answer || '').trim()
      case 'email': return !!(answer || '').includes('@')
      case 'question': return step.inputType === 'checkbox' ? true : answer !== undefined
      case 'agreement': return answer !== undefined
      default: return true
    }
  })()

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-lila-50/60 via-white to-white overflow-hidden">
      <Blobs />
      <ProgressHeader title={data.landing.title} pct={pct} onBack={goBack} showBack />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-4">
          {step.type === 'name' && (
            <>
              <h2 className="text-2xl font-black text-navy-900">{step.question}</h2>
              {step.subtitle && <p className="text-base text-slate-500">{step.subtitle}</p>}
              <input
                autoFocus
                type="text"
                value={answer || ''}
                onChange={e => setAnswer(step.key, e.target.value)}
                placeholder={step.placeholder}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </>
          )}

          {step.type === 'email' && (
            <>
              <h2 className="text-2xl font-black text-navy-900">{step.question}</h2>
              {step.note && (
                <div className="bg-lila-50 border border-lila-200 rounded-xl p-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-lila-500 shrink-0" />
                  <p className="text-sm text-lila-700 font-semibold">{step.note}</p>
                </div>
              )}
              <input
                autoFocus
                type="email"
                value={answer || ''}
                onChange={e => setAnswer(step.key, e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              {step.trustNote && <p className="text-xs text-slate-400">{step.trustNote}</p>}
            </>
          )}

          {step.type === 'question' && (
            <>
              <h2 className="text-2xl font-black text-navy-900">{fill(step.question)}</h2>
              {step.subtitle && <p className="text-base text-slate-500">{step.subtitle}</p>}
              {step.inputType === 'slider' ? (
                <div className="pt-2">
                  <p className="text-center text-4xl font-black text-navy-900">{answer ?? step.min}</p>
                  <input
                    type="range"
                    min={step.min}
                    max={step.max}
                    value={answer ?? step.min}
                    onChange={e => setAnswer(step.key, Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{step.min}</span>
                    <span>{step.max}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {step.options.map((opt, i) => {
                    const isMulti = step.inputType === 'checkbox'
                    const selected = isMulti ? (answer || []).includes(opt.value) : answer === opt.value
                    return (
                      <OptionCard
                        key={opt.value}
                        option={opt}
                        selected={selected}
                        multi={isMulti}
                        accentIndex={i}
                        onClick={() => {
                          if (isMulti) {
                            const cur = new Set(answer || [])
                            cur.has(opt.value) ? cur.delete(opt.value) : cur.add(opt.value)
                            setAnswer(step.key, [...cur])
                          } else {
                            setAnswer(step.key, opt.value)
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}

          {step.type === 'agreement' && (
            <>
              <h2 className="text-xl font-black text-navy-900">"{step.statement}"</h2>
              <p className="text-base text-slate-500">¿Estás de acuerdo?</p>
              <div className="flex justify-between gap-2 pt-2">
                {EMOJI_SCALE.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(step.key, i + 1)}
                    className={`flex-1 aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl transition-colors ${answer === i + 1 ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Muy en desacuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </>
          )}

          {step.type === 'trivia' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.question}</h2>
              <div className="flex gap-2">
                {['Sí, lo sabía', 'No, no lo sabía'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(step.key, opt)}
                    className={`flex-1 py-3.5 rounded-xl border-2 text-sm font-semibold transition-colors ${answer === opt ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {answer && (
                <div className="bg-lila-50 border border-lila-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700">{step.fact}</p>
                </div>
              )}
            </>
          )}

          {step.type === 'alert' && (
            <>
              <span className="inline-block text-xs font-bold uppercase bg-red-100 text-red-600 px-3 py-1.5 rounded-full">Zona de alerta</span>
              <h2 className="text-xl font-black text-navy-900">{fill(step.title)}</h2>
              <div className="space-y-2.5">
                {step.items.map((it, i) => (
                  <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span>{it}</p>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1">La buena noticia</p>
                <p className="text-sm text-slate-700">{step.goodNews}</p>
              </div>
            </>
          )}

          {step.type === 'loading' && (
            step.messages ? (
              <LoadingStages messages={step.messages.map(fill)} duration={step.duration || 5000} />
            ) : (
              <div className="text-center py-8 space-y-5">
                <div className="w-20 h-20 mx-auto border-[6px] border-lila-100 border-t-lila-500 rounded-full animate-spin" />
                <p className="font-bold text-navy-900 text-lg">{fill(step.message)}</p>
                {step.trust && <p className="text-sm text-slate-400">{step.trust}</p>}
              </div>
            )
          )}

          {step.type === 'gauge' && (
            <>
              <h2 className="text-xl font-black text-navy-900 text-center">{fill(step.title)}</h2>
              <GaugeMeter score={data.computeScore(answers)} label={step.subtitle} />
            </>
          )}

          {step.type === 'projection' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{fill(step.title)}</h2>
              <p className="text-base text-slate-500">{fill(step.subtitle)}</p>
              <div className="bg-slate-50 rounded-2xl p-4">
                <svg viewBox="0 0 200 90" className="w-full">
                  <defs>
                    <pattern id="projectionGrid" width="20" height="16" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="200" height="80" fill="url(#projectionGrid)" />
                  <line x1="0" y1="0" x2="0" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
                  <polyline points="0,60 30,65 60,58 90,68" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <polyline points="90,68 120,45 150,25 200,10" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex justify-between text-sm text-slate-400 font-semibold">
                <span>Hoy</span>
                <span>Con un sistema</span>
              </div>
            </>
          )}

          {step.type === 'result' && (
            <div className="text-center space-y-4">
              <span className="inline-block text-xs font-bold uppercase bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full">Diagnóstico personalizado</span>
              <h2 className="text-2xl font-black text-navy-900">
                {firstName ? `${firstName}, detectamos ${profile.findings.length} problemas:` : `Detectamos ${profile.findings.length} problemas:`}
              </h2>
              <div className="text-left space-y-2 bg-slate-50 rounded-xl p-4">
                {profile.findings.map((f, i) => (
                  <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-emerald-500 font-bold shrink-0">✓</span>{f}</p>
                ))}
              </div>
              <p className="text-base font-bold text-navy-900">
                Por eso te recomendamos <span className="bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 bg-clip-text text-transparent">Plano.Money</span>.
              </p>

              <div className="text-left bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold uppercase text-slate-400">Lo que detectamos</p>
                <SummaryRow label="Ingresos" value={data.incomeLabels?.[answers.situacion]} />
                <SummaryRow label="Principal desafío" value={profile.challenge} />
                <SummaryRow label="Objetivo principal" value={data.goalLabels?.[answers.objetivo_principal]} />
                <SummaryRow label="Prioridad" value={profile.priority} />
              </div>

              <div className={`${scoreZone.bg} rounded-xl p-4 flex items-center justify-between gap-3`}>
                <div className="text-left">
                  <p className="text-white/80 text-xs font-bold uppercase">Salud financiera</p>
                  <p className="text-white text-xs mt-0.5">En 30 días podés mejorar este puntaje.</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-black text-white">{score}<span className="text-base font-semibold text-white/70">/100</span></p>
                  <p className="text-xs font-bold uppercase text-white">{scoreZone.label}</p>
                </div>
              </div>

              <p className="text-lg font-black text-navy-900">{profile.title}</p>
              <p className="text-base text-slate-600">{profile.description}</p>
              {answers.deseo && (
                <p className="text-base text-slate-600">
                  Y en el fondo, lo que más querés es {deseoLabel}. Se puede: es cuestión de sistema, no de esfuerzo.
                </p>
              )}
              {profile.image && (
                <div className="rounded-2xl overflow-hidden border-4 border-white ring-1 ring-slate-200 shadow-lg">
                  <img src={profile.image} alt={profile.imageAlt || ''} className="w-full h-44 sm:h-52 object-cover object-top" />
                </div>
              )}

              {profile.firstStep && (
                <div className="text-left bg-lila-50 border border-lila-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase text-lila-600 mb-1">Primer paso recomendado</p>
                  <p className="text-sm text-slate-700">{profile.firstStep}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {step.type !== 'loading' && (
          <div className="max-w-md mx-auto mt-4">
            {step.type === 'result' ? (
              <a
                href={offerUrl}
                className="block w-full text-center bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-4 rounded-full text-base shadow-lg shadow-accent-600/30 transition hover:scale-105"
              >
                {step.cta}
              </a>
            ) : (
              <button
                onClick={goNext}
                disabled={!canContinue}
                className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-30 text-white font-bold py-4 rounded-full text-base transition"
              >
                {step.cta || 'Continuar →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
