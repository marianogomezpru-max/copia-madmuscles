// Content-only data file for the Plano.Money lead quiz — the QuizEngine
// component is fully generic; a future quiz for another product/niche is
// just a new file like this one, no engine changes needed.
//
// The quiz's only job is to diagnose the person and hand them off to
// /oferta with that diagnosis attached (?p=<profile key>&n=<first name>).
// No price, no bonuses, no checkout copy belongs here — that's all
// /oferta's job, so the two never say conflicting things and neither has
// to be updated twice when a price or bonus changes. It also stays a pure
// diagnosis start to finish: no mid-quiz "here's our product" pitch
// screens either, those broke the diagnostic frame and started to feel
// like a sales interruption. The one real screenshot of the app shows up
// exactly once, on the final result screen, alongside the diagnosis
// itself — the closest it gets to naming Plano.Money is the result
// screen's closing line, which is diagnosis continuity, not a pitch.

export const PLANO_MONEY_QUIZ = {
  quizId: 'plano-money',

  // Frase corta para completar "{{deseo}}" en cualquier texto del quiz
  // (ver 'projection' más abajo) según lo que la persona eligió como su
  // deseo — mantiene ese hilo emocional concreto hasta el final.
  deseoLabels: {
    viajar: 'viajar sin culpa',
    comprar: 'darte ese gusto importante',
    ahorrar: 'tener un colchón de ahorro',
    tranquilidad: 'vivir sin pensar en plata todo el tiempo',
  },

  landing: {
    kicker: 'Diagnóstico Financiero Gratuito',
    title: '¿Sentís que el dinero desaparece antes de terminar el mes?',
    subtitle: 'Si te lo preguntaste más de una vez, no sos vos: es no tener un sistema. Respondé unas preguntas rápidas (menos de 3 minutos) y armamos tu Diagnóstico Financiero personalizado.',
    cta: 'Empezar mi diagnóstico →',
  },

  steps: [
    {
      type: 'name',
      key: 'name',
      question: '¿Cómo te gustaría que te llamemos durante el diagnóstico?',
      subtitle: 'Así podemos hablarte directo, sin formalismos.',
      placeholder: 'Tu nombre',
    },
    {
      type: 'question',
      key: 'situacion',
      question: '{{name}}, ¿cómo generás tus ingresos?',
      inputType: 'radio',
      options: [
        { value: 'empleo_fijo', label: 'Sueldo fijo', sublabel: 'Ingreso mensual estable', icon: '💼' },
        { value: 'empleo_comision', label: 'Ingresos variables', sublabel: 'Sueldo base más comisión según resultados', icon: '📈' },
        { value: 'comerciante', label: 'Negocio propio', sublabel: 'Ventas que cambian mes a mes', icon: '🏪' },
        { value: 'independiente', label: 'Freelance', sublabel: 'Ingresos por proyecto', icon: '💻' },
      ],
    },
    {
      type: 'question',
      key: 'sobrante_mes',
      question: '¿Cuánto te queda normalmente a fin de mes?',
      inputType: 'radio',
      options: [
        { value: 'nada', label: 'Nada', sublabel: 'Llego justo o en rojo', icon: '😬' },
        { value: 'menos_10', label: 'Menos del 10%', sublabel: 'Casi no queda margen', icon: '😕' },
        { value: 'mas_20', label: 'Más del 20%', sublabel: 'Suelo tener margen', icon: '🙂' },
      ],
    },
    {
      type: 'question',
      key: 'ahorro_potencial',
      question: '¿Cuánto creés que ahorrarías si supieras exactamente en qué gastás?',
      inputType: 'radio',
      options: [
        { value: 'nada', label: 'Nada, ya controlo todo', icon: '🤷' },
        { value: '100', label: 'Unos US$ 100 por mes', icon: '💵' },
        { value: '300', label: 'Unos US$ 300 por mes', icon: '💰' },
        { value: 'no_se', label: 'No tengo ni idea', sublabel: 'Y eso ya dice algo', icon: '😅' },
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
        { value: 'esperanzado', label: 'Con esperanza', sublabel: 'Quiero cambiar y estoy dispuesto/a', icon: '🌱' },
        { value: 'tranquilo', label: 'Tranquilo/a', sublabel: 'No estoy mal, pero quiero mejorar', icon: '🙂' },
      ],
    },
    {
      type: 'question',
      key: 'dependientes',
      question: '¿Quién depende de tus ingresos?',
      inputType: 'radio',
      options: [
        { value: 'solo_yo', label: 'Solo yo', icon: '🧍' },
        { value: 'pareja', label: 'Mi pareja', icon: '👫' },
        { value: 'hijos', label: 'Mis hijos', icon: '👨‍👧‍👦' },
        { value: 'familia', label: 'Toda mi familia', icon: '👨‍👩‍👧‍👦' },
      ],
    },
    {
      type: 'question',
      key: 'objetivo_principal',
      question: '¿Qué querés lograr primero?',
      inputType: 'radio',
      options: [
        { value: 'deudas', label: 'Salir de deudas', icon: '📉' },
        { value: 'ahorrar', label: 'Ahorrar', icon: '💰' },
        { value: 'controlar_gastos', label: 'Controlar mis gastos', icon: '🎯' },
        { value: 'dejar_de_preocuparme', label: 'Dejar de preocuparme por la plata', icon: '😌' },
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
        { value: 'metas', label: 'Mis metas', sublabel: 'Viajar, comprar, ahorrar: todo se posterga', icon: '🎯' },
        { value: 'todo', label: 'Todo lo anterior', icon: '🌀' },
      ],
    },
    {
      type: 'question',
      key: 'deseo',
      question: 'Si tu situación financiera no fuera un problema, ¿qué es lo primero que harías?',
      inputType: 'radio',
      options: [
        { value: 'viajar', label: 'Viajar sin culpa', sublabel: 'Ese viaje que seguís posponiendo', icon: '🌴' },
        { value: 'comprar', label: 'Darte un gusto importante', sublabel: 'Auto, casa propia, un proyecto grande', icon: '🏠' },
        { value: 'ahorrar', label: 'Tener un colchón de ahorro', sublabel: 'Dormir tranquilo/a ante un imprevisto', icon: '💰' },
        { value: 'tranquilidad', label: 'Vivir sin pensar en plata todo el tiempo', icon: '😌' },
      ],
    },
    {
      type: 'agreement',
      key: 'acuerdo_gasto',
      statement: 'El dinero se me va y no sé bien en qué.',
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
      question: '¿Estás dispuesto/a a dedicarle 3 minutos por día durante 21 días?',
      inputType: 'radio',
      options: [
        { value: 'si', label: 'Sí, 100% comprometido/a', icon: '🔥' },
        { value: 'esfuerzo', label: 'Voy a hacer lo posible', icon: '💪' },
        { value: 'dudas', label: 'Tengo dudas sobre el tiempo', icon: '🤔' },
      ],
    },
    {
      type: 'trivia',
      key: 'trivia_anotar',
      question: '¿Sabías que anotar tus gastos es una de las formas más efectivas de dejar de gastar de más?',
      fact: 'Por eso el primer paso de tu diagnóstico es justamente ese: hacer visible a dónde va tu plata.',
    },
    {
      type: 'alert',
      title: '{{name}}, con base en tus respuestas...',
      items: [
        'El gasto hormiga (compras pequeñas sin registrar) suele representar entre el 10 y el 15% del sueldo mensual de quien no controla sus gastos.',
        'Vivir sin un fondo de emergencia significa que cualquier imprevisto se resuelve con deuda.',
        'La ansiedad financiera es una de las principales causas de discusión de pareja.',
      ],
      goodNews: 'Con un sistema simple, esto se revierte en semanas, no en años.',
      cta: 'Ver mi diagnóstico →',
    },
    // Pantalla de análisis en 3 etapas antes del resultado — sube el
    // valor percibido del diagnóstico. Deliberadamente sin ninguna cifra
    // de usuarios: no tenemos ese dato todavía, así que el copy se queda
    // en el proceso ("qué estamos haciendo con tus respuestas") en vez de
    // una estadística inventada.
    {
      type: 'loading',
      messages: [
        'Analizando tus respuestas, {{name}}...',
        'Aplicando el método Plano.Money...',
        'Detectando oportunidades de ahorro...',
      ],
      duration: 5000,
    },
    {
      type: 'gauge',
      title: '{{name}}, tu Salud Financiera hoy está en:',
      subtitle: 'Este es tu punto de partida. En 30 días con un sistema simple podés estar en zona verde.',
      cta: 'Ver mi proyección →',
    },
    {
      type: 'projection',
      title: 'Así se ve tu cambio, {{name}}',
      subtitle: 'Cuando empezás a tener el control real de tu dinero, para poder {{deseo}}.',
      cta: 'Continuar →',
    },
    {
      type: 'email',
      key: 'email',
      question: 'Dejanos tu mail para enviarte tu diagnóstico',
      note: 'Asegurate de que sea válido: ahí te llega también tu diagnóstico completo.',
      cta: 'Ver mi resultado →',
    },
    // Última pantalla del quiz: el diagnóstico personalizado, con los
    // problemas detectados (computeProfile().findings) y una captura real
    // de la app que respalda ese diagnóstico específico. Nombra a
    // Plano.Money como la recomendación (es el puente hacia /oferta) pero
    // sin precio, sin bono, sin nada de eso: esa parte sigue siendo
    // trabajo exclusivo de /oferta a partir de acá.
    {
      type: 'result',
      cta: 'Ver mi plan personalizado →',
    },
  ],

  // Heurística simple 0-100: arranca en 35 (justo entrando en zona
  // amarilla) y suma/resta según respuestas. El techo se limita a 60 a
  // propósito: nadie debería ver "Zona Verde" en el diagnóstico, esa zona
  // es la promesa de después de usar el sistema, no el punto de partida.
  computeScore(answers) {
    let score = 35
    const bump = { ansioso: -12, frustrado: -8, culpa: -10, esperanzado: 10, tranquilo: 6 }
    score += bump[answers.emocion] || 0
    if (answers.sobrante_mes === 'nada') score -= 8
    if (answers.sobrante_mes === 'mas_20') score += 8
    if (answers.acuerdo_gasto >= 4) score -= 10
    if (answers.acuerdo_gasto <= 2) score += 10
    if (answers.intentos_previos === 'nunca') score -= 5
    if (answers.compromiso === 'si') score += 8
    if (answers.compromiso === 'dudas') score -= 8
    if (answers.area_afectada === 'todo') score -= 6
    return Math.max(5, Math.min(60, Math.round(score)))
  },

  // `key` identifies which /oferta hero variant (PROFILE_HERO in
  // SalesPagePlanoMoney.jsx) picks up the thread after the quiz — keep
  // both in sync if a profile is added, renamed, or removed here. `image`
  // is the real app screenshot shown alongside the diagnosis on the
  // result step. `findings` are the 3 checkmarked problems shown on that
  // same screen, right before the diagnosis names Plano.Money as the
  // recommendation.
  computeProfile(answers) {
    if (answers.area_afectada === 'pareja') {
      return {
        key: 'pareja',
        title: 'El Equipo Desalineado',
        description: 'El dinero se volvió un tema de tensión en pareja o familia más que de números. Tu diagnóstico se enfoca en organizar las cuentas compartidas para bajar la fricción.',
        findings: [
          'No tenés un sistema compartido con tu pareja o familia.',
          'El dinero se convirtió en un tema de tensión, no de números.',
          'No existe una vista clara de quién gasta qué.',
        ],
        image: '/quiz-result-pareja.png',
        imageAlt: 'Pantalla real de Plano.Money agregando un integrante a la familia',
      }
    }
    if (answers.situacion === 'comerciante' || answers.situacion === 'independiente' || answers.situacion === 'empleo_comision') {
      return {
        key: 'ingreso_variable',
        title: 'El Ingreso Variable Sin Sistema',
        description: 'Tus ingresos cambian mes a mes, y hoy los administrás "a ojo". Tu diagnóstico se enfoca en crear un colchón que te dé estabilidad incluso en los meses flojos.',
        findings: [
          'No tenés un sistema para tus ingresos variables.',
          'Administrás tus gastos "a ojo", mes a mes.',
          'No existe un colchón para los meses flojos.',
        ],
        image: '/quiz-result-ingreso-variable.png',
        imageAlt: 'Pantalla real de Plano.Money con el resumen de gastos del mes',
      }
    }
    if (answers.emocion === 'culpa' || answers.acuerdo_gasto >= 4) {
      return {
        key: 'comprador_emocional',
        title: 'El Comprador Emocional',
        description: 'Gran parte de tus gastos responden a una emoción del momento, no a un plan. Tu diagnóstico se enfoca en identificar esos disparadores antes de que aparezcan.',
        findings: [
          'No tenés un sistema que te frene antes de gastar.',
          'Las compras por impulso se comen tu presupuesto.',
          'No existe un registro que te muestre el impacto real de cada gasto.',
        ],
        image: '/quiz-result-emocional.png',
        imageAlt: 'Pantalla real de Plano.Money alertando un gasto por encima de lo presupuestado',
      }
    }
    return {
      key: 'reactivo',
      title: 'El Reactivo Sin Sistema',
      description: 'No te falta disciplina. Te falta un sistema simple que te muestre a dónde va tu plata sin esfuerzo.',
      findings: [
        'No tenés un sistema.',
        'Tus gastos se registran después, nunca antes.',
        'No existe un presupuesto mensual real.',
      ],
      image: '/quiz-result-reactivo.png',
      imageAlt: 'Pantalla real del panel principal de Plano.Money',
    }
  },
}
