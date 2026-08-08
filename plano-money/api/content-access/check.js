import { verifyContentToken } from '../_lib/contentAccess.js'

// Validates a token already stored in the visitor's browser (from a
// previous verify call) — no email re-entry needed on return visits.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { token, slug } = req.body || {}
  if (!token || !slug) return res.status(400).json({ valid: false })

  res.status(200).json({ valid: verifyContentToken(token, slug) })
}
