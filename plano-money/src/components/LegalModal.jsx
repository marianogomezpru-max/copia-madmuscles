import { X } from 'lucide-react'
import { LEGAL_CONTENT } from '../legalContent.js'

export default function LegalModal({ t, lang, type, onClose }) {
  const content = (LEGAL_CONTENT[lang] || LEGAL_CONTENT.es)[type]

  return (
    <div className="fixed inset-0 bg-navy-900/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-900">{content.title}</h2>
            <p className="text-xs text-slate-400">{content.updated}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          {content.sections.map(section => (
            <div key={section.heading}>
              <h3 className="text-sm font-bold text-navy-900 mb-1">{section.heading}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2 px-5 rounded-xl text-sm"
          >
            {t.legalCloseBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
