import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "sicoes-gob-bo-como-ingresar-y-buscar-convocatorias",
  title: "sicoes.gob.bo: cómo ingresar, buscar convocatorias y RUPE",
  description:
    "Guía de sicoes.gob.bo: qué puedes hacer sin cuenta, cómo usar tu cuenta RUPE, buscar convocatorias, descargar el DBC y evitar problemas de acceso y estafas.",
  tldr:
    "En sicoes.gob.bo, el portal oficial de contrataciones estatales de Bolivia, puedes consultar convocatorias sin cuenta; el registro en el RUPE sirve para participar, por ejemplo ofreciendo propuestas electrónicas. Abre Convocatorias, revisa entidad, objeto, CUCE y fecha de presentación, descarga el DBC y formularios, y verifica siempre la URL oficial.",
  category: "Registro y trámites",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "sicoes.gob.bo",
    "ingresar a SICOES",
    "buscar convocatorias SICOES",
    "cuenta RUPE",
    "descargar DBC",
    "portal SICOES Bolivia",
    "problemas acceso SICOES",
    "CUCE",
  ],
  sections: [
    {
      id: "que-es-sicoes-gob-bo",
      heading: "¿Qué es sicoes.gob.bo y para qué sirve?",
      blocks: [
        {
          type: "p",
          text:
            "sicoes.gob.bo es el portal oficial del SICOES (Sistema de Contrataciones Estatales de Bolivia), administrado por el Ministerio de Economía y Finanzas Públicas (MEFP). Allí las entidades públicas publican sus convocatorias para contratar bienes, obras, servicios generales y consultorías, y los proveedores consultan procesos, formularios, normativa y su registro en el RUPE.",
        },
        {
          type: "p",
          text:
            "Si recién empiezas, puedes ver el panorama general en [qué es SICOES en Bolivia](/blog/que-es-sicoes-bolivia). Este artículo es más práctico: te lleva por el portal, explica qué puedes hacer con y sin cuenta, qué datos leer en cada convocatoria y cómo evitar los problemas más frecuentes de acceso y los intentos de cobro indebido.",
        },
        {
          type: "p",
          text:
            "Una aclaración importante: SICOES Monitor, el servicio que publica este blog, es independiente, gratuito y **no es el portal oficial**. Ayuda a descubrir convocatorias, pero la fuente oficial es sicoes.gob.bo y el documento base de contratación (DBC) de cada proceso. Verifica siempre allí antes de decidir.",
        },
      ],
    },
    {
      id: "sin-cuenta-vs-con-cuenta",
      heading: "¿Qué puedo hacer en SICOES sin cuenta y qué necesito una cuenta RUPE?",
      blocks: [
        {
          type: "p",
          text:
            "Sin cuenta puedes consultar el portal público: revisar convocatorias, leer su información y conocer secciones como Formularios, Normativa y el Programa Anual de Contrataciones (PAC). Con un registro activo en el RUPE (Registro Único de Proveedores del Estado) puedes participar como proveedor; por ejemplo, para ofrecer propuestas electrónicas se requiere información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado.",
        },
        {
          type: "table",
          caption: "Sin cuenta frente a con cuenta RUPE",
          head: ["Actividad", "Sin cuenta", "Con registro RUPE activo"],
          rows: [
            [
              "Consultar convocatorias vigentes",
              "Sí, en la parte pública del portal",
              "Sí",
            ],
            [
              "Leer datos del proceso (entidad, objeto, fechas, estado)",
              "Sí",
              "Sí",
            ],
            [
              "Revisar normativa, formularios y PAC",
              "Sí",
              "Sí",
            ],
            [
              "Ofrecer propuestas electrónicas",
              "No",
              "Sí, con información válida y activa y sin impedimentos",
            ],
            [
              "Generar el Certificado RUPE",
              "No",
              "Sí, luego de completar el registro",
            ],
            [
              "Requisitos específicos de cada proceso",
              "Verifica en el DBC",
              "Verifica en el DBC",
            ],
          ],
        },
        {
          type: "p",
          text:
            "Esta tabla resume lo general. Cada proceso tiene su propio DBC, que define requisitos, formularios, criterios de evaluación, plazos y condiciones del contrato, y es el documento que manda. No afirmamos aquí a partir de qué monto es obligatorio el RUPE ni su costo: consulta la norma vigente y el portal. Para el paso a paso del registro, revisa [cómo registrarse en el RUPE en Bolivia](/blog/como-registrarse-en-el-rupe-bolivia).",
        },
        {
          type: "callout",
          tone: "info",
          title: "Dos etapas del RUPE",
          text:
            "El registro tiene una etapa inicial (tipo de proveedor, información general, domicilio, representante legal, bienes y servicios ofertados, responsable del registro y finalizar) y una etapa de activación vía correo electrónico, donde obtienes tu usuario y contraseña. Sin la activación, el registro no queda operativo.",
        },
      ],
    },
    {
      id: "recorrido-por-el-portal",
      heading: "¿Qué secciones tiene el portal sicoes.gob.bo?",
      blocks: [
        {
          type: "p",
          text:
            "El portal organiza su contenido en secciones visibles desde la página principal: Convocatorias, Requerimiento de Personal, Arrendamiento remate y otros, Contrataciones de otros países, Formularios, Destino de Bienes, RUPE, Normativa, Programa Anual de Contrataciones (PAC) y comunicados. La disposición exacta puede cambiar, así que confirma en pantalla cómo se presentan al momento de tu visita.",
        },
        {
          type: "table",
          caption: "Recorrido por las secciones del portal",
          head: ["Sección", "Para qué la usas"],
          rows: [
            [
              "Convocatorias",
              "Ver los procesos publicados por las entidades para contratar bienes, obras, servicios generales y consultorías.",
            ],
            [
              "Requerimiento de Personal",
              "Buscar convocatorias de personal y consultoría individual (consultores de línea). Mira [SICOES requerimiento de personal](/blog/sicoes-requerimiento-de-personal-2026).",
            ],
            [
              "Arrendamiento remate y otros",
              "Consultar procesos distintos a la compra directa, como arrendamientos y remates, según lo publicado.",
            ],
            [
              "Contrataciones de otros países",
              "Revisar procesos de contratación de otros países que el portal difunda.",
            ],
            [
              "Formularios",
              "Acceder a formularios que se usan en los procesos; confirma siempre cuáles exige el DBC del proceso.",
            ],
            [
              "Destino de Bienes",
              "Consultar información sobre el destino de bienes, según lo publicado en esa sección.",
            ],
            [
              "RUPE",
              "Registrarte (opción «Registrarme»), activar tu cuenta, completar información y generar tu certificado.",
            ],
            [
              "Normativa",
              "Consultar las normas que rigen las contrataciones, entre ellas el D.S. 0181 y las NB-SABS con sus modificaciones.",
            ],
            [
              "Programa Anual de Contrataciones (PAC)",
              "Ver la planificación de contrataciones de las entidades para anticiparte.",
            ],
            [
              "Comunicados",
              "Enterarte de avisos publicados en el portal que pueden afectar procesos o servicios.",
            ],
          ],
        },
        {
          type: "p",
          text:
            "Un hábito útil es revisar los comunicados de vez en cuando. Si hay mantenimiento, cambios en el sistema o avisos para proveedores, suelen informarse por ese medio. Y si buscas una visión de la normativa que gobierna todo esto, lee [modalidades de contratación estatal en Bolivia](/blog/modalidades-de-contratacion-estatal-bolivia).",
        },
      ],
    },
    {
      id: "como-buscar-y-filtrar",
      heading: "¿Cómo buscar y filtrar convocatorias en SICOES?",
      blocks: [
        {
          type: "p",
          text:
            "Para buscar, entra a la sección Convocatorias, revisa el listado de procesos y aplica los criterios de búsqueda o filtros que el portal ofrezca, por ejemplo por entidad, tipo de contratación u objeto. Las opciones y su nombre exacto pueden variar, por eso aquí hablamos en términos generales y conviene que revises qué campos aparecen en pantalla.",
        },
        {
          type: "h3",
          text: "Una estrategia de búsqueda en tres pasos",
        },
        {
          type: "ol",
          items: [
            "**Empieza amplio.** Busca por el tipo de objeto que te interesa (por ejemplo «mantenimiento» o «equipos») sin restringir demasiado.",
            "**Reduce con criterios.** Si el portal lo permite, limita por entidad o por el tipo de contratación para descartar lo que no es tuyo.",
            "**Ordena por urgencia.** Revisa primero los procesos con fecha de presentación de propuestas más cercana.",
          ],
        },
        {
          type: "p",
          text:
            "Si trabajas con mucha frecuencia, complementa el portal con páginas por zona o actividad. SICOES Monitor, por ejemplo, ofrece sin cuenta un listado general en [/licitaciones](/licitaciones), páginas por departamento como [La Paz](/licitaciones/departamento/la-paz) o [Santa Cruz](/licitaciones/departamento/santa-cruz), por municipio como [El Alto](/licitaciones/municipio/el-alto) o [Sucre](/licitaciones/municipio/sucre), y por rubro como [tecnología](/licitaciones/categoria/tecnologia) o [construcción](/licitaciones/categoria/construccion). Son una guía de descubrimiento; la verificación es en el portal oficial.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Usa palabras de la entidad",
          text:
            "Las convocatorias usan lenguaje formal: «adquisición», «provisión», «suministro», «servicio de». Si buscas con el nombre comercial de tu producto y no aparece nada, prueba con sinónimos. Hay listas por rubro en [cómo encontrar licitaciones en Bolivia](/blog/como-encontrar-licitaciones-en-bolivia).",
        },
      ],
    },
    {
      id: "que-datos-leer",
      heading: "¿Qué datos debo leer en cada convocatoria?",
      blocks: [
        {
          type: "p",
          text:
            "En cada convocatoria lee, como mínimo, la entidad, el objeto de la contratación, el tipo o modalidad, la fecha de publicación, la fecha de presentación de propuestas, el estado, el CUCE y el documento base de contratación (DBC) con sus formularios. Con esos datos decides en pocos minutos si el proceso te interesa y cuánto tiempo tienes para preparar tu propuesta.",
        },
        {
          type: "ul",
          items: [
            "**Entidad:** quién contrata; te indica si has trabajado con ella y qué práctica suele tener.",
            "**Objeto:** qué se contrata exactamente; debe coincidir con lo que tu empresa puede entregar.",
            "**Tipo o modalidad:** Contratación Menor (Bs 1 hasta Bs 50.000), ANPE (más de Bs 50.000 hasta Bs 1.000.000) o Licitación Pública (más de Bs 1.000.000), según el D.S. 0181. También existen vías excepcionales reguladas por la norma.",
            "**Fecha de publicación y de presentación de propuestas:** te dicen cuánto tiempo tienes.",
            "**Estado:** confirma que el proceso sigue vigente.",
            "**CUCE:** el Código Único de Contrataciones Estatales, tu referencia para ubicar el proceso siempre.",
            "**DBC y formularios:** definen requisitos, criterios de evaluación, plazos y condiciones del contrato.",
          ],
        },
        {
          type: "p",
          text:
            "El tope entre convocatoria pública nacional e internacional aparece con valores distintos según la fuente consultada, por lo que debe confirmarse en la norma vigente. Del mismo modo, en ANPE la garantía de seriedad de propuesta solo puede exigirse cuando el precio referencial es mayor a Bs 200.000; si un DBC la pide, comprueba que se cumpla esa condición.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "El DBC manda",
          text:
            "Los resúmenes, incluidos los de SICOES Monitor, no sustituyen al DBC. Si un dato de un resumen difiere del DBC o del portal, vale lo que dice el documento oficial.",
        },
      ],
    },
    {
      id: "descargar-dbc-y-formularios",
      heading: "¿Cómo descargo el DBC y los formularios de una convocatoria?",
      blocks: [
        {
          type: "p",
          text:
            "Abre la convocatoria en sicoes.gob.bo, ubica los documentos asociados al proceso (el DBC y sus formularios) y descárgalos a tu equipo. Guarda cada archivo con el CUCE en el nombre para no confundir procesos. Luego lee el DBC completo antes de empezar a llenar cualquier formulario.",
        },
        {
          type: "p",
          text:
            "El MEFP publica modelos de DBC, por ejemplo para ANPE de bienes, arrendamiento y supervisión técnica (versión 2022), que sirven para familiarizarte con la estructura. El DBC específico de cada proceso es el que debes seguir. Para entender su estructura en detalle, lee [el documento base de contratación (DBC) en Bolivia](/blog/documento-base-de-contratacion-dbc-bolivia).",
        },
        {
          type: "ol",
          items: [
            "Descarga el DBC y todos los formularios del proceso.",
            "Renombra los archivos con el CUCE y el nombre corto de la entidad.",
            "Lee el DBC completo: requisitos, formularios, criterios de evaluación, plazos y condiciones.",
            "Haz una lista de verificación con cada documento y formulario exigido.",
            "Marca quién se encarga de cada documento y en qué fecha estará listo.",
            "Revisa cualquier comunicado o ajuste del proceso antes de presentar.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Formularios que cambian",
          text:
            "Usa los formularios del proceso y no versiones que alguien te haya pasado por otro canal. Un formulario desactualizado o de otro proceso puede generar observaciones. Para evitar errores frecuentes, revisa [errores que descalifican propuestas](/blog/errores-que-descalifican-propuestas-licitaciones-bolivia).",
        },
      ],
    },
    {
      id: "problemas-frecuentes-de-acceso",
      heading: "¿Qué hago si no puedo ingresar a SICOES o a mi cuenta RUPE?",
      blocks: [
        {
          type: "p",
          text:
            "Si no puedes ingresar, revisa primero lo más simple: que estés en la dirección oficial, que tu conexión funcione, que tu usuario y contraseña estén bien escritos y que tu registro esté activado. Si el problema continúa, consulta los manuales oficiales del RUPE y los canales de soporte oficiales; no compartas tus credenciales con terceros.",
        },
        {
          type: "table",
          caption: "Problemas frecuentes y qué revisar",
          head: ["Problema", "Qué revisar primero", "Si persiste"],
          rows: [
            [
              "No recuerdo mi contraseña",
              "Busca la opción de recuperación en el portal y revisa tu bandeja de entrada y spam",
              "Consulta la guía operativa oficial del RUPE y el soporte oficial",
            ],
            [
              "No llegó el correo de activación",
              "Revisa spam o promociones y confirma que escribiste bien tu correo",
              "Consulta los manuales RUPE y el soporte oficial; la activación vía correo es parte del registro",
            ],
            [
              "La página no carga o se ve mal",
              "Prueba con otra red, actualiza el navegador o abre una ventana privada",
              "Intenta más tarde y revisa los comunicados del portal",
            ],
            [
              "No puedo descargar un archivo",
              "Verifica tu conexión y permite descargas en el navegador",
              "Prueba con otro navegador o dispositivo",
            ],
            [
              "Mi información del registro cambió",
              "Revisa la información de tu registro y actualízala",
              "Para cambio de matrícula de comercio existe una guía operativa oficial",
            ],
          ],
        },
        {
          type: "p",
          text:
            "Existen guías oficiales: el manual RUPE para empresas, el manual RUPE para persona natural y una guía operativa para el cambio de matrícula de comercio en el RUPE. Están enlazadas en las fuentes de este artículo. Los pasos exactos de recuperación de contraseña y los mensajes de error dependen del portal en el momento de tu consulta, por lo que no los detallamos aquí.",
        },
        {
          type: "callout",
          tone: "info",
          title: "No esperes al último día",
          text:
            "Los problemas de acceso se resuelven mejor con tiempo. Comprueba que puedes ingresar a tu cuenta y que tu registro está vigente antes de que se acerque un cierre, no el mismo día de la presentación.",
        },
      ],
    },
    {
      id: "seguridad-y-estafas",
      heading: "¿Cómo evitar estafas y accesos falsos relacionados con SICOES?",
      blocks: [
        {
          type: "p",
          text:
            "Para evitar estafas, entra siempre escribiendo tú mismo la dirección oficial (https://www.sicoes.gob.bo), no pagues a intermediarios por «dar acceso» a información pública y desconfía de quien cobre por llenar formularios sin que verifiques qué se presenta en tu nombre. Ante cualquier oferta dudosa, verifica con el portal y los manuales oficiales.",
        },
        {
          type: "ul",
          items: [
            "**Verifica la URL oficial** antes de ingresar usuario y contraseña; desconfía de enlaces recibidos por mensajes o redes.",
            "**No pagues por acceso:** la consulta de convocatorias en el portal oficial es pública.",
            "**Cuida tus credenciales:** no compartas tu usuario ni tu contraseña del RUPE.",
            "**Cuidado con grupos que cobran por llenar formularios:** verifica quién los llena y qué información declaran en tu nombre, porque tú eres responsable de lo que presentas.",
            "**Desconfía de promesas de adjudicación:** nadie puede garantizar que ganarás un proceso.",
            "**Contrasta fechas y datos** que recibas por terceros con el portal y el DBC.",
          ],
        },
        {
          type: "p",
          text:
            "Esto aplica también a servicios de alertas, incluido SICOES Monitor: son útiles para enterarte, pero no reemplazan la consulta oficial. Puedes comparar alternativas con criterios objetivos en [herramientas de alertas de licitaciones en Bolivia](/blog/herramientas-de-alertas-de-licitaciones-bolivia).",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Qué hacer si ya compartiste tus datos",
          text:
            "Si sospechas que entregaste credenciales a un tercero, cambia tu contraseña de inmediato y revisa tu información de registro. Consulta los canales oficiales sobre cómo proceder en tu caso.",
        },
      ],
    },
    {
      id: "como-evitar-perder-fechas",
      heading: "¿Cómo evito perder fechas de presentación de propuestas?",
      blocks: [
        {
          type: "p",
          text:
            "Evitas perder fechas combinando un calendario propio, una revisión diaria y alertas por email: anotas el CUCE y la fecha de presentación de cada proceso que sigues, revisas el portal cada día y confirmas la fecha y hora vigentes antes de preparar los documentos finales. Un proceso sin fecha anotada es un proceso que se pierde.",
        },
        {
          type: "ul",
          items: [
            "Registra en una hoja el CUCE, la entidad, el objeto y la fecha de presentación de propuestas.",
            "Crea recordatorios con anticipación: uno para empezar a preparar y otro para la revisión final.",
            "Vuelve a revisar el proceso antes de presentar por si hubo comunicados o ajustes.",
            "Verifica que tu RUPE siga con información válida y activa.",
            "Ten un equipo de respaldo: alguien más que sepa dónde están los documentos.",
          ],
        },
        {
          type: "p",
          text:
            "Los plazos dependen de cada proceso y de su DBC; no hay una duración que puedas asumir de antemano. Por eso un sistema de seguimiento propio es tan valioso. Para convertirlo en una rutina diaria, usa la propuesta de [cómo encontrar licitaciones en Bolivia](/blog/como-encontrar-licitaciones-en-bolivia).",
        },
      ],
    },
    {
      id: "como-sicoes-monitor-te-ayuda",
      heading: "Cómo SICOES Monitor te ayuda",
      blocks: [
        {
          type: "p",
          text:
            "SICOES Monitor es un servicio gratuito e independiente de Ribentek, no afiliado al Estado, que lee a diario las convocatorias nacionales vigentes de SICOES y te envía por email, a las 9 am (hora de Bolivia), un resumen priorizado según el perfil de tu empresa, con puntaje de relevancia y un enlace directo al proceso. Puedes entrar con tu correo y un código desde [/login](/login).",
        },
        {
          type: "p",
          text:
            "No reemplaza al portal oficial: debes verificar cada proceso en sicoes.gob.bo y en su DBC. Tampoco ofrece alertas de requerimiento de personal, presentación de propuestas ni asesoría legal. Si tienes dudas sobre el servicio, escribe a jbendek@ribentek.com.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Cómo ingreso a sicoes.gob.bo?",
      a: "Escribe https://www.sicoes.gob.bo en tu navegador y consulta las convocatorias en la parte pública del portal, sin necesidad de cuenta. Para participar como proveedor, por ejemplo para ofrecer propuestas electrónicas, necesitas un registro activo en el RUPE, al que se accede desde la sección RUPE. Verifica siempre que estás en la dirección oficial antes de ingresar tus credenciales.",
    },
    {
      q: "¿Necesito una cuenta para ver las convocatorias de SICOES?",
      a: "No necesitas cuenta para consultar convocatorias en el portal público. La cuenta RUPE se usa para participar como proveedor: para ofrecer propuestas electrónicas se requiere información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado. Confirma en la norma y en el portal cuándo aplica a tu caso concreto.",
    },
    {
      q: "¿Qué es el CUCE y dónde lo encuentro?",
      a: "El CUCE es el Código Único de Contrataciones Estatales, un identificador que cada proceso tiene en SICOES. Se muestra entre los datos de la convocatoria, junto con la entidad, el objeto y las fechas. Conviene anotarlo siempre porque es la forma más segura de volver a ubicar un proceso y de verificar que hablas del mismo con tu equipo.",
    },
    {
      q: "¿Dónde descargo el DBC de una convocatoria?",
      a: "En la propia convocatoria dentro de sicoes.gob.bo, donde se publican el documento base de contratación (DBC) y los formularios del proceso. Descárgalos, guárdalos con el CUCE en el nombre y lee el DBC completo, porque define requisitos, formularios, criterios de evaluación, plazos y condiciones del contrato. Si un resumen difiere del DBC, vale el DBC.",
    },
    {
      q: "¿Qué hago si no me llega el correo de activación del RUPE?",
      a: "Revisa las carpetas de spam y promociones, y confirma que escribiste bien tu correo en el registro. La activación por correo es la segunda etapa del registro, en la que obtienes usuario y contraseña. Si no llega, consulta los manuales oficiales del RUPE y el soporte oficial; no pagues a terceros por resolverlo.",
    },
    {
      q: "¿Alguien puede cobrarme por darme acceso a SICOES?",
      a: "La consulta de convocatorias en el portal oficial es pública, así que no deberías pagar por acceso. Desconfía de intermediarios que ofrezcan acceso o cobren por llenar formularios: verifica qué presentan en tu nombre y consulta los canales oficiales. Tú eres responsable de lo que declaras en una propuesta, y nadie puede garantizarte una adjudicación.",
    },
    {
      q: "¿SICOES Monitor es el portal oficial?",
      a: "No. SICOES Monitor es un servicio gratuito e independiente de Ribentek, no afiliado al Estado. Lee las convocatorias nacionales vigentes de SICOES y envía un resumen diario por email a las 9 am con puntaje de relevancia, pero la información oficial está en sicoes.gob.bo y en el DBC de cada proceso. No permite presentar propuestas.",
    },
  ],
  related: [
    "como-registrarse-en-el-rupe-bolivia",
    "documento-base-de-contratacion-dbc-bolivia",
    "como-encontrar-licitaciones-en-bolivia",
  ],
  sources: [
    { label: "Portal SICOES", url: "https://www.sicoes.gob.bo" },
    {
      label: "Guía operativa RUPE empresa (SICOES)",
      url: "https://www.sicoes.gob.bo/portal/docs/manualRupeEmpresa.pdf",
    },
    {
      label: "Guía operativa RUPE persona natural (SICOES)",
      url: "https://www.sicoes.gob.bo/portal/docs/manualRupePersona.pdf",
    },
    {
      label: "Manual de Operaciones del SICOES (MEFP)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2024-06/Manual%20de%20Operaciones%20del%20SICOES_2022.pdf",
    },
    {
      label: "Modelo de DBC ANPE bienes (MEFP, 2022)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2023-01/DBC_ANPE_BIENES_02022022.pdf",
    },
  ],
  howTo: {
    name: "Cómo ingresar a sicoes.gob.bo y buscar convocatorias",
    description:
      "Pasos para ingresar al portal oficial de SICOES, buscar convocatorias, leer sus datos, descargar el DBC y llevar control de fechas.",
    steps: [
      {
        name: "Ingresa a la dirección oficial",
        text: "Escribe https://www.sicoes.gob.bo directamente en el navegador, sin pasar por enlaces recibidos por mensajes o redes.",
      },
      {
        name: "Abre la sección Convocatorias",
        text: "Revisa el listado de procesos publicados por las entidades públicas. No necesitas cuenta para consultarlos.",
      },
      {
        name: "Busca y filtra",
        text: "Usa los criterios de búsqueda disponibles en pantalla, empezando amplio y reduciendo después por entidad o tipo de contratación.",
      },
      {
        name: "Lee los datos del proceso",
        text: "Revisa entidad, objeto, modalidad, fecha de publicación, fecha de presentación de propuestas, estado y CUCE.",
      },
      {
        name: "Descarga el DBC y los formularios",
        text: "Guarda los documentos del proceso con el CUCE en el nombre y lee el DBC completo antes de llenar formularios.",
      },
      {
        name: "Verifica tu registro RUPE",
        text: "Si vas a participar, confirma que tu registro esté activo y con información válida; si no lo tienes, inicia el proceso desde RUPE y Registrarme.",
      },
      {
        name: "Anota fechas y verifica antes de presentar",
        text: "Registra el CUCE y la fecha de presentación en tu calendario y vuelve a revisar el proceso antes de presentar tu propuesta.",
      },
    ],
  },
};

export default post;
