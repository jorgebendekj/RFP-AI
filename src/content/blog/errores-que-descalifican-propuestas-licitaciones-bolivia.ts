import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "errores-que-descalifican-propuestas-licitaciones-bolivia",
  title: "12 errores que descalifican propuestas en licitaciones Bolivia",
  description:
    "Los 12 errores más evitables que pueden descalificar una propuesta en licitaciones de Bolivia: causa, consecuencia y cómo evitarlos, con checklist pre-envío.",
  tldr:
    "En licitaciones de Bolivia, la mayoría de los errores que descalifican son formales y evitables: documentos vencidos, formularios alterados, plazos incumplidos, inconsistencias entre propuestas o RUPE desactualizado. Qué causa descalificación lo define el DBC de cada proceso en SICOES (sicoes.gob.bo). Esta guía explica 12 errores y un checklist de verificación antes de enviar.",
  category: "Estrategia",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "errores en licitaciones Bolivia",
    "descalificación de propuestas Bolivia",
    "por qué descalifican una propuesta",
    "checklist licitaciones",
    "requisitos habilitantes",
    "DBC",
    "RUPE",
    "SICOES",
    "propuesta rechazada licitación",
    "contrataciones estatales Bolivia",
  ],
  sections: [
    {
      id: "por-que-descalifican",
      heading: "¿Por qué se descalifica una propuesta en una licitación en Bolivia?",
      blocks: [
        {
          type: "p",
          text:
            "Una propuesta se descalifica cuando incumple algo que el documento base de contratación (DBC) establece como causal, ya sea un requisito habilitante, un formato obligatorio o un plazo. En la práctica, muchas pérdidas no se deben a que la oferta fuera mala, sino a errores formales: un documento vencido, un formulario modificado o un archivo equivocado.",
        },
        {
          type: "p",
          text:
            "Este artículo reúne 12 errores frecuentes en procesos de contratación estatal. Para cada uno verás la causa, la consecuencia posible y cómo evitarlo. Son descripciones generales basadas en buenas prácticas, no una lista oficial de causales.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "El DBC manda",
          text:
            "Qué errores llevan a descalificación, y cuáles son subsanables, lo define el DBC de cada proceso y la norma vigente. Lo que aquí se describe no es una regla universal: verifica siempre el DBC en sicoes.gob.bo. SICOES Monitor es un servicio independiente de Ribentek, no el portal oficial ni una fuente de asesoría legal.",
        },
        {
          type: "p",
          text:
            "Si estás empezando, conviene entender antes [qué es el DBC](/blog/documento-base-de-contratacion-dbc-bolivia) y cómo funciona el [proceso completo para ganar licitaciones](/blog/como-ganar-licitaciones-en-bolivia).",
        },
      ],
    },
    {
      id: "tabla-resumen",
      heading: "¿Cuáles son los 12 errores? Tabla resumen",
      blocks: [
        {
          type: "p",
          text:
            "Los 12 errores más evitables son: documentos vencidos, formularios alterados, presentación fuera de plazo, incumplir requisitos habilitantes, inconsistencias entre propuesta técnica y económica, errores aritméticos, fallas de firma o representación, RUPE desactualizado, no leer adendas o aclaraciones, subir archivos equivocados o corruptos, dejar todo para el último minuto e ignorar los términos de referencia.",
        },
        {
          type: "table",
          caption: "Resumen: error, riesgo y prevención",
          head: ["#", "Error", "Riesgo principal", "Cómo evitarlo"],
          rows: [
            ["1", "Documentos vencidos", "Documento inválido el día de presentación", "Calendario de vencimientos y revisión previa"],
            ["2", "Formularios alterados", "Incumplimiento del formato obligatorio", "Usar formularios del DBC tal cual"],
            ["3", "Presentar fuera de plazo", "Propuesta no admitida", "Conocer fecha, hora y forma; margen de seguridad"],
            ["4", "No cumplir requisitos habilitantes", "No pasar la etapa de cumplimiento", "Matriz de requisitos con evidencia"],
            ["5", "Propuestas técnica y económica inconsistentes", "Observaciones o pérdida de puntaje", "Revisión cruzada"],
            ["6", "Errores aritméticos", "Totales incorrectos o ambiguos", "Verificación doble y por otra persona"],
            ["7", "Firmas o representación incorrectas", "Documentos sin validez formal", "Verificar quién firma y con qué poder"],
            ["8", "RUPE desactualizado", "Información no válida o no activa", "Actualizar y revisar el certificado"],
            ["9", "No leer adendas o aclaraciones", "Responder a condiciones ya modificadas", "Revisar el proceso hasta el cierre"],
            ["10", "Archivos equivocados o corruptos", "Documentación ilegible o incorrecta", "Abrir y verificar cada archivo"],
            ["11", "Dejar todo para el último minuto", "Fallas técnicas y omisiones", "Cronograma regresivo y presentación anticipada"],
            ["12", "Ignorar los términos de referencia", "Propuesta que no responde al objeto", "Matriz de respuesta punto por punto"],
          ],
        },
      ],
    },
    {
      id: "errores-1-a-4",
      heading: "Errores 1 a 4: documentos, formularios, plazos y requisitos habilitantes",
      blocks: [
        {
          type: "h3",
          text: "1. Presentar documentos vencidos",
        },
        {
          type: "p",
          text:
            "Causa: no hay control de fechas de vigencia y se reutiliza la carpeta de un proceso anterior. Consecuencia: un documento sin vigencia el día de la presentación puede no ser aceptado, según lo que disponga el DBC. Cómo evitarlo: crea una hoja con cada documento y su fecha de vencimiento, revísala al inicio de cada proceso y renueva con margen. Verifica qué antigüedad máxima acepta el DBC para cada documento.",
        },
        {
          type: "h3",
          text: "2. Alterar o reemplazar los formularios",
        },
        {
          type: "p",
          text:
            "Causa: se «mejora» el formato, se borran campos que parecen innecesarios o se reemplaza el formulario por uno propio. Consecuencia: la propuesta puede considerarse que no cumple el formato exigido y complica la evaluación. Cómo evitarlo: usa los formularios del DBC tal como vienen, completa todos los campos aplicables y, si algo no corresponde, no lo borres: sigue las indicaciones del propio documento. Si hay dudas, consulta a la entidad dentro del plazo de consultas.",
        },
        {
          type: "h3",
          text: "3. Presentar fuera de plazo o en forma incorrecta",
        },
        {
          type: "p",
          text:
            "Causa: se calcula mal la fecha u hora límite, se confunde el lugar o la forma de presentación, o no se considera el tiempo de traslado o de carga. Consecuencia: una propuesta fuera de plazo puede no ser admitida, y no hay forma de recuperar el trabajo invertido. Cómo evitarlo: anota la fecha, hora y forma de presentación del DBC en un lugar visible, confirma si hay modificaciones en adendas y presenta con un margen amplio. Si tienes dudas, revisa el proceso en [sicoes.gob.bo](https://www.sicoes.gob.bo).",
        },
        {
          type: "h3",
          text: "4. No cumplir los requisitos habilitantes",
        },
        {
          type: "p",
          text:
            "Causa: se postula sin comprobar que se cumplen los requisitos mínimos de participación (experiencia, personal, documentos u otros que defina el DBC). Consecuencia: la propuesta puede quedar fuera antes de evaluar la parte técnica o económica. Cómo evitarlo: arma una matriz con cada requisito, la evidencia que lo acredita y el documento adjunto. Si no cumples uno y no puedes subsanarlo ni asociarte, no participes: el análisis go/no-go está explicado en la [guía para ganar licitaciones](/blog/como-ganar-licitaciones-en-bolivia).",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Matriz de requisitos en cinco columnas",
          text:
            "Requisito del DBC, número de página, documento que lo cumple, responsable y estado. Es la herramienta más simple para no olvidar nada.",
        },
      ],
    },
    {
      id: "errores-5-a-8",
      heading: "Errores 5 a 8: coherencia, aritmética, firmas y RUPE",
      blocks: [
        {
          type: "h3",
          text: "5. Inconsistencias entre la propuesta técnica y la económica",
        },
        {
          type: "p",
          text:
            "Causa: cada parte la prepara una persona distinta sin revisión cruzada. Ejemplos: la propuesta técnica describe un equipo de cinco personas y la económica costea tres; los plazos no coinciden; las cantidades difieren. Consecuencia: observaciones, pérdida de puntaje o dudas sobre la capacidad real de ejecutar. Cómo evitarlo: una sola versión de las cantidades, el plazo y el equipo, y una revisión cruzada final. Lo que describes debe estar costeado y lo que cobras debe estar descrito.",
        },
        {
          type: "h3",
          text: "6. Errores aritméticos",
        },
        {
          type: "p",
          text:
            "Causa: sumas mal hechas, fórmulas de hoja de cálculo incompletas, redondeos distintos, totales que no coinciden entre el formulario y la carta. Consecuencia: el precio de tu oferta puede ser ambiguo o ser corregido según lo que disponga el DBC, con efectos que tú no controlas. Cómo evitarlo: verifica cada suma dos veces, haz que otra persona recalcule, y confirma que el total sea idéntico en todos los lugares donde aparece (formulario, carta y resumen).",
        },
        {
          type: "h3",
          text: "7. Errores de firma o de representación",
        },
        {
          type: "p",
          text:
            "Causa: firma una persona sin poder suficiente, falta una firma en un formulario, o los datos del representante no coinciden con los documentos de la empresa. Consecuencia: los documentos pueden carecer de validez formal para el proceso. Cómo evitarlo: verifica quién debe firmar según el DBC, que el poder esté vigente y que el nombre, el documento de identidad y la firma coincidan en todos los documentos. Si el proponente es una persona natural, revisa los requisitos para ese caso.",
        },
        {
          type: "h3",
          text: "8. Certificado RUPE desactualizado o con datos inconsistentes",
        },
        {
          type: "p",
          text:
            "Causa: se cambió el domicilio, el representante legal, la matrícula de comercio o los rubros y no se actualizó el RUPE. Consecuencia: para ofrecer propuestas electrónicas se requiere información válida y activa en el RUPE, y las entidades verifican la autenticidad del certificado con su código de verificación en SICOES; si hay datos desactualizados o el registro no está activo, puedes tener problemas. Cómo evitarlo: revisa tu registro antes de cada proceso, completa la información complementaria y genera un certificado actualizado. Mira [cómo registrarte y mantener el RUPE](/blog/como-registrarse-en-el-rupe-bolivia) y, si cambió tu matrícula de comercio, la guía operativa correspondiente.",
        },
      ],
    },
    {
      id: "errores-9-a-12",
      heading: "Errores 9 a 12: adendas, archivos, último minuto y términos de referencia",
      blocks: [
        {
          type: "h3",
          text: "9. No leer adendas, aclaraciones o respuestas a consultas",
        },
        {
          type: "p",
          text:
            "Causa: se lee el DBC una vez al inicio y no se vuelve a revisar el proceso. Consecuencia: puedes preparar tu propuesta con plazos, formularios o requisitos que ya fueron modificados. Cómo evitarlo: revisa el proceso en el portal oficial cada día en la última semana y de nuevo el día anterior al cierre. Anota cada cambio y actualiza tus formularios y tu cronograma en consecuencia.",
        },
        {
          type: "h3",
          text: "10. Subir o entregar archivos equivocados, incompletos o corruptos",
        },
        {
          type: "p",
          text:
            "Causa: nombres de archivo confusos, versiones antiguas, documentos escaneados ilegibles, archivos dañados o formatos no admitidos. Consecuencia: la entidad puede no poder revisar la documentación o encontrar documentos que no corresponden al proceso. Cómo evitarlo: usa una convención de nombres (por ejemplo, número de formulario y nombre), abre cada archivo antes de enviarlo, revisa la legibilidad de los escaneos y verifica los formatos y tamaños que acepte la forma de presentación del proceso.",
        },
        {
          type: "h3",
          text: "11. Dejar todo para el último minuto",
        },
        {
          type: "p",
          text:
            "Causa: la propuesta se arma en los últimos días y la presentación se deja para las últimas horas. Consecuencia: aumentan los errores, no queda tiempo para corregir y cualquier falla técnica (conexión, impresión, traslado, un documento que falta) puede dejarte fuera. Cómo evitarlo: trabaja con un cronograma regresivo, fija una fecha interna de cierre anterior a la oficial y presenta con margen. Un ejemplo de cronograma está en la [guía para ganar licitaciones](/blog/como-ganar-licitaciones-en-bolivia).",
        },
        {
          type: "h3",
          text: "12. Ignorar los términos de referencia o las especificaciones técnicas",
        },
        {
          type: "p",
          text:
            "Causa: se presenta una propuesta genérica, adaptada de un proceso anterior, que no responde a lo que la entidad pidió. Consecuencia: la propuesta puede no cumplir las especificaciones o recibir menor evaluación, aunque la empresa sea capaz. Cómo evitarlo: construye una matriz de respuesta punto por punto: cada requerimiento técnico del DBC con su respuesta y el documento de respaldo. Evalúa si el proceso corresponde a tu rubro antes de empezar, por ejemplo revisando [procesos de construcción](/licitaciones/categoria/construccion) o de [tecnología](/licitaciones/categoria/tecnologia) según lo tuyo.",
        },
        {
          type: "callout",
          tone: "info",
          title: "No todo error es igual de grave",
          text:
            "Algunos defectos pueden ser subsanables y otros no; depende del DBC y de la norma. No asumas que se te permitirá corregir: planifica para presentar bien desde el inicio.",
        },
      ],
    },
    {
      id: "checklist-pre-envio",
      heading: "¿Qué checklist usar antes de enviar la propuesta?",
      blocks: [
        {
          type: "p",
          text:
            "Usa esta lista de verificación en la última revisión, idealmente un día antes del cierre y con una persona distinta a quien armó la propuesta. Marca cada punto con evidencia, no de memoria.",
        },
        {
          type: "ol",
          items: [
            "Releí el DBC completo y las aclaraciones, adendas y respuestas a consultas publicadas.",
            "Confirmé la fecha, la hora y la forma de presentación del proceso.",
            "Cumplo cada requisito habilitante y tengo la evidencia adjunta.",
            "Todos los documentos están vigentes y legibles.",
            "El RUPE está activo, actualizado y el certificado (si se exige) es el correcto.",
            "Usé los formularios del DBC sin alterarlos y llené todos los campos aplicables.",
            "Las firmas y la representación cumplen lo que pide el DBC.",
            "La propuesta técnica responde punto por punto a los términos de referencia.",
            "La propuesta técnica y la económica coinciden en cantidades, plazos y equipo.",
            "Verifiqué las operaciones aritméticas y los totales con otra persona.",
            "Las garantías exigidas, si las hay, están listas con los datos correctos.",
            "Abrí cada archivo, revisé el nombre, el formato y que correspondan al proceso.",
            "Guardé una copia completa de lo que voy a presentar.",
            "Presento con un margen de tiempo antes del límite.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Dos pares de ojos",
          text:
            "Quien armó la propuesta suele pasar por alto sus propios errores. Pide a un colega que haga la lista de verificación sin conocer la propuesta: encontrará lo que tú ya no ves.",
        },
      ],
    },
    {
      id: "que-hacer-si-ocurre",
      heading: "¿Qué hacer si cometiste uno de estos errores?",
      blocks: [
        {
          type: "p",
          text:
            "Si detectas el error antes del cierre, corrígelo y, si el DBC lo permite, presenta la versión correcta dentro del plazo. Si lo detectas después, revisa lo que el DBC y la norma establecen sobre subsanación, aclaraciones o impugnación y consulta con un asesor legal; las posibilidades dependen de cada proceso y no deben darse por sentadas.",
        },
        {
          type: "ul",
          items: [
            "Antes del cierre: corrige, vuelve a verificar con el checklist y presenta con margen.",
            "Después de presentar: no asumas que podrás subsanar; verifica en el DBC si existe esa posibilidad y en qué plazo.",
            "Tras una descalificación: pide y revisa la información disponible según la norma, identifica la causa y documenta la lección.",
            "A futuro: añade el error a tu checklist para que no se repita en el siguiente proceso.",
          ],
        },
        {
          type: "p",
          text:
            "Si recién estás conociendo el terreno, repasa [qué es SICOES](/blog/que-es-sicoes-bolivia) y cómo funciona el sistema antes de tu primera propuesta.",
        },
      ],
    },
    {
      id: "como-te-ayuda-sicoes-monitor",
      heading: "Cómo SICOES Monitor te ayuda a evitar errores",
      blocks: [
        {
          type: "p",
          text:
            "SICOES Monitor es un servicio gratuito e independiente de Ribentek, no afiliado al Estado. No presenta propuestas ni asesora legalmente; lo que sí hace es leer a diario las convocatorias nacionales vigentes de SICOES y enviarte un resumen por email a las 9am (hora Bolivia), priorizado por relevancia para tu empresa y con enlace directo al proceso, para que tengas más tiempo de preparar cada propuesta.",
        },
        {
          type: "p",
          text:
            "Explora las [licitaciones vigentes](/licitaciones) o ingresa desde [/login](/login). Recuerda verificar siempre cada proceso y su DBC en sicoes.gob.bo. Para consultas sobre el servicio: jbendek@ribentek.com.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Cuáles son los errores más comunes que descalifican una propuesta en Bolivia?",
      a: "Los más frecuentes son formales: documentos vencidos, formularios alterados, presentación fuera de plazo, requisitos habilitantes incumplidos, inconsistencias entre la propuesta técnica y la económica, errores aritméticos, firmas o representación incorrectas, RUPE desactualizado y no revisar adendas. Qué causa descalificación en concreto lo define el DBC de cada proceso, así que verifica el documento antes de presentar.",
    },
    {
      q: "¿Quién decide si una propuesta se descalifica?",
      a: "La entidad convocante evalúa las propuestas aplicando lo que establecen el DBC y la norma vigente. El DBC detalla los requisitos, los formatos, los criterios de evaluación y las causales por las que una propuesta puede ser descalificada o rechazada. Por eso es indispensable leerlo completo y revisar las aclaraciones o adendas del proceso antes de presentar tu propuesta.",
    },
    {
      q: "¿Se puede subsanar un error después de presentar la propuesta?",
      a: "Depende del DBC y de la norma vigente: algunos defectos pueden ser subsanables y otros no. No conviene asumir que podrás corregir. Lo prudente es verificar en el DBC si existe esa posibilidad, en qué plazo y con qué condiciones, y consultar con un asesor legal. Lo más seguro es presentar la propuesta correcta desde el inicio.",
    },
    {
      q: "¿Qué pasa si mi certificado RUPE está desactualizado?",
      a: "Para ofrecer propuestas electrónicas se requiere información válida y activa en el RUPE, y las entidades verifican la autenticidad del certificado con su código de verificación en SICOES. Un registro desactualizado o inactivo puede generar inconvenientes en tu proceso. Antes de cada presentación, revisa tus datos, completa la información complementaria y genera un certificado actualizado.",
    },
    {
      q: "¿Qué debo revisar el último día antes del cierre?",
      a: "Revisa si hay nuevas adendas o aclaraciones publicadas, confirma la fecha, hora y forma de presentación, verifica que los documentos estén vigentes y legibles, comprueba firmas y representación, revisa la aritmética y la coherencia entre la propuesta técnica y la económica, y abre cada archivo que vas a presentar. Usa un checklist y, de ser posible, que lo revise otra persona.",
    },
    {
      q: "¿Cómo evito errores aritméticos en la propuesta económica?",
      a: "Haz las sumas dos veces, usa hojas de cálculo con fórmulas verificadas y pide a otra persona que recalcule los totales. Comprueba que el monto sea idéntico en el formulario económico, en la carta de presentación y en cualquier resumen. Respeta las unidades, la moneda y el desglose que pida el DBC, y confirma que cada ítem coincida con la propuesta técnica.",
    },
    {
      q: "¿Conviene presentar la propuesta el último día?",
      a: "No es recomendable. Presentar con margen te permite reaccionar ante fallas técnicas, documentos faltantes o dudas sobre la forma de presentación. Fija una fecha interna anterior al cierre oficial, trabaja con un cronograma regresivo y reserva el último tramo solo para verificar. Confirma siempre fecha, hora y forma de presentación en el DBC.",
    },
  ],
  related: [
    "como-ganar-licitaciones-en-bolivia",
    "documento-base-de-contratacion-dbc-bolivia",
    "como-registrarse-en-el-rupe-bolivia",
  ],
  sources: [
    { label: "Portal SICOES", url: "https://www.sicoes.gob.bo" },
    {
      label: "Modelo de DBC ANPE bienes (MEFP, 2022)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2023-01/DBC_ANPE_BIENES_02022022.pdf",
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
      label: "Guía operativa cambio de matrícula de comercio en RUPE (SIGEP)",
      url: "https://portal.sigep.gob.bo/wp-content/uploads/2021/06/GUIAOPERATIVACAMBIOMATRICULACOMERCIORUPE.pdf",
    },
  ],
};

export default post;
