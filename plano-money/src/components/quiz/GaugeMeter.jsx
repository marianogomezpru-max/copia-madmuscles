// Semicircular gauge, red → yellow → green, with a needle at `score` (0-100).
function arcPoint(p, r = 90, cx = 100, cy = 100) {
  const angle = (Math.PI / 180) * (180 - 180 * p)
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) }
}

function arcPath(from, to, r = 90) {
  const a = arcPoint(from, r)
  const b = arcPoint(to, r)
  return `M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`
}

export default function GaugeMeter({ score, label }) {
  const clamped = Math.max(0, Math.min(100, score))
  const needle = arcPoint(clamped / 100, 78)
  const zone = clamped < 33.3 ? 'Zona Roja' : clamped < 66.7 ? 'Zona Amarilla' : 'Zona Verde'
  const zoneColor = clamped < 33.3 ? 'text-red-600' : clamped < 66.7 ? 'text-amber-600' : 'text-emerald-600'

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-64 max-w-full">
        <path d={arcPath(0, 0.333)} stroke="#ef4444" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={arcPath(0.333, 0.667)} stroke="#f59e0b" strokeWidth="16" fill="none" />
        <path d={arcPath(0.667, 1)} stroke="#10b981" strokeWidth="16" fill="none" strokeLinecap="round" />
        <line x1="100" y1="100" x2={needle.x} y2={needle.y} stroke="#1a1652" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="100" r="6" fill="#1a1652" />
      </svg>
      <p className={`text-lg font-black -mt-2 ${zoneColor}`}>{zone}</p>
      {label && <p className="text-sm text-slate-500 text-center mt-1">{label}</p>}
    </div>
  )
}
