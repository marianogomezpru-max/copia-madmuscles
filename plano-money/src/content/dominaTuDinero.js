export const DOMINA_TU_DINERO = {
  bookId: 'domina-tu-dinero',
  title: 'Domina Tu Dinero',
  subtitle: 'El método práctico para organizar tus finanzas, eliminar deudas, ahorrar e invertir con inteligencia, aunque tus ingresos cambien cada mes.',
  intro: [
    'Si alguna vez has sentido que el dinero desaparece sin saber en qué lo gastaste, que trabajas mucho pero nunca logras ahorrar, o que cada fin de mes se convierte en una carrera contra el tiempo para pagar las cuentas, quiero que sepas algo: no estás solo.',
    'Millones de personas viven exactamente la misma situación. No porque sean irresponsables o porque no trabajen lo suficiente, sino porque nadie les enseñó a administrar su dinero.',
    'La buena noticia es que administrar bien el dinero no depende únicamente de cuánto ganas. La diferencia no está en el salario, sino en los hábitos, las decisiones y el sistema que utilizan para manejar su dinero.',
    'No importa si hoy empiezas desde cero, si tienes deudas, si tus ingresos cambian cada mes o si has cometido errores financieros en el pasado. Lo único que realmente importa es la decisión que estás tomando hoy: aprender a dominar tu dinero para que el dinero deje de dominar tu vida.',
  ],
  chapters: [
    {
      title: 'La mentalidad que construye riqueza',
      hook: 'Todo comienza en tu mente.',
      body: [
        { paragraphs: [
          'Imagina a dos personas que ganan exactamente lo mismo. Cinco años después, una vive tranquila, tiene ahorros, pocas deudas y está construyendo un patrimonio. La otra continúa preocupada por llegar a fin de mes y siente que nunca avanza.',
          'La diferencia no fue la suerte ni el salario. Estuvo en la manera en que cada una administró su dinero y en las decisiones que tomó día tras día. La riqueza no suele construirse con un golpe de suerte. Se construye con hábitos constantes, decisiones inteligentes y una mentalidad orientada al largo plazo.',
        ]},
        { heading: 'Los mitos que nos impiden avanzar', paragraphs: [
          'Muchas personas crecieron escuchando frases como "el dinero es la raíz de todos los problemas" o "invertir es solo para personas millonarias". Con el tiempo, estas frases se convierten en creencias que influyen en nuestras decisiones.',
          'La realidad es distinta: el dinero no es bueno ni malo, es una herramienta. En manos de una persona responsable, puede brindar tranquilidad, oportunidades y libertad.',
        ]},
        { heading: 'La riqueza es un hábito', paragraphs: [
          'No importa si hoy tus ingresos son altos o bajos. Lo importante es crear hábitos financieros saludables: registrar tus gastos, ahorrar antes de gastar, evitar compras impulsivas, tener objetivos claros y pensar antes de endeudarte. Ninguno de estos hábitos requiere ganar más dinero — solo requieren disciplina.',
        ]},
        { heading: 'El poder del interés compuesto en los hábitos', paragraphs: [
          'Las pequeñas decisiones repetidas durante mucho tiempo producen grandes resultados. No necesitas ahorrar miles de dólares cada mes para comenzar. Necesitás empezar. Un café diario, una suscripción que no utilizás o compras impulsivas parecen insignificantes por separado, pero juntas pueden representar una parte importante de tu presupuesto anual.',
        ]},
      ],
      caseStudy: { name: 'Carlos, el freelancer', text: 'Carlos trabaja como diseñador gráfico y sus ingresos cambian cada mes. Cuando recibía un buen pago, gastaba casi todo. Después de analizar sus hábitos, decidió registrar todos sus ingresos, ahorrar un porcentaje de cada pago antes de gastar y evitar compras impulsivas durante 24 horas antes de decidir. Un año después había eliminado la mayor parte de sus deudas y creado un fondo de emergencia. No ganó más dinero. Aprendió a administrarlo mejor.' },
      commonError: 'Muchas personas esperan sentirse motivadas para comenzar. La realidad es que primero se actúa y después aparece la motivación. No esperes el momento perfecto.',
      expertTip: 'No intentes cambiar toda tu vida financiera en una sola semana. Elegí un solo hábito, practicalo durante 30 días, y cuando se convierta en costumbre, agregá el siguiente.',
      exercise: {
        fields: [
          { label: '¿Qué creencia sobre el dinero aprendiste durante tu infancia?', type: 'textarea' },
          { label: '¿Esa creencia te ayuda o te limita?', type: 'text' },
          { label: '¿Qué hábito financiero querés comenzar desde hoy?', type: 'text' },
          { label: '¿Qué gasto innecesario podés eliminar este mes?', type: 'text' },
        ],
      },
      keyIdeas: [
        'La riqueza comienza en la forma de pensar.',
        'El dinero es una herramienta, no un enemigo.',
        'Los hábitos pequeños producen grandes resultados.',
        'Administrar bien el dinero es más importante que ganar mucho.',
      ],
      quote: 'No se trata de cuánto dinero ganas, sino de cuánto conservas, cómo lo administras y cómo haces que trabaje para construir el futuro que deseas.',
    },
    {
      title: 'Conoce realmente tus finanzas',
      hook: 'No podés mejorar lo que no conocés.',
      body: [
        { paragraphs: [
          'Muchas personas creen que tienen problemas financieros porque ganan poco. Sin embargo, al revisar sus cuentas descubren que el verdadero problema no es el ingreso, sino el desconocimiento de cómo lo administran. La mayoría sabe cuánto gana, pero muy pocos saben cuánto gastan realmente.',
        ]},
        { heading: 'Haz una radiografía de tu dinero', paragraphs: [
          'Antes de crear un presupuesto necesitás responder cuatro preguntas fundamentales: ¿Cuánto dinero entra cada mes? ¿Cuánto dinero sale? ¿En qué se está gastando? ¿Cuál es tu patrimonio actual?',
        ]},
        { heading: 'Descubre en qué se va tu dinero', paragraphs: [
          'Clasificá tus gastos en fijos (vivienda, servicios, transporte), variables (supermercado, entretenimiento, ropa) y "gastos hormiga" — pequeños gastos diarios que parecen insignificantes pero, sumados, representan una cantidad importante. Un gasto de $5 al día equivale aproximadamente a $150 al mes y $1.825 al año.',
        ]},
        { heading: 'Calculá tu patrimonio', paragraphs: [
          'El patrimonio representa todo lo que poseés menos todo lo que debés: Activos − Pasivos = Patrimonio. Este número es tu punto de partida — tu objetivo será hacerlo crecer año tras año.',
        ]},
      ],
      caseStudy: { name: 'Ana y Miguel', text: 'Estaban convencidos de que necesitaban ganar más dinero. Durante un mes anotaron absolutamente todos sus gastos y descubrieron que gastaban más de $350 mensuales en compras impulsivas y comidas fuera de casa. Sin aumentar sus ingresos, lograron ahorrar ese mismo monto cada mes simplemente reorganizando sus prioridades.' },
      commonError: 'No revisar los estados de cuenta, no registrar los gastos pequeños, y confiar solo en la memoria para controlar el dinero.',
      expertTip: 'Dedicá 15 minutos cada semana a revisar tus movimientos financieros. Es mucho más fácil corregir pequeños desvíos semanalmente que intentar solucionar grandes problemas al final del mes.',
      exercise: {
        fields: [
          { label: 'Ingresos mensuales', type: 'money' },
          { label: 'Gastos mensuales', type: 'money' },
          { label: 'Flujo de efectivo (ingresos − gastos)', type: 'money' },
          { label: 'Total de activos', type: 'money' },
          { label: 'Total de pasivos', type: 'money' },
          { label: 'Patrimonio actual', type: 'money' },
          { label: 'Tres acciones que realizarás esta semana para conocer mejor tus finanzas', type: 'textarea' },
        ],
      },
      keyIdeas: [
        'No podés administrar lo que no conocés.',
        'Registrar tus ingresos y gastos te da control.',
        'El flujo de efectivo muestra si estás avanzando o retrocediendo.',
        'El patrimonio refleja tu progreso financiero real.',
      ],
      quote: 'El dinero deja de ser un problema cuando dejas de ignorarlo y comenzás a medirlo.',
    },
    {
      title: 'El sistema para administrar cualquier ingreso',
      hook: 'El problema no es cuánto ganás, sino qué hacés con lo que recibís.',
      body: [
        { paragraphs: [
          'Existe una creencia muy común: "Cuando gane más dinero, comenzaré a organizar mis finanzas." Pero muchas personas aumentan sus ingresos y, al mismo tiempo, aumentan sus gastos — a esto se le conoce como inflación del estilo de vida.',
        ]},
        { heading: 'Primero pagate a vos mismo', paragraphs: [
          'La mayoría sigue este orden: recibe dinero, paga cuentas, gasta, y si sobra algo, ahorra. El problema es que casi nunca sobra. Las personas con mejores hábitos hacen lo contrario: reciben dinero, apartan una parte para su futuro, pagan sus compromisos, y gastan lo restante de manera consciente.',
        ]},
        { heading: 'El Método Domina tu Dinero: 5 categorías', list: [
          'Gastos esenciales (50%) — vivienda, alimentación, transporte, salud.',
          'Objetivos financieros y ahorro (20%) — fondo de emergencia, metas, inversiones futuras.',
          'Pago de deudas (15%) — reducí primero las de mayor interés.',
          'Crecimiento personal (10%) — cursos, libros, herramientas de trabajo.',
          'Disfrutar la vida (5%) — salidas, hobbies, gustos sin culpa.',
        ]},
        { paragraphs: [
          'Este sistema también funciona con ingresos variables: los porcentajes se aplican cada vez que recibís un pago, sin importar el monto. Automatizá el ahorro con una transferencia automática cada vez que recibas ingresos, para no depender solo de la disciplina.',
        ]},
      ],
      caseStudy: { name: 'Laura, emprendedora', text: 'Sus ventas cambiaban cada mes. Antes administraba el dinero "de memoria": gastaba en las buenas temporadas y pedía préstamos en las malas. Al aplicar el Método Domina tu Dinero, distribuyendo cada pago según los porcentajes, logró crear un fondo de emergencia, reducir sus deudas y eliminar la ansiedad de las ventas bajas. Sus ingresos siguieron siendo variables — lo que cambió fue su sistema.' },
      commonError: 'Elaborar un presupuesto únicamente cuando hay problemas económicos. El presupuesto debe usarse tanto en épocas buenas como difíciles.',
      expertTip: 'Cada aumento de ingresos es una oportunidad. En vez de gastar todo el incremento, destiná al menos la mitad a tus objetivos financieros.',
      exercise: {
        fields: [
          { label: 'Gastos esenciales (50% de tu ingreso actual)', type: 'money' },
          { label: 'Ahorro (20%)', type: 'money' },
          { label: 'Pago de deudas (15%)', type: 'money' },
          { label: 'Crecimiento personal (10%)', type: 'money' },
          { label: 'Disfrutar (5%)', type: 'money' },
          { label: '¿Qué categoría necesita más atención en este momento?', type: 'text' },
        ],
      },
      keyIdeas: [
        'Un buen sistema funciona con ingresos altos, bajos o variables.',
        'Ahorrar debe ser una prioridad, no una consecuencia.',
        'Administrar porcentajes es más simple que administrar montos fijos.',
        'La constancia supera a la perfección.',
      ],
      quote: 'La libertad financiera no comienza cuando ganás más dinero; comienza el día en que decidís darle un propósito a cada dólar que entra en tus manos.',
    },
    {
      title: 'Cómo vivir tranquilo aunque tus ingresos cambien',
      hook: 'La incertidumbre no tiene por qué convertirse en estrés.',
      body: [
        { paragraphs: [
          'Si sos emprendedor, freelancer o trabajás por comisiones, seguramente conocés la sensación de un mes bueno seguido de uno flojo. La buena noticia es que el problema no son los ingresos variables — es administrarlos como si fueran fijos.',
        ]},
        { heading: 'Identificá tu ingreso base', paragraphs: [
          'Revisá tus ingresos de los últimos doce meses y anotá el más bajo. Ese será tu "ingreso base" — tus gastos fijos deberían poder cubrirse con esa cantidad. Todo lo que ingrese por encima es un excedente para fortalecer tu fondo de emergencia, pagar deudas o invertir.',
        ]},
        { heading: 'Creá un colchón financiero', paragraphs: [
          'Durante los meses buenos, depositá una parte del excedente en una cuenta de estabilidad. Durante los meses flojos, usá ese dinero para completar tu presupuesto. Diversificar tus fuentes de ingreso también reduce el riesgo de depender de una sola.',
        ]},
      ],
      caseStudy: { name: 'Miguel, fotógrafo independiente', text: 'Organizaba su vida según los meses de mayor trabajo, aumentando sus gastos cuando ganaba más. En temporada baja recurría a préstamos. Después de implementar un ingreso base y una cuenta de estabilidad, enfrentó una temporada baja sin endeudarse. Sus ingresos siguieron siendo variables. Su tranquilidad ya no.' },
      commonError: 'Gastar más solo porque este mes ganaste más. Los ingresos extraordinarios no deben convertirse automáticamente en gastos extraordinarios.',
      expertTip: 'Cada vez que recibas un ingreso superior al habitual, preguntate: ¿cómo puede este dinero mejorar mi futuro, además de resolver mis necesidades de hoy?',
      exercise: {
        fields: [
          { label: 'Mi ingreso mensual más bajo (de los últimos 12 meses)', type: 'money' },
          { label: 'Mis gastos fijos mensuales', type: 'money' },
          { label: '¿Puedo cubrir mis gastos esenciales con mi ingreso base?', type: 'checkboxGroup', options: ['Sí', 'No'] },
          { label: 'Cuánto empezaré a ahorrar cada mes para mi cuenta de estabilidad', type: 'money' },
        ],
      },
      keyIdeas: [
        'Los ingresos variables no son el problema; la falta de planificación sí.',
        'Organizá tu presupuesto usando tu ingreso base.',
        'Aprovechá los meses buenos para fortalecer los meses difíciles.',
        'Diversificar tus ingresos aumenta tu seguridad.',
      ],
      quote: 'La verdadera tranquilidad financiera no consiste en ganar lo mismo todos los meses, sino en tener un sistema que funcione incluso cuando los ingresos cambian.',
    },
    {
      title: 'El método para eliminar las deudas',
      hook: 'Las deudas no desaparecen solas, pero sí pueden tener un final.',
      body: [
        { paragraphs: [
          'No todas las deudas son iguales: existen las que generan valor (una vivienda, un préstamo para estudiar) y las deudas de consumo (compras impulsivas, vacaciones financiadas) — estas últimas son las más peligrosas y el objetivo es eliminarlas lo antes posible.',
        ]},
        { heading: 'El primer paso: dejá de crear nuevas deudas', paragraphs: [
          'Es como intentar llenar un balde con agua mientras tiene un agujero en el fondo. Antes de acelerar el pago, evitá compras impulsivas y reducí el uso del crédito para gastos cotidianos.',
        ]},
        { heading: 'El método de la avalancha', paragraphs: [
          'Continuá pagando el mínimo en todas tus deudas, y destiná todo el dinero adicional a la de mayor tasa de interés. Cuando esa desaparezca, atacá la siguiente. Cada deuda eliminada libera más dinero para acelerar el pago de la próxima — como una bola de nieve enfocada en ahorrar intereses.',
        ]},
        { paragraphs: [
          'Antes de aceptar condiciones, negociá: pedí una reducción de la tasa de interés o preguntá por planes de refinanciamiento. Y cuidado con la consolidación de deudas — solo conviene si realmente reduce el costo financiero total.',
        ]},
      ],
      caseStudy: { name: 'Sofía y Daniel', text: 'Acumulaban cuatro tarjetas de crédito y un préstamo, pagando siempre el mínimo. Decidieron eliminar primero la tarjeta con mayor interés y dejaron de financiar compras de consumo, destinando cada ingreso adicional a esa deuda. En dieciocho meses eliminaron todas sus tarjetas.' },
      commonError: 'Pagar solo el monto mínimo de la tarjeta de crédito — prolonga la deuda y aumenta considerablemente los intereses.',
      expertTip: 'Si recibís un ingreso extraordinario (bono, comisión, reembolso), destiná una parte importante al pago de tus deudas antes de pensar en nuevos gastos.',
      exercise: {
        title: 'Tu inventario de deudas',
        fields: [
          { label: 'Deuda 1 — Saldo / Interés', type: 'text' },
          { label: 'Deuda 2 — Saldo / Interés', type: 'text' },
          { label: 'Deuda 3 — Saldo / Interés', type: 'text' },
          { label: '¿Cuál será la primera deuda que eliminarás?', type: 'text' },
          { label: '¿Cuánto dinero adicional podés destinar cada mes para acelerar su pago?', type: 'money' },
        ],
      },
      keyIdeas: [
        'No todas las deudas son iguales.',
        'Dejá de generar nuevas deudas antes de eliminar las actuales.',
        'Priorizá las deudas con mayor costo financiero.',
        'Cada deuda eliminada libera dinero para construir tu patrimonio.',
      ],
      quote: 'Cada deuda que eliminás no solo mejora tus finanzas; también recupera una parte de tu tranquilidad y te acerca a la libertad de decidir sobre tu futuro.',
    },
    {
      title: 'Aprendé a ahorrar sin dejar de vivir',
      hook: 'Ahorrar no significa dejar de disfrutar.',
      body: [
        { paragraphs: [
          'La diferencia entre una persona que siempre está preocupada por el dinero y otra que vive con tranquilidad no suele estar en cuánto gana, sino en el hábito de separar una parte de sus ingresos para su futuro. El ahorro no es el dinero que sobra al final del mes — es el dinero que decidís proteger desde el principio.',
        ]},
        { heading: 'Pagate primero', paragraphs: [
          'Cada vez que recibas dinero, apartá primero el porcentaje destinado al ahorro. No importa si comenzás con un 5%, un 10% o un 20%. Lo importante es que el ahorro ocurra antes de empezar a gastar.',
        ]},
        { heading: 'Dale un propósito a cada ahorro', paragraphs: [
          'Guardar dinero "por si acaso" es poco motivador. Cuando cada ahorro tiene un objetivo concreto (fondo de emergencia, viajes, vivienda, jubilación), mantener el hábito resulta mucho más fácil. Separá tus recursos en cuentas distintas para cada objetivo, y automatizá una transferencia cada vez que recibas ingresos.',
        ]},
      ],
      caseStudy: { name: 'Andrea', text: 'Siempre decía que no podía ahorrar porque "todo estaba muy caro". Después de revisar sus gastos descubrió varias suscripciones que casi no usaba y compras impulsivas por internet. Redujo algunos gastos y transfirió automáticamente el 10% de cada ingreso a una cuenta separada. Doce meses después había reunido más de $3.600.' },
      commonError: 'Esperar a que "sobre dinero" para comenzar a ahorrar. La realidad es que el dinero casi nunca sobra.',
      expertTip: 'Cada vez que recibas un aumento de ingresos, destiná al menos la mitad de ese incremento al ahorro o a la inversión.',
      exercise: {
        fields: [
          { label: 'Mi principal objetivo de ahorro es', type: 'text' },
          { label: 'Necesito ahorrar', type: 'money' },
          { label: 'Quiero lograrlo en (meses)', type: 'text' },
          { label: 'Para lograrlo debo ahorrar cada mes', type: 'money' },
        ],
      },
      keyIdeas: [
        'Ahorrar no significa dejar de vivir; significa elegir mejor.',
        'El ahorro debe realizarse antes de comenzar a gastar.',
        'Cada ahorro necesita un propósito claro.',
        'Automatizar el ahorro facilita mantener el hábito.',
      ],
      quote: 'Cada dólar que ahorrás hoy es una decisión que le da más tranquilidad, más oportunidades y más libertad a la persona que serás mañana.',
    },
    {
      title: 'El fondo de emergencia',
      hook: 'Tu mejor seguro contra los imprevistos.',
      body: [
        { paragraphs: [
          'La diferencia entre una persona que enfrenta un imprevisto con tranquilidad y otra que termina endeudándose suele ser una sola: tener un fondo de emergencia. No está pensado para compras ni vacaciones — su única función es proteger tu estabilidad financiera cuando la vida no sale como estaba planeado.',
        ]},
        { heading: '¿Cuánto deberías tener?', paragraphs: [
          'Si tenés un empleo con ingresos estables: entre 3 y 6 meses de gastos esenciales. Si sos emprendedor, freelancer o tenés ingresos variables: entre 6 y 12 meses. No necesitás reunirlo en una semana — empezá con una meta pequeña, como $500, y seguí avanzando.',
        ]},
        { heading: '¿Dónde guardarlo?', paragraphs: [
          'Debe ser seguro (sin riesgo alto), accesible (disponible rápido) y no demasiado a mano (separado de tu cuenta de gastos diarios, para no caer en la tentación de usarlo).',
        ]},
      ],
      caseStudy: { name: 'Javier, comerciante', text: 'Nunca lograba ahorrar porque pensaba que siempre habría ventas suficientes. Un invierno una tormenta dañó su local y tuvo que cerrar dos semanas. Gracias a un fondo equivalente a cuatro meses de gastos, pudo pagar el alquiler y los salarios sin recurrir a préstamos. No fue suerte. Fue planificación.' },
      commonError: 'Confundir el fondo de emergencia con la cuenta de ahorro para metas personales (vacaciones, auto nuevo). Son cosas diferentes.',
      expertTip: 'Cada vez que recibas un ingreso extraordinario, destiná una parte a fortalecer tu fondo de emergencia hasta alcanzar la meta establecida.',
      exercise: {
        fields: [
          { label: 'Mis gastos esenciales mensuales son', type: 'money' },
          { label: 'Mi objetivo de fondo de emergencia', type: 'checkboxGroup', options: ['3 meses', '6 meses', '12 meses'] },
          { label: 'Necesito reunir', type: 'money' },
          { label: 'Actualmente tengo', type: 'money' },
          { label: 'A partir de este mes ahorraré', type: 'money' },
        ],
      },
      keyIdeas: [
        'Los imprevistos son inevitables; el endeudamiento no.',
        'Un fondo de emergencia protege tu tranquilidad y tu patrimonio.',
        'Comenzá con metas pequeñas y avanzá de forma constante.',
        'Si usás el fondo, convertí en prioridad reconstruirlo.',
      ],
      quote: 'La verdadera seguridad financiera no consiste en esperar que nunca ocurra una emergencia, sino en estar preparado para afrontarla sin poner en riesgo tu futuro.',
    },
    {
      title: 'Cómo aumentar tus ingresos',
      hook: 'Hay un límite para ahorrar, pero no para generar más ingresos.',
      body: [
        { paragraphs: [
          'Podés cancelar suscripciones y evitar compras impulsivas, pero siempre existirá un límite para cuánto podés recortar. En cambio, tu capacidad para generar ingresos tiene un potencial mucho mayor. Cambiá la pregunta de "¿cómo puedo ahorrar más?" a "¿cómo puedo generar $500 más al mes?".',
        ]},
        { heading: 'Cuatro formas de aumentar tus ingresos', list: [
          'Mejorar en tu empleo actual: capacitarte, asumir nuevas responsabilidades, negociar un aumento.',
          'Ofrecer un servicio: reparaciones, diseño, asesorías, clases particulares, traducción.',
          'Vender productos: físicos, artesanías, o digitales (ebooks, plantillas, cursos) que podés crear una vez y vender muchas veces.',
          'Crear ingresos semipasivos: cursos en línea, programas de afiliados, membresías, contenido monetizado.',
        ]},
        { paragraphs: [
          'Nunca dependas de una sola fuente de ingresos. Cuando obtengas ingresos adicionales, invertí una parte en herramientas que fortalezcan tu capacidad de generar más dinero (una computadora mejor, un curso especializado, publicidad para tu negocio).',
        ]},
      ],
      caseStudy: { name: 'Mariana', text: 'Trabajaba como asistente administrativa y aprovechó una habilidad que consideraba un simple pasatiempo: diseñar presentaciones. Comenzó ofreciendo sus servicios los fines de semana. Seis meses después generaba cerca de $900 mensuales adicionales, que usó para eliminar deudas y comenzar a invertir.' },
      commonError: 'Pensar que necesitás una gran inversión para empezar. La mayoría de los negocios exitosos comenzaron con recursos limitados.',
      expertTip: 'Antes de buscar una segunda fuente de ingresos, preguntate: ¿qué problema puedo resolver para otras personas? Las personas pagan por soluciones, no por tiempo.',
      exercise: {
        fields: [
          { label: 'Mis habilidades (una lista)', type: 'textarea' },
          { label: '¿Cuál de estas habilidades podría generar ingresos en los próximos 30 días?', type: 'text' },
          { label: '¿Qué primer paso podés dar esta misma semana?', type: 'text' },
          { label: '¿Cuánto ingreso adicional te gustaría generar cada mes?', type: 'money' },
        ],
      },
      keyIdeas: [
        'Existe un límite para ahorrar, pero no para generar más ingresos.',
        'Tu conocimiento y tus habilidades son activos valiosos.',
        'Diversificar tus ingresos aumenta tu estabilidad financiera.',
        'Invertí en aprender y en herramientas que multipliquen tu capacidad de generar dinero.',
      ],
      quote: 'Tu salario puede pagar tus gastos de hoy, pero tus habilidades y tu capacidad para generar nuevas oportunidades serán las que construyan la vida financiera que deseás.',
    },
    {
      title: 'Invertir sin ser experto',
      hook: 'La inversión es el puente entre ahorrar y construir patrimonio.',
      body: [
        { paragraphs: [
          'Muchas personas creen que invertir es solo para millonarios o expertos. Nada más lejos de la realidad: invertir consiste en colocar tu dinero en activos que tengan el potencial de crecer con el tiempo. El orden correcto siempre será: organizar tus finanzas, eliminar las deudas más costosas, crear un fondo de emergencia, y recién después comenzar a invertir. Nunca inviertas el dinero que podrías necesitar para una emergencia.',
        ]},
        { heading: 'El tiempo es tu mejor aliado', paragraphs: [
          'Mientras antes empieces, más oportunidades tendrá tu dinero para crecer. No necesitás esperar a tener grandes cantidades — lo importante es desarrollar el hábito de invertir de manera constante.',
        ]},
        { heading: 'Diversificá: no pongas todos los huevos en la misma canasta', paragraphs: [
          'Distribuí tu dinero entre distintos tipos de activos: fondos de inversión, acciones, bonos, bienes raíces. Nunca inviertas en algo que no entendés, y desconfiá de cualquier propuesta que prometa ganancias muy altas, rápidas y sin riesgo.',
        ]},
      ],
      caseStudy: { name: 'Roberto', text: 'Pensaba que invertir era solo para personas con mucho dinero. Después de organizar sus finanzas y completar su fondo de emergencia, comenzó con pequeñas aportaciones mensuales en un fondo diversificado. Nunca buscó hacerse rico rápido — su objetivo fue construir un futuro sólido, y por eso obtuvo resultados.' },
      commonError: 'Invertir por recomendación de amigos o publicaciones en internet sin comprender realmente en qué estás colocando tu dinero.',
      expertTip: 'Antes de invertir, respondé: ¿cuál es mi objetivo?, ¿cuánto tiempo puedo mantener este dinero invertido?, ¿qué nivel de riesgo acepto?, ¿entiendo cómo funciona esta inversión?',
      exercise: {
        fields: [
          { label: 'Mi principal objetivo de inversión es', type: 'text' },
          { label: 'Quiero alcanzar esta meta en', type: 'checkboxGroup', options: ['3 años', '5 años', '10 años', 'Más de 10 años'] },
          { label: 'Estoy dispuesto a invertir cada mes', type: 'money' },
        ],
      },
      keyIdeas: [
        'Invertir es hacer que tu dinero trabaje para vos.',
        'Primero organizá tus finanzas y creá un fondo de emergencia.',
        'El tiempo y la constancia importan más que adivinar el mercado.',
        'Nunca inviertas en algo que no comprendés.',
      ],
      quote: 'La riqueza no se construye encontrando la inversión perfecta, sino tomando decisiones inteligentes, constantes y sostenibles a lo largo del tiempo.',
    },
    {
      title: 'Finanzas en pareja y en familia',
      hook: 'El dinero puede unir... o separar.',
      body: [
        { paragraphs: [
          'Uno de los temas que más conflictos genera en las relaciones no es la falta de amor — es la falta de comunicación sobre el dinero. Cuando una pareja aprende a trabajar como un equipo, las finanzas dejan de ser una fuente de estrés para convertirse en una herramienta que las acerca a sus sueños.',
        ]},
        { heading: 'Definan metas comunes', paragraphs: [
          'Cuando existe un objetivo compartido (comprar una vivienda, viajar, la educación de los hijos), resulta mucho más fácil decir "no" a los gastos impulsivos.',
        ]},
        { heading: '¿Dinero junto, separado o mixto?', paragraphs: [
          'No existe un único modelo correcto. El sistema mixto es uno de los más usados: cada persona mantiene una cuenta personal, y ambos aportan una cantidad acordada a una cuenta para los gastos del hogar y objetivos comunes. Más importante que el sistema es la transparencia.',
        ]},
      ],
      caseStudy: { name: 'Carolina y Andrés', text: 'Ganaban buenos ingresos pero administraban su dinero por separado sin hablar de finanzas. Decidieron implementar una reunión financiera el primer domingo de cada mes, crear un presupuesto y una cuenta exclusiva para el ahorro familiar. Un año después habían reunido el dinero para el enganche de su primera vivienda.' },
      commonError: 'Pensar que hablar de dinero genera conflictos. En realidad, lo que genera conflictos es no hablar del tema hasta que aparece un problema.',
      expertTip: 'Realizá una "reunión financiera familiar" una vez al mes, de solo 30 minutos: revisar ingresos y gastos, evaluar metas, ajustar el presupuesto, celebrar logros.',
      exercise: {
        fields: [
          { label: 'Nuestra principal meta financiera es', type: 'text' },
          { label: 'Queremos alcanzarla antes de', type: 'text' },
          { label: 'Cada mes ahorraremos', type: 'money' },
          { label: 'Tres compromisos que asumimos como familia', type: 'textarea' },
        ],
      },
      keyIdeas: [
        'El dinero debe ser un tema de conversación, no de discusión.',
        'Las metas compartidas fortalecen el compromiso de toda la familia.',
        'Un presupuesto familiar brinda claridad y reduce el estrés.',
        'La transparencia genera confianza.',
      ],
      quote: 'Una familia que habla de dinero con honestidad no solo construye estabilidad financiera; también fortalece la confianza y los sueños que compartirán durante toda la vida.',
    },
    {
      title: 'Construí el futuro que deseás',
      hook: 'Tu futuro financiero se construye con las decisiones que tomás hoy.',
      body: [
        { paragraphs: [
          'La libertad financiera no ocurre por casualidad. Es el resultado de cientos de pequeñas decisiones tomadas con intención. Antes de hablar de números, pensá en la vida que querés dentro de cinco años: dónde querés vivir, cómo imaginás tu trabajo, qué experiencias deseás disfrutar.',
        ]},
        { heading: 'Convertí tus sueños en objetivos', paragraphs: [
          'Un sueño inspira. Un objetivo se puede planificar. Usá el método SMART: Específico, Medible, Alcanzable, Relevante, con Tiempo definido. Dividí las grandes metas en etapas: corto plazo (1 año), mediano plazo (2-5 años) y largo plazo (5-20 años).',
        ]},
        { heading: 'Construí patrimonio, no solo ingresos', paragraphs: [
          'Cada año preguntate: ¿mis activos aumentaron?, ¿mis deudas disminuyeron?, ¿mi patrimonio creció? Revisá tu plan al menos una vez al año — adaptar el plan no significa fracasar, significa crecer.',
        ]},
      ],
      caseStudy: { name: 'Patricia', text: 'Hace diez años vivía al día, sin ahorros. Un día escribió tres metas: eliminar sus deudas, ahorrar para una vivienda, e invertir para su jubilación. No consiguió todo en un año, pero cada pequeño avance la acercó al objetivo. Hoy vive en su propia casa y sigue invirtiendo para el futuro.' },
      commonError: 'Pensar únicamente en el presente. Cuando todas las decisiones se toman para satisfacer necesidades inmediatas, es muy difícil construir patrimonio.',
      expertTip: 'Escribí tus metas financieras y colocalas en un lugar visible. Las metas que ves con frecuencia permanecen presentes en tus decisiones diarias.',
      exercise: {
        fields: [
          { label: 'Mi objetivo a 1 año', type: 'text' },
          { label: 'Mi objetivo a 5 años', type: 'text' },
          { label: 'Mi objetivo a 10 años', type: 'text' },
          { label: 'Para lograrlo, comenzaré haciendo estas tres acciones', type: 'textarea' },
        ],
      },
      keyIdeas: [
        'El futuro financiero comienza con las decisiones de hoy.',
        'Los sueños necesitan convertirse en objetivos concretos.',
        'Construir patrimonio es más importante que solo aumentar los ingresos.',
        'Revisá y ajustá tu plan cada año.',
      ],
      quote: 'El futuro no se improvisa. Se construye, decisión a decisión, ahorro a ahorro e inversión tras inversión.',
    },
    {
      title: 'El Método Domina tu Dinero',
      hook: 'El sistema definitivo para tomar el control de tus finanzas.',
      body: [
        { paragraphs: [
          'Es momento de reunir todo lo aprendido en un sistema simple, práctico y fácil de aplicar. No necesitás ser perfecto. Solo necesitás ser constante.',
        ]},
        { heading: 'Los 7 pilares del método', list: [
          '1. Conocé tu realidad financiera — todo comienza con un diagnóstico.',
          '2. Asigná una misión a cada dólar — antes de gastar, decidí qué función tendrá cada ingreso.',
          '3. Viví por debajo de tus posibilidades — la diferencia entre lo que ganás y lo que gastás es tu libertad financiera.',
          '4. Construí seguridad antes de buscar riqueza — presupuesto, fondo de emergencia, deudas, después inversión.',
          '5. Hacé crecer tus ingresos — casi no existe límite para desarrollar nuevas fuentes.',
          '6. Invertí pensando en el largo plazo — constancia, paciencia, diversificación.',
          '7. Repetí el proceso cada mes — la revisión mensual evita que pequeños errores se conviertan en grandes problemas.',
        ]},
      ],
      caseStudy: { name: 'Daniel', text: 'Tenía deudas y ningún ahorro. En vez de cambiar todo de golpe, aplicó un hábito nuevo cada mes: registrar gastos, crear un presupuesto, ahorrar el 10%, pagar la deuda de mayor interés, iniciar su fondo de emergencia, comenzar una inversión mensual. Dos años después su realidad era completamente diferente — no por una fórmula secreta, sino porque transformó pequeños hábitos en un estilo de vida.' },
      commonError: 'Buscar la estrategia perfecta y nunca comenzar. La mejor estrategia es aquella que realmente aplicás.',
      expertTip: 'No compares tu progreso con el de otras personas. Comparalo con la persona que eras hace un año.',
      exercise: {
        title: 'Autoevaluación final',
        fields: [
          { label: 'Hábitos que ya formo parte de mi vida', type: 'checkboxGroup', options: ['Llevo un presupuesto', 'Registro mis gastos', 'Tengo un fondo de emergencia', 'Ahorro todos los meses', 'Estoy eliminando mis deudas', 'Invierto regularmente', 'Tengo objetivos financieros escritos', 'Reviso mis finanzas mensualmente'] },
          { label: 'Mi compromiso personal a partir de hoy', type: 'textarea' },
        ],
      },
      keyIdeas: [
        'El éxito financiero es un proceso, no un evento.',
        'Cada dólar debe tener un propósito.',
        'La disciplina supera a la motivación.',
        'Los hábitos diarios construyen el patrimonio.',
      ],
      quote: 'Dominar tu dinero no significa tener millones. Significa que cada decisión financiera te acerca a la vida que deseás, en lugar de alejarte de ella.',
    },
  ],
}
