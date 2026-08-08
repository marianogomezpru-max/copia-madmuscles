import { useEffect, useState } from 'react'
import Logo from '../Logo.jsx'

const tokenKey = slug => `plano_money_content_${slug}`

// Wraps a paid standalone piece of content (ebook/bono sold on its own).
// No Plano.Money account needed — just the email it was bought under.
// Checks, in order: a token already saved in this browser, an ?email= in
// the URL (from the delivery email — verifies automatically), or finally
// asks the visitor to type the email themselves.
export default function ContentGate({ slug, children }) {
  const [status, setStatus] = useState('checking') // checking | locked | unlocked
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem(tokenKey(slug))
    const urlEmail = new URLSearchParams(window.location.search).get('email')

    const run = async () => {
      if (savedToken) {
        const res = await fetch('/api/content-access/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: savedToken, slug }),
        }).then(r => r.json()).catch(() => ({ valid: false }))
        if (res.valid) {
          setStatus('unlocked')
          return
        }
      }
      if (urlEmail) {
        setEmail(urlEmail)
        const unlocked = await verify(urlEmail)
        window.history.replaceState({}, '', window.location.pathname)
        if (unlocked) return
      }
      setStatus('locked')
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const verify = async candidateEmail => {
    setError('')
    try {
      const res = await fetch('/api/content-access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: candidateEmail, slug }),
      })
      const data = await res.json()
      if (!res.ok || !data.token) {
        setStatus('locked')
        setError('No encontramos ninguna compra con ese mail. Revisá que sea el mismo que usaste al pagar.')
        return false
      }
      localStorage.setItem(tokenKey(slug), data.token)
      setStatus('unlocked')
      return true
    } catch {
      setStatus('locked')
      setError('No pudimos verificar tu acceso ahora. Probá de nuevo en un momento.')
      return false
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await verify(email.trim())
    setLoading(false)
  }

  if (status === 'checking') return <div className="min-h-screen" />

  if (status === 'unlocked') return children

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center animate-fade-in">
        <Logo className="w-14 h-14 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy-900 mb-2">Ingresá tu mail de compra</h2>
        <p className="text-slate-500 text-sm mb-6">Usá el mismo mail con el que pagaste para acceder a este contenido.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm sm:text-base"
          />
          {error && <p className="text-xs text-red-600 font-semibold text-left">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm"
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  )
}
