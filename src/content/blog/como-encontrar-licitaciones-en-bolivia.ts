import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "como-encontrar-licitaciones-en-bolivia",
  title: "Cómo encontrar licitaciones en Bolivia: 5 métodos y alertas",
  description:
    "Aprende a encontrar licitaciones en Bolivia: portal SICOES, filtros, PAC, palabras clave por rubro, alertas por email y una rutina diaria de 10 minutos.",
  tldr:
    "Para encontrar licitaciones en Bolivia, revisa cada día la sección Convocatorias de sicoes.gob.bo, filtra por entidad, departamento y rubro, usa palabras clave con sinónimos, sigue el Programa Anual de Contrataciones (PAC) para anticiparte y activa alertas por email. Ordena siempre por fecha de cierre y verifica cada proceso en el documento base de contratación (DBC).",
  category: "Estrategia",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "cómo encontrar licitaciones en Bolivia",
    "buscar licitaciones Bolivia",
    "convocatorias SICOES",
    "alertas de licitaciones",
    "programa anual de contrataciones PAC",
    "licitaciones por departamento",
    "palabras clave licitaciones",
    "contrataciones estatales Bolivia",
  ],
  sections: [
    {
      id: "como-encontrar-licitaciones",
      heading: "¿Cómo encontrar licitaciones en Bolivia?",
      blocks: [
        {
          type: "p",
          text:
            "La forma más confiable de encontrar licitaciones en Bolivia es consultar la sección **Convocatorias** del portal oficial [sicoes.gob.bo](https://www.sicoes.gob.bo), administrado por el Ministerio de Economía y Finanzas Públicas (MEFP), donde las entidades públicas publican sus procesos para contratar bienes, obras, servicios generales y consultorías. Todo lo demás (alertas, directorios, grupos) sirve para llegar más rápido a esa fuente, no para reemplazarla.",
        },
        {
          type: "p",
          text:
            "Encontrar oportunidades no es difícil; lo difícil es hacerlo de forma constante. Una empresa que revisa el portal un día a la semana suele enterarse tarde de procesos con plazos cortos. Por eso este artículo combina cinco métodos complementarios, listas de palabras clave por rubro y una rutina diaria de 10 minutos que puedes sostener sin dedicarle medio día a la búsqueda.",
        },
        {
          type: "p",
          text:
            "Antes de empezar, conviene tener claro qué buscas. Si aún no conoces los tipos de proceso, lee primero [las modalidades de contratación estatal en Bolivia](/blog/modalidades-de-contratacion-estatal-bolivia): según el D.S. 0181, la Contratación Menor va de Bs 1 hasta Bs 50.000, el ANPE (Apoyo Nacional a la Producción y Empleo) abarca montos mayores a Bs 50.000 hasta Bs 1.000.000 y la Licitación Pública corresponde a montos mayores a Bs 1.000.000. Saber en qué rango trabaja tu empresa te ayuda a descartar rápido lo que no te conviene.",
        },
        {
          type: "table",
          caption: "Los 5 métodos para encontrar licitaciones, comparados",
          head: ["Método", "Esfuerzo", "Ventaja principal", "Limitación"],
          rows: [
            [
              "1. Portal oficial (Convocatorias)",
              "Medio: requiere revisión diaria",
              "Fuente primaria, información completa y DBC descargable",
              "Depende de que te acuerdes de entrar y de filtrar bien",
            ],
            [
              "2. Filtros por entidad, departamento y rubro",
              "Medio: hay que definir criterios",
              "Reduce el ruido y deja solo lo relevante",
              "Un filtro muy estrecho puede dejar fuera oportunidades",
            ],
            [
              "3. Páginas por departamento, municipio y rubro",
              "Bajo: consulta rápida sin cuenta",
              "Vista ordenada por zona o actividad",
              "Son un resumen; el detalle se confirma en el portal oficial",
            ],
            [
              "4. Alertas por email",
              "Bajo una vez configuradas",
              "Llegan a tu bandeja sin que tengas que buscar",
              "Debes ajustar rubros y palabras clave para no recibir ruido",
            ],
            [
              "5. Programa Anual de Contrataciones (PAC)",
              "Medio: revisión periódica",
              "Te permite anticipar contrataciones antes de la convocatoria",
              "Es una planificación: puede cambiar o no concretarse",
            ],
          ],
        },
      ],
    },
    {
      id: "metodo-portal-oficial",
      heading: "Método 1: ¿cómo buscar en el portal oficial de SICOES?",
      blocks: [
        {
          type: "p",
          text:
            "Para buscar en el portal oficial, entra a sicoes.gob.bo y abre la sección Convocatorias, que lista los procesos publicados por las entidades públicas. Puedes consultar las convocatorias sin cuenta; el registro en el RUPE (Registro Único de Proveedores del Estado) se vuelve necesario cuando quieres participar, por ejemplo para ofrecer propuestas electrónicas, y debes verificar en la norma y el portal cuándo aplica a tu caso.",
        },
        {
          type: "p",
          text:
            "El portal tiene otras secciones útiles además de Convocatorias: Requerimiento de Personal (donde se publican convocatorias de personal y consultoría individual), Arrendamiento remate y otros, Contrataciones de otros países, Formularios, Destino de Bienes, RUPE, Normativa y el Programa Anual de Contrataciones (PAC). Conocerlas te evita buscar en el lugar equivocado. Si necesitas una guía de navegación completa, revisa [sicoes.gob.bo: cómo ingresar y buscar convocatorias](/blog/sicoes-gob-bo-como-ingresar-y-buscar-convocatorias).",
        },
        {
          type: "p",
          text:
            "Cada proceso tiene un **CUCE** (Código Único de Contrataciones Estatales) y muestra datos como la entidad, el objeto de la contratación, el tipo o modalidad, la fecha de publicación, la fecha de presentación de propuestas, el estado, el documento base de contratación (DBC) y los formularios. Al revisar un proceso, anota siempre el CUCE: es la referencia que no cambia y que te permite volver a encontrarlo.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Qué leer primero en cada convocatoria",
          text:
            "Lee en este orden: objeto de la contratación, entidad, modalidad, fecha de presentación de propuestas y, recién entonces, el DBC. Si el objeto no coincide con lo que tu empresa hace, ahorraste tiempo; si coincide, la fecha de cierre te dice cuánto margen tienes.",
        },
      ],
    },
    {
      id: "metodo-filtros-y-paginas",
      heading: "Métodos 2 y 3: ¿cómo filtrar por entidad, departamento y rubro?",
      blocks: [
        {
          type: "p",
          text:
            "Filtrar consiste en limitar la búsqueda a las entidades, la zona geográfica y el tipo de objeto que realmente te interesan. En términos prácticos, defines tres criterios (dónde puedes operar, qué vendes y a qué entidades les has vendido o te gustaría vender) y los aplicas cada día. Los criterios disponibles en el portal pueden cambiar con el tiempo, así que verifica en pantalla qué opciones ofrece al momento de tu consulta.",
        },
        {
          type: "h3",
          text: "Filtrar por entidad",
        },
        {
          type: "p",
          text:
            "Las entidades repiten patrones: un municipio que contrata mantenimiento vial probablemente volverá a hacerlo. Haz una lista corta de 5 a 10 entidades prioritarias (gobernaciones, municipios, universidades, empresas públicas) y revisa sus publicaciones con frecuencia. Con el tiempo aprenderás cómo redactan sus requisitos, y eso es una ventaja real al preparar propuestas.",
        },
        {
          type: "h3",
          text: "Filtrar por departamento y municipio",
        },
        {
          type: "p",
          text:
            "Si tu operación es regional, trabajar por zona evita revisar procesos que no podrías ejecutar. En SICOES Monitor, que es un servicio independiente, puedes consultar sin crear una cuenta páginas por departamento: [La Paz](/licitaciones/departamento/la-paz), [Santa Cruz](/licitaciones/departamento/santa-cruz), [Cochabamba](/licitaciones/departamento/cochabamba), [Oruro](/licitaciones/departamento/oruro), [Potosí](/licitaciones/departamento/potosi), [Tarija](/licitaciones/departamento/tarija), [Chuquisaca](/licitaciones/departamento/chuquisaca), [Beni](/licitaciones/departamento/beni) y [Pando](/licitaciones/departamento/pando). También hay páginas por municipio: [Sacaba](/licitaciones/municipio/sacaba), [El Alto](/licitaciones/municipio/el-alto), [Quillacollo](/licitaciones/municipio/quillacollo), [Tiquipaya](/licitaciones/municipio/tiquipaya), [Vinto](/licitaciones/municipio/vinto), [Viacha](/licitaciones/municipio/viacha) y [Sucre](/licitaciones/municipio/sucre).",
        },
        {
          type: "h3",
          text: "Filtrar por rubro",
        },
        {
          type: "p",
          text:
            "Las páginas por rubro agrupan convocatorias vigentes por actividad: [construcción](/licitaciones/categoria/construccion), [tecnología](/licitaciones/categoria/tecnologia), [salud](/licitaciones/categoria/salud), [consultoría](/licitaciones/categoria/consultoria), [servicios](/licitaciones/categoria/servicios), [mantenimiento](/licitaciones/categoria/mantenimiento), [logística](/licitaciones/categoria/logistica) y [educación](/licitaciones/categoria/educacion). El listado general está en [/licitaciones](/licitaciones). Son una forma cómoda de explorar, pero recuerda que SICOES Monitor lee solo convocatorias nacionales vigentes y no reemplaza la verificación en sicoes.gob.bo.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "No filtres demasiado",
          text:
            "Un error común es filtrar tan fino que nunca aparece nada. Una convocatoria de «suministro de equipos» puede ser relevante para una empresa de tecnología aunque no diga «software». Empieza con filtros amplios por rubro y departamento, y recién después afina con palabras clave.",
        },
      ],
    },
    {
      id: "metodo-alertas-email",
      heading: "Método 4: ¿sirven las alertas por email para encontrar licitaciones?",
      blocks: [
        {
          type: "p",
          text:
            "Sí, las alertas por email sirven porque eliminan el paso de acordarse de buscar: el resumen llega a tu bandeja y tú solo decides qué procesos revisar. Su valor real depende de que estén bien configuradas (rubros y palabras clave correctos) y de que verifiques cada proceso en el portal oficial antes de invertir tiempo en una propuesta.",
        },
        {
          type: "p",
          text:
            "Hay varias opciones en el mercado, con enfoques distintos (correo, WhatsApp, directorios con archivo). Si quieres compararlas con criterios claros, lee [herramientas de alertas de licitaciones en Bolivia](/blog/herramientas-de-alertas-de-licitaciones-bolivia). Un criterio que conviene mirar siempre es qué fuente de datos usa el servicio y con qué frecuencia actualiza, porque una alerta tardía pierde su sentido.",
        },
        {
          type: "p",
          text:
            "**SICOES Monitor** es un servicio gratuito e independiente de Ribentek, no afiliado al Estado. Lee a diario las convocatorias nacionales vigentes de SICOES, las prioriza con inteligencia artificial según el perfil de tu empresa y tus palabras clave, y te envía un resumen por email a las 9 am (hora de Bolivia) con un puntaje de relevancia y un enlace directo al proceso. Tiene límites claros: solo cubre convocatorias nacionales, no ofrece alertas de requerimiento de personal y no permite presentar propuestas.",
        },
        {
          type: "ul",
          items: [
            "Elige tus rubros reales, no todos los que existen: más rubros significan más ruido.",
            "Carga palabras clave con sinónimos (ver la sección siguiente).",
            "Revisa el resumen a una hora fija, idealmente al llegar.",
            "Verifica siempre en sicoes.gob.bo y en el DBC antes de decidir.",
          ],
        },
      ],
    },
    {
      id: "metodo-pac",
      heading: "Método 5: ¿qué es el PAC y cómo ayuda a anticipar licitaciones?",
      blocks: [
        {
          type: "p",
          text:
            "El PAC es el **Programa Anual de Contrataciones**: una sección del portal de SICOES donde se consulta la planificación de contrataciones de las entidades públicas. Sirve para anticiparte, es decir, para saber qué podría convocarse más adelante y empezar a preparar tu documentación, tu RUPE y tus alianzas antes de que se publique la convocatoria.",
        },
        {
          type: "p",
          text:
            "Conviene tratar el PAC como una señal de planificación y no como una garantía. Una contratación programada puede modificarse, postergarse o no realizarse, y los plazos reales solo se conocen cuando aparece la convocatoria con su DBC. Aun así, el seguimiento del PAC cambia la forma de trabajar: pasas de reaccionar a un cierre cercano a preparar con calma.",
        },
        {
          type: "ol",
          items: [
            "Entra a la sección PAC del portal y ubica las entidades de tu lista prioritaria.",
            "Anota las contrataciones relacionadas con tu rubro y la época aproximada en que se prevén.",
            "Verifica que tu registro en el RUPE esté activo y con información vigente (consulta [cómo registrarte en el RUPE](/blog/como-registrarse-en-el-rupe-bolivia)).",
            "Prepara con anticipación los documentos que suelen pedirse: experiencia, personal clave, estados financieros, según lo que indique cada DBC.",
            "Cuando salga la convocatoria, compara el DBC con lo que ya preparaste y ajusta.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Un calendario propio",
          text:
            "Crea una hoja simple con entidad, objeto previsto, mes estimado y estado (seguimiento, convocada, descartada). Cada vez que una contratación del PAC aparezca como convocatoria, cambia su estado y registra el CUCE.",
        },
      ],
    },
    {
      id: "redes-y-grupos",
      heading: "¿Sirven los grupos de WhatsApp y las redes para enterarse de licitaciones?",
      blocks: [
        {
          type: "p",
          text:
            "Los grupos y las redes pueden servir como aviso complementario, pero nunca como fuente única: la información que circula allí puede estar incompleta, desactualizada o mal copiada. La regla práctica es usarlos para descubrir que existe un proceso y luego confirmar en sicoes.gob.bo la entidad, el objeto, la fecha de presentación de propuestas y el DBC.",
        },
        {
          type: "p",
          text:
            "También hay que tener cautela con quienes cobran por «dar acceso» o por llenar formularios. El acceso a las convocatorias del portal oficial es público para consulta y el registro en el RUPE se hace en el portal; si alguien te ofrece algo distinto, verifica antes de pagar. Para una lectura más detallada de la seguridad en el portal, revisa [sicoes.gob.bo: cómo ingresar y buscar convocatorias](/blog/sicoes-gob-bo-como-ingresar-y-buscar-convocatorias).",
        },
        {
          type: "ul",
          items: [
            "Usa los grupos para descubrir, no para decidir.",
            "Confirma cada dato con el CUCE en el portal oficial.",
            "Desconfía de plazos o montos que no puedas verificar en el DBC.",
            "No entregues tus credenciales del RUPE a terceros.",
          ],
        },
      ],
    },
    {
      id: "palabras-clave-por-rubro",
      heading: "¿Qué palabras clave usar para buscar licitaciones por rubro?",
      blocks: [
        {
          type: "p",
          text:
            "Usa palabras clave que reflejen cómo escriben las entidades, no cómo se llama tu producto en el mercado. Las convocatorias suelen emplear términos formales («adquisición», «suministro», «provisión», «servicio de»), por eso cada rubro necesita varios sinónimos. Las listas siguientes son un punto de partida: ajústalas con lo que veas en convocatorias reales.",
        },
        {
          type: "table",
          caption: "Palabras clave y sinónimos sugeridos por rubro",
          head: ["Rubro", "Palabras clave principales", "Sinónimos y variantes"],
          rows: [
            [
              "Construcción",
              "construcción, obra, pavimento, puente",
              "ampliación, refacción, mejoramiento, empedrado, alcantarillado, supervisión de obra, infraestructura, edificio",
            ],
            [
              "Tecnología",
              "software, sistema, equipos de computación",
              "sistema informático, desarrollo de aplicación, licencias, servidores, redes, cableado estructurado, soporte técnico, ciberseguridad",
            ],
            [
              "Salud",
              "medicamentos, insumos médicos",
              "material de laboratorio, reactivos, equipamiento hospitalario, instrumental, material de bioseguridad, equipo médico",
            ],
            [
              "Servicios",
              "servicio de, provisión de servicio",
              "limpieza, seguridad y vigilancia, alimentación, catering, impresión, publicidad, alquiler, fotocopiado",
            ],
            [
              "Consultoría",
              "consultoría, estudio, supervisión",
              "consultor, diseño final, estudio técnico, evaluación, auditoría, asistencia técnica, capacitación",
            ],
            [
              "Logística",
              "transporte, distribución",
              "flete, almacenamiento, carga, traslado, combustible, vehículos, movilidad, courier",
            ],
            [
              "Educación",
              "material educativo, capacitación",
              "mobiliario escolar, equipamiento de aulas, textos, libros, material didáctico, formación, talleres",
            ],
            [
              "Mantenimiento",
              "mantenimiento, reparación",
              "mantenimiento preventivo, mantenimiento correctivo, refacción, equipos, maquinaria, vehículos, instalaciones, ascensores, aire acondicionado",
            ],
          ],
        },
        {
          type: "h3",
          text: "Cómo construir tu lista",
        },
        {
          type: "ol",
          items: [
            "Revisa cinco convocatorias pasadas de tu rubro y subraya las palabras que repiten.",
            "Agrupa en tres bloques: palabras principales, sinónimos y términos relacionados.",
            "Agrega variantes con y sin tilde y en singular y plural.",
            "Define palabras de exclusión mentales: términos que indican procesos que no puedes atender.",
            "Revisa la lista cada mes, porque las entidades cambian su vocabulario.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rubros de nicho",
          text:
            "Si tu producto es muy específico, busca también por el uso final. Por ejemplo, una empresa que vende bombas de agua puede buscar «agua potable», «riego» o «sistema de bombeo», además de «bomba».",
        },
      ],
    },
    {
      id: "rutina-diaria-10-minutos",
      heading: "¿Cómo armar una rutina diaria de 10 minutos para revisar licitaciones?",
      blocks: [
        {
          type: "p",
          text:
            "Una rutina diaria de 10 minutos funciona si tiene pasos fijos y un criterio claro para descartar: revisas las nuevas convocatorias, las clasificas en tres grupos (descartar, seguir, preparar) y registras el CUCE y la fecha de cierre de las que sigues. La constancia importa más que la duración.",
        },
        {
          type: "table",
          caption: "Rutina diaria sugerida",
          head: ["Minuto", "Acción", "Resultado esperado"],
          rows: [
            [
              "0 a 2",
              "Abre tu resumen de alertas por email",
              "Lista de procesos nuevos con su relevancia",
            ],
            [
              "2 a 5",
              "Verifica en sicoes.gob.bo los que parecen relevantes",
              "Entidad, objeto, modalidad y fecha de cierre confirmados",
            ],
            [
              "5 a 8",
              "Clasifica: descartar, seguir o preparar",
              "Máximo tres procesos en «preparar»",
            ],
            [
              "8 a 10",
              "Actualiza tu hoja de seguimiento con CUCE y fecha de cierre",
              "Calendario de cierres al día",
            ],
          ],
        },
        {
          type: "p",
          text:
            "Una vez por semana, dedica 20 o 30 minutos adicionales a revisar el PAC, ajustar palabras clave y repasar los procesos que quedaron en «seguir». Si quieres ver el panorama general en cualquier momento, el listado público está en [/licitaciones](/licitaciones).",
        },
      ],
    },
    {
      id: "priorizar-por-fecha-de-cierre",
      heading: "¿Cómo priorizar licitaciones por fecha de cierre?",
      blocks: [
        {
          type: "p",
          text:
            "Prioriza ordenando los procesos por la **fecha de presentación de propuestas** y dedicando primero tiempo a los de cierre más próximo que además encajan con tu empresa. Un proceso relevante con cierre cercano exige acción inmediata; uno relevante con cierre lejano puede prepararse con calma; uno poco relevante, sea cual sea su fecha, se descarta.",
        },
        {
          type: "p",
          text:
            "Los plazos no son iguales para todos los procesos: dependen de la modalidad y de lo que fije el DBC de cada uno, así que nunca asumas una duración estándar. Lo que sí puedes hacer es calcular tu propio tiempo de preparación. Si tu equipo necesita, por ejemplo, reunir certificados, cotizar con proveedores y revisar formularios, estima cuántos días hábiles requiere y compáralo con el tiempo restante.",
        },
        {
          type: "ul",
          items: [
            "**Urgente y relevante:** preparar hoy; confirma requisitos y reparte tareas.",
            "**Relevante, con margen:** programar la preparación y pedir documentos con anticipación.",
            "**Dudoso:** leer el DBC completo antes de decidir; no descartes sin haberlo revisado.",
            "**No relevante:** descartar y registrar el motivo para afinar tus filtros.",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "No dependas de un solo aviso",
          text:
            "Antes de cerrar tu propuesta, vuelve a verificar la fecha y la hora de presentación en el portal y en el DBC. Los plazos pueden modificarse mediante comunicados o ajustes del proceso, y tú eres quien debe confirmar la información vigente.",
        },
      ],
    },
    {
      id: "como-sicoes-monitor-te-ayuda",
      heading: "Cómo SICOES Monitor te ayuda a encontrar licitaciones",
      blocks: [
        {
          type: "p",
          text:
            "SICOES Monitor es un servicio gratuito e independiente: no es el portal oficial ni está afiliado al Estado, por lo que debes verificar cada proceso en sicoes.gob.bo y en su DBC antes de decidir. Puedes explorar sin cuenta las páginas públicas por departamento, municipio y rubro, y, si quieres recibirlas en tu correo, ingresar con tu email y un código para configurar tu perfil.",
        },
        {
          type: "p",
          text:
            "Si lo activas, recibirás un resumen diario a las 9 am (hora de Bolivia) con puntaje de relevancia y enlace directo a cada proceso. Puedes empezar desde [/login](/login). Si tienes dudas, escribe a jbendek@ribentek.com. Recuerda que el servicio no ofrece alertas de requerimiento de personal, presentación de propuestas ni asesoría legal.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Dónde se publican las licitaciones en Bolivia?",
      a: "Las convocatorias de las entidades públicas se publican en el portal oficial SICOES (sicoes.gob.bo), administrado por el Ministerio de Economía y Finanzas Públicas. Allí se encuentran en la sección Convocatorias, junto con el documento base de contratación (DBC) y los formularios. Existen directorios y servicios de alertas privados que ayudan a descubrirlas, pero la verificación final siempre debe hacerse en el portal oficial.",
    },
    {
      q: "¿Cómo buscar licitaciones por departamento en Bolivia?",
      a: "Puedes filtrar por departamento en el portal oficial, si la opción está disponible al momento de tu consulta, o usar las páginas públicas de SICOES Monitor para La Paz, Santa Cruz, Cochabamba, Oruro, Potosí, Tarija, Chuquisaca, Beni y Pando. En ambos casos, confirma entidad, objeto y fecha de cierre en sicoes.gob.bo antes de preparar cualquier propuesta.",
    },
    {
      q: "¿Necesito cuenta para ver las convocatorias de SICOES?",
      a: "Para consultar convocatorias no necesitas un registro previo. El registro en el RUPE (Registro Único de Proveedores del Estado) se vuelve necesario para participar, por ejemplo para ofrecer propuestas electrónicas, y requiere información válida y activa. Verifica en la norma vigente y en el portal cuándo aplica a tu tipo de proceso y a tu situación como proveedor.",
    },
    {
      q: "¿Qué es el PAC y por qué conviene revisarlo?",
      a: "El PAC o Programa Anual de Contrataciones es una sección del portal SICOES donde se consulta la planificación de contrataciones de las entidades. Conviene revisarlo porque te permite anticipar qué podría convocarse y preparar documentos y alianzas con tiempo. Es una planificación, no una garantía: las contrataciones pueden cambiar, postergarse o no realizarse, y los plazos reales se conocen en la convocatoria.",
    },
    {
      q: "¿Cuánto tiempo debo dedicar cada día a buscar licitaciones?",
      a: "Una rutina de 10 minutos diarios es suficiente si es constante y ordenada: revisar el resumen de alertas, verificar los procesos relevantes en el portal, clasificarlos en descartar, seguir o preparar y registrar el CUCE y la fecha de cierre. Una revisión semanal más larga sirve para afinar palabras clave y repasar el PAC.",
    },
    {
      q: "¿Puedo confiar en los grupos de WhatsApp que comparten licitaciones?",
      a: "Pueden servir como aviso complementario, pero no como fuente única, porque la información puede estar incompleta o desactualizada. Úsalos para enterarte de que existe un proceso y luego verifica en sicoes.gob.bo el CUCE, la fecha de presentación de propuestas y el DBC. Desconfía de quien cobre por darte acceso a información que es pública en el portal.",
    },
    {
      q: "¿Cuál es la mejor forma de priorizar licitaciones?",
      a: "Ordénalas por fecha de presentación de propuestas y por encaje con tu empresa. Primero atiende las relevantes con cierre cercano, programa la preparación de las relevantes con margen y descarta las que no encajan. Los plazos dependen del DBC de cada proceso, así que verifica la fecha y hora vigentes antes de cerrar tu propuesta.",
    },
    {
      q: "¿SICOES Monitor reemplaza al portal oficial?",
      a: "No. SICOES Monitor es un servicio gratuito e independiente de Ribentek, no afiliado al Estado. Lee las convocatorias nacionales vigentes y las resume con relevancia en un email diario a las 9 am, pero la información oficial está en sicoes.gob.bo y en el DBC de cada proceso. Tampoco permite presentar propuestas ni ofrece asesoría legal.",
    },
  ],
  related: [
    "sicoes-gob-bo-como-ingresar-y-buscar-convocatorias",
    "herramientas-de-alertas-de-licitaciones-bolivia",
    "como-ganar-licitaciones-en-bolivia",
  ],
  sources: [
    { label: "Portal SICOES", url: "https://www.sicoes.gob.bo" },
    {
      label: "Manual de Operaciones del SICOES (MEFP)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2024-06/Manual%20de%20Operaciones%20del%20SICOES_2022.pdf",
    },
    {
      label: "D.S. 0181 Normas Básicas del SABS (compendio SEA)",
      url: "https://sea.gob.bo/digesto/CompendioII/S/200_DS_0181.pdf",
    },
    {
      label: "Apoyo Nacional a la Producción y Empleo (BCB)",
      url: "https://www.bcb.gob.bo/?q=apoyo-nacional-produccion-empleo",
    },
  ],
  howTo: {
    name: "Cómo encontrar licitaciones en Bolivia",
    description:
      "Procedimiento para encontrar y priorizar licitaciones en Bolivia combinando el portal oficial, filtros, el PAC, alertas y una rutina diaria.",
    steps: [
      {
        name: "Define tu perfil de búsqueda",
        text: "Anota tus rubros, los departamentos donde puedes operar, el rango de montos que manejas y 5 a 10 entidades prioritarias.",
      },
      {
        name: "Revisa la sección Convocatorias de sicoes.gob.bo",
        text: "Entra al portal oficial, abre Convocatorias y revisa los procesos nuevos: entidad, objeto, modalidad, fecha de presentación de propuestas y DBC.",
      },
      {
        name: "Aplica filtros y palabras clave con sinónimos",
        text: "Filtra por entidad, departamento y rubro, y complementa con una lista de palabras clave y sinónimos propios de tu actividad.",
      },
      {
        name: "Activa alertas por email",
        text: "Configura un servicio de alertas con tus rubros y palabras clave para recibir un resumen diario sin tener que buscar manualmente.",
      },
      {
        name: "Sigue el Programa Anual de Contrataciones (PAC)",
        text: "Consulta el PAC periódicamente para anticipar contrataciones y preparar tu documentación antes de que se publique la convocatoria.",
      },
      {
        name: "Prioriza por fecha de cierre",
        text: "Ordena los procesos por fecha de presentación de propuestas y clasifícalos en descartar, seguir o preparar.",
      },
      {
        name: "Verifica en el DBC y registra el CUCE",
        text: "Antes de invertir tiempo, descarga y lee el DBC, confirma los requisitos y anota el CUCE y la fecha de cierre en tu hoja de seguimiento.",
      },
    ],
  },
};

export default post;
