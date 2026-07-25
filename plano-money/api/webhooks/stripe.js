import Stripe from 'stripe'
import { issueAccessCode } from '../_lib/supabaseAdmin.js'
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email || session.customer_email
    if (email && session.payment_status === 'paid') {
      try {
        const code = await issueAccessCode({ email, source: 'stripe', externalRef: session.id })
        await sendAccessCodeEmail({ to: email, code })
      } catch (err) {
        console.error('Failed to issue/send access code for Stripe session', session.id, err)
        return res.status(500).end('Internal error')
      }
    }
  }

  res.status(200).json({ received: true })
}
