import ContentGate from '../components/content/ContentGate.jsx'
import Logo from '../components/Logo.jsx'
import Reto21Dias from '../components/resources/Reto21Dias.jsx'

const SLUG = 'bono-reto-21-dias'

function RetoStandalone() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="text-center py-2">
          <Logo className="w-14 h-14 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase text-brand-600">Bono</p>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">21 Días para Reprogramar tu Cerebro Financiero</h1>
        </div>
        <Reto21Dias />
      </div>
    </div>
  )
}

export default function BonoReto21DiasPage() {
  return (
    <ContentGate slug={SLUG}>
      <RetoStandalone />
    </ContentGate>
  )
}
