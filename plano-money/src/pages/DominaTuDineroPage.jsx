import ContentGate from '../components/content/ContentGate.jsx'
import InteractiveEbookReader from '../components/content/InteractiveEbookReader.jsx'
import { DOMINA_TU_DINERO } from '../content/dominaTuDinero.js'

export default function DominaTuDineroPage() {
  return (
    <ContentGate slug={DOMINA_TU_DINERO.bookId}>
      <InteractiveEbookReader
        bookId={DOMINA_TU_DINERO.bookId}
        title={DOMINA_TU_DINERO.title}
        subtitle={DOMINA_TU_DINERO.subtitle}
        intro={DOMINA_TU_DINERO.intro}
        chapters={DOMINA_TU_DINERO.chapters}
      />
    </ContentGate>
  )
}
