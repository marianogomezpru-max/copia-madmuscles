import crypto from 'node:crypto'
import { supabaseAdmin } from './supabaseAdmin.js'

// Hotmart product id -> content slug this purchase unlocks. One JSON env
// var instead of one env var per product, so adding a new offer later
// (a new order bump, a new upsell) never needs a code change — just add
// an entry here and redeploy the env var.
export function contentProductMap() {
  try {
    return JSON.parse(process.env.HOTMART_CONTENT_PRODUCTS || '{}')
  } catch {
    console.error('HOTMART_CONTENT_PRODUCTS is not valid JSON')
    return {}
  }
}

export async function grantContentAccess({ email, slug, source, externalRef, hotmartProductId }) {
  const admin = supabaseAdmin()
  const { error } = await admin.from('content_purchases').upsert(
    {
      email: email.trim().toLowerCase(),
      content_slug: slug,
      source,
      external_ref: externalRef,
      hotmart_product_id: hotmartProductId || null,
    },
    { onConflict: 'source,external_ref,content_slug' }
  )
  if (error) throw error
}

// Signed, expiring token — proves "this email owns this content" without
// needing a password or a Supabase Auth account. HMAC'd with a server-only
// secret so it can't be forged client-side.
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 365 // 1 year — a one-time content purchase shouldn't need re-verifying often

function sign(payload) {
  const secret = process.env.CONTENT_ACCESS_SECRET
  if (!secret) throw new Error('Missing CONTENT_ACCESS_SECRET env var')
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url')
}

export function issueContentToken({ email, slug }) {
  const expires = Date.now() + TOKEN_TTL_MS
  const payload = `${email.trim().toLowerCase()}|${slug}|${expires}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

export function verifyContentToken(token, slug) {
  try {
    const [encodedPayload, signature] = token.split('.')
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
    if (sign(payload) !== signature) return false
    const [, tokenSlug, expires] = payload.split('|')
    return tokenSlug === slug && Number(expires) > Date.now()
  } catch {
    return false
  }
}

export async function hasPurchased({ email, slug }) {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('content_purchases')
    .select('id')
    .eq('content_slug', slug)
    .ilike('email', email.trim())
    .maybeSingle()
  if (error) throw error
  return !!data
}
