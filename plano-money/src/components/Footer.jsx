import { useState } from 'react'
import LegalModal from './LegalModal.jsx'

export default function Footer({ t, lang }) {
  const [openLegal, setOpenLegal] = useState(null) // null | 'terms' | 'privacy'
  const year = new Date().getFullYear()

  return (
    <footer className="py-6 text-center text-xs text-slate-400 space-y-1.5">
      <p>© {year} Novi Global International S.A. · Plano.Money — {t.footerRights}</p>
      <p className="space-x-3">
        <button onClick={() => setOpenLegal('terms')} className="hover:text-slate-600 underline underline-offset-2">
          {t.footerTerms}
        </button>
        <span>·</span>
        <button onClick={() => setOpenLegal('privacy')} className="hover:text-slate-600 underline underline-offset-2">
          {t.footerPrivacy}
        </button>
      </p>
      {openLegal && <LegalModal t={t} lang={lang} type={openLegal} onClose={() => setOpenLegal(null)} />}
    </footer>
  )
}
