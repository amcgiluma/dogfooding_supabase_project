# Compañeros digitales: preguntas y decisiones

Documento vivo del brainstorming. Recoge las preguntas, las respuestas de Juanma con redacción aclarada y las propuestas que todavía necesitan una decisión. No es una especificación cerrada.

**Documentos preparados a partir de estas respuestas:** [visión y plan completos](proyecto.md) y [resumen visual interactivo](resumen.html). Este archivo conserva el registro de preguntas; el plan organiza las decisiones por tema y mantiene explícitos los pendientes.

## Revisión de sencillez y alcance de la primera versión

**Valoración del asistente, no una decisión de Juanma.** La idea central está clara: un compañero que conoce al usuario, recibe misiones, trabaja con autonomía dentro de límites y entrega resultados que se pueden revisar. La experiencia puede ser sencilla, pero la visión completa exige resolver ejecución autónoma, memoria, revisiones, programación de seguimientos, integraciones, costes y pagos. Construir todo desde cero y ofrecerlo públicamente desde el principio haría grande el proyecto.

**Resultado de la revisión, confirmado.** Juanma quiere abordar la visión amplia desde la primera versión, usarla personalmente al principio y adaptar un motor de agentes existente. No acepta reducir el alcance inicial a un único caso de uso. Preparar usuarios y sus datos en Supabase forma parte de la base del producto aunque inicialmente solo lo use él. Las respuestas siguientes sustituyen el estado pendiente de estas preguntas.

### R1. ¿Qué alcance debe tener la primera versión que podamos usar de verdad?

**Confirmado.** Construir la visión amplia desde el principio, aceptando que el desarrollo sea mayor. Esto no establece que todos los componentes deban construirse a la vez ni que deban abrirse al público desde el inicio.

**Opciones que se presentaron:**

- Priorizar crear una aplicación: completar ese recorrido primero y dejar las experiencias específicas de investigación y seguimiento para después. Recomendación del asistente para reducir alcance.
- Ofrecer los tres casos básicos: crear aplicaciones, investigar y vigilar, con una experiencia mínima en cada uno.
- Construir la visión amplia desde el principio, aceptando un desarrollo mayor.

### R2. ¿Quién debería poder usar esa primera versión?

**Confirmado.** Solo Juanma al principio, para validar el funcionamiento y los costes. Desde el inicio quiere preparar el proyecto de Supabase y la base de datos de usuarios, de modo que la aplicación tenga esa estructura aunque todavía no se incorporen otras personas.

**Distinción de alcance.** Ese Supabase corresponde a nuestra plataforma. Es distinto de las cuentas de Supabase que un usuario conecte para las aplicaciones creadas por sus compañeros. Todavía no se ha creado un proyecto remoto ni se ha elegido el esquema concreto.

**Opciones que se presentaron:**

- Solo Juanma al principio, para validar misiones y costes antes de añadir altas y cobros a otros usuarios. Recomendación del asistente para esta fase experimental.
- Un pequeño grupo de invitados, con cuentas separadas y consumo controlado desde el inicio.
- Cualquier persona que se registre y contrate un plan, incluyendo el recorrido de suscripción desde el inicio.

### R3. ¿Cómo queremos empezar con el motor que hace trabajar al compañero?

**Confirmado.** Adaptar un motor existente. Juanma propone Pi como candidato, por su ligereza y el posible ahorro de recursos, y quiere estudiar también otras opciones que encajen. El producto concreto sigue sin elegirse.

**Nombre aclarado por Juanma.** Se refería a Pi, el harness de agentes; «pi-hole» era una confusión de nombre. [Pi](https://pi.dev/).

**Opciones que se presentaron:**

- Adaptar un motor existente si encaja: concentrar el desarrollo propio en la web, las misiones y la memoria. Recomendación del asistente para simplificar el desarrollo; no elige todavía un producto concreto.
- Crear nuestro propio motor desde el principio, aceptando desarrollar también su ejecución y coordinación.

Estas preguntas deciden el orden y el alcance de la primera versión. No eliminan automáticamente capacidades de la visión final ni sustituyen las decisiones ya confirmadas.

### Reutilización del sistema anterior y reparto del trabajo

**Confirmado por Juanma.** Ya ha implementado un sistema de memoria persistente con Obsidian. Aportará instrucciones claras para adaptar el harness y definir cómo los agentes invocados por un compañero comparten memoria y se mejoran. Quiere que el asistente prepare la configuración base de EC2 y del motor elegido para incorporar ese sistema. Los pasos concretos se aportarán en esa fase; todavía no se ha preparado ni probado una imagen EC2.

**Referencia aportada y revisada:** [CyberRoot · El Concilio](https://amcgiluma.github.io/CyberRoot/mapa/). El mapa describe nueve roles con turnos, lecturas y entregas definidas; separa el conocimiento permanente, la cola de trabajo y el código; usa un índice inicial para consultar solo el contexto necesario, planes, relevos, revisores, ramas y propuestas de mejora compartidas. Esto aporta una referencia de coordinación por archivos. La página no muestra por sí sola la implementación de la memoria de Obsidian ni permite verificar el funcionamiento real del sistema.

**Aclaración confirmada por Juanma.** La referencia a CyberRoot incluye que los agentes se comuniquen entre sí y se ayuden a mejorar. Habrá turnos especiales para revisar el progreso y reprogramar su actividad, aumentando o reduciendo la carga diaria según si se está llegando al objetivo. El reparto puede cambiar durante la misión; no se trata de copiar un horario fijo. Estos ajustes respetan el presupuesto, los permisos y las pausas del usuario.

**Alcance confirmado de la reprogramación.** Los turnos pueden ajustar horarios, frecuencia, prioridades, reparto del trabajo, instrucciones, skills y herramientas, dentro del presupuesto y los permisos vigentes. No se ha elegido la opción de modificar también el código del propio harness.

**Pendiente de concretar:** quién coordina esos turnos, con qué frecuencia se celebran y cómo se comprueba que una mejora ayuda.

**Propuesta para reutilizar esa experiencia, sin confirmar.** El compañero sería la cara visible y coordinaría los especialistas necesarios según la misión. Reutilizar los índices, las entregas entre roles y la carpeta de mejoras, sin imponer nueve agentes fijos ni los horarios del juego a todas las misiones. Los mecanismos para evitar escrituras simultáneas incompatibles y controlar qué memoria puede consultar cada agente se concretarán con los pasos de Juanma.

**Exploración inicial de motores; sin elección ni medición práctica:**

| Candidato | Qué justifica estudiarlo | Qué sigue pendiente |
| --- | --- | --- |
| Pi, candidato propuesto por Juanma | Su documentación lo presenta como un harness mínimo y extensible, integrable por SDK o RPC, con proveedores como OpenRouter. | Adaptar la coordinación de subagentes y los permisos; probar el sistema de memoria de Juanma. |
| Hermes | Documenta memoria, creación y mejora de skills, tareas programadas y subagentes. | Comparar su encaje con el sistema existente de Juanma y comprobar resultados de desarrollo con las mismas misiones. |
| OpenCode | Agente de programación de código abierto con documentación de agentes, permisos, SDK y servidor. | Estudiar cómo integrarlo con nuestra web y las misiones de investigación y vigilancia. |

Fuentes: [Pi](https://pi.dev/), [Hermes](https://github.com/NousResearch/hermes-agent), [OpenCode](https://opencode.ai/docs/).

**Pendiente de comprobar:** consumo real de RAM, recursos de navegador, compilaciones y número de agentes activos. Un núcleo pequeño no demuestra por sí solo que toda la carga del compañero pueda ejecutarse en una instancia con poca memoria. La selección debe considerar el trabajo de adaptación y el coste de misiones reales, no solo el tamaño del motor.

### R4. ¿El candidato que llamas «pi-hole» es Pi, el harness de pi.dev?

**Confirmado.** Sí, se refiere a Pi. La confusión de nombre está resuelta; Pi sigue siendo un candidato por evaluar, no una elección definitiva.

### R5. ¿Qué hacemos con la fecha límite de una misión?

**Confirmado, vinculado a la pregunta 11.** La fecha es opcional y muy recomendable para que los agentes se planifiquen. Al alcanzarla, entrega un avance presentable y continúa dentro del presupuesto disponible. Debe estimar cuánto trabajo queda y organizar el esfuerzo para disponer de algo que el usuario pueda ver y probar. En una aplicación, la entrega debe incluir interfaz y publicación en Vercel dentro de los permisos disponibles, aunque todavía falten partes del backend o funcionalidades.

**Opciones que se presentaron:**

- Fecha opcional; siempre hay límites de esfuerzo por etapa. Si hay fecha, entrega lo conseguido y pausa la etapa al alcanzarla. Recomendación del asistente.
- Fecha opcional; entrega un avance al alcanzarla y continúa dentro del presupuesto disponible, respetando cualquier pausa explícita.
- Fecha obligatoria en cada misión; entrega y pausa al alcanzarla.

### R6. ¿Qué ritmo de trabajo tendrá el compañero?

**Confirmado, vinculado a la pregunta 49.** Las misiones activas avanzan cuando hay trabajo; la vigilancia tiene horarios y una revisión diaria busca mejoras cuando el compañero está libre. Se añaden turnos especiales para reajustar la carga de trabajo según el progreso hacia el objetivo.

**Opciones que se presentaron:**

- Las misiones activas avanzan al recibir trabajo; la vigilancia tiene su horario y, cuando está libre, una revisión diaria busca mejoras. Opción elegida por Juanma.
- Todo el trabajo avanza en turnos programados, incluidas las misiones nuevas.
- Trabaja de forma continua mientras tenga trabajo útil y capacidad, también buscando mejoras, respetando las pausas y los permisos.

### R7. ¿Qué incluye reprogramar agentes en los turnos especiales?

**Confirmado.** Ajustar también sus instrucciones, skills y herramientas, además de los horarios, la frecuencia, las prioridades y el reparto del trabajo. Todos los ajustes mantienen el presupuesto y los permisos del usuario. Modificar el código del propio harness no forma parte de la opción elegida.

**Opciones que se presentaron:**

- Ajustar horarios, frecuencia, prioridades y reparto del trabajo.
- Ajustar también sus instrucciones, skills y herramientas, además del reparto del trabajo. Opción elegida por Juanma.
- Permitir además modificar el código del propio harness. Esta posibilidad no está confirmada.

### R8. Si el usuario retira un permiso, ¿qué pasa con una acción que ya está en marcha?

**Confirmado, vinculado a la pregunta 24.** Cancelar la acción en curso si todavía es posible, bloquear nuevas acciones que necesiten el permiso retirado e informar al usuario de lo que ya se ejecutó. Retirar un permiso no implica deshacer automáticamente efectos que ya ocurrieron.

**Opciones que se presentaron:**

- Cancelarla si aún es posible y bloquear nuevas acciones con ese permiso; informar de lo que ya se ejecutó. Recomendación del asistente.
- Permitir terminar la acción iniciada y bloquear las siguientes.

## Cómo leer este documento

- **Confirmado:** decisión expresada por Juanma.
- **Parcial:** hay una respuesta relacionada, pero falta concretar la pregunta.
- **Pendiente:** todavía no se ha respondido.
- **Propuesta:** sugerencia del asistente, pendiente de aceptación o ajuste.
- **Fuera de alcance actual:** tema pospuesto expresamente para esta versión del proyecto.

Las respuestas nuevas se incorporan a su pregunta. Si cambian una decisión anterior, se actualiza su respuesta y se deja una nota breve del cambio. Una sugerencia del asistente no se convierte en una decisión por defecto.

## Alcance actual

**Confirmado, con aclaración posterior.** Es un proyecto experimental y de uso personal al principio. No está en producción ni se abrirá al público en esta fase. Juanma quiere desarrollar la visión amplia desde la primera versión y preparar desde el inicio la estructura de usuarios en Supabase. La escala de uso inicial es pequeña; el alcance funcional es amplio.

**Aclaración sobre pagos.** En esta fase no se busca ganar dinero con el servicio. Se quieren tres niveles de capacidad que permitan más trabajo y más rapidez. La opción preferida es una suscripción propia que incluya el consumo de IA del compañero. También se quiere permitir que el usuario aporte sus propias API keys. Conectar suscripciones externas de Codex, Claude u otros proveedores se contempla como alternativa, sujeta a lo que permita cada proveedor. No se han fijado precios ni una oferta comercial.

## Decisiones previas a los bloques

### A. ¿Para quién queremos que funcione especialmente bien la primera versión?

**Confirmado.** Para personas individuales. La experiencia debe poder entenderse y usarse sin nuestra ayuda.

### B. ¿Qué tipo de resultado debería poder entregar el compañero?

**Confirmado.** El producto admite objetivos de distintos tipos. Una pregunta puede producir una investigación; una idea de aplicación puede producir código y una aplicación. El compañero comunica sus dudas o necesidades durante el proceso. No se limita a una única categoría de tarea.

### C. ¿Qué peso tiene la identidad del compañero?

**Confirmado.** Es un compañero cercano y práctico. Tiene identidad propia, recuerda el contexto del usuario y centra su valor en ayudar con resultados.

### D. ¿Qué libertad tiene mientras cumple una misión?

**Confirmado.** Se empieza en modo restrictivo y con consulta al usuario; YOLO se activa después de forma explícita. Los modos son conjuntos predefinidos de una misma lista de permisos. Un menú avanzado permite ajustar cada permiso y crear un modo personalizado.

**Excepción confirmada.** Cada compra o pago requiere aprobación humana, incluso en YOLO. Se puede activar manualmente la capacidad de preparar compras con un presupuesto, pero ese presupuesto no sustituye la aprobación de cada compra.

**Cambio respecto a la primera respuesta:** YOLO deja de describirse como acceso sin excepciones; las compras conservan siempre la aprobación humana.

**Confirmado.** La configuración global se aplica por defecto y los ajustes específicos de una misión prevalecen sobre ella. En esta conversación, «proyecto» se había usado como equivalente a «misión».

**Aclaración confirmada.** Al revocar un permiso, se cancela la acción en curso si aún es posible, se bloquean nuevas acciones que lo necesiten y se informa de lo que ya se ejecutó. La pregunta 24 recoge esta decisión.

**Pendiente de concretar:** permisos adicionales y cómo heredan la configuración los agentes internos y los posibles hitos o submisiones.

### E. ¿Qué hace si encuentra una duda mientras el usuario no está?

**Confirmado.** Hay dos comportamientos ajustables: dejar una pregunta al usuario y avanzar en lo que no depende de su respuesta, o resolver las dudas por su cuenta. Este ajuste es independiente de los permisos para actuar.

**Confirmado.** Hay una configuración global y una configuración de la misión. Los ajustes diferentes de la misión prevalecen sobre los globales. En modo de consulta, el compañero puede resolver detalles poco importantes. Siempre se resumen las decisiones importantes y las preguntas se presentan una a una. Si encuentra instrucciones incompatibles en modo autónomo, el agente elige cómo resolverlas.

### F. ¿Qué recibe el usuario cuando pide una aplicación?

**Confirmado.** El resultado deseado es una aplicación publicada y utilizable. Se buscan integraciones que permitan construir y publicar directamente, con Vercel para el despliegue y Supabase para el backend como servicios deseados. Se pueden considerar otros servicios según las necesidades. Las entregas se consideran finales de etapa; solo se presentan como producto final si el usuario lo ha solicitado.

**Confirmado.** Un agente revisor comprueba que la aplicación abre, que funcionan todas las funcionalidades solicitadas y que los datos se guardan correctamente. Playwright MCP u otra herramienta equivalente es una posibilidad para comprobar los recorridos en el navegador, no una elección técnica cerrada.

**Pendiente de concretar:** propiedad de las cuentas y recursos, conexiones necesarias, gastos y herramientas de revisión. No se ha elegido todavía una integración técnica concreta.

## Bloque 1. Qué significa tener un compañero

### 1. ¿Cada persona empieza con un único compañero o puede crear varios desde el primer día?

**Confirmado.** El onboarding se hace con un solo compañero y toda la experiencia inicial se explica a través de él. Después, la persona puede crear tantos compañeros como quiera.

**Aclaración posterior.** El primer chat es un onboarding conversacional: el compañero hace preguntas para conocer al usuario y guardar lo que este quiera compartir en su memoria persistente, respetando la consulta previa para ciertos datos personales.

### 2. Si tiene varios, ¿qué motivo tendría para separarlos: trabajo y vida personal, distintos proyectos o distintas especialidades?

**Confirmado.** Cada compañero se enfoca en un aspecto de la vida de la persona. Puede ocuparse de varias tareas o misiones. No hace falta crear un compañero por tarea.

### 3. ¿El compañero debería conocerte cada vez mejor a través de todas tus misiones?

**Confirmado.** Sí. Tendrá memoria persistente en Obsidian, inspirada en un sistema que Juanma construyó anteriormente. Juanma aportará los detalles cuando se prepare la imagen de EC2.

**Aclaración posterior.** La memoria vive en EC2 y contiene archivos por temas, como personalidad, gustos y objetivos. El agente consulta primero el inicio o resumen relevante para decidir qué contenido necesita leer completo. Las preguntas 43–48 recogen el contenido, la consulta gráfica y el aprendizaje.

**Pendiente de concretar entonces:** estructura exacta de los archivos, persistencia durante los cambios de instancia, copias de seguridad y acceso o intercambio de información entre compañeros.

### 4. ¿Puede decirte «esto que me pides no te ayudará mucho; te propongo otra cosa»?

**Confirmado.** Sí. Debe ser pragmático y útil, con criterio propio. Puede cuestionar una petición y proponer una alternativa; no debe limitarse a complacer al usuario.

### 5. ¿Quieres que proponga nuevas misiones por iniciativa propia?

**Confirmado.** Sí, y puede ir más allá de proponer: basándose en lo que sabe del usuario, puede empezar a preparar o construir cosas que crea que le ayudarán. Su iniciativa debe respetar los permisos y la forma de decidir configurados por el usuario.

**Idea de exploración de Juanma:** combinar un sistema pequeño con buenas capacidades de programación y con aprendizaje y automejora. Juanma considera que Hermes destaca en aprender y mejorarse, pero le ha resultado menos eficaz programando. Le interesa explorar una combinación de esas cualidades con la sencillez de Pi y capacidades de programación similares a las de Codex.

**Aclaración posterior confirmada.** Se adaptará un harness existente. Juanma confirma que se refiere a Pi y quiere estudiar alternativas. Falta seleccionar el motor después de evaluar su encaje. Sus observaciones sobre Hermes y los recursos son experiencias o hipótesis, no una comparación medida. La revisión R3 recoge esta decisión.

### 6. ¿Qué tendría que pasar para que alguien dijera «me ha quitado trabajo de encima» después de su primer día?

**Confirmado.** Que el sistema pueda trabajar por su cuenta sin que la persona tenga que supervisarlo continuamente. La autonomía útil es un criterio central del producto.

## Bloque 2. Cómo se pide una misión

### 7. ¿Se empieza escribiendo libremente o mostrando ejemplos como «Construye», «Investiga» y «Haz seguimiento»?

**Confirmado.** Se muestran ejemplos y propuestas para ayudar a empezar, pero siempre se puede pedir algo libremente. Los ejemplos orientan; no limitan las capacidades del compañero.

### 8. ¿Puede recibir una idea desordenada y ayudarte a convertirla en un objetivo concreto?

**Confirmado.** Sí. Ayudar a aclarar una idea y convertirla en algo abordable forma parte del trabajo del compañero.

### 9. ¿Debería ofrecerte una primera propuesta rápidamente o hacer varias preguntas antes de trabajar?

**Confirmado.** Depende del tipo de tarea. Las tareas sencillas pueden empezar directamente. En tareas de diseño o construcción, el comportamiento habitual es enseñar propuestas y hacer preguntas para orientar el trabajo. El usuario puede ajustar el nivel de preguntas, junto con la configuración que permite al agente decidir por su cuenta.

**Pendiente de concretar:** cómo se presenta ese ajuste para evitar controles duplicados o contradictorios.

### 10. ¿Toda misión necesita acordar qué resultado contará como terminado?

**Confirmado.** La referencia principal es la finalización de una etapa, no necesariamente el cierre definitivo de toda la misión. Se identifica qué avance o entrega marca el final de esa etapa.

**Aclaración posterior.** Los resultados no se presentan como productos finales salvo que el usuario lo pida explícitamente. Una entrega publicada puede seguir siendo una entrega de etapa.

**Aclaración posterior.** Cuando considera cumplido el objetivo de una misión, el compañero notifica que está terminada y pausa su ejecución. El usuario puede confirmar el cierre o pedir que continúe. Esto no convierte cada entrega intermedia en un producto final; la pregunta 37 detalla el cierre de la misión.

**Pendiente de concretar:** la validación y continuación de los hitos intermedios de una misión grande.

### 11. ¿La fecha límite es opcional? ¿Qué esperas que cambie al añadirla?

**Confirmado.** La fecha es opcional, pero se recomienda mucho para que los agentes puedan planificar el trabajo. Deben estimar el esfuerzo y el tiempo restante y organizar el plan para llegar a esa fecha con una entrega presentable.

**Confirmado.** Al alcanzar la fecha, entrega un avance y continúa trabajando dentro del presupuesto disponible. La fecha no provoca una pausa automática ni autoriza aumentar el gasto. Se mantienen la pausa explícita del usuario y el cierre de la misión cuando el compañero considera cumplido su objetivo, según la pregunta 37.

**Confirmado para aplicaciones.** La planificación debe procurar una versión visible, con frontend y publicación en Vercel, aunque todavía falten partes del backend o algunas funcionalidades. El usuario debe poder percibir y probar el avance. La publicación sigue dependiendo de las conexiones y permisos autorizados.

**Propuesta del asistente, sin confirmar.** Planificar primero un recorrido completo y pequeño que se pueda usar; mostrar claramente lo que funciona y lo pendiente. Si se usan datos de ejemplo para una entrega intermedia, identificarlos como tales. Esa entrega no se presenta como misión terminada mientras queden requisitos solicitados sin completar y comprobar.

**Cambio respecto a la propuesta anterior.** Se descarta detener la etapa automáticamente al llegar la fecha. La fecha orienta una entrega presentable y el trabajo puede continuar con la capacidad autorizada.

**Pendiente de concretar:** cómo limita su esfuerzo una misión sin fecha y cómo comunica que una entrega presentable no llegará a tiempo. Los límites de esfuerzo por etapa siguen siendo una propuesta, no un acuerdo confirmado.

### 12. Si pides algo enorme, ¿te propone una primera versión pequeña o intenta abordar todo lo pedido?

**Confirmado.** Propone una primera versión pequeña que permita comprobar si va por buen camino. El usuario puede rechazar esa propuesta y pedir un alcance mayor.

## Idea adicional: Git y GitHub

**Confirmado.** El desarrollo debe tener una buena integración con Git, presentada de forma sencilla también para personas que no conocen sus conceptos. Debe permitir conservar versiones y volver a un estado anterior.

**Dirección deseada:** permitir revisar y aprobar cambios, incluyendo pull requests cuando el proyecto use GitHub u otro servicio que las soporte.

**Pendiente.** GitHub no se ha decidido como requisito. Git sí se considera necesario. Falta definir cuándo hacen falta revisiones y cómo se presentan al usuario.

**Propuesta del asistente, sin confirmar:** usar acciones comprensibles como «Ver cambios», «Aprobar versión» y «Volver a esta versión», dejando los detalles de Git accesibles para quien los necesite.

## Bloque 3. Cómo organiza el trabajo

### 13. ¿Puede tener varias misiones activas a la vez?

**Confirmado.** Sí. Un compañero puede trabajar en varias misiones simultáneamente. El usuario debe saber que esto puede aumentar el consumo y los costes.

**Pendiente de concretar:** cómo se comunica ese coste y cómo se relaciona la simultaneidad con la capacidad y el presupuesto disponibles.

### 14. ¿Tú eliges su prioridad o el compañero la decide según urgencia y contexto?

**Confirmado.** El compañero decide inicialmente las prioridades. El usuario puede indicarle que una tarea o misión tiene más prioridad y cambiar su orden de atención.

**Idea de Juanma.** Mostrar una etiqueta de prioridad en cada tarea para entender su importancia. Los niveles y la forma de editarlos todavía no están definidos.

### 15. Si le das una nueva misión, ¿interrumpe la anterior, trabaja en paralelo o la deja en espera?

**Confirmado.** Añade la nueva misión y trabaja en ella junto con las demás; recibir una misión no obliga a sustituir la anterior. Su organización se ajusta a las prioridades del compañero y del usuario.

**Aclaración confirmada.** Juanma se refería a pausar una misión. El usuario puede pausar una misión cuando quiera. Se corrige la transcripción anterior «pulsar».

### 16. ¿Una petición como «investiga la idea y construye la web» es una misión con etapas o dos misiones relacionadas?

**Confirmado.** Es una única misión con distintas etapas.

**Idea de Juanma.** Una misión grande podría tratarse como un proyecto con submisiones que correspondan a los hitos elegidos por el agente. Esta organización se considera una posibilidad; todavía no introduce una entidad separada ni una nueva jerarquía de configuración.

### 17. ¿Puedes cambiar el objetivo a mitad del trabajo con un mensaje normal?

**Confirmado.** Sí, pero mediante una acción explícita del usuario. Habrá un botón «Cambiar objetivo» que permita escribir el nuevo objetivo para el compañero. Un mensaje de conversación no sustituye por sí solo esa acción.

**Pendiente de concretar:** qué trabajo se conserva y cómo se reorganiza la misión después del cambio.

### 18. ¿Necesitas ver las subtareas o te basta con etapas sencillas como «Preparando», «Construyendo» y «Comprobando»?

**Confirmado.** Las subtareas se pueden consultar en un menú o vista de detalle, pero no aparecen en la vista principal por defecto.

## Bloque 4. Permisos y modo YOLO

### 19. ¿Los permisos pertenecen al compañero entero, a cada misión o hay unos generales que puedes cambiar para una misión?

**Confirmado.** Hay permisos generales que se pueden ajustar para cada misión. Los ajustes específicos de la misión prevalecen sobre la configuración global. Juanma ha aclarado que, al hablar de la configuración del «proyecto», se refería a la misión.

**Pendiente de concretar:** cómo reciben estos permisos los agentes internos del compañero y los posibles hitos o submisiones. La idea de una misión grande organizada como proyecto no establece todavía niveles adicionales de configuración.

### 20. ¿Cuál será el modo inicial para una persona nueva?

**Confirmado.** Modo restrictivo y de consulta al usuario. YOLO requiere activación explícita posterior. Los permisos para actuar y la forma de resolver dudas siguen siendo controles diferentes.

### 21. ¿Qué acciones quedan desactivadas en el modo restrictivo: publicar, enviar mensajes, comprar, borrar, modificar servicios existentes?

**Confirmado.** El conjunto inicial restringe publicar, enviar mensajes, comprar, borrar y modificar servicios existentes. También se contemplan permisos para usar servicios externos. Cada permiso se puede ajustar manualmente; restrictivo y YOLO son configuraciones de una lista común. El usuario puede guardar una configuración como modo personalizado.

**Pendiente.** Se quieren considerar más permisos, sin ampliar innecesariamente la interfaz principal. La lista adicional y el comportamiento exacto de cada restricción no están definidos. Las compras mantienen la aprobación humana incluso al cambiar de modo.

### 22. En YOLO, ¿puede también contratar servicios de pago y aumentar gastos? ¿Dentro de qué presupuesto?

**Confirmado.** YOLO no habilita compras ni pagos automáticos. El usuario puede activar manualmente una capacidad de compra con un presupuesto concreto. Aun así, cada compra necesita un botón de aprobación humana antes de ejecutarse. El compañero no puede comprar sin esa aprobación.

**Pendiente de concretar:** tratamiento de suscripciones, renovaciones y costes por uso de recursos, que son diferentes de una compra puntual.

### 23. ¿Puedes autorizar «publica esta aplicación» sin darle permiso para modificar tus otras aplicaciones?

**Confirmado.** Sí. Se pueden limitar los permisos a la aplicación o proyecto autorizado sin concederlos sobre los demás.

### 24. Si retiras un permiso durante una misión, ¿qué debería ocurrir con las acciones que ya estaban en marcha?

**Confirmado.** Cancelar la acción en curso si todavía es posible y bloquear nuevas acciones que requieran el permiso retirado. Informar al usuario de lo que ya se ejecutó. La revocación no implica revertir automáticamente los efectos de una acción ya ejecutada.

## Bloque 5. Dudas y decisiones

### 25. ¿La forma de resolver dudas se configura para todo el compañero o para cada misión?

**Confirmado.** Hay una configuración global que se aplica por defecto. Una configuración diferente dentro de la misión prevalece sobre la global para los ajustes que cambie.

**Aclaración confirmada.** «Proyecto» se había usado como equivalente a «misión». También se plantea que las misiones grandes se organicen como proyectos con submisiones o hitos elegidos por el agente, pero esa estructura sigue siendo una idea por concretar.

### 26. En modo de consulta, ¿puede elegir solo detalles pequeños, como el nombre de un archivo?

**Confirmado.** Sí. Puede resolver detalles pequeños por su cuenta. Las decisiones importantes requieren consulta en este modo.

**Pendiente de concretar:** ejemplos y criterios que distingan un detalle pequeño de una decisión importante.

### 27. En modo de decisión autónoma, ¿quieres un resumen de las decisiones importantes que tomó?

**Confirmado.** Sí, siempre debe haber un resumen de las decisiones importantes. Debe ser breve y útil, sin ruido ni informes innecesarios. Se quiere apoyar este comportamiento con skills cuando se prepare el harness; su implementación queda para esa fase.

### 28. ¿Las preguntas deberían incluir una recomendación y dos o tres respuestas fáciles de elegir?

**Confirmado.** Las preguntas ofrecen dos o tres respuestas fáciles de elegir y una opción «Ninguna de las anteriores» que permite escribir una respuesta personalizada.

**Propuesta del asistente, sin confirmar expresamente:** señalar una opción recomendada cuando el compañero tenga criterio suficiente para hacerlo.

### 29. Si acumula diez preguntas, ¿las reúne en una revisión o te las comunica una por una?

**Confirmado.** Las presenta una a una.

### 30. Si descubre que tu objetivo contiene dos instrucciones incompatibles, ¿cuál debería prevalecer en modo autónomo?

**Confirmado.** En modo autónomo, el agente elige cómo resolver las instrucciones incompatibles. La decisión importante se recoge en el resumen correspondiente, según la pregunta 27, y no modifica los permisos configurados.

## Bloque 6. Servicios conectados y propiedad

### 31. ¿El usuario conecta sus propias cuentas de Vercel y Supabase o nosotros le proporcionamos el alojamiento?

**Parcial.** El usuario debe poder conectar sus propias cuentas de Vercel y Supabase. A Juanma también le gustaría que pudiéramos proporcionar los recursos directamente, pero quiere conocer su viabilidad y complejidad antes de decidir. El uso inicial será personal y experimental, con un alcance funcional amplio. La base de usuarios en el Supabase de nuestra plataforma se preparará desde el inicio; esa decisión no resuelve quién paga o proporciona el alojamiento de las aplicaciones generadas.

**Propuesta del asistente, sin confirmar:** empezar conectando las cuentas del usuario para reducir el trabajo de administrar recursos y facturación de otras personas. Mantener el alojamiento gestionado por nosotros como posibilidad por estudiar.

### 32. ¿Podría empezar con recursos gestionados por nosotros y trasladarlos a sus cuentas después?

**Fuera de alcance actual.** La migración de recursos gestionados por nosotros a cuentas del usuario se pospone. No forma parte de esta fase del proyecto.

### 33. ¿Aceptarías que la primera publicación requiera crear o conectar esas cuentas?

**Confirmado.** Sí. En el onboarding se pregunta si el usuario quiere desarrollar aplicaciones. Si es así, la propia aplicación ofrece un recorrido sencillo para crear, si hace falta, y conectar sus cuentas de Vercel y Supabase.

**Experiencia deseada.** Botones «Conectar Supabase» y «Conectar Vercel», autorización en cada proveedor, regreso a nuestra aplicación y una confirmación clara de conexión. Un tutorial breve explica los pasos. Esta experiencia pertenece a nuestra aplicación, no a cada aplicación que genere el compañero.

**Pendiente técnico:** elegir y probar cómo se autoriza el acceso de las herramientas o MCP del compañero. La conexión deseada no se da por implementada ni verificada.

**Viabilidad comprobada en documentación oficial:**

- Supabase documenta un botón «Connect Supabase» y autorización OAuth para que una aplicación gestione organizaciones y proyectos del usuario mediante su API de administración. [Guía oficial](https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration).
- Vercel documenta integraciones con autorización OAuth y permisos para gestionar proyectos y despliegues mediante su API. [Guía oficial](https://vercel.com/docs/integrations/create-integration/vercel-api-integrations).
- Vercel MCP tiene su propio flujo de autorización y requiere un cliente aprobado. No se puede asumir que una integración propia podrá usarlo directamente ni que las credenciales de la API sean intercambiables con las del MCP. [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp).
- Supabase MCP también documenta un flujo de autorización en el navegador. Su conexión al compañero se debe probar por separado de la integración de administración de nuestra aplicación. [Supabase MCP](https://supabase.com/docs/guides/ai-tools/mcp).

**Valoración del asistente.** La experiencia de dos botones y un tutorial es viable como dirección de diseño. El trabajo real incluye registrar las integraciones, completar la autorización, guardar y renovar las conexiones, aplicar los permisos y comprobar qué recursos puede usar el compañero. No se fija una estimación de tiempo sin elegir y probar el harness.

**Propuesta de recorrido, sin confirmar:** si el usuario indica que quiere crear aplicaciones, mostrar «Conectar Supabase» y «Conectar Vercel», ayudarle a crear las cuentas que le falten, confirmar las conexiones y devolverlo a su misión. Si no quiere conectarlas todavía, permitir completar el onboarding y volver a este paso cuando una misión lo necesite. La autorización de una cuenta existente no crea por sí sola una cuenta nueva.

### 34. ¿El compañero puede crear proyectos nuevos y también trabajar sobre proyectos existentes?

**Confirmado.** Sí, ambas cosas. También puede crear nuevos proyectos por iniciativa propia si cree que ayudarán al usuario, respetando los permisos configurados y la aprobación humana obligatoria de compras.

### 35. Además de publicar aplicaciones, ¿qué conexiones tienen valor desde el principio: archivos, repositorios de código, correo, calendario?

**Parcial.** Juanma considera útiles todas las conexiones mencionadas: archivos, repositorios de código, correo y calendario. Quiere que las integraciones sean sencillas y que Vercel y Supabase estén contemplados desde el inicio para desarrollar aplicaciones. Git sigue siendo necesario y GitHub no se ha convertido en un requisito.

**Pendiente de concretar:** cuáles de esas conexiones se implementan en la primera versión. Considerarlas útiles no confirma que todas deban construirse de inmediato.

**Aclaración relacionada sobre las entregas.** Los resultados marcan finales de etapa. Solo se presentan como productos finales cuando el usuario lo solicita expresamente; esta aclaración también se recoge en las preguntas 10 y 37.

### 36. ¿Quieres elegir qué servicios usa o prefieres que el compañero proponga lo necesario según la misión?

**Confirmado.** El compañero elige los servicios necesarios según la misión para mantener la experiencia sencilla. El usuario puede indicar un servicio o una forma de trabajar diferente, y el compañero debe tenerlo en cuenta. Elegir un servicio no habilita por sí solo su acceso ni autoriza compras.

## Propuestas adicionales de esta ronda

Estas propuestas no son decisiones confirmadas.

- **Permisos adicionales a estudiar:** leer información privada, modificar archivos o datos, crear recursos externos y conectar nuevos servicios. Mantener publicar, enviar, borrar y comprar como acciones distinguibles. Agrupar las opciones en el menú avanzado para evitar una lista interminable en la experiencia principal.
- **Compras:** aplicar la aprobación humana en la ejecución de la herramienta de compra, no depender únicamente de que el agente recuerde una instrucción. El presupuesto limita las propuestas de compra; no reemplaza el botón de aprobación.
- **Costes:** distinguir el consumo normal de una misión, los recursos externos que pueden generar cargos y las compras puntuales. Falta acordar qué aprobación requiere crear o ampliar un recurso que cobra por uso, así como las renovaciones automáticas.
- **Prioridades:** mostrar etiquetas sencillas como «Alta», «Normal» y «Baja». El compañero asigna la prioridad y el usuario puede cambiarla. Esos nombres son una propuesta, no niveles ya elegidos.

## Pendientes que se mantienen tras las aclaraciones

- **11:** concretar el límite de esfuerzo cuando no hay fecha y cómo se avisa de un retraso. Ya están confirmadas la fecha opcional y recomendable, la entrega presentable y la continuación dentro del presupuesto.
- **19 y 25:** concretar si las misiones grandes tendrán submisiones y cómo recibirán la configuración los agentes internos. La configuración global con ajustes por misión ya está confirmada.
- **31:** decidir si, en esta fase experimental, solo se usan cuentas del usuario o también se proporcionan recursos gestionados por nosotros.
- **48 y 49:** concretar los responsables, la frecuencia y la comprobación de resultados de los turnos de mejora. Ya están confirmados los ajustes de horarios, carga, instrucciones, skills y herramientas, además del trabajo activo, la vigilancia con horarios y la revisión diaria de mejoras cuando está libre.
- **51 a 54:** fijar capacidad, precios y medición de los tres niveles de nuestra suscripción; decidir el coste del servicio cuando el usuario aporta sus propias claves y validar las conexiones de suscripciones externas. La preferencia por una suscripción propia y la posibilidad de aportar API keys ya están confirmadas.

Las 60 preguntas tienen ya respuestas, aclaraciones, propuestas o un estado pendiente explícito. Las aclaraciones de las preguntas 15, 24, 25 y 30 están resueltas, al igual que las respuestas R1–R8. La pregunta 32 queda expresamente fuera del alcance actual. Completar el recorrido de preguntas no convierte los detalles pendientes en decisiones confirmadas.

## Bloque 7. Qué entrega y cuándo termina

### 37. ¿Quién da una misión por terminada: el compañero, tú o una comprobación acordada al principio?

**Confirmado.** Cuando el compañero considera que ha completado una misión, notifica al usuario que está terminada y pausa la ejecución de esa misión. El usuario puede confirmar que está completada o indicar que necesita continuar. La pausa afecta a esa misión; no implica detener las demás.

**Distinción ya acordada.** Las entregas intermedias cierran etapas. Solo se presentan como productos finales cuando el usuario lo pide expresamente.

### 38. Para una aplicación, ¿qué debe comprobar antes de entregarla: que abre, que sus funciones principales funcionan, que guarda datos correctamente?

**Confirmado.** Debe comprobar que la aplicación abre, que los datos se guardan correctamente y que funcionan todas las funcionalidades solicitadas por el usuario. La revisión debe cubrir lo pedido; no basta con comprobar que carga la página inicial.

**Confirmado.** Uno de los agentes revisores se encarga de estas comprobaciones.

**Herramienta candidata de Juanma.** Playwright MCP o una herramienta equivalente puede utilizarse para probar la aplicación en el navegador. La herramienta concreta y las comprobaciones complementarias se decidirán al implementar el sistema de revisión.

### 39. Para una investigación, ¿esperas un documento completo, una recomendación breve, una tabla o una combinación?

**Confirmado.** Se entrega un documento HTML bonito, muy visual y basado en plantillas prediseñadas que priorizan las imágenes. Al configurar cómo quiere recibir las investigaciones, el usuario ve dos o tres plantillas y elige la que prefiere. Esa preferencia se utiliza para preparar los informes posteriores.

**Pendiente de concretar:** el momento exacto de esa elección inicial y la posibilidad de cambiar de plantilla para una investigación concreta. Las plantillas todavía no se han diseñado.

### 40. ¿Quieres ver versiones intermedias para orientar el trabajo?

**Confirmado.** Sí. El compañero muestra versiones intermedias e informa de qué está haciendo y por dónde va para que el usuario pueda orientar el trabajo. Esto complementa las propuestas iniciales y la primera versión pequeña ya acordadas.

**Pendiente de concretar:** frecuencia y forma de presentar esos avances sin saturar al usuario.

### 41. Cuando entregas una corrección, ¿reabre la misma misión o crea una nueva?

**Confirmado.** Reabre la misma misión y continúa sobre ella, conservando su contexto y su trabajo anterior.

### 42. Después de publicar una aplicación, ¿el compañero sigue manteniéndola o necesita una misión de mantenimiento?

**Confirmado.** Da por terminada la misión de construcción y propone enseguida al usuario una misión de mantenimiento de la aplicación. Si el usuario acepta, inicia ese trabajo de mantenimiento. No lo activa automáticamente por haber publicado la aplicación.

**Pendiente de concretar:** alcance, frecuencia y presupuesto del mantenimiento.

## Bloque 8. Memoria y aprendizaje

### 43. ¿Qué debería recordar siempre sobre ti: gustos, forma de trabajar, proyectos, presupuesto?

**Confirmado.** Recuerda la información que el usuario quiera compartir: personalidad, gustos, objetivos y otros aspectos útiles para ayudarle. El primer chat al abrir la aplicación es un onboarding conversacional con preguntas que alimentan esa memoria persistente.

**Estructura general confirmada.** La memoria usa archivos de Obsidian en EC2 organizados por temas. El agente lee primero el inicio o resumen relevante para decidir si necesita consultar el contenido completo. Los detalles del sistema anterior de Juanma y el formato exacto se aportarán al preparar la imagen de EC2.

### 44. ¿Comparte lo aprendido entre todas las misiones o cada proyecto conserva su propio contexto?

**Confirmado.** Cada misión o proyecto conserva su propio contexto. Además, el compañero aprende durante las conversaciones y puede incorporar preferencias generales del usuario a su memoria persistente cuando corresponda. El contexto de una misión y la información general del usuario tienen ámbitos diferentes.

### 45. ¿Puedes abrir una vista sencilla de «lo que sabe de mí» y corregirla?

**Confirmado.** Sí. La aplicación tendrá una interfaz gráfica para consultar lo que el compañero sabe del usuario y corregir esa información. La interfaz representa la memoria de Obsidian que vive dentro de EC2.

**Pendiente de concretar:** diseño de la interfaz y forma de sincronizar las correcciones con los archivos de memoria.

### 46. ¿Debería preguntarte antes de guardar ciertos datos personales?

**Confirmado.** Sí. Antes de guardar ciertos datos personales, debe preguntar al usuario.

**Pendiente de concretar:** qué datos requieren esa consulta y cómo se presenta.

### 47. Cuando corriges algo, ¿aprende una preferencia general o la aplica solo a ese trabajo?

**Confirmado.** El agente decide según el contexto si la preferencia pertenece únicamente a la misión o si describe una preferencia general del usuario. La guarda en el ámbito correspondiente y la tiene en cuenta en trabajos futuros, respetando la consulta previa sobre ciertos datos personales.

### 48. Cuando hablamos de que «mejora solo», ¿quieres que aprenda preferencias, cambie su manera de trabajar o añada nuevas herramientas?

**Confirmado.** La automejora incluye actualizar su memoria, aprender lo que le gusta al usuario y aplicar esas preferencias en el futuro.

**Confirmado.** Dentro de EC2 habrá una carpeta de propuestas de mejora. El agente registra en ella ideas surgidas durante el trabajo, como cambiar su manera de trabajar o añadir una herramienta que necesite. Un proceso periódico revisa las propuestas, valora cuáles conviene aplicar y cuáles no, y actúa respetando los permisos del usuario y las aprobaciones obligatorias de compras.

**Frecuencia confirmada posteriormente.** Una revisión diaria busca mejoras cuando el compañero está libre. La pregunta 49 recoge el ritmo elegido.

**Aclaración confirmada.** Los agentes se comunican y se mejoran entre sí. Habrá turnos especiales para revisar el progreso y ajustar horarios, frecuencia, prioridades, reparto del trabajo, instrucciones, skills y herramientas según si se está llegando al objetivo. Es la parte del sistema de CyberRoot que Juanma quiere reutilizar. Los ajustes respetan el presupuesto y los permisos; modificar el código del propio harness no forma parte de la opción elegida.

**Pendiente para la fase de EC2 y harness:** estructura de esa carpeta, formato de las propuestas, responsables de la revisión y aplicación, forma de comprobar una mejora y límites de los cambios que puede aplicar por su cuenta. Juanma aportará más detalles en ese momento. No se ha elegido todavía un harness.

## Bloque 9. Ritmo, dinero y disponibilidad

### 49. ¿Debe trabajar continuamente, solo cuando tiene misiones o también en horarios programados?

**Confirmado: ritmo combinado.** Las misiones activas avanzan cuando hay trabajo; la vigilancia se ejecuta con horarios y una revisión diaria busca mejoras cuando el compañero está libre. El trabajo se mantiene dentro de la capacidad y los permisos disponibles y respeta las pausas del usuario.

**Confirmado.** Habrá turnos especiales en los que los agentes se comuniquen, se ayuden a mejorar y reajusten su programación para dedicar más o menos carga diaria según el progreso hacia el objetivo. Estos turnos complementan el trabajo activo y las revisiones de mejoras; no implican que todo deba esperar a una hora fija.

**Alcance confirmado.** Además del reparto del trabajo, pueden ajustar instrucciones, skills y herramientas, manteniendo los permisos y el presupuesto disponibles. La respuesta R7 concreta esta capacidad.

**Propuesta del asistente, sin confirmar.** Comprobar si hay trabajo pendiente sin consultar a la IA cuando baste una comprobación simple, y activarla al encontrar algo concreto que revisar o hacer. Mantener las pausas como estado explícito para que ningún turno programado reactive una misión pausada por el usuario.

**Experiencia propuesta.** Explicar «trabaja en tus misiones y revisa novedades según lo acordado», dejando cronjobs y horarios internos fuera de la configuración habitual del usuario.

**Pendiente de concretar:** frecuencia y responsables de los turnos especiales, criterio para aumentar o reducir carga y reparto de la capacidad entre misiones, vigilancia y mejoras. Elegir el mecanismo de programación y decidir si EC2 permanece encendida o se detiene durante el reposo. Programar el trabajo de IA no decide por sí solo el ciclo de vida de la instancia.

### 50. Cuando no tiene tareas, ¿espera o busca mejoras que podría proponerte?

**Confirmado.** Busca mejoras. Puede utilizar lo que sabe del usuario para identificar trabajo útil y alimentar su carpeta de propuestas de mejora, respetando los permisos y límites disponibles.

**Frecuencia confirmada.** Una revisión diaria busca mejoras cuando está libre, según la pregunta 49.

**Pendiente de concretar:** capacidad que se reserva a esta iniciativa y cómo se retoma una revisión si una misión necesita al compañero.

### 51. ¿Qué debería comprar una suscripción mayor: más trabajo, más rapidez, más misiones simultáneas o acceso a capacidades distintas?

**Confirmado.** Un nivel superior proporciona más capacidad de trabajo y más rapidez, con la posibilidad de realizar más trabajo o mejores trabajos. En esta fase no se busca obtener beneficio económico con el servicio; el gasto debe servir para proporcionar capacidad.

**Confirmado.** Después de planificar una misión, el agente comunica una estimación del tiempo necesario basada en el plan de trabajo y el nivel contratado.

**Propuesta del asistente, sin confirmar:** presentar un intervalo de tiempo orientativo para la próxima entrega y actualizarlo si cambian el alcance, las prioridades, los bloqueos o la capacidad disponible. Separar esa estimación de una fecha límite elegida por el usuario.

**Aclaración confirmada.** La preferencia es ofrecer nuestra propia suscripción, incluyendo el consumo de IA. También debe existir la posibilidad de aportar API keys propias. Integrar suscripciones de Codex, Claude u otros proveedores es una alternativa que depende de las conexiones admitidas por cada proveedor; en esa modalidad el usuario paga la suscripción al proveedor.

**Pendiente de concretar:** qué capacidad y rapidez ofrece realmente cada nivel, el coste del servicio si el usuario aporta sus propias claves y qué proveedores se conectarán primero. No se prometen multiplicadores ni tiempos fijos.

### 52. ¿Prefieres los cinco niveles originales o empezar con una oferta más pequeña y fácil de explicar?

**Confirmado.** Tres niveles de capacidad. Sustituyen la propuesta inicial de cinco niveles. Sus nombres, precios y límites concretos todavía no están definidos.

### 53. ¿La cuota incluye solo el trabajo del compañero o también los gastos de las aplicaciones que crea?

**Confirmado.** Incluye el trabajo del compañero. Los gastos de las aplicaciones que crea no se incluyen en esa cuota.

**Aclaración confirmada.** En la modalidad preferida de suscripción propia, la cuota incluye el consumo de IA del compañero. Aportar una API key propia es otra modalidad: la facturación de esas llamadas depende de la cuenta del usuario en el proveedor.

**Pendiente de concretar:** cómo se cubren los costes de EC2 y de la infraestructura del propio compañero, y cómo se muestran por separado los recursos externos de cada aplicación.

### 54. Si agota el presupuesto, ¿pausa, entrega lo conseguido o te ofrece ampliar el límite?

**Confirmado.** Ofrece ampliar el límite. La oferta debe tener en cuenta la suscripción contratada y la capacidad que esa suscripción permite ampliar. Cualquier compra o pago sigue necesitando aprobación humana.

**Dirección de exploración de Juanma.** Buscar una herramienta de código abierto para medir el consumo y estudiar si una suscripción de IA, como el acceso a Codex incluido en un plan, puede aprovecharse desde otro harness sin contratar consumo adicional por API. Todavía no se ha elegido herramienta ni se ha confirmado el acceso desde el producto propuesto.

**Medición comprobada en documentación:**

- `ccusage` es un proyecto de código abierto con licencia MIT que lee registros locales de Codex, Pi y Hermes, entre otros, y puede exportar informes en JSON. [Proyecto](https://github.com/ccusage/ccusage), [fuentes soportadas](https://ccusage.com/guide/all-reports).
- En Codex, su coste en dólares es una estimación equivalente al uso por API, no el saldo de créditos ni la factura de una suscripción. El soporte de registros de Codex se documenta como experimental. [Guía de Codex en ccusage](https://ccusage.com/guide/codex/).
- Codex App Server documenta consultas de límites del plan y de actividad de tokens, además de eventos de consumo por conversación. Son una fuente candidata para medir capacidad disponible; deben probarse con la autenticación elegida. [Documentación oficial](https://learn.chatgpt.com/docs/app-server).

**Uso de una suscripción de IA comprobado en documentación oficial:**

- Codex distingue acceso mediante inicio de sesión con ChatGPT y acceso mediante una API key, que se factura por uso. [Autenticación](https://learn.chatgpt.com/docs/auth).
- OpenAI documenta el uso de un plan de ChatGPT en aplicaciones de código abierto y alojadas localmente mediante Sign in with ChatGPT, con una configuración para Codex App Server y una guía para máquinas virtuales autohospedadas. El acceso depende de la elegibilidad y de los permisos del usuario. Para una aplicación de pago o alojada como servicio remoto, la documentación remite a un formulario de interés; no confirma acceso general para nuestro servicio gestionado. [Descripción del acceso](https://developers.openai.com/siwc/token-sharing-open-source), [Codex App Server](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server), [máquinas virtuales](https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms).
- Las peticiones siguen consumiendo el uso disponible del plan o créditos. Aprovechar una suscripción no significa hacer llamadas sin consumir tokens o disponer de capacidad ilimitada. [Uso y límites](https://learn.chatgpt.com/docs/pricing).

**Propuesta del asistente, sin confirmar.** Usar los datos de límites del proveedor para la capacidad restante y los registros de ejecución para atribuir consumo a misiones. Guardar el avance y esperar una ampliación aprobada o una renovación del límite cuando no se pueda continuar. No sustituir automáticamente una suscripción agotada por llamadas de API con gasto adicional. Una estimación de coste no debe presentarse como saldo real de la suscripción.

## Aclaración: suscripción propia y conexiones de IA

**Decisión de producto confirmada.** El recorrido preferido es que el usuario contrate uno de nuestros tres niveles y use el compañero desde nuestra web, sin tener que contratar por separado una cuenta de IA. Se quiere ofrecer también la posibilidad de introducir API keys propias. Aprovechar una suscripción externa es una alternativa deseada, no una integración garantizada.

| Modalidad | Quién paga el consumo de IA | Experiencia deseada | Estado |
| --- | --- | --- | --- |
| Nuestra suscripción | Nosotros cubrimos el consumo incluido con la cuota del usuario. | Elegir nivel y empezar a hablar con el compañero. | Opción principal confirmada; proveedor y cobro pendientes. |
| API key propia | El usuario paga las llamadas con su cuenta del proveedor. | Conectar una clave y trabajar desde nuestra web. | Posibilidad confirmada; precio de nuestro servicio en esta modalidad pendiente. |
| Suscripción externa | El usuario paga su plan a OpenAI, Anthropic u otro proveedor. | Conectar la cuenta desde nuestra web cuando se admita. | Alternativa deseada; viabilidad por proveedor pendiente. |

**Viabilidad comprobada en documentación; todavía sin integración ni prueba real:**

- OpenRouter documenta expresamente que una aplicación SaaS puede crear una clave interna por cliente, medir su consumo y asignarle un límite. Las claves consumen un saldo común de nuestra cuenta. Esto permite financiar la IA desde nuestra suscripción sin exigir al cliente una cuenta de OpenRouter. Es una base candidata, no el proveedor elegido. [Claves y límites por cliente](https://openrouter.zendesk.com/hc/en-us/articles/51680687417499-Can-I-create-one-API-key-per-user-with-its-own-spending-limit-Management-API-keys).
- Los límites de OpenRouter se comprueban por petición: solicitudes simultáneas pueden sobrepasar ligeramente el límite. Sus renovaciones automáticas siguen horarios UTC; habrá que coordinar los límites con el ciclo real de nuestra cuota. Medir la IA no mide por sí solo todos los costes de EC2 y del resto de herramientas. [Funcionamiento de límites](https://openrouter.zendesk.com/hc/en-us/articles/51680687417499-Can-I-create-one-API-key-per-user-with-its-own-spending-limit-Management-API-keys).
- Como diseño propuesto, nuestra aplicación gestionaría el cobro periódico y la asignación de capacidad; OpenRouter suministraría y mediría las llamadas a modelos. Acceder a un modelo no equivale a recibir el sistema completo de Codex o Claude Code: la coordinación, las herramientas y la ejecución del compañero deben resolverse en nuestro producto.
- OpenRouter también ofrece un inicio de sesión que lleva al usuario a autorizar su cuenta y lo devuelve a nuestra web con una clave controlada por él. Esto sirve para conectar su cuenta de OpenRouter; no convierte una suscripción de Codex o Claude en saldo de OpenRouter. [Conectar una cuenta de OpenRouter](https://openrouter.ai/docs/guides/overview/auth/oauth).
- OpenAI documenta el uso del plan de ChatGPT en aplicaciones abiertas y locales; para aplicaciones de pago o alojadas remotamente remite a un formulario de interés. No se presupone acceso para nuestra web gestionada. [Sign in with ChatGPT](https://developers.openai.com/siwc/token-sharing-open-source).
- Anthropic recomienda API keys para productos desarrollados para otras personas. Su actualización del 15 de junio indica que el Agent SDK y ciertas aplicaciones de terceros siguen consumiendo los límites de la suscripción, pero esto no confirma una conexión universal para nuestro servicio. Hay que validar el acceso admitido para nuestro caso; el contenido antiguo de ese anuncio, que proponía créditos mensuales independientes, quedó suspendido. [Autenticación para desarrolladores](https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account), [actualización sobre Agent SDK](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan).

**Propuesta para simplificar, sin confirmar.** Presentar nuestra suscripción como recorrido principal y situar «Usar mi propia clave» y las conexiones externas en ajustes. Mostrar capacidad disponible y qué incluye cada nivel, dejando los detalles de proveedores en una vista opcional. Definir los límites después de medir misiones reales, incluyendo revisores, memoria, vigilancia y propuestas de mejora, además del chat.

**Pendiente de concretar:** proveedor inicial y sistema de cobro; capacidad y precio de cada nivel; costes de infraestructura; condiciones y precio con claves propias; renovación y ampliación de capacidad; disponibilidad de autenticación externa. La compra o ampliación sigue requiriendo aprobación humana. No está confirmado que se puedan contratar y pagar planes externos enteramente dentro de nuestra web: el recorrido puede necesitar pasar por la web del proveedor y volver.

## Bloque 10. Cómo se vive y cómo lo mostramos

### 55. Al abrir la aplicación, ¿qué debe dominar: el compañero, las misiones activas o lo que necesita tu respuesta?

**Confirmado.** La primera entrada se centra por completo en el onboarding con el compañero. En las siguientes entradas se muestran los compañeros en grande; si solo hay uno, se muestra ese único compañero. Al pulsarlo, se abre su espacio con todas sus misiones.

### 56. ¿Quieres un chat general con el compañero y conversaciones dentro de cada misión, o un único lugar para hablar?

**Confirmado.** Un chat general con cada compañero y una conversación propia dentro de cada misión.

### 57. ¿Cuándo debe avisarte fuera de la aplicación: al terminar, al bloquearse, al necesitar permiso o en un resumen diario?

**Confirmado.** Un resumen diario y avisos cuando una misión termina, se bloquea o necesita permiso del usuario.

**Pendiente de concretar:** canal de notificación, horario del resumen y ajustes del usuario para esos avisos.

### 58. ¿Qué hace especial su identidad: nombre, aspecto, tono al hablar, pequeños gestos, evolución con el tiempo?

**Confirmado.** Tiene nombre, aspecto y evolución con el tiempo. Al crear un compañero, la IA genera una propuesta de identidad. El usuario puede configurar el nombre y el aspecto. La identidad mantiene la orientación cercana y práctica ya acordada.

**Pendiente de concretar:** qué cambios expresa su evolución y cómo se presentan al usuario.

### 59. Para el HTML resumen, ¿prefieres capturas de experiencias imaginadas, ilustraciones del compañero, fotografías de situaciones de uso o una mezcla?

**Confirmado.** Una mezcla de fotografías, ilustraciones y capturas, con más imágenes y símbolos que texto. Además, cuando el compañero crea una aplicación, se desea que produzca capturas o vídeos de esa aplicación para mostrar el resultado y sus avances.

**Viabilidad comprobada.** Playwright se ejecuta en Linux con un navegador sin interfaz visible y permite guardar capturas y grabar recorridos en vídeo. Por ello, una EC2 con un sistema compatible, los navegadores y sus dependencias puede realizar esas capturas y grabaciones. Es una conclusión de viabilidad a partir de la documentación; todavía no se ha probado nuestra imagen de EC2. [Ejecución en servidores](https://playwright.dev/docs/ci), [capturas](https://playwright.dev/docs/screenshots), [vídeos](https://playwright.dev/docs/videos).

**Propuesta del asistente, sin confirmar:** empezar con capturas de los recorridos principales y grabar vídeos cortos cuando aporten información útil. Se puede aprovechar el recorrido del agente revisor para generar evidencia visual de las funcionalidades.

**Pendiente técnico:** preparación y prueba en la imagen EC2, almacenamiento de las capturas y vídeos y presentación en la aplicación. El [HTML resumen del proyecto](resumen.html) ya se ha preparado después de estructurar las decisiones: combina fotografía e ilustración conceptual con una demostración de interfaz; no representa una aplicación implementada.

### 60. ¿Qué tres historias deben demostrar la idea? Por ejemplo: «crea mi negocio online», «investiga una decisión» y «vigila algo por mí».

**Confirmado.** Los tres casos principales son:

1. Crear un negocio o una aplicación online.
2. Investigar un tema, una pregunta o una decisión.
3. Mantenerse atento a novedades, actualizaciones o algo que el usuario quiera vigilar.

Estas historias guían las primeras demostraciones y el resumen visual, sin limitar el producto a esas únicas capacidades.
