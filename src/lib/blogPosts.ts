export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Direct, quotable answer shown first (optimized for AI answer engines). */
  tldr: string;
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  keywords: string[];
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  related: string[];
}

const DATE = "2026-10-02";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-es-sicoes-bolivia",
    title: "¿Qué es SICOES en Bolivia y cómo funciona? Guía 2026",
    description:
      "SICOES es el Sistema de Contrataciones Estatales de Bolivia (sicoes.gob.bo). Qué publica, quién puede participar, cómo se relaciona con el RUPE y cómo seguir las convocatorias.",
    tldr:
      "SICOES (Sistema de Contrataciones Estatales) es el portal oficial del Estado Plurinacional de Bolivia, en sicoes.gob.bo, donde las entidades públicas publican sus convocatorias de contratación de bienes, obras y servicios. Para participar, el proveedor debe estar inscrito en el RUPE (Registro Único de Proveedores del Estado).",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 5,
    keywords: ["qué es SICOES", "SICOES Bolivia", "sicoes.gob.bo", "contrataciones estatales Bolivia", "convocatorias SICOES"],
    sections: [
      {
        heading: "SICOES en una frase",
        paragraphs: [
          "SICOES es el sistema electrónico donde las entidades públicas bolivianas (ministerios, gobernaciones, municipios, universidades públicas y empresas estatales) publican las convocatorias para contratar bienes, obras, servicios generales y consultorías. Es administrado por el Ministerio de Economía y Finanzas Públicas y su portal es sicoes.gob.bo.",
          "Cualquier persona puede consultar las convocatorias vigentes. Para presentar una propuesta, en cambio, es necesario contar con registro en el RUPE.",
        ],
      },
      {
        heading: "¿Qué información publica SICOES?",
        list: [
          "CUCE: Código Único de Contrataciones Estatales que identifica cada proceso.",
          "Entidad convocante y objeto de la contratación.",
          "Tipo y modalidad de contratación (por ejemplo ANPE o Licitación Pública).",
          "Fecha de publicación y fecha límite de presentación de propuestas.",
          "Documento base de contratación (DBC) y formularios del proceso.",
          "Estado del proceso: vigente, adjudicado, desierto o cancelado.",
        ],
      },
      {
        heading: "¿Quién puede participar?",
        paragraphs: [
          "Pueden participar personas naturales, empresas unipersonales y personas jurídicas (sociedades, asociaciones accidentales, entre otras) que estén habilitadas en el RUPE y no tengan impedimentos para contratar con el Estado. Cada convocatoria detalla además los requisitos propios del proceso.",
        ],
      },
      {
        heading: "El problema: revisar el portal todos los días",
        paragraphs: [
          "Las convocatorias tienen plazos cortos y se publican a diario en todo el país. Una empresa que no revisa el portal con frecuencia puede enterarse tarde de oportunidades de su rubro. Por eso existen servicios de alerta como SICOES Monitor, que lee las convocatorias vigentes, las ordena por relevancia con inteligencia artificial y envía cada mañana un resumen por email.",
        ],
      },
      {
        heading: "Cómo empezar",
        list: [
          "Regístrate en el RUPE desde sicoes.gob.bo (guía paso a paso en este blog).",
          "Define tu rubro y palabras clave para filtrar el ruido.",
          "Activa alertas diarias para no perder fechas límite.",
          "Revisa el documento base de contratación completo antes de preparar tu propuesta.",
        ],
        ordered: true,
      },
    ],
    faqs: [
      { q: "¿SICOES es lo mismo que el RUPE?", a: "No. SICOES es el portal donde se publican las convocatorias; el RUPE es el registro de proveedores al que se accede desde el mismo portal y que es necesario para presentar propuestas." },
      { q: "¿Consultar SICOES tiene costo?", a: "La consulta de convocatorias en sicoes.gob.bo es pública. SICOES Monitor es un servicio independiente y gratuito que añade alertas diarias con IA." },
      { q: "¿SICOES Monitor es un sitio oficial?", a: "No. SICOES Monitor es un producto independiente de Ribentek que organiza información pública del portal oficial; no está afiliado al Estado boliviano." },
    ],
    related: ["como-registrarse-en-el-rupe-bolivia", "como-encontrar-licitaciones-en-bolivia", "modalidades-de-contratacion-estatal-bolivia"],
  },
  {
    slug: "como-registrarse-en-el-rupe-bolivia",
    title: "Cómo registrarse en el RUPE (Bolivia): pasos y requisitos",
    description:
      "Guía práctica del Registro Único de Proveedores del Estado (RUPE): para qué sirve, cuándo es obligatorio, pasos de registro y cómo obtener el certificado.",
    tldr:
      "El RUPE (Registro Único de Proveedores del Estado) es el registro obligatorio para contratar con el Estado boliviano en procesos mayores a Bs 20.000. Se tramita en sicoes.gob.bo en dos etapas: registro inicial de datos y activación de la cuenta por correo electrónico; luego se genera el certificado RUPE.",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 5,
    keywords: ["RUPE Bolivia", "registro RUPE", "certificado RUPE", "cómo registrarse en el RUPE", "proveedores del Estado Bolivia"],
    sections: [
      {
        heading: "¿Qué es el RUPE?",
        paragraphs: [
          "El Registro Único de Proveedores del Estado (RUPE) reúne la información de los proveedores, contratistas y consultores que contratan con entidades públicas. Se gestiona desde el portal SICOES y es requisito para participar en los procesos de contratación sobre el umbral de contratación menor (procesos mayores a Bs 20.000).",
        ],
      },
      {
        heading: "Pasos para registrarse",
        list: [
          "Ingresa a sicoes.gob.bo y elige la opción RUPE → Registrarme.",
          "Selecciona el tipo de proveedor (persona natural, empresa unipersonal o persona jurídica).",
          "Completa información general, dirección, representante legal y los bienes o servicios que ofreces.",
          "Define al responsable del registro y finaliza la etapa inicial.",
          "Activa tu cuenta desde el enlace enviado a tu correo y obtén tu usuario y contraseña.",
          "Completa la información complementaria y genera tu certificado RUPE.",
        ],
        ordered: true,
      },
      {
        heading: "El certificado RUPE",
        paragraphs: [
          "El certificado RUPE acredita tu inscripción. Las entidades públicas verifican su autenticidad ingresando el código de verificación en SICOES, por lo que conviene mantenerlo vigente y con datos actualizados (por ejemplo, cambios de matrícula de comercio o de representante legal).",
        ],
      },
      {
        heading: "Errores frecuentes",
        list: [
          "Dejar la activación por correo pendiente y descubrirlo el día del cierre de una convocatoria.",
          "No actualizar los rubros ofrecidos, lo que limita las invitaciones y la coincidencia con procesos.",
          "Presentar un certificado con datos desactualizados.",
        ],
      },
      {
        heading: "Importante",
        paragraphs: [
          "Los requisitos y procedimientos pueden cambiar. Confirma siempre en los manuales y guías operativas publicados en sicoes.gob.bo antes de realizar el trámite.",
        ],
      },
    ],
    faqs: [
      { q: "¿El RUPE es obligatorio?", a: "Sí para contratar con el Estado en procesos mayores a Bs 20.000, ya sea persona natural, unipersonal o jurídica, según las referencias normativas vigentes; verifica la norma actualizada." },
      { q: "¿Dónde se tramita el RUPE?", a: "En el portal oficial sicoes.gob.bo, sección RUPE → Registrarme." },
      { q: "¿Tiene costo registrarse?", a: "Consulta los costos vigentes (si los hay) directamente en el portal oficial, ya que pueden variar." },
    ],
    related: ["que-es-sicoes-bolivia", "modalidades-de-contratacion-estatal-bolivia", "como-ganar-licitaciones-en-bolivia"],
  },
  {
    slug: "modalidades-de-contratacion-estatal-bolivia",
    title: "Modalidades de contratación estatal en Bolivia: ANPE, Licitación Pública y más",
    description:
      "Diferencias entre Contratación Menor, ANPE y Licitación Pública en Bolivia, con los rangos de monto de referencia y qué implica cada una para tu empresa.",
    tldr:
      "Según las referencias de las Normas Básicas del SABS, la contratación estatal en Bolivia se divide por monto: Contratación Menor (hasta Bs 20.000), ANPE (Apoyo Nacional a la Producción y Empleo, desde Bs 50.000 hasta Bs 1.000.000) y Licitación Pública (desde Bs 1.000.000, nacional hasta Bs 70.000.000 e internacional por encima).",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 4,
    keywords: ["ANPE Bolivia", "licitación pública Bolivia", "contratación menor Bolivia", "modalidades de contratación Bolivia", "SABS"],
    sections: [
      {
        heading: "Resumen por monto",
        list: [
          "Contratación Menor: desde Bs 1 hasta Bs 20.000.",
          "ANPE (Apoyo Nacional a la Producción y Empleo): mayores a Bs 50.000 y hasta Bs 1.000.000; puede ejecutarse por Solicitud de Cotizaciones o Solicitud de Propuestas.",
          "Licitación Pública Nacional: desde Bs 1.000.000 hasta Bs 70.000.000.",
          "Licitación Pública Internacional: montos mayores a Bs 70.000.000.",
        ],
      },
      {
        heading: "ANPE: la modalidad más relevante para PYMES",
        paragraphs: [
          "ANPE está pensada para impulsar a proveedores nacionales en procesos de monto intermedio. En ANPE, la garantía de seriedad de propuesta solo puede exigirse en contrataciones con precio referencial superior a Bs 200.000.",
        ],
      },
      {
        heading: "Licitación Pública",
        paragraphs: [
          "Es la modalidad para los montos más altos. Exige documentación técnica y económica más completa, y suele requerir garantías. Prepara tu propuesta con anticipación: los plazos están definidos en el documento base de contratación de cada proceso.",
        ],
      },
      {
        heading: "Qué hacer con esta información",
        paragraphs: [
          "Filtra las convocatorias por modalidad según el tamaño de tu empresa y tu capacidad financiera. Los umbrales pueden actualizarse por normativa; valídalos en la norma vigente y en el DBC del proceso.",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué significa ANPE?", a: "Apoyo Nacional a la Producción y Empleo, una modalidad de contratación para montos intermedios (mayores a Bs 50.000 hasta Bs 1.000.000)." },
      { q: "¿Cuál es el monto mínimo para una Licitación Pública?", a: "Desde Bs 1.000.000, según los rangos de referencia de las normas básicas; verifica la normativa actualizada." },
    ],
    related: ["que-es-sicoes-bolivia", "como-ganar-licitaciones-en-bolivia", "como-registrarse-en-el-rupe-bolivia"],
  },
  {
    slug: "como-encontrar-licitaciones-en-bolivia",
    title: "Cómo encontrar licitaciones en Bolivia (y recibir alertas diarias)",
    description:
      "Métodos para encontrar licitaciones y convocatorias vigentes en Bolivia: portal SICOES, filtros por rubro y departamento, y alertas automáticas por email con IA.",
    tldr:
      "Para encontrar licitaciones en Bolivia, consulta las convocatorias vigentes en sicoes.gob.bo, filtra por rubro, entidad y departamento, y automatiza el seguimiento con alertas diarias como las de SICOES Monitor, que envía cada mañana a las 9am (hora Bolivia) un resumen de oportunidades relevantes para tu empresa.",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 4,
    keywords: ["encontrar licitaciones Bolivia", "licitaciones vigentes Bolivia", "alertas licitaciones Bolivia", "convocatorias Bolivia", "buscar licitaciones"],
    sections: [
      {
        heading: "1. El portal oficial",
        paragraphs: [
          "La fuente de verdad es sicoes.gob.bo. Allí puedes ver las convocatorias vigentes con su CUCE, entidad, objeto y fecha de presentación.",
        ],
      },
      {
        heading: "2. Navegar por departamento y rubro",
        paragraphs: [
          "En SICOES Monitor puedes explorar las convocatorias por departamento (La Paz, Santa Cruz, Cochabamba, Oruro, Potosí, Tarija, Chuquisaca, Beni y Pando) y por rubro (construcción, tecnología, salud, consultoría, servicios, mantenimiento, logística y educación) sin crear cuenta.",
        ],
      },
      {
        heading: "3. Alertas automáticas",
        paragraphs: [
          "Revisar el portal todos los días consume tiempo. Con un perfil de rubro y palabras clave, SICOES Monitor te envía a las 9am solo lo relevante, con un puntaje de relevancia calculado por IA y el enlace directo al proceso.",
        ],
      },
      {
        heading: "4. Palabras clave que funcionan",
        list: [
          "Usa términos del objeto de contratación (por ejemplo: «provisión», «mantenimiento», «consultoría», «software»).",
          "Incluye sinónimos y variantes con y sin tildes.",
          "Añade nombres de entidades con las que quieres trabajar.",
        ],
      },
    ],
    faqs: [
      { q: "¿Cada cuánto se publican convocatorias?", a: "A diario. Por eso conviene automatizar el seguimiento con alertas." },
      { q: "¿Puedo ver licitaciones de mi departamento?", a: "Sí. SICOES Monitor tiene páginas por departamento y por rubro con las convocatorias vigentes." },
    ],
    related: ["que-es-sicoes-bolivia", "herramientas-de-alertas-de-licitaciones-bolivia", "como-ganar-licitaciones-en-bolivia"],
  },
  {
    slug: "herramientas-de-alertas-de-licitaciones-bolivia",
    title: "Herramientas de alertas de licitaciones en Bolivia: qué mirar antes de elegir",
    description:
      "Criterios para comparar servicios de alertas de licitaciones en Bolivia: fuente de datos, filtros, canal de aviso, relevancia y costo. Incluye SICOES Monitor.",
    tldr:
      "Al elegir un servicio de alertas de licitaciones en Bolivia, compara: fuente oficial de datos (SICOES), frecuencia de actualización, filtros por rubro y departamento, canal de aviso (email o WhatsApp), calidad de la priorización y costo. SICOES Monitor ofrece alertas diarias por email con IA, de forma gratuita.",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 4,
    keywords: ["alertas licitaciones Bolivia", "monitor de licitaciones", "herramientas licitaciones Bolivia", "SICOES alertas"],
    sections: [
      {
        heading: "Qué existe hoy",
        paragraphs: [
          "En Bolivia hay varios servicios que reutilizan la información pública de SICOES: directorios de convocatorias con filtros, servicios de alerta por WhatsApp y monitores por email. Cada uno tiene un enfoque distinto, por lo que conviene revisar sus sitios y condiciones actuales.",
        ],
      },
      {
        heading: "Criterios de comparación",
        list: [
          "Fuente de datos: ¿se basa en el portal oficial sicoes.gob.bo?",
          "Actualización: ¿cada cuánto se refresca la información?",
          "Filtros: rubro, departamento, entidad, monto, modalidad.",
          "Canal: email, WhatsApp o panel web, según cómo trabaje tu equipo.",
          "Relevancia: ¿prioriza lo que importa a tu empresa o solo lista todo?",
          "Costo y límites de uso.",
        ],
      },
      {
        heading: "Enfoque de SICOES Monitor",
        paragraphs: [
          "SICOES Monitor está diseñado para empresas bolivianas: escanea las convocatorias vigentes, calcula un puntaje de relevancia con IA según tu perfil y envía un resumen diario por email a las 9am hora Bolivia. Es gratuito y requiere solo un correo para empezar.",
        ],
      },
    ],
    faqs: [
      { q: "¿Necesito pagar para recibir alertas?", a: "SICOES Monitor es gratuito. Otros servicios pueden tener planes de pago; revisa sus condiciones." },
      { q: "¿Las alertas reemplazan al portal oficial?", a: "No. Las alertas te avisan; el detalle oficial y la presentación de propuestas se hacen siempre en sicoes.gob.bo." },
    ],
    related: ["como-encontrar-licitaciones-en-bolivia", "que-es-sicoes-bolivia"],
  },
  {
    slug: "como-ganar-licitaciones-en-bolivia",
    title: "Cómo ganar licitaciones en Bolivia: checklist para empresas y PYMES",
    description:
      "Checklist práctico para preparar propuestas en contrataciones estatales de Bolivia: RUPE al día, lectura del DBC, documentación, plazos y errores que descalifican.",
    tldr:
      "Para aumentar tus posibilidades de ganar una licitación en Bolivia: mantén el RUPE vigente, lee completo el documento base de contratación, cumple todos los formularios y plazos, presenta documentación sin errores y responde exactamente a lo que pide la entidad. Detectar a tiempo la convocatoria es el primer paso.",
    datePublished: DATE,
    dateModified: DATE,
    readingMinutes: 5,
    keywords: ["ganar licitaciones Bolivia", "preparar propuesta licitación Bolivia", "DBC", "licitaciones PYMES Bolivia"],
    sections: [
      {
        heading: "Antes de la convocatoria",
        list: [
          "RUPE vigente y con rubros actualizados.",
          "Documentos legales y tributarios al día.",
          "Alertas activas por rubro para enterarte el día de la publicación.",
        ],
      },
      {
        heading: "Al encontrar una convocatoria",
        list: [
          "Descarga y lee todo el documento base de contratación (DBC).",
          "Anota fechas clave: consultas, reunión aclaratoria, presentación y apertura.",
          "Verifica requisitos de experiencia, personal y garantías.",
          "Decide rápido si participar: tu tiempo es limitado.",
        ],
        ordered: true,
      },
      {
        heading: "Al preparar la propuesta",
        list: [
          "Completa cada formulario tal como lo pide el DBC, sin modificar formatos.",
          "Revisa montos, firmas y fechas antes de presentar.",
          "Cuida la coherencia entre propuesta técnica y económica.",
          "Presenta con margen de tiempo: no esperes a la última hora.",
        ],
      },
      {
        heading: "Errores que descalifican",
        list: [
          "Documentos faltantes o vencidos.",
          "Formularios incompletos o alterados.",
          "Propuesta fuera de plazo.",
          "Incumplir requisitos habilitantes del DBC.",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué es el DBC?", a: "El Documento Base de Contratación: define requisitos, formularios, criterios de evaluación y plazos de cada proceso." },
      { q: "¿Una PYME puede ganar licitaciones del Estado?", a: "Sí. Modalidades como ANPE están orientadas a proveedores nacionales en montos intermedios. Lo clave es cumplir requisitos y plazos." },
    ],
    related: ["modalidades-de-contratacion-estatal-bolivia", "como-registrarse-en-el-rupe-bolivia", "como-encontrar-licitaciones-en-bolivia"],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
