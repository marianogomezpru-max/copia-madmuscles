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

  const signupUrl = process.env.APP_URL || 'https://plano-money.vercel.app'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Tu código de acceso a Plano.Money',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Tu código de acceso a Plano.Money es:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background: #f1f5f9; padding: 12px 16px; border-radius: 8px; text-align: center;">${code}</p>
          <p>Usalo al registrarte en <a href="${signupUrl}">${signupUrl}</a>, en el campo "Código de acceso".</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend email failed:', res.status, body)
  }
}
