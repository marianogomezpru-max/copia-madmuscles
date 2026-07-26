import { issueAccessCode, setAccessSuspended } from '../_lib/supabaseAdmin.js'
import { sendAccessCodeEmail, sendContentAccessEmail } from '../_lib/email.js'
import { contentProductMap, grantContentAccess } from '../_lib/contentAccess.js'

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
  const productId = body.data?.product?.id != null ? String(body.data.product.id) : null
  // Stays constant across renewal charges for the same subscriber, unlike
  // the transaction id — this is what later cancellation/refund events use
  // to find their way back to the right household. Field name/path can
  // vary by Hotmart API version; check "Registros" on a real test event
  // and adjust here if this doesn't come through.
  const subscriberCode = body.data?.subscription?.subscriber?.code

  // Only the main Plano.Money product grants a new account — an order
  // bump / upsell / downsell approved in the same checkout still gets
  // paid normally, it just doesn't fire its own separate "create your
  // account" email. Set HOTMART_PRODUCT_ID once you have the main
  // product's id; until then every product is treated as "grants access"
  // so testing isn't blocked on this being configured.
  const mainProductId = process.env.HOTMART_PRODUCT_ID
  const isMainProduct = !mainProductId || productId === mainProductId

  // Order bump / upsell / downsell — each is its own standalone product,
  // sold once, gating a single interactive page. Configured as one JSON
  // env var (HOTMART_CONTENT_PRODUCTS: {"<hotmart product id>": "<content slug>"})
  // instead of a code change per new offer.
  const contentSlug = productId ? contentProductMap()[productId] : null

  const isApprovedEvent =
    (eventType === 'PURCHASE_APPROVED' || eventType === 'PURCHASE_COMPLETE') &&
    (!purchaseStatus || APPROVED_STATUSES.has(purchaseStatus))

  const isApprovedPurchase = isMainProduct && isApprovedEvent

  try {
    if (isApprovedPurchase && email && transactionId) {
      const code = await issueAccessCode({ email, source: 'hotmart', externalRef: transactionId, hotmartSubscriberCode: subscriberCode })
      await sendAccessCodeEmail({ to: email, code })
      // A renewal charge for a subscriber who'd previously been suspended
      // (lapsed payment, now paid again) gets their access back.
      if (subscriberCode) await setAccessSuspended({ source: 'hotmart', ref: subscriberCode, suspended: false })
    } else if (contentSlug && isApprovedEvent && email && transactionId) {
      await grantContentAccess({ email, slug: contentSlug, source: 'hotmart', externalRef: transactionId, hotmartProductId: productId })
      await sendContentAccessEmail({ to: email, slug: contentSlug })
    } else if (isMainProduct && CANCEL_EVENTS.has(eventType) && subscriberCode) {
      await setAccessSuspended({ source: 'hotmart', ref: subscriberCode, suspended: true })
    }
  } catch (err) {
    console.error('Failed to process Hotmart event', eventType, err)
    return res.status(500).end('Internal error')
  }

  res.status(200).json({ received: true })
}
