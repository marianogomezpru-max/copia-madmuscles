// Fires a custom Meta Pixel event beyond the automatic PageView (loaded in
// index.html). Guarded for SSR/no-script contexts, and for cases where the
// pixel script hasn't finished loading yet.
export function trackFbEvent(name, params) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, params)
  }
}
