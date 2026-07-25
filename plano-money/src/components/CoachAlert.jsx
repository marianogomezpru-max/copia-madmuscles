import { AlertTriangle, Bot } from 'lucide-react'
import { formatMoney } from '../utils/format.js'

export default function CoachAlert({ t, alerts, lang }) {
  return (
    <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-start gap-3 sm:gap-4">
      <div className="p-2.5 sm:p-3 bg-white/15 rounded-xl shrink-0 backdrop-blur-md">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-100" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-xs sm:text-sm tracking-wide text-purple-100 uppercase mb-1">{t.coachAlert}</h3>
        {alerts.length > 0 ? (
          <div className="space-y-1.5">
            {alerts.map((alert, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start sm:items-center gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-finaraCardYellow shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  {t.coachOverspending
                    .replace('{amount}', formatMoney(alert.diff, lang))
                    .replace('{category}', alert.category)}
                </span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-200">{t.coachNormal}</p>
        )}
      </div>
    </div>
  )
}
