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
const ACCENT_DOTS = ['bg-lila-500', 'bg-celeste-500', 'bg-brand-500']

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

function Blobs() {
  return (
    <>
      <div className="absolute -top-16 -left-20 w-64 h-64 bg-lila-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-24 -right-16 w-64 h-64 bg-celeste-400/20 rounded-full blur-3xl -z-10" />
    </>
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
  const profile = data.computeProfile(answers)
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
            </>
          )}

          {step.type === 'question' && (
            <>
              <h2 className="text-2xl font-black text-navy-900">{step.question.replace('{{name}}', name)}</h2>
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

          {step.type === 'pitch' && (
            <>
              <h2 className="text-2xl font-black text-navy-900">{step.title}</h2>
              <p className="text-base text-slate-600">{step.body}</p>
              {step.image && (
                <div className="rounded-2xl overflow-hidden border-4 border-white ring-1 ring-slate-200 shadow-lg">
                  <img src={step.image} alt={step.imageAlt || ''} className="w-full h-48 sm:h-56 object-cover object-top" />
                </div>
              )}
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
              <h2 className="text-xl font-black text-navy-900">{step.title.replace('{{name}}', name)}</h2>
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
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 mx-auto border-[6px] border-lila-100 border-t-lila-500 rounded-full animate-spin" />
              <p className="font-bold text-navy-900 text-lg">{step.message}</p>
              {step.trust && <p className="text-sm text-slate-400">{step.trust}</p>}
            </div>
          )}

          {step.type === 'gauge' && (
            <>
              <h2 className="text-xl font-black text-navy-900 text-center">{step.title.replace('{{name}}', name)}</h2>
              <GaugeMeter score={data.computeScore(answers)} label={step.subtitle} />
            </>
          )}

          {step.type === 'projection' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.title}</h2>
              <p className="text-base text-slate-500">{step.subtitle}</p>
              <div className="bg-slate-50 rounded-2xl p-4">
                <svg viewBox="0 0 200 80" className="w-full">
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
              <h2 className="text-2xl font-black text-navy-900">{name ? `${name}, tu perfil es:` : 'Tu perfil es:'}</h2>
              <p className="text-xl font-black bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 bg-clip-text text-transparent">{profile.title}</p>
              <p className="text-base text-slate-600">{profile.description}</p>
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
