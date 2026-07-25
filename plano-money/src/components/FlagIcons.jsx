// Plain inline SVGs instead of flag emoji — emoji flags render as bare
// two-letter codes (or nothing) on Windows, which has no flag glyphs in its
// default emoji font, so they'd disappear for a lot of users.
const base = 'w-4 h-3 rounded-sm shrink-0 ring-1 ring-black/10'

export function FlagAR({ className = '' }) {
  return (
    <svg viewBox="0 0 24 16" className={`${base} ${className}`}>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.3" fill="#74ACDF" />
      <rect y="10.7" width="24" height="5.3" fill="#74ACDF" />
      <circle cx="12" cy="8" r="1.6" fill="#F6B40E" />
    </svg>
  )
}

export function FlagUS({ className = '' }) {
  return (
    <svg viewBox="0 0 24 16" className={`${base} ${className}`}>
      <rect width="24" height="16" fill="#B22234" />
      <rect y="1.23" width="24" height="1.23" fill="#fff" />
      <rect y="3.69" width="24" height="1.23" fill="#fff" />
      <rect y="6.15" width="24" height="1.23" fill="#fff" />
      <rect y="8.62" width="24" height="1.23" fill="#fff" />
      <rect y="11.08" width="24" height="1.23" fill="#fff" />
      <rect y="13.54" width="24" height="1.23" fill="#fff" />
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  )
}

export function FlagBR({ className = '' }) {
  return (
    <svg viewBox="0 0 24 16" className={`${base} ${className}`}>
      <rect width="24" height="16" fill="#009739" />
      <polygon points="12,2.5 21.5,8 12,13.5 2.5,8" fill="#FEDD00" />
      <circle cx="12" cy="8" r="3" fill="#012169" />
    </svg>
  )
}

export const LANGUAGES = [
  { code: 'es', label: 'Español', Flag: FlagAR },
  { code: 'en', label: 'English', Flag: FlagUS },
  { code: 'pt', label: 'Português', Flag: FlagBR },
]
