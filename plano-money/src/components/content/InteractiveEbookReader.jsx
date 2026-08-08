import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, Menu, X, Check, BookOpen, Clock, Lightbulb,
  AlertTriangle, CheckCircle2, Quote, PenLine, Brain, Target, PiggyBank,
  TrendingUp, Wallet, ShieldCheck, Compass, Flame, Star, Rocket,
  HeartHandshake, Zap,
} from 'lucide-react'
import Logo from '../Logo.jsx'

// Cycled by chapter index so every chapter gets a distinct icon + gradient
// without content files needing to declare one — keeps data files plain.
const CHAPTER_STYLES = [
  { icon: Brain, grad: 'from-lila-500 to-accent-600' },
  { icon: Target, grad: 'from-celeste-500 to-lila-500' },
  { icon: PiggyBank, grad: 'from-brand-500 to-celeste-500' },
  { icon: TrendingUp, grad: 'from-accent-600 to-celeste-500' },
  { icon: Wallet, grad: 'from-lila-600 to-brand-500' },
  { icon: ShieldCheck, grad: 'from-celeste-600 to-brand-500' },
  { icon: Compass, grad: 'from-accent-500 to-lila-500' },
  { icon: Flame, grad: 'from-brand-600 to-accent-600' },
  { icon: Star, grad: 'from-lila-500 to-celeste-600' },
  { icon: Rocket, grad: 'from-accent-600 to-brand-500' },
  { icon: HeartHandshake, grad: 'from-celeste-500 to-accent-500' },
  { icon: Zap, grad: 'from-brand-500 to-lila-500' },
]
const chapterStyle = i => CHAPTER_STYLES[i % CHAPTER_STYLES.length]

function estimateMinutes(chapters) {
  const words = chapters.reduce((sum, c) => {
    const bodyWords = c.body.reduce((s, b) => s + (b.paragraphs?.join(' ').split(/\s+/).length || 0), 0)
    return sum + bodyWords
  }, 0)
  return Math.max(1, Math.round(words / 180))
}

function loadAnswers(bookId) {
  try {
    return JSON.parse(localStorage.getItem(`plano_money_ebook_${bookId}`)) || {}
  } catch {
    return {}
  }
}

function ExerciseField({ bookId, chapterIdx, field, fieldIdx, answers, setAnswers }) {
  const key = `${chapterIdx}.${fieldIdx}`
  const value = answers[key] || ''
  const save = v => {
    const next = { ...answers, [key]: v }
    setAnswers(next)
    localStorage.setItem(`plano_money_ebook_${bookId}`, JSON.stringify(next))
  }

  if (field.type === 'checkboxGroup') {
    const checked = new Set(value ? value.split('|') : [])
    const toggle = opt => {
      const next = new Set(checked)
      next.has(opt) ? next.delete(opt) : next.add(opt)
      save([...next].join('|'))
    }
    return (
      <div className="space-y-1.5">
        {field.label && <p className="text-sm font-semibold text-slate-700">{field.label}</p>}
        {field.options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={checked.has(opt)} onChange={() => toggle(opt)} className="w-4 h-4 rounded accent-lila-500" />
            {opt}
          </label>
        ))}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">{field.label}</p>
        <textarea
          value={value}
          onChange={e => save(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500"
        />
      </div>
    )
  }

  // 'text' or 'money'
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{field.label}</p>
      <input
        type="text"
        value={value}
        onChange={e => save(e.target.value)}
        placeholder={field.type === 'money' ? '$' : ''}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500"
      />
    </div>
  )
}

export default function InteractiveEbookReader({ bookId, title, subtitle, intro, chapters }) {
  const [chapterIdx, setChapterIdx] = useState(-1) // -1 = intro
  const [menuOpen, setMenuOpen] = useState(false)
  const [answers, setAnswers] = useState(() => loadAnswers(bookId))
  const [readChapters, setReadChapters] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`plano_money_ebook_${bookId}_progress`)) || []
    } catch {
      return []
    }
  })

  const goTo = idx => {
    setChapterIdx(idx)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (idx >= 0 && !readChapters.includes(idx)) {
      const next = [...readChapters, idx]
      setReadChapters(next)
      localStorage.setItem(`plano_money_ebook_${bookId}_progress`, JSON.stringify(next))
    }
  }

  const chapter = chapterIdx >= 0 ? chapters[chapterIdx] : null
  const progressPct = Math.round((readChapters.length / chapters.length) * 100)
  const readMinutes = estimateMinutes(chapters)

  const NavList = () => (
    <nav className="space-y-1">
      <button
        onClick={() => goTo(-1)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${chapterIdx === -1 ? 'bg-gradient-to-r from-lila-500 to-celeste-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <BookOpen className="w-3.5 h-3.5 shrink-0" /> Introducción
      </button>
      {chapters.map((c, i) => {
        const { icon: Icon, grad } = chapterStyle(i)
        const active = chapterIdx === i
        const done = readChapters.includes(i)
        return (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${active ? 'bg-gradient-to-r from-lila-500 to-celeste-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <span className={`relative w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${grad}`}>
              <Icon className="w-3 h-3 text-white" />
              {done && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-500 border border-white flex items-center justify-center">
                  <Check className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                </span>
              )}
            </span>
            <span className="truncate">Cap. {i + 1}: {c.title}</span>
          </button>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-lila-50/50 via-white to-white">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Logo className="w-9 h-9 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-navy-900 truncate">{title}</p>
              <p className="text-xs text-slate-400">
                {chapterIdx === -1 ? 'Introducción' : `Capítulo ${chapterIdx + 1} de ${chapters.length}`} · {progressPct}% completado
              </p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-slate-500">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        <aside className={`${menuOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0`}>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 sm:sticky sm:top-24">
            <NavList />
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-5">
          {chapterIdx === -1 ? (
            <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="absolute -top-16 -left-20 w-64 h-64 bg-lila-400/20 rounded-full blur-3xl -z-10" />
              <div className="absolute top-10 -right-16 w-64 h-64 bg-celeste-400/20 rounded-full blur-3xl -z-10" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lila-500 via-accent-600 to-celeste-500 flex items-center justify-center shadow-lg shadow-accent-600/20">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-navy-900">{title}</h1>
                <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-lila-50 text-lila-700 text-xs font-bold px-3 py-1.5 rounded-full border border-lila-100">
                  <BookOpen className="w-3.5 h-3.5" /> {chapters.length} capítulos
                </span>
                <span className="inline-flex items-center gap-1.5 bg-celeste-50 text-celeste-700 text-xs font-bold px-3 py-1.5 rounded-full border border-celeste-100">
                  <Clock className="w-3.5 h-3.5" /> ~{readMinutes} min de lectura
                </span>
                <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-100">
                  <PenLine className="w-3.5 h-3.5" /> Con ejercicios interactivos
                </span>
              </div>

              <div className="space-y-3 text-slate-700 leading-relaxed">
                {intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              <button
                onClick={() => goTo(0)}
                className="bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-lg shadow-accent-600/20 transition hover:scale-[1.02]"
              >
                Empezar a leer →
              </button>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold uppercase text-slate-400 mb-3">Índice</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {chapters.map((c, i) => {
                    const { icon: Icon, grad } = chapterStyle(i)
                    return (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="flex items-center gap-3 text-left p-3 rounded-xl border border-slate-100 hover:border-lila-200 hover:bg-lila-50/40 transition"
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br ${grad}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </span>
                        <span className="text-sm font-semibold text-slate-700">{i + 1}. {c.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${chapterStyle(chapterIdx).grad}`} />
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${chapterStyle(chapterIdx).grad} shadow-md`}>
                    {(() => { const Icon = chapterStyle(chapterIdx).icon; return <Icon className="w-5 h-5 text-white" /> })()}
                  </span>
                  <p className="text-xs font-bold uppercase text-lila-600">Capítulo {chapterIdx + 1}</p>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900">{chapter.title}</h2>
                {chapter.hook && <p className="italic text-slate-500">{chapter.hook}</p>}

                {chapter.body.map((block, bi) => (
                  <div key={bi} className="space-y-2">
                    {block.heading && <h3 className="text-base font-bold text-navy-900 mt-3">{block.heading}</h3>}
                    {block.paragraphs.map((p, pi) => <p key={pi} className="text-sm sm:text-base text-slate-700 leading-relaxed">{p}</p>)}
                    {block.list && (
                      <ul className="list-disc list-inside text-sm sm:text-base text-slate-700 space-y-0.5 ml-2">
                        {block.list.map((li, li2) => <li key={li2}>{li}</li>)}
                      </ul>
                    )}
                  </div>
                ))}

                {chapter.caseStudy && (
                  <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 mb-1">Caso práctico — {chapter.caseStudy.name}</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{chapter.caseStudy.text}</p>
                    </div>
                  </div>
                )}

                {chapter.commonError && (
                  <div className="flex gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase text-red-500 mb-1">Error común</p>
                      <p className="text-sm text-slate-700">{chapter.commonError}</p>
                    </div>
                  </div>
                )}

                {chapter.expertTip && (
                  <div className="flex gap-3 bg-lila-50 border border-lila-100 rounded-xl p-4">
                    <Lightbulb className="w-4 h-4 text-lila-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase text-lila-600 mb-1">Consejo del experto</p>
                      <p className="text-sm text-slate-700">{chapter.expertTip}</p>
                    </div>
                  </div>
                )}
              </div>

              {chapter.exercise && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-dashed border-celeste-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-celeste-500 flex items-center justify-center shrink-0">
                      <PenLine className="w-4 h-4 text-white" />
                    </span>
                    <h3 className="text-base font-bold text-navy-900">{chapter.exercise.title || 'Ejercicio interactivo'}</h3>
                  </div>
                  {chapter.exercise.fields.map((f, fi) => (
                    <ExerciseField key={fi} bookId={bookId} chapterIdx={chapterIdx} field={f} fieldIdx={fi} answers={answers} setAnswers={setAnswers} />
                  ))}
                </div>
              )}

              {chapter.keyIdeas && (
                <div className="bg-brand-50 p-5 rounded-2xl border border-brand-100 space-y-2">
                  <h3 className="text-sm font-bold text-brand-700 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Ideas clave
                  </h3>
                  {chapter.keyIdeas.map((idea, i) => (
                    <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-brand-500 font-bold">✓</span>{idea}</p>
                  ))}
                </div>
              )}

              {chapter.quote && (
                <div className="bg-navy-900 text-white p-5 rounded-2xl text-center relative">
                  <Quote className="w-5 h-5 text-celeste-400 mx-auto mb-2" />
                  <p className="italic text-sm sm:text-base">{chapter.quote}</p>
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => goTo(chapterIdx - 1)}
                  className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-navy-900 py-2 px-4"
                >
                  <ChevronLeft className="w-4 h-4" /> {chapterIdx === 0 ? 'Introducción' : 'Anterior'}
                </button>
                {chapterIdx < chapters.length - 1 && (
                  <button
                    onClick={() => goTo(chapterIdx + 1)}
                    className="flex items-center gap-1 text-sm font-bold text-white bg-gradient-to-r from-lila-500 to-celeste-500 hover:brightness-110 py-2 px-4 rounded-xl"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
