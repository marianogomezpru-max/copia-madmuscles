// Icon-only mark — no baked-in text, so "Plano.Money" can sit beside it at
// any size. Ascending bars on a navy → indigo gradient (no black anywhere).
export default function Logo({ className = 'w-10 h-10' }) {
  return (
    <div className={`${className} rounded-2xl bg-gradient-to-br from-navy-900 to-accent-600 flex items-center justify-center shadow-md shrink-0`}>
      <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none" aria-hidden="true">
        <rect x="3" y="14" width="4" height="7" rx="1.5" fill="white" fillOpacity="0.55" />
        <rect x="10" y="9" width="4" height="12" rx="1.5" fill="white" fillOpacity="0.8" />
        <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
      </svg>
    </div>
  )
}
