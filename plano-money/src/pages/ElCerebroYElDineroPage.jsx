import ContentGate from '../components/content/ContentGate.jsx'
import InteractiveEbookReader from '../components/content/InteractiveEbookReader.jsx'
import { EL_CEREBRO_Y_EL_DINERO } from '../content/elCerebroYElDinero.js'

export default function ElCerebroYElDineroPage() {
  return (
    <ContentGate slug={EL_CEREBRO_Y_EL_DINERO.bookId}>
      <InteractiveEbookReader
        bookId={EL_CEREBRO_Y_EL_DINERO.bookId}
        title={EL_CEREBRO_Y_EL_DINERO.title}
        subtitle={EL_CEREBRO_Y_EL_DINERO.subtitle}
        intro={EL_CEREBRO_Y_EL_DINERO.intro}
        chapters={EL_CEREBRO_Y_EL_DINERO.chapters}
      />
    </ContentGate>
  )
}
