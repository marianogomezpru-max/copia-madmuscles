import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. Only ever imported from inside /api
// (Vercel serverless functions), never from src/, so the key never reaches
// the browser bundle.
export function supabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  return createClient(url, key, { auth: { persistSession: false } })
}

function randomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
}

// Idempotent: a webhook retry with the same (source, externalRef) reuses
// the code already issued for that purchase instead of minting a new one.
// stripeCustomerId/stripeSubscriptionId/hotmartSubscriberCode are stored so
// a later cancellation/refund event can find its way back to this
// household — see set_access_suspended_by_ref.
export async function issueAccessCode({ email, source, externalRef, stripeCustomerId, stripeSubscriptionId, hotmartSubscriberCode }) {
  const admin = supabaseAdmin()

  const { data: existing } = await admin
    .from('access_codes')
    .select('code')
    .eq('source', source)
    .eq('external_ref', externalRef)
    .maybeSingle()
  if (existing) return existing.code

  const code = randomCode()
  const { error } = await admin.from('access_codes').insert({
    code: code.toLowerCase(),
    email,
    source,
    external_ref: externalRef,
    stripe_customer_id: stripeCustomerId || null,
    stripe_subscription_id: stripeSubscriptionId || null,
    hotmart_subscriber_code: hotmartSubscriberCode || null,
  })
  if (error) throw error
  return code
}

// p_ref is whichever gateway reference we have on hand for the event
// (Stripe subscription id, Stripe customer id, or Hotmart subscriber
// code) — set_access_suspended_by_ref looks it up against the
// access_codes rows issued earlier and flips settings.access_suspended
// for that household. A no-op if no matching household is found (e.g. a
// one-time, non-subscription purchase that later gets refunded).
export async function setAccessSuspended({ source, ref, suspended }) {
  if (!ref) return
  const admin = supabaseAdmin()
  const { error } = await admin.rpc('set_access_suspended_by_ref', {
    p_source: source,
    p_ref: ref,
    p_suspended: suspended,
  })
  if (error) throw error
}
