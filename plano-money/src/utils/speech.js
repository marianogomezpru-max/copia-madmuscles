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

// Speech-to-text writes numbers using locale grouping — "diez mil" comes
// back as the literal text "10.000" in Spanish/Portuguese (period as
// thousands separator, comma as decimal), which JS's Number() would read as
// 10.000 = 10. This figures out which separator is the decimal point (the
// last one, only if it isn't followed by exactly 3 digits — a 3-digit
// trailing group means it's a thousands separator, not a decimal) and
// strips the rest, so "10.000" -> "10000" and "10,50" -> "10.50".
function normalizeSpokenNumber(raw) {
  const seps = raw.match(/[.,]/g)
  if (!seps) return raw

  if (new Set(seps).size === 2) {
    const decimalSep = raw.lastIndexOf(',') > raw.lastIndexOf('.') ? ',' : '.'
    const thousandsSep = decimalSep === ',' ? '.' : ','
    return raw.split(thousandsSep).join('').replace(decimalSep, '.')
  }

  const parts = raw.split(seps[0])
  const lastPart = parts[parts.length - 1]
  const isDecimal = parts.length === 2 && lastPart.length !== 3
  return isDecimal ? `${parts.slice(0, -1).join('')}.${lastPart}` : parts.join('')
}

const NUMBER_PATTERN = /\d+(?:[.,]\d+)*/

// Best-effort local parse of a dictated phrase into an amount + category —
// no AI call. Falls back to leaving fields blank for the user to fill in.
export function parseExpensePhrase(phrase, translations) {
  const amountMatch = phrase.match(NUMBER_PATTERN)
  const amount = amountMatch ? normalizeSpokenNumber(amountMatch[0]) : ''

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
  const amountMatch = phrase.match(NUMBER_PATTERN)
  const amount = amountMatch ? normalizeSpokenNumber(amountMatch[0]) : ''

  let label = amountMatch ? phrase.replace(amountMatch[0], '') : phrase
  label = label.replace(FILLER_WORDS, '').replace(/\s+/g, ' ').trim()
  if (label) label = label.charAt(0).toUpperCase() + label.slice(1)

  return { amount, label }
}
