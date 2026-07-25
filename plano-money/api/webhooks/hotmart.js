import { issueAccessCode, setAccessSuspended } from '../_lib/supabaseAdmin.js'
import { sendAccessCodeEmail } from '../_lib/email.js'

// Hotmart sends its signing token ("Hottok", generated in
// Ferramentas > Webhook of your Hotmart product) in this header — compare
// it to the value stored as HOTMART_HOTTOK to confirm the request is real.
const APPROVED_STATUSES = new Set(['APPROVED', 'COMPLETE'])
const CANCEL_EVENTS = new Set(['PURCHASE_CANCELED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'SUBSCRIPTION_CANCELLATION'])

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
  // Stays constant across renewal charges for the same subscriber, unlike
  // the transaction id — this is what later cancellation/refund events use
  // to find their way back to the right household. Field name/path can
  // vary by Hotmart API version; check "Registros" on a real test event
  // and adjust here if this doesn't come through.
  const subscriberCode = body.data?.subscription?.subscriber?.code

  const isApprovedPurchase =
    (eventType === 'PURCHASE_APPROVED' || eventType === 'PURCHASE_COMPLETE') &&
    (!purchaseStatus || APPROVED_STATUSES.has(purchaseStatus))

  try {
    if (isApprovedPurchase && email && transactionId) {
      const code = await issueAccessCode({ email, source: 'hotmart', externalRef: transactionId, hotmartSubscriberCode: subscriberCode })
      await sendAccessCodeEmail({ to: email, code })
      // A renewal charge for a subscriber who'd previously been suspended
      // (lapsed payment, now paid again) gets their access back.
      if (subscriberCode) await setAccessSuspended({ source: 'hotmart', ref: subscriberCode, suspended: false })
    } else if (CANCEL_EVENTS.has(eventType) && subscriberCode) {
      await setAccessSuspended({ source: 'hotmart', ref: subscriberCode, suspended: true })
    }
  } catch (err) {
    console.error('Failed to process Hotmart event', eventType, err)
    return res.status(500).end('Internal error')
  }

  res.status(200).json({ received: true })
}
