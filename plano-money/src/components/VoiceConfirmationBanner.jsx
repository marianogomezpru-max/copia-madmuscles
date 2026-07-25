import { CheckCircle2 } from 'lucide-react'

export default function VoiceConfirmationBanner({ message }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
