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
export async function issueAccessCode({ email, source, externalRef }) {
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
  })
  if (error) throw error
  return code
}
