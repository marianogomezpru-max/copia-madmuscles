// Content-only data file for the Plano.Money lead quiz — the QuizEngine
// component is fully generic; a future quiz for another product/niche is
// just a new file like this one, no engine changes needed.
//
// The quiz's only job is to diagnose the person and hand them off to
// /oferta with that diagnosis attached (?p=<profile key>). No price, no
// bonuses, no checkout copy belongs here — that's all /oferta's job, so
// the two never say conflicting things and neither has to be updated
// twice when a price or bonus changes. It also stays a pure diagnosis
// start to finish: no mid-quiz "here's our product" pitch screens either,
// those broke the diagnostic frame and started to feel like a sales
// interruption. The one real screenshot of the app shows up exactly
// once, on the final result screen, alongside the diagnosis itself.

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
    title: '¿A dónde se fue mi plata este mes?',
    subtitle: 'Si te lo preguntaste más de una vez, no sos vos: es no tener un sistema. Respondé unas preguntas rápidas (menos de 2 minutos) y armamos tu Diagnóstico Financiero personalizado.',
    cta: 'Empezar mi diagnóstico →',
  },

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
        { value: 'mujer', label: 'Mujer', icon: '👩' },
        { value: 'hombre', label: 'Hombre', icon: '👨' },
        { value: 'prefiero_no_decir', label: 'Prefiero no decir', icon: '🙂' },
      ],
    },
    {
      type: 'question',
      key: 'situacion',
      question: '¿Cómo generás tus ingresos?',
      inputType: 'radio',
      options: [
        { value: 'empleo_fijo', label: 'Empleo fijo', sublabel: 'Sueldo mensual estable', icon: '💼' },
        { value: 'empleo_comision', label: 'Empleo fijo + comisión', sublabel: 'Sueldo base más variable según resultados', icon: '📈' },
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
    {
      type: 'loading',
      message: 'Armando tu Diagnóstico Financiero, {{name}}...',
      trust: 'Cruzando tus respuestas con el método Plano.Money',
      duration: 2200,
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
    // Última pantalla del quiz: el diagnóstico personalizado, con una
    // captura real de la app que respalda ese diagnóstico específico.
    // Ni precio ni bonos acá, eso es trabajo de /oferta a partir de este
    // punto.
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
    const bump = { ansioso: -12, frustrado: -8, culpa: -10, esperanzado: 10 }
    score += bump[answers.emocion] || 0
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
  // result step.
  computeProfile(answers) {
    if (answers.area_afectada === 'pareja') {
      return {
        key: 'pareja',
        title: 'El Equipo Desalineado',
        description: 'El dinero se volvió un tema de tensión en pareja o familia más que de números. Tu diagnóstico se enfoca en organizar las cuentas compartidas para bajar la fricción.',
        image: '/quiz-result-pareja.png',
        imageAlt: 'Pantalla real de Plano.Money agregando un integrante a la familia',
      }
    }
    if (answers.situacion === 'comerciante' || answers.situacion === 'independiente' || answers.situacion === 'empleo_comision') {
      return {
        key: 'ingreso_variable',
        title: 'El Ingreso Variable Sin Sistema',
        description: 'Tus ingresos cambian mes a mes, y hoy los administrás "a ojo". Tu diagnóstico se enfoca en crear un colchón que te dé estabilidad incluso en los meses flojos.',
        image: '/quiz-result-ingreso-variable.png',
        imageAlt: 'Pantalla real de Plano.Money con el resumen de gastos del mes',
      }
    }
    if (answers.emocion === 'culpa' || answers.acuerdo_gasto >= 4) {
      return {
        key: 'comprador_emocional',
        title: 'El Comprador Emocional',
        description: 'Gran parte de tus gastos responden a una emoción del momento, no a un plan. Tu diagnóstico se enfoca en identificar esos disparadores antes de que aparezcan.',
        image: '/quiz-result-emocional.png',
        imageAlt: 'Pantalla real de Plano.Money alertando un gasto por encima de lo presupuestado',
      }
    }
    return {
      key: 'reactivo',
      title: 'El Reactivo Sin Sistema',
      description: 'No te falta disciplina. Te falta un sistema simple que te muestre a dónde va tu plata sin esfuerzo.',
      image: '/quiz-result-reactivo.png',
      imageAlt: 'Pantalla real del panel principal de Plano.Money',
    }
  },
}
