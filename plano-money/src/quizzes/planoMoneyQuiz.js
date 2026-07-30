// Content-only data file for the Plano.Money lead quiz — the QuizEngine
// component is fully generic; a future quiz for another product/niche is
// just a new file like this one, no engine changes needed.
//
// The quiz is the sales page: all traffic starts here. Its final step
// hands off to /oferta (SalesPagePlanoMoney) — the richer offer-reveal
// page — which is the one that links out to the real Hotmart checkout.

export const PLANO_MONEY_QUIZ = {
  quizId: 'plano-money',

  landing: {
    kicker: 'Diagnóstico Financiero Gratuito',
    title: '¿A dónde se fue mi plata este mes?',
    subtitle: 'Si te lo preguntaste más de una vez, no sos vos: es no tener un sistema. Respondé unas preguntas rápidas (menos de 2 minutos) y armamos tu Diagnóstico Financiero personalizado.',
    cta: 'Empezar mi diagnóstico →',
  },

  valueStack: [
    { label: 'Diagnóstico financiero personalizado', value: '$15' },
    { label: 'Bono: ¿Qué Comprador Eres?', value: '$9' },
    { label: 'Bono: 21 Días para Reprogramar tu Cerebro Financiero', value: '$12' },
    { label: 'Bono: Piensa Antes de Comprar', value: '$8' },
  ],

  steps: [
    {
      type: 'name',
      key: 'name',
      question: '¿Cómo te llamás?',
      subtitle: 'Así personalizamos tu diagnóstico de acá en adelante.',
      placeholder: 'Tu nombre',
    },
    {
      type: 'question',
      key: 'genero',
      question: '{{name}}, ¿sos...?',
      inputType: 'radio',
      options: [
        { value: 'mujer', label: 'Mujer', sublabel: 'Tendencia a sentir culpa por cada gasto', icon: '👩' },
        { value: 'hombre', label: 'Hombre', sublabel: 'Tendencia a evitar mirar el problema de frente', icon: '👨' },
        { value: 'prefiero_no_decir', label: 'Prefiero no decir', sublabel: '', icon: '🙂' },
      ],
    },
    {
      type: 'question',
      key: 'situacion',
      question: '¿Cómo generás tus ingresos?',
      inputType: 'radio',
      options: [
        { value: 'empleo_fijo', label: 'Empleo fijo', sublabel: 'Sueldo mensual estable', icon: '💼' },
        { value: 'comerciante', label: 'Soy comerciante o tengo un negocio', sublabel: 'Ventas que varían mes a mes', icon: '🏪' },
        { value: 'independiente', label: 'Trabajo independiente', sublabel: 'Ingresos variables por proyecto', icon: '💻' },
      ],
    },
    {
      type: 'question',
      key: 'emocion',
      question: '¿Cómo te sentís hoy con tu situación financiera?',
      inputType: 'radio',
      options: [
        { value: 'ansioso', label: 'Ansioso/a', sublabel: 'Pienso en la plata más de lo que quisiera', icon: '😰' },
        { value: 'frustrado', label: 'Frustrado/a', sublabel: 'Gano lo suficiente pero nunca me alcanza', icon: '😤' },
        { value: 'culpa', label: 'Con culpa', sublabel: 'Me arrepiento de compras que hago', icon: '😓' },
        { value: 'esperanzado', label: 'Con esperanza', sublabel: 'Quiero cambiar y estoy dispuesto/a', icon: '🙂' },
      ],
    },
    {
      type: 'question',
      key: 'area_afectada',
      question: '¿Dónde más te está pesando el tema plata?',
      inputType: 'radio',
      options: [
        { value: 'pareja', label: 'Mi pareja o familia', sublabel: 'Discutimos o hay tensión por el dinero', icon: '👨‍👩‍👧' },
        { value: 'tranquilidad', label: 'Mi tranquilidad personal', sublabel: 'Vivo con ansiedad de no saber si me alcanza', icon: '🧘' },
        { value: 'metas', label: 'Mis metas', sublabel: 'Viajar, comprar, ahorrar — todo se posterga', icon: '🎯' },
        { value: 'todo', label: 'Todo lo anterior', sublabel: '', icon: '🌀' },
      ],
    },
    {
      type: 'agreement',
      key: 'acuerdo_gasto',
      statement: 'El dinero se me va y no sé bien en qué.',
    },
    // Mini-pitch contextual — una variante por cada opción de "area_afectada".
    {
      type: 'pitch',
      showIf: { key: 'area_afectada', equals: 'pareja' },
      title: 'Plano.Money resuelve justo esto',
      body: 'Compartís las cuentas con tu pareja o tu familia — cada uno ve lo suyo, sin señalar con el dedo.',
      mockupLabel: 'Perfiles compartidos',
      cta: 'Seguir →',
    },
    {
      type: 'pitch',
      showIf: { key: 'area_afectada', equals: 'tranquilidad' },
      title: 'Plano.Money resuelve justo esto',
      body: 'Sabés, de un vistazo, cuánto tenés disponible hoy — sin esa sensación de no saber si te alcanza.',
      mockupLabel: 'Resumen del mes',
      cta: 'Seguir →',
    },
    {
      type: 'pitch',
      showIf: { key: 'area_afectada', equals: 'metas' },
      title: 'Plano.Money resuelve justo esto',
      body: 'Definís tu meta en la app y ves cuánto llevás ahorrado cada semana — dejás de posponerla "para cuando sobre".',
      mockupLabel: 'Metas de ahorro',
      cta: 'Seguir →',
    },
    {
      type: 'pitch',
      showIf: { key: 'area_afectada', equals: 'todo' },
      title: 'No estás solo/a',
      body: 'Es la combinación más común. Plano.Money ataca las tres cosas a la vez: organiza tus gastos, tu ahorro y lo que compartís con tu familia, todo en un solo lugar.',
      mockupLabel: 'Plano.Money — vista general',
      cta: 'Seguir →',
    },
    {
      type: 'question',
      key: 'intentos_previos',
      question: '¿Ya intentaste ordenar tus finanzas antes?',
      inputType: 'radio',
      options: [
        { value: 'nunca', label: 'Nunca lo intenté', sublabel: 'Quiero empezar de cero', icon: '🌱' },
        { value: 'excel', label: 'Usé una planilla de Excel', sublabel: 'La abandoné a las pocas semanas', icon: '📊' },
        { value: 'otra_app', label: 'Probé otra app', sublabel: 'La dejé de usar', icon: '📱' },
        { value: 'cuaderno', label: 'Voy anotando en un cuaderno', sublabel: 'Sin ningún sistema', icon: '📓' },
      ],
    },
    {
      type: 'question',
      key: 'compromiso',
      question: '¿Estás dispuesto/a a dedicarle 5 minutos por día durante 21 días?',
      inputType: 'radio',
      options: [
        { value: 'si', label: 'Sí, 100% comprometido/a', sublabel: '', icon: '🔥' },
        { value: 'esfuerzo', label: 'Voy a hacer lo posible', sublabel: '', icon: '💪' },
        { value: 'dudas', label: 'Tengo dudas sobre el tiempo', sublabel: '', icon: '🤔' },
      ],
    },
    {
      type: 'trivia',
      key: 'trivia_anotar',
      question: '¿Sabías que anotar tus gastos es una de las formas más efectivas de dejar de gastar de más?',
      fact: 'Por eso el primer paso de tu plan va a ser justamente ese: hacer visible a dónde va tu plata.',
    },
    {
      type: 'alert',
      title: '{{name}}, con base en tus respuestas...',
      items: [
        'El gasto hormiga (compras pequeñas sin registrar) suele representar entre el 10 y 15% del sueldo mensual de quien no controla sus gastos.',
        'Vivir sin un fondo de emergencia significa que cualquier imprevisto se resuelve con deuda.',
        'La ansiedad financiera es una de las principales causas de discusión de pareja.',
      ],
      goodNews: 'La buena noticia: con un sistema simple, esto se revierte en semanas, no en años.',
      cta: 'Ver mi diagnóstico →',
    },
    {
      type: 'loading',
      message: 'Armando tu Diagnóstico Financiero...',
      trust: 'Cruzando tus respuestas con el método Plano.Money',
      duration: 2200,
    },
    {
      type: 'gauge',
      title: '{{name}}, tu Salud Financiera hoy está en:',
      subtitle: 'Este es tu punto de partida. En 30 días con Plano.Money podés estar en zona verde.',
      cta: 'Ver mi proyección →',
    },
    {
      type: 'projection',
      title: 'Así se ve el cambio',
      subtitle: 'Cuando empezás a tener el control real de tu dinero.',
      cta: 'Continuar →',
    },
    {
      type: 'email',
      key: 'email',
      question: 'Dejanos tu mail para enviarte tu diagnóstico',
      note: 'Asegurate de que sea válido — ahí te llega también tu bono sorpresa.',
      cta: 'Ver mi resultado →',
    },
    {
      type: 'result',
      cta: 'Quiero mi plan →',
    },
    {
      type: 'scratch',
      title: 'Rascá y descubrí tu descuento',
      discountLabel: '50%',
      cta: 'Continuar →',
    },
    {
      type: 'salesPage',
      kicker: 'Tu diagnóstico está listo',
      title: 'Empezá a controlar tu dinero desde hoy',
      subtitle: 'Plano.Money organiza tus gastos, tu ahorro y tus metas — en menos de 5 minutos por día.',
      bullets: [
        'Control total de tus gastos e ingresos, sin planillas ni anotar nada a mano.',
        'Perfiles para tu pareja o tu familia, cada uno viendo lo que le corresponde.',
        'Metas de ahorro que sí podés cumplir, paso a paso.',
        'Acceso inmediato desde tu celular, apenas confirmás la compra.',
        'Incluye 3 bonos interactivos sin costo adicional.',
      ],
      guarantee: '7 días de garantía. Si Plano.Money no te ayuda a ordenar tus finanzas, te devolvemos tu dinero.',
      originalPrice: 'US$ 5.99/mes',
      price: '50% OFF con tu código',
      cta: 'Empezar ahora →',
      checkoutUrl: '/oferta',
      faq: [
        { q: '¿Cuándo se aplica mi descuento?', a: 'Se aplica automáticamente al hacer clic en "Empezar ahora" — no necesitás ingresar ningún código.' },
        { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin permanencia mínima. Cancelás desde tu cuenta cuando quieras.' },
        { q: '¿Es seguro pagar acá?', a: 'El pago se procesa a través de Hotmart, con los mismos estándares de seguridad de cualquier compra online.' },
      ],
      disclaimer: 'Plano.Money es una herramienta de organización financiera personal. No constituye asesoría financiera profesional ni garantiza resultados de ahorro específicos — estos dependen de las decisiones y hábitos de cada usuario.',
    },
  ],

  // Heurística simple 0-100: arranca en 55 y suma/resta según respuestas.
  computeScore(answers) {
    let score = 55
    const bump = { ansioso: -15, frustrado: -10, culpa: -12, esperanzado: 5 }
    score += bump[answers.emocion] || 0
    if (answers.acuerdo_gasto >= 4) score -= 12
    if (answers.acuerdo_gasto <= 2) score += 8
    if (answers.intentos_previos === 'nunca') score -= 5
    if (answers.compromiso === 'si') score += 10
    if (answers.compromiso === 'dudas') score -= 5
    if (answers.area_afectada === 'todo') score -= 8
    return Math.max(5, Math.min(95, Math.round(score)))
  },

  computeProfile(answers) {
    if (answers.area_afectada === 'pareja') {
      return {
        title: 'El Equipo Desalineado',
        description: 'El dinero se volvió un tema de tensión en pareja o familia más que de números. Tu plan se enfoca en organizar las cuentas compartidas para bajar la fricción.',
      }
    }
    if (answers.situacion === 'comerciante' || answers.situacion === 'independiente') {
      return {
        title: 'El Ingreso Variable Sin Sistema',
        description: 'Tus ingresos cambian mes a mes, y hoy los administrás "a ojo". Tu plan se enfoca en crear un colchón que te dé estabilidad incluso en los meses flojos.',
      }
    }
    if (answers.emocion === 'culpa' || answers.acuerdo_gasto >= 4) {
      return {
        title: 'El Comprador Emocional',
        description: 'Gran parte de tus gastos responden a una emoción del momento, no a un plan. Tu plan se enfoca en identificar esos disparadores antes de que aparezcan.',
      }
    }
    return {
      title: 'El Reactivo Sin Sistema',
      description: 'No te falta disciplina — te falta un sistema simple que te muestre a dónde va tu plata sin esfuerzo. Es exactamente lo que Plano.Money hace por vos.',
    }
  },
}
