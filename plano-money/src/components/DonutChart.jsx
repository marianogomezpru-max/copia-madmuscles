import { useState } from 'react'
import { GROUPS, GROUP_COLORS } from '../constants.js'
import { formatCurrency } from '../utils/format.js'

const SIZE = 220
const STROKE = 34
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 3

export default function DonutChart({ t, totalsByGroup, total, lang }) {
  const [hovered, setHovered] = useState(null)

  const segments = GROUPS.map(g => ({ group: g, value: totalsByGroup[g] || 0 })).filter(s => s.value > 0)

  if (total <= 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-sm text-slate-400">
        {t.noExpensesInPeriod}
      </div>
    )
  }

  let offset = 0
  const arcs = segments.map(seg => {
    const length = Math.max(0, (seg.value / total) * CIRCUMFERENCE - GAP)
    const arc = { ...seg, length, offset }
    offset += (seg.value / total) * CIRCUMFERENCE
    return arc
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--donut-track)" strokeWidth={STROKE} />
            {arcs.map(arc => (
              <circle
                key={arc.group}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={GROUP_COLORS[arc.group].light}
                strokeWidth={hovered === arc.group ? STROKE + 6 : STROKE}
                strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="round"
                onMouseEnter={() => setHovered(arc.group)}
                onMouseLeave={() => setHovered(null)}
                style={{ transition: 'stroke-width 0.15s ease', cursor: 'pointer' }}
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered ? (
            <>
              <span className="text-xs font-bold text-slate-400 uppercase">{t.groups[hovered]}</span>
              <span className="text-lg font-black text-slate-900">${formatCurrency(totalsByGroup[hovered], lang)}</span>
              <span className="text-xs text-slate-400">{Math.round((totalsByGroup[hovered] / total) * 100)}%</span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-400 uppercase">{t.cards.expenses}</span>
              <span className="text-lg font-black text-slate-900">${formatCurrency(total, lang)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {arcs.map(arc => (
          <div
            key={arc.group}
            onMouseEnter={() => setHovered(arc.group)}
            onMouseLeave={() => setHovered(null)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${hovered === arc.group ? 'bg-slate-100' : ''}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: GROUP_COLORS[arc.group].light }} />
              <span className="text-sm font-semibold text-slate-700 truncate">{t.groups[arc.group]}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-slate-900">${formatCurrency(arc.value, lang)}</span>
              <span className="text-xs text-slate-400 w-10 text-right">{Math.round((arc.value / total) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
