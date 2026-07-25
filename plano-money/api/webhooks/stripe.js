import Stripe from 'stripe'
import { issueAccessCode, setAccessSuspended } from '../_lib/supabaseAdmin.js'
import { sendAccessCodeEmail } from '../_lib/email.js'

// Signature verification needs the exact raw request bytes, so we disable
// Vercel's default JSON body parsing for this function.
export const config = { api: { bodyParser: false } }

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const signature = req.headers['stripe-signature']
  const rawBody = await readRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const email = session.customer_details?.email || session.customer_email
      if (email && session.payment_status === 'paid') {
        const code = await issueAccessCode({
          email,
          source: 'stripe',
          externalRef: session.id,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
          stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
        })
        await sendAccessCodeEmail({ to: email, code })
      }
    } else if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      // Subscription cancelled outright, or a renewal charge didn't go
      // through (Stripe will keep retrying it, but access is cut the
      // moment it fails, not only once Stripe gives up retrying).
      const obj = event.data.object
      const subscriptionRef = typeof obj.subscription === 'string' ? obj.subscription : obj.id
      await setAccessSuspended({ source: 'stripe', ref: subscriptionRef, suspended: true })
    } else if (event.type === 'invoice.payment_succeeded') {
      // Covers a lapsed customer paying again: their next successful
      // renewal charge automatically restores access.
      const invoice = event.data.object
      const subscriptionRef = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
      await setAccessSuspended({ source: 'stripe', ref: subscriptionRef, suspended: false })
    }
  } catch (err) {
    console.error('Stripe webhook handling failed for event', event.type, err)
    return res.status(500).end('Internal error')
  }

  res.status(200).json({ received: true })
}
