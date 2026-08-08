import { useState } from 'react'
import { Mic } from 'lucide-react'
import { isSpeechSupported, listenOnce } from '../utils/speech.js'

export default function VoiceButton({ t, lang, onTranscript, className = '' }) {
  const [listening, setListening] = useState(false)

  const handleClick = async () => {
    if (!isSpeechSupported()) {
      alert(t.voiceNotSupported)
      return
    }
    setListening(true)
    try {
      const phrase = await listenOnce(lang)
      onTranscript(phrase)
    } catch (err) {
      // 'no-speech' / 'aborted' just mean the user didn't say anything or
      // cancelled — not worth interrupting them with an alert for that.
      if (err === 'not-allowed' || err === 'service-not-allowed') alert(t.voiceErrorPermission)
      else if (err === 'network') alert(t.voiceErrorNetwork)
      else if (err && err !== 'no-speech' && err !== 'aborted') alert(t.voiceErrorGeneric)
    } finally {
      setListening(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
        listening ? 'bg-red-50 border-red-200 text-red-600' : 'bg-brand-50 border-brand-100 text-brand-700 hover:bg-brand-100'
      } ${className}`}
    >
      <Mic className="w-3.5 h-3.5" /> {listening ? t.listeningBtn : t.dictateBtn}
    </button>
  )
}
