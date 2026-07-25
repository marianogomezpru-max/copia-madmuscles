import { CATEGORIES } from '../constants.js'

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

// Records one utterance and resolves with the transcript. Uses the browser's
// free built-in speech recognition — no network call, no API key.
export function listenOnce(lang = 'es') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const localeMap = { es: 'es-AR', en: 'en-US', pt: 'pt-BR' }
  return new Promise((resolve, reject) => {
    const recognition = new SpeechRecognition()
    recognition.lang = localeMap[lang] || 'es-AR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = e => resolve(e.results[0][0].transcript)
    recognition.onerror = e => reject(e.error)
    recognition.onend = () => {}
    try {
      recognition.start()
    } catch {
      reject('start-failed')
    }
  })
}

// Best-effort local parse of a dictated phrase into an amount + category —
// no AI call. Falls back to leaving fields blank for the user to fill in.
export function parseExpensePhrase(phrase, translations) {
  const amountMatch = phrase.match(/(\d+([.,]\d+)?)/)
  const amount = amountMatch ? amountMatch[1].replace(',', '.') : ''

  const lower = phrase.toLowerCase()
  let categoryId = ''
  for (const cat of CATEGORIES) {
    const label = (translations.categories[cat.id] || '').toLowerCase()
    const words = label.split(/[\s/]+/).filter(w => w.length > 3)
    if (words.some(w => lower.includes(w))) {
      categoryId = cat.id
      break
    }
  }

  return { amount, categoryId, note: phrase }
}

const FILLER_WORDS = /\b(pesos|peso|dolares|dólares|usd|de|en|por|del|la|el)\b/gi

// Generic parse for forms that just need "amount" + "everything else as a
// label" (income, goals, profile names) — no category matching involved.
export function parseAmountAndLabel(phrase) {
  const amountMatch = phrase.match(/(\d+([.,]\d+)?)/)
  const amount = amountMatch ? amountMatch[1].replace(',', '.') : ''

  let label = amountMatch ? phrase.replace(amountMatch[0], '') : phrase
  label = label.replace(FILLER_WORDS, '').replace(/\s+/g, ' ').trim()
  if (label) label = label.charAt(0).toUpperCase() + label.slice(1)

  return { amount, label }
}
