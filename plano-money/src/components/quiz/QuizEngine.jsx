import { useEffect, useState } from 'react'
import { ChevronLeft, Check, Gift } from 'lucide-react'
import Logo from '../Logo.jsx'
import GaugeMeter from './GaugeMeter.jsx'
import ScratchCard from './ScratchCard.jsx'

function stepVisible(step, answers) {
  if (!step.showIf) return true
  const value = answers[step.showIf.key]
  if (step.showIf.equals !== undefined) return value === step.showIf.equals
  if (step.showIf.notEquals !== undefined) return value !== step.showIf.notEquals
  return true
}

function ProgressHeader({ title, pct, onBack, showBack }) {
  return (
    <header className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur px-4 pt-3 pb-2">
      <div className="max-w-md mx-auto flex items-center gap-3">
        {showBack ? (
          <button onClick={onBack} className="p-1 text-slate-400 hover:text-navy-900 shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}
        <p className="text-xs font-bold text-navy-900 truncate flex-1 text-center">{title}</p>
        <div className="w-7 shrink-0" />
      </div>
      <div className="max-w-md mx-auto h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </header>
  )
}

function OptionCard({ option, selected, onClick, multi }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors ${
        selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {option.icon && <span className="text-2xl shrink-0">{option.icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-navy-900 text-sm">{option.label}</p>
        {option.sublabel && <p className="text-xs text-slate-400">{option.sublabel}</p>}
      </div>
      <div className={`w-5 h-5 shrink-0 flex items-center justify-center border-2 ${multi ? 'rounded-md' : 'rounded-full'} ${selected ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
    </button>
  )
}

const EMOJI_SCALE = ['👎', '👎', '🤷', '👍', '👍']

export default function QuizEngine({ data }) {
  const [stepIndex, setStepIndex] = useState(-1) // -1 = landing
  const [answers, setAnswers] = useState({})
  const [loadingDone, setLoadingDone] = useState(false)
  const [scratchRevealed, setScratchRevealed] = useState(false)

  const visibleSteps = data.steps.filter(s => stepVisible(s, answers))
  const step = stepIndex >= 0 ? visibleSteps[stepIndex] : null
  const pct = stepIndex < 0 ? 0 : Math.round(((stepIndex + 1) / visibleSteps.length) * 100)

  const setAnswer = (key, value) => setAnswers(a => ({ ...a, [key]: value }))

  const goNext = () => {
    if (stepIndex + 1 >= visibleSteps.length) return
    setStepIndex(i => i + 1)
    setLoadingDone(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => {
    if (stepIndex <= 0) { setStepIndex(-1); return }
    setStepIndex(i => i - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (step?.type === 'loading') {
      const t = setTimeout(() => { setLoadingDone(true); goNext() }, step.duration || 2200)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  const name = answers.name || ''

  // ---------- Landing ----------
  if (stepIndex === -1) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-4">
          <Logo className="w-14 h-14 mx-auto" />
          <p className="text-xs font-bold uppercase text-brand-600">{data.landing.kicker}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">{data.landing.title}</h1>
          <p className="text-slate-500">{data.landing.subtitle}</p>
          <button onClick={goNext} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 rounded-xl text-sm">
            {data.landing.cta}
          </button>
        </div>
      </div>
    )
  }

  // ---------- Sales page (final, own layout) ----------
  if (step.type === 'salesPage') {
    const sp = step
    const profileKey = data.computeProfile(answers).key
    const offerUrl = profileKey ? `${sp.checkoutUrl}${sp.checkoutUrl.includes('?') ? '&' : '?'}p=${profileKey}` : sp.checkoutUrl
    return (
      <div className="min-h-screen bg-slate-50 pb-10">
        <div className="max-w-md mx-auto px-4 pt-8 space-y-5">
          <div className="text-center space-y-2">
            <Logo className="w-14 h-14 mx-auto" />
            <p className="text-xs font-bold uppercase text-brand-600">{sp.kicker}</p>
            <h1 className="text-2xl font-black text-navy-900">{sp.title}</h1>
            <p className="text-slate-500 text-sm">{sp.subtitle}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            {sp.bullets.map((b, i) => (
              <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-brand-500 font-bold shrink-0">✓</span>{b}</p>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
            <p className="text-sm font-bold text-emerald-700">{sp.guarantee}</p>
          </div>

          <div className="bg-navy-900 text-white p-5 rounded-2xl text-center space-y-3">
            {sp.originalPrice && <p className="text-sm line-through text-slate-400">{sp.originalPrice}</p>}
            <p className="text-3xl font-black">{sp.price}</p>
            <a href={offerUrl} className="block w-full bg-white text-navy-900 font-bold py-3 rounded-xl text-sm">
              {sp.cta}
            </a>
          </div>

          {sp.faq && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <p className="font-bold text-navy-900 text-sm">Preguntas frecuentes</p>
              {sp.faq.map((f, i) => (
                <details key={i} className="text-sm">
                  <summary className="font-semibold text-slate-700 cursor-pointer">{f.q}</summary>
                  <p className="text-slate-500 mt-1">{f.a}</p>
                </details>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">{sp.disclaimer}</p>
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
    <div className="min-h-screen bg-slate-50">
      <ProgressHeader title={data.landing.title} pct={pct} onBack={goBack} showBack />
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {step.type === 'name' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.question}</h2>
              {step.subtitle && <p className="text-sm text-slate-500">{step.subtitle}</p>}
              <input
                autoFocus
                type="text"
                value={answer || ''}
                onChange={e => setAnswer(step.key, e.target.value)}
                placeholder={step.placeholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </>
          )}

          {step.type === 'email' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.question}</h2>
              {step.note && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700 font-semibold">{step.note}</p>
                </div>
              )}
              <input
                autoFocus
                type="email"
                value={answer || ''}
                onChange={e => setAnswer(step.key, e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </>
          )}

          {step.type === 'question' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.question.replace('{{name}}', name)}</h2>
              {step.subtitle && <p className="text-sm text-slate-500">{step.subtitle}</p>}
              {step.inputType === 'slider' ? (
                <div className="pt-2">
                  <p className="text-center text-3xl font-black text-navy-900">{answer ?? step.min}</p>
                  <input
                    type="range"
                    min={step.min}
                    max={step.max}
                    value={answer ?? step.min}
                    onChange={e => setAnswer(step.key, Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{step.min}</span>
                    <span>{step.max}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {step.options.map(opt => {
                    const isMulti = step.inputType === 'checkbox'
                    const selected = isMulti ? (answer || []).includes(opt.value) : answer === opt.value
                    return (
                      <OptionCard
                        key={opt.value}
                        option={opt}
                        selected={selected}
                        multi={isMulti}
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
              <h2 className="text-lg font-black text-navy-900">"{step.statement}"</h2>
              <p className="text-sm text-slate-500">¿Estás de acuerdo?</p>
              <div className="flex justify-between gap-1.5 pt-2">
                {EMOJI_SCALE.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(step.key, i + 1)}
                    className={`flex-1 aspect-square rounded-xl border flex items-center justify-center text-xl ${answer === i + 1 ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase">
                <span>Muy en desacuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </>
          )}

          {step.type === 'pitch' && (
            <>
              <h2 className="text-xl font-black text-navy-900">{step.title}</h2>
              <p className="text-sm text-slate-600">{step.body}</p>
              {step.mockupLabel && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-xs font-bold text-slate-400 uppercase">
                  {step.mockupLabel}
                </div>
              )}
            </>
          )}

          {step.type === 'trivia' && (
            <>
              <h2 className="text-lg font-black text-navy-900">{step.question}</h2>
              <div className="flex gap-2">
                {['Sí, lo sabía', 'No, no lo sabía'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(step.key, opt)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold ${answer === opt ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {answer && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                  <p className="text-sm text-slate-700">{step.fact}</p>
                </div>
              )}
            </>
          )}

          {step.type === 'alert' && (
            <>
              <span className="inline-block text-[10px] font-bold uppercase bg-red-100 text-red-600 px-2 py-1 rounded-full">Zona de Alerta</span>
              <h2 className="text-lg font-black text-navy-900">{step.title.replace('{{name}}', name)}</h2>
              <div className="space-y-2">
                {step.items.map((it, i) => (
                  <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span>{it}</p>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-xs font-bold uppercase text-emerald-600 mb-1">La buena noticia</p>
                <p className="text-sm text-slate-700">{step.goodNews}</p>
              </div>
            </>
          )}

          {step.type === 'loading' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin" />
              <p className="font-bold text-navy-900">{step.message}</p>
              {step.trust && <p className="text-xs text-slate-400">{step.trust}</p>}
            </div>
          )}

          {step.type === 'gauge' && (
            <>
              <h2 className="text-lg font-black text-navy-900 text-center">{step.title.replace('{{name}}', name)}</h2>
              <GaugeMeter score={data.computeScore(answers)} label={step.subtitle} />
            </>
          )}

          {step.type === 'projection' && (
            <>
              <h2 className="text-lg font-black text-navy-900">{step.title}</h2>
              <p className="text-sm text-slate-500">{step.subtitle}</p>
              <svg viewBox="0 0 200 80" className="w-full">
                <polyline points="0,60 30,65 60,58 90,68" fill="none" stroke="#ef4444" strokeWidth="3" />
                <polyline points="90,68 120,45 150,25 200,10" fill="none" stroke="#10b981" strokeWidth="3" />
              </svg>
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Hoy</span>
                <span>Con Plano.Money</span>
              </div>
            </>
          )}

          {step.type === 'result' && (() => {
            const profile = data.computeProfile(answers)
            return (
              <div className="text-center space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase bg-brand-100 text-brand-700 px-2 py-1 rounded-full">Diagnóstico personalizado</span>
                <h2 className="text-xl font-black text-navy-900">{name ? `${name}, tu perfil es:` : 'Tu perfil es:'}</h2>
                <p className="text-lg font-black text-brand-600">{profile.title}</p>
                <p className="text-sm text-slate-600">{profile.description}</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left space-y-1.5">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Tu diagnóstico incluye</p>
                  {data.valueStack.map((v, i) => (
                    <p key={i} className="text-sm text-slate-700 flex justify-between">
                      <span>{v.label}</span>
                      <span className="text-slate-400 line-through">{v.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            )
          })()}

          {step.type === 'scratch' && (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-black text-navy-900">{step.title}</h2>
              <ScratchCard discountLabel={step.discountLabel} onRevealed={() => setScratchRevealed(true)} />
              {scratchRevealed && (
                <div className="animate-fade-in bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-emerald-700">🎉 Ganaste tu descuento — se aplica automáticamente en el siguiente paso.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {step.type !== 'loading' && (
          <div className="max-w-md mx-auto mt-4">
            <button
              onClick={goNext}
              disabled={!canContinue || (step.type === 'scratch' && !scratchRevealed)}
              className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-30 text-white font-bold py-3.5 rounded-xl text-sm"
            >
              {step.cta || 'Continuar →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
