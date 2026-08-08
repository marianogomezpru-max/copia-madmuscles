import ContentGate from '../components/content/ContentGate.jsx'
import InteractiveEbookReader from '../components/content/InteractiveEbookReader.jsx'
import { DEL_SOMOS_DOS_AL_SOMOS_TRES } from '../content/delSomosDosAlSomosTres.js'

export default function DelSomosDosAlSomosTresPage() {
  return (
    <ContentGate slug={DEL_SOMOS_DOS_AL_SOMOS_TRES.bookId}>
      <InteractiveEbookReader
        bookId={DEL_SOMOS_DOS_AL_SOMOS_TRES.bookId}
        title={DEL_SOMOS_DOS_AL_SOMOS_TRES.title}
        subtitle={DEL_SOMOS_DOS_AL_SOMOS_TRES.subtitle}
        intro={DEL_SOMOS_DOS_AL_SOMOS_TRES.intro}
        chapters={DEL_SOMOS_DOS_AL_SOMOS_TRES.chapters}
      />
    </ContentGate>
  )
}
