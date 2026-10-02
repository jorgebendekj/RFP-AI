import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "que-es-sicoes-bolivia",
  title: "SICOES Bolivia: qué es, cómo funciona y convocatorias (2026)",
  description:
    "Guía completa del SICOES de Bolivia: qué es, quién lo administra, qué se publica, cómo ver las convocatorias y cómo seguirlas cada día. Actualizada 2026.",
  tldr: "El SICOES (Sistema de Contrataciones Estatales de Bolivia) es el portal oficial, sicoes.gob.bo, administrado por el Ministerio de Economía y Finanzas Públicas, donde las entidades públicas publican convocatorias para contratar bienes, obras, servicios y consultorías. Cada proceso tiene un CUCE. Para ofertar se necesita estar registrado en el RUPE y leer el DBC de cada proceso.",
  category: "Fundamentos",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "SICOES Bolivia",
    "qué es el SICOES",
    "sicoes.gob.bo",
    "convocatorias SICOES",
    "contrataciones estatales Bolivia",
    "CUCE",
    "RUPE",
    "licitaciones Bolivia",
    "DBC",
  ],
  sections: [
    {
      id: "que-es-el-sicoes",
      heading: "¿Qué es el SICOES en Bolivia?",
      blocks: [
        {
          type: "p",
          text: "El **SICOES** (Sistema de Contrataciones Estatales de Bolivia) es el portal oficial donde las entidades públicas del país publican sus convocatorias para contratar bienes, obras, servicios generales y consultorías. Se accede en [sicoes.gob.bo](https://www.sicoes.gob.bo) y es de consulta abierta: cualquier persona puede ver las convocatorias sin pagar ni crear una cuenta.",
        },
        {
          type: "p",
          text: "Dicho de forma simple: el Estado boliviano compra muchas cosas (construcción de caminos, equipos de computación, material de salud, servicios de limpieza, estudios técnicos, personal de apoyo) y, por norma, debe anunciar esas compras para que los interesados puedan competir. El SICOES es la vitrina donde se anuncian. Si tienes una empresa, un emprendimiento o eres un profesional independiente y quieres venderle al Estado, este es el primer lugar que debes conocer.",
        },
        {
          type: "p",
          text: "La normativa base de estas contrataciones es el **D.S. 0181 (28 de junio de 2009)**, que aprobó las Normas Básicas del Sistema de Administración de Bienes y Servicios (**NB-SABS**), con modificaciones posteriores. Por eso, al leer un proceso, verás referencias constantes a esas normas. Si quieres repasar el vocabulario, tenemos un [glosario de contrataciones estatales en Bolivia](/blog/glosario-contrataciones-estatales-bolivia) con las siglas más comunes.",
        },
        {
          type: "callout",
          tone: "info",
          title: "SICOES Monitor no es el portal oficial",
          text: "Este artículo lo publica SICOES Monitor, un servicio gratuito e independiente de Ribentek, sin afiliación con el Estado. La información oficial y vigente siempre está en sicoes.gob.bo y en el documento base de contratación (DBC) de cada proceso. Verifica allí antes de tomar cualquier decisión.",
        },
      ],
    },
    {
      id: "quien-administra-el-sicoes",
      heading: "¿Quién administra el SICOES?",
      blocks: [
        {
          type: "p",
          text: "El SICOES es administrado por el **Ministerio de Economía y Finanzas Públicas (MEFP)** de Bolivia. Las entidades públicas (ministerios, gobernaciones, municipios, universidades, empresas estatales y otras) son las que publican sus propios procesos; el MEFP mantiene el sistema y las normas operativas asociadas.",
        },
        {
          type: "p",
          text: "Esto tiene una consecuencia práctica importante: **cada convocatoria es responsabilidad de la entidad que la publica**. El portal no evalúa las propuestas ni decide quién gana; solo es el canal donde se difunde la información. Las preguntas sobre un proceso concreto (plazos, requisitos, aclaraciones) se resuelven con la entidad convocante, siguiendo lo que indique su DBC.",
        },
        {
          type: "p",
          text: "El MEFP también publica documentación de apoyo, como el Manual de Operaciones del SICOES y modelos de documentos base de contratación (por ejemplo, modelos de DBC para ANPE de bienes, de la versión 2022). Están enlazados en las fuentes al final de esta guía.",
        },
      ],
    },
    {
      id: "que-se-publica",
      heading: "¿Qué información se publica en una convocatoria?",
      blocks: [
        {
          type: "p",
          text: "Cada proceso publicado en el SICOES tiene un **CUCE (Código Único de Contrataciones Estatales)**, que funciona como su número de identificación, y un conjunto de datos básicos que te permiten decidir rápidamente si te interesa. Los datos típicos que se listan son los siguientes.",
        },
        {
          type: "table",
          caption: "Datos típicos de una convocatoria en el SICOES",
          head: ["Dato", "Para qué te sirve"],
          rows: [
            ["CUCE", "Identifica el proceso de forma única; úsalo al hacer consultas o al citar el proceso."],
            ["Entidad", "Quién contrata. Te dice si es un municipio, una gobernación, una universidad, etc."],
            ["Objeto de contratación", "Qué se va a comprar o contratar. Es lo primero que debes leer."],
            ["Tipo o modalidad", "Por ejemplo, Contratación Menor, ANPE o Licitación Pública; define el tipo de proceso."],
            ["Fecha de publicación", "Desde cuándo está disponible la convocatoria."],
            ["Fecha de presentación de propuestas", "El plazo que no puedes dejar pasar. Confírmalo siempre en el DBC."],
            ["Estado", "Si el proceso sigue vigente o ya avanzó a otra etapa."],
            ["DBC y formularios", "El documento base de contratación y los formularios que debes llenar."],
          ],
        },
        {
          type: "p",
          text: "El dato más importante de todos es el **DBC (documento base de contratación)**. Ahí se definen los requisitos, los formularios, los criterios de evaluación, los plazos y las condiciones del contrato. Todo lo que no esté en este artículo, o que difiera entre procesos, depende del DBC. Tenemos una guía específica: [qué es el documento base de contratación (DBC)](/blog/documento-base-de-contratacion-dbc-bolivia).",
        },
        {
          type: "p",
          text: "Para entender por qué un proceso es de un tipo u otro, conviene conocer las modalidades. Según el D.S. 0181, la **Contratación Menor** abarca de Bs 1 hasta Bs 50.000; el **ANPE** (Apoyo Nacional a la Producción y Empleo), montos mayores a Bs 50.000 hasta Bs 1.000.000; y la **Licitación Pública**, montos mayores a Bs 1.000.000. También existen vías excepcionales reguladas por la norma (contratación directa, por excepción y por emergencia). Más detalle en [modalidades de contratación estatal en Bolivia](/blog/modalidades-de-contratacion-estatal-bolivia).",
        },
      ],
    },
    {
      id: "secciones-del-portal",
      heading: "¿Qué secciones tiene el portal sicoes.gob.bo?",
      blocks: [
        {
          type: "p",
          text: "En su página principal, el portal muestra varias secciones visibles: **Convocatorias**, **Requerimiento de Personal**, **Arrendamiento remate y otros**, **Contrataciones de otros países**, **Formularios**, **Destino de Bienes**, **RUPE**, **Normativa**, el **Programa Anual de Contrataciones (PAC)** y comunicados. Estas son las que más usarás.",
        },
        {
          type: "ul",
          items: [
            "**Convocatorias:** el listado principal de procesos de contratación de bienes, obras, servicios y consultorías. Aquí pasarás la mayor parte del tiempo.",
            "**Requerimiento de Personal:** donde se publican las convocatorias de personal y consultoría individual. Si buscas empleo o trabajo como consultor, empieza aquí; lo explicamos en [SICOES requerimiento de personal](/blog/sicoes-requerimiento-de-personal-2026).",
            "**Arrendamiento remate y otros:** procesos distintos a la compra, como arrendamientos o remates.",
            "**Contrataciones de otros países:** información de contrataciones fuera de Bolivia.",
            "**Formularios:** formularios disponibles en el portal.",
            "**Destino de Bienes:** información sobre el destino de bienes del Estado.",
            "**RUPE:** el acceso al Registro Único de Proveedores del Estado, donde te registras como proveedor.",
            "**Normativa:** las normas que regulan las contrataciones.",
            "**Programa Anual de Contrataciones (PAC):** la programación de compras que cada entidad prevé para el año; útil para anticiparte.",
          ],
        },
        {
          type: "p",
          text: "Los nombres y la disposición del portal pueden cambiar con el tiempo, por lo que si algo no aparece donde lo esperas, revisa la página principal. Para una explicación paso a paso de cómo entrar y buscar, lee [cómo ingresar a sicoes.gob.bo y buscar convocatorias](/blog/sicoes-gob-bo-como-ingresar-y-buscar-convocatorias).",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Mira el PAC antes de que salga la convocatoria",
          text: "El Programa Anual de Contrataciones (PAC) te muestra qué planea comprar cada entidad. No sustituye a la convocatoria, pero te permite preparar documentos y ofertas con anticipación para las entidades que más te interesan.",
        },
      ],
    },
    {
      id: "quien-puede-participar",
      heading: "¿Quién puede participar en los procesos del SICOES?",
      blocks: [
        {
          type: "p",
          text: "Pueden participar **personas naturales, empresas unipersonales y personas jurídicas** (empresas y sociedades), siempre que cumplan los requisitos del proceso y no tengan impedimentos para contratar con el Estado. Mirar las convocatorias es libre; para **ofrecer propuestas** se requiere, en general, contar con información válida y activa en el RUPE.",
        },
        {
          type: "p",
          text: "El **RUPE (Registro Único de Proveedores del Estado)** es el registro donde se inscriben los proveedores. Se accede desde sicoes.gob.bo, sección RUPE, opción «Registrarme». El proceso tiene dos etapas: el registro inicial (tipo de proveedor, información general, domicilio, representante legal, bienes y servicios ofertados) y la activación por correo electrónico, tras la cual obtienes tu usuario y contraseña. Luego puedes completar información complementaria y generar tu **Certificado RUPE**. Lo detallamos en la guía de [cómo registrarse en el RUPE](/blog/como-registrarse-en-el-rupe-bolivia).",
        },
        {
          type: "p",
          text: "A partir de qué monto o en qué tipo de proceso es obligatorio presentar el certificado, y si hay costos de registro, depende de la norma y del DBC de cada proceso: verifícalo en el portal y en la norma vigente, no en resúmenes de terceros. Lo mismo aplica a los demás requisitos que pida cada entidad, como experiencia, documentación legal o garantías.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Registrarse no significa poder ofertar a todo",
          text: "Cada DBC puede pedir requisitos adicionales (experiencia, personal, equipos, documentos legales o garantías). Estar en el RUPE es un requisito de entrada, no una garantía de que cumples con todo lo que exige un proceso concreto.",
        },
      ],
    },
    {
      id: "diferencia-sicoes-rupe-sigep",
      heading: "¿Cuál es la diferencia entre SICOES, RUPE y SIGEP?",
      blocks: [
        {
          type: "p",
          text: "El **SICOES** es el portal donde se publican las convocatorias; el **RUPE** es el registro de proveedores del Estado que se usa para identificarte y acreditar tus datos al ofertar; y el **SIGEP** aparece, en algunos procesos de consultoría individual, como otro registro que el postulante debe tener. Son piezas distintas que se complementan.",
        },
        {
          type: "table",
          caption: "SICOES, RUPE y SIGEP de un vistazo",
          head: ["Sigla", "Qué es", "Cuándo lo vas a necesitar"],
          rows: [
            ["SICOES", "Sistema de Contrataciones Estatales; portal oficial de convocatorias.", "Para ver procesos, descargar el DBC y formularios."],
            ["RUPE", "Registro Único de Proveedores del Estado.", "Para ofrecer propuestas y acreditar tus datos de proveedor."],
            ["SIGEP", "Sistema de gestión pública del Estado, que en ejemplos de DBC de consultoría individual aparece como registro requerido.", "Solo si el DBC del cargo lo exige; revisa el documento de cada proceso."],
          ],
        },
        {
          type: "p",
          text: "En ejemplos observados de DBC de consultoría individual se pide registro tanto en RUPE como en SIGEP. Eso no es una regla general para todos los procesos: es un ejemplo que vale la pena revisar si te postulas a un cargo. La conclusión práctica es leer siempre la sección de requisitos del DBC antes de postular.",
        },
      ],
    },
    {
      id: "ciclo-de-un-proceso",
      heading: "¿Cómo es el ciclo de un proceso de contratación?",
      blocks: [
        {
          type: "p",
          text: "En términos generales, un proceso avanza por seis etapas: **convocatoria, consultas, presentación de propuestas, evaluación, adjudicación y contrato**. Los plazos de cada etapa y la forma exacta de cumplirlas dependen de la modalidad y del DBC, así que lo que sigue es un mapa general, no un calendario.",
        },
        {
          type: "ol",
          items: [
            "**Convocatoria:** la entidad publica el proceso en el SICOES con su CUCE, el objeto, la modalidad, la fecha de presentación y el DBC con sus formularios.",
            "**Consultas:** si algo no queda claro, los interesados pueden pedir aclaraciones a la entidad por los medios y en los plazos que indique el DBC.",
            "**Presentación de propuestas:** envías tu propuesta con los formularios y respaldos requeridos, dentro del plazo y en la forma que establece el DBC (en algunos casos de forma electrónica, para lo cual el RUPE debe estar activo).",
            "**Evaluación:** una comisión o responsable designado por la entidad revisa las propuestas aplicando los criterios del DBC.",
            "**Adjudicación:** la entidad determina qué propuesta resulta adjudicada, o declara el proceso desierto si corresponde.",
            "**Contrato:** con el adjudicatario se formaliza el contrato, con las condiciones y garantías que establezca el DBC y la norma.",
          ],
        },
        {
          type: "p",
          text: "Si quieres convertir este mapa en una estrategia concreta, la guía de [cómo ganar licitaciones en Bolivia](/blog/como-ganar-licitaciones-en-bolivia) detalla cómo preparar propuestas competitivas. Y si prefieres revisar el panorama del día a día, puedes explorar las [licitaciones vigentes](/licitaciones).",
        },
      ],
    },
    {
      id: "errores-de-novatos",
      heading: "¿Cuáles son los errores más comunes de quien empieza?",
      blocks: [
        {
          type: "p",
          text: "Los errores más comunes de quienes se inician en el SICOES son **no leer el DBC completo, dejar el registro en el RUPE para último momento, perder el plazo de presentación y entregar formularios incompletos**. Casi todos se evitan con organización y anticipación.",
        },
        {
          type: "ul",
          items: [
            "**No leer el DBC completo.** Los requisitos, la forma de presentación y los criterios de evaluación están ahí. Quien se guía por un resumen suele equivocarse.",
            "**Registrarse tarde en el RUPE.** La activación depende de un correo electrónico y de completar la información; hacerlo con el plazo encima es arriesgado.",
            "**Confundir fecha de publicación con fecha de presentación.** Son datos distintos y solo la segunda es tu fecha límite; confírmala en el DBC.",
            "**Postular a todo.** Presentar propuestas a procesos que no encajan con tu experiencia consume tiempo y rara vez da resultados. Es mejor elegir menos procesos y prepararlos bien.",
            "**Olvidar los respaldos.** Muchos formularios exigen documentos adjuntos; un respaldo faltante puede costarte la propuesta.",
            "**No hacer consultas a tiempo.** Si tienes dudas sobre el objeto o los requisitos, consúltalas dentro del periodo previsto en el DBC.",
          ],
        },
        {
          type: "p",
          text: "Tenemos una guía dedicada a este tema: [errores que descalifican propuestas en licitaciones de Bolivia](/blog/errores-que-descalifican-propuestas-licitaciones-bolivia).",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Qué hacer si no estás seguro de un requisito",
          text: "No lo supongas. Revisa de nuevo el DBC, consulta a la entidad convocante por el medio que indique el documento y, si el caso es complejo o legal, busca asesoría profesional. SICOES Monitor no ofrece asesoría legal.",
        },
      ],
    },
    {
      id: "como-seguir-convocatorias",
      heading: "¿Cómo seguir las convocatorias del SICOES cada día?",
      blocks: [
        {
          type: "p",
          text: "Puedes seguir las convocatorias de tres formas: **entrar al portal oficial con regularidad**, usar **páginas que organizan las convocatorias por departamento, municipio o rubro**, o **recibir un resumen diario por correo**. Lo ideal es combinarlas y, sobre todo, verificar siempre el proceso final en sicoes.gob.bo.",
        },
        {
          type: "ol",
          items: [
            "**Define tu perfil.** Anota tus rubros, el tamaño de contratos que puedes asumir y las zonas donde puedes trabajar.",
            "**Haz tu revisión diaria.** Reserva un momento fijo cada día para revisar convocatorias nuevas; los plazos son cortos y un día perdido cuenta.",
            "**Filtra por lo que importa.** Descarta rápido lo que no encaja y profundiza en lo que sí.",
            "**Descarga el DBC de los procesos interesantes** y revisa requisitos, plazos y formularios antes de decidir.",
            "**Anota fechas límite** en tu calendario, con margen para reunir documentos.",
          ],
        },
        {
          type: "p",
          text: "Si prefieres explorar por zona o por tema, puedes empezar por departamentos como [La Paz](/licitaciones/departamento/la-paz), [Santa Cruz](/licitaciones/departamento/santa-cruz) o [Cochabamba](/licitaciones/departamento/cochabamba), o por rubros como [construcción](/licitaciones/categoria/construccion), [tecnología](/licitaciones/categoria/tecnologia) o [consultoría](/licitaciones/categoria/consultoria). Para una comparación de servicios disponibles, lee [herramientas de alertas de licitaciones en Bolivia](/blog/herramientas-de-alertas-de-licitaciones-bolivia), y para un método completo de búsqueda, [cómo encontrar licitaciones en Bolivia](/blog/como-encontrar-licitaciones-en-bolivia).",
        },
      ],
    },
    {
      id: "como-te-ayuda-sicoes-monitor",
      heading: "Cómo SICOES Monitor te ayuda",
      blocks: [
        {
          type: "p",
          text: "SICOES Monitor es un servicio **gratuito e independiente** de Ribentek (no afiliado al Estado). Lee a diario las convocatorias nacionales vigentes de SICOES, las prioriza con IA según el perfil de tu empresa y tus palabras clave, y te envía un **resumen por correo a las 9:00 (hora de Bolivia)** con un puntaje de relevancia y el enlace directo al proceso. Puedes [ingresar con tu correo en /login](/login).",
        },
        {
          type: "p",
          text: "Aclaraciones importantes: SICOES Monitor no presenta propuestas por ti, no ofrece (todavía) alertas de requerimiento de personal ni brinda asesoría legal. Es una ayuda para no perder oportunidades, pero **la fuente oficial es sicoes.gob.bo y el DBC de cada proceso**; verifica siempre allí antes de decidir. Si tienes dudas o sugerencias, escribe a jbendek@ribentek.com.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Qué es el SICOES en Bolivia?",
      a: "El SICOES es el Sistema de Contrataciones Estatales de Bolivia, el portal oficial (sicoes.gob.bo) donde las entidades públicas publican convocatorias para contratar bienes, obras, servicios generales y consultorías. Lo administra el Ministerio de Economía y Finanzas Públicas. Cualquier persona puede consultar las convocatorias; para ofrecer propuestas se necesita, en general, estar registrado en el RUPE y cumplir los requisitos del DBC.",
    },
    {
      q: "¿Quién administra el SICOES?",
      a: "El SICOES es administrado por el Ministerio de Economía y Finanzas Públicas (MEFP) de Bolivia. Sin embargo, cada convocatoria la publica y gestiona la entidad pública que contrata, y es esa entidad la responsable del proceso. Por eso, las consultas sobre plazos, requisitos o resultados de un proceso concreto deben dirigirse a la entidad convocante siguiendo lo que indique su documento base de contratación.",
    },
    {
      q: "¿Cuánto cuesta ver las convocatorias en el SICOES?",
      a: "La consulta de convocatorias en el portal oficial es abierta, sin necesidad de cuenta. Respecto a costos de registro en el RUPE o de participar en procesos específicos, no los afirmamos aquí: dependen de la norma vigente y del documento base de contratación de cada proceso, por lo que debes verificarlos directamente en sicoes.gob.bo y en la normativa aplicable antes de tomar decisiones.",
    },
    {
      q: "¿Qué es el CUCE de un proceso?",
      a: "El CUCE es el Código Único de Contrataciones Estatales. Cada proceso publicado en el SICOES tiene uno, y funciona como su número de identificación. Es útil para ubicar el proceso con exactitud, citarlo en consultas a la entidad y distinguirlo de otros procesos parecidos. Lo verás junto a los datos de la convocatoria, como la entidad, el objeto y la fecha de presentación.",
    },
    {
      q: "¿Necesito estar en el RUPE para ver convocatorias?",
      a: "No para consultarlas: las convocatorias se pueden ver sin registro. En cambio, para ofrecer propuestas se requiere, en general, información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado. Si planeas participar, conviene registrarte con anticipación, porque incluye una etapa de activación por correo electrónico antes de obtener tu usuario y contraseña.",
    },
    {
      q: "¿Cuál es la diferencia entre SICOES y RUPE?",
      a: "El SICOES es el portal donde se publican las convocatorias y se descarga la documentación de cada proceso. El RUPE es el Registro Único de Proveedores del Estado, al que se accede desde el propio portal y donde se registran personas naturales, empresas unipersonales y personas jurídicas. En términos simples: el SICOES es donde encuentras oportunidades y el RUPE es donde acreditas quién eres como proveedor.",
    },
    {
      q: "¿Dónde se publican las convocatorias de personal y consultores?",
      a: "Las convocatorias de personal y de consultoría individual se publican en la sección Requerimiento de Personal del SICOES. Cada cargo tiene su propio documento base de contratación con términos de referencia, requisitos y forma de postulación. Algunos ejemplos observados piden además registro en SIGEP y evaluación por etapas, pero eso varía; revisa siempre el DBC del cargo al que quieres postular.",
    },
    {
      q: "¿SICOES Monitor es el portal oficial del SICOES?",
      a: "No. SICOES Monitor es un servicio gratuito e independiente de Ribentek, sin afiliación con el Estado. Lee las convocatorias nacionales vigentes del SICOES, las prioriza según tu perfil y te envía un resumen diario por correo con enlace al proceso. La fuente oficial y vigente siempre es sicoes.gob.bo y el documento base de contratación de cada proceso, que debes verificar antes de decidir.",
    },
  ],
  related: [
    "como-registrarse-en-el-rupe-bolivia",
    "modalidades-de-contratacion-estatal-bolivia",
    "sicoes-gob-bo-como-ingresar-y-buscar-convocatorias",
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
      label: "Guía operativa RUPE empresa (SICOES)",
      url: "https://www.sicoes.gob.bo/portal/docs/manualRupeEmpresa.pdf",
    },
    {
      label: "Modelo de DBC ANPE bienes (MEFP, 2022)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2023-01/DBC_ANPE_BIENES_02022022.pdf",
    },
  ],
};

export default post;
