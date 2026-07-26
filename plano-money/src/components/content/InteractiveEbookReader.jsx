import { useState } from 'react'
import { ChevronLeft, ChevronRight, Menu, X, Check } from 'lucide-react'
import Logo from '../Logo.jsx'

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
            <input type="checkbox" checked={checked.has(opt)} onChange={() => toggle(opt)} className="w-4 h-4 rounded accent-brand-500" />
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
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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

  const NavList = () => (
    <nav className="space-y-1">
      <button
        onClick={() => goTo(-1)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${chapterIdx === -1 ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        Introducción
      </button>
      {chapters.map((c, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${chapterIdx === i ? 'bg-brand-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {readChapters.includes(i) && <Check className="w-3.5 h-3.5 shrink-0" />}
          <span>Cap. {i + 1}: {c.title}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Logo className="w-9 h-9 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-navy-900 truncate">{title}</p>
              <p className="text-xs text-slate-400">{progressPct}% completado</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-slate-500">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
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
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-navy-900">{title}</h1>
              <p className="text-slate-500 font-medium">{subtitle}</p>
              <div className="space-y-3 text-slate-700 leading-relaxed">
                {intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <button
                onClick={() => goTo(0)}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 px-6 rounded-xl text-sm"
              >
                Empezar a leer →
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <p className="text-xs font-bold uppercase text-brand-600">Capítulo {chapterIdx + 1}</p>
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
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Caso práctico — {chapter.caseStudy.name}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{chapter.caseStudy.text}</p>
                  </div>
                )}

                {chapter.commonError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase text-red-500 mb-1">Error común</p>
                    <p className="text-sm text-slate-700">{chapter.commonError}</p>
                  </div>
                )}

                {chapter.expertTip && (
                  <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase text-brand-600 mb-1">Consejo del experto</p>
                    <p className="text-sm text-slate-700">{chapter.expertTip}</p>
                  </div>
                )}
              </div>

              {chapter.exercise && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-navy-900">{chapter.exercise.title || 'Ejercicio práctico'}</h3>
                  {chapter.exercise.fields.map((f, fi) => (
                    <ExerciseField key={fi} bookId={bookId} chapterIdx={chapterIdx} field={f} fieldIdx={fi} answers={answers} setAnswers={setAnswers} />
                  ))}
                </div>
              )}

              {chapter.keyIdeas && (
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-700 mb-1">Ideas clave</h3>
                  {chapter.keyIdeas.map((idea, i) => (
                    <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-emerald-500 font-bold">✓</span>{idea}</p>
                  ))}
                </div>
              )}

              {chapter.quote && (
                <div className="bg-navy-900 text-white p-5 rounded-2xl text-center">
                  <p className="italic text-sm sm:text-base">"{chapter.quote}"</p>
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => goTo(chapterIdx - 1)}
                  disabled={chapterIdx === 0 && false}
                  className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-navy-900 disabled:opacity-30 py-2 px-4"
                >
                  <ChevronLeft className="w-4 h-4" /> {chapterIdx === 0 ? 'Introducción' : 'Anterior'}
                </button>
                {chapterIdx < chapters.length - 1 && (
                  <button
                    onClick={() => goTo(chapterIdx + 1)}
                    className="flex items-center gap-1 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 py-2 px-4 rounded-xl"
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
