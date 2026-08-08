import { hasPurchased, issueContentToken } from '../_lib/contentAccess.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { email, slug } = req.body || {}
  if (!email || !slug) return res.status(400).json({ error: 'missing_email_or_slug' })

  try {
    const purchased = await hasPurchased({ email, slug })
    if (!purchased) return res.status(403).json({ error: 'not_found' })

    const token = issueContentToken({ email, slug })
    res.status(200).json({ token })
  } catch (err) {
    console.error('content-access/verify failed', err)
    res.status(500).json({ error: 'internal_error' })
  }
}
