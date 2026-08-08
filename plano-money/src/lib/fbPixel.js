// Fires a custom Meta Pixel event beyond the automatic PageView (loaded in
// index.html). Guarded for SSR/no-script contexts, and for cases where the
// pixel script hasn't finished loading yet.
export function trackFbEvent(name, params) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, params)
  }
}

// Para eventos que no son parte de los ~17 estándar de Meta (Lead, Purchase,
// InitiateCheckout, etc.) — necesitan trackCustom en vez de track para
// aparecer bien clasificados en el Administrador de Eventos, en vez de
// perderse o marcarse como no reconocidos.
export function trackFbCustomEvent(name, params) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, params)
  }
}
