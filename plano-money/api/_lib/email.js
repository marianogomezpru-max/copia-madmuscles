import { CONTENT_REGISTRY } from '../../src/content/registry.js'

// Sends the access-code email via Resend (https://resend.com). Needs
// RESEND_API_KEY and RESEND_FROM ("Plano.Money <acceso@tudominio.com>",
// must be a domain verified in Resend) as Vercel env vars.
export async function sendAccessCodeEmail({ to, code }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or RESEND_FROM — skipping email, code was still generated:', code)
    return
  }

  const baseUrl = process.env.APP_URL || 'https://plano-money.vercel.app'
  // One-click link: LoginScreen reads ?access_code=&email= on load, switches
  // straight to the signup form and pre-fills both — the code can only be
  // redeemed under this same email (enforced server-side), so pre-filling
  // it here isn't just convenience, it steers the customer to the email
  // that will actually work.
  const signupUrl = `${baseUrl}/?access_code=${encodeURIComponent(code)}&email=${encodeURIComponent(to)}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Tu acceso a Plano.Money',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Ya podés crear tu cuenta en Plano.Money — hacé click en el botón y completá tus datos:</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${signupUrl}" style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px;">Crear mi cuenta</a>
          </p>
          <p style="font-size: 12px; color: #64748b;">Tu código de acceso es <strong>${code}</strong> (ya viene cargado en el link de arriba — si el botón no te funciona, entrá a ${baseUrl} y pegalo manualmente en el campo "Código de acceso").</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend email failed:', res.status, body)
  }
}

// Delivers a standalone ebook/bono purchase (order bump, upsell, downsell —
// anything sold apart from the app subscription). No account, no password:
// the link carries the buyer's email so the content page can verify and
// unlock it automatically on first click.
export async function sendContentAccessEmail({ to, slug }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  const entry = CONTENT_REGISTRY[slug]
  if (!entry) {
    console.error('sendContentAccessEmail: unknown content slug', slug)
    return
  }
  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or RESEND_FROM — skipping email for', slug)
    return
  }

  const baseUrl = process.env.APP_URL || 'https://plano-money.vercel.app'
  const link = `${baseUrl}${entry.path}?email=${encodeURIComponent(to)}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Tu acceso a "${entry.title}"`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Ya podés acceder a <strong>${entry.title}</strong> — hacé click en el botón:</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${link}" style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px;">Acceder ahora</a>
          </p>
          <p style="font-size: 12px; color: #64748b;">Si el botón no funciona, entrá a ${baseUrl}${entry.path} e ingresá el mismo mail con el que compraste (${to}).</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend email failed:', res.status, body)
  }
}
