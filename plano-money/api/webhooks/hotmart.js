import { issueAccessCode } from '../_lib/supabaseAdmin.js'
import { sendAccessCodeEmail } from '../_lib/email.js'

// Hotmart sends its signing token ("Hottok", generated in
// Ferramentas > Webhook of your Hotmart product) in this header — compare
// it to the value stored as HOTMART_HOTTOK to confirm the request is real.
const APPROVED_STATUSES = new Set(['APPROVED', 'COMPLETE'])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const receivedToken = req.headers['x-hotmart-hottok']
  if (!receivedToken || receivedToken !== process.env.HOTMART_HOTTOK) {
    console.error('Hotmart webhook: invalid or missing Hottok header')
    return res.status(401).end('Unauthorized')
  }

  const body = req.body || {}
  const eventType = body.event
  const purchaseStatus = body.data?.purchase?.status
  const email = body.data?.buyer?.email
  const transactionId = body.data?.purchase?.transaction

  const isApprovedPurchase =
    (eventType === 'PURCHASE_APPROVED' || eventType === 'PURCHASE_COMPLETE') &&
    (!purchaseStatus || APPROVED_STATUSES.has(purchaseStatus))

  if (isApprovedPurchase && email && transactionId) {
    try {
      const code = await issueAccessCode({ email, source: 'hotmart', externalRef: transactionId })
      await sendAccessCodeEmail({ to: email, code })
    } catch (err) {
      console.error('Failed to issue/send access code for Hotmart transaction', transactionId, err)
      return res.status(500).end('Internal error')
    }
  }

  res.status(200).json({ received: true })
}
