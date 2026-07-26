import ContentGate from '../components/content/ContentGate.jsx'
import Logo from '../components/Logo.jsx'
import QuizComprador from '../components/resources/QuizComprador.jsx'

const SLUG = 'bono-quiz-comprador'

function QuizStandalone() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="text-center py-2">
          <Logo className="w-14 h-14 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase text-brand-600">Bono</p>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">¿Qué Comprador Eres?</h1>
        </div>
        <QuizComprador />
      </div>
    </div>
  )
}

export default function BonoQuizCompradorPage() {
  return (
    <ContentGate slug={SLUG}>
      <QuizStandalone />
    </ContentGate>
  )
}
