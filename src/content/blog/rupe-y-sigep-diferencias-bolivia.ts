import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "rupe-y-sigep-diferencias-bolivia",
  title: "RUPE y SIGEP: diferencias y cuál necesitas para contratar con el Estado",
  seoTitle: "RUPE y SIGEP: diferencias y cuál necesitas (2026)",
  description:
    "RUPE y SIGEP no son lo mismo: el RUPE te habilita como proveedor y el Registro de Beneficiario SIGEP sirve para cobrar. Diferencias, orden de trámites y errores.",
  tldr:
    "El RUPE (Registro Único de Proveedores del Estado) habilita a un proveedor para contratar con el Estado y se accede desde sicoes.gob.bo. El Registro de Beneficiario del SIGEP (Sistema de Gestión Pública) sirve para recibir pagos del Estado en Bolivia. Son registros distintos, y algunas convocatorias, sobre todo de consultoría individual, piden ambos. Confirma siempre en el DBC.",
  category: "Registro y trámites",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "rupe sigep",
    "sigep rupe",
    "sicoes rupe",
    "rupe sicoes",
    "registro beneficiario sigep consultor",
    "diferencia entre RUPE y SIGEP",
    "registro de beneficiario SIGEP",
    "RUPE Bolivia",
    "ciudadanía digital consultor",
    "cuenta bancaria RUPE SIGEP",
    "registros para contratar con el Estado",
  ],
  sections: [
    {
      id: "diferencia-rupe-sigep",
      heading: "¿Cuál es la diferencia entre el RUPE y el SIGEP?",
      blocks: [
        {
          type: "p",
          text: "El **RUPE** es el registro que te identifica como proveedor y te habilita para contratar con el Estado; el **SIGEP** es el Sistema de Gestión Pública, y su **Registro de Beneficiario** es el que permite que el Estado te pague. Dicho de forma simple: el RUPE responde a la pregunta «¿puedo ofertar?» y el registro de beneficiario SIGEP responde a «¿puedo cobrar?».",
        },
        {
          type: "p",
          text: "La confusión es comprensible. Las búsquedas «rupe sigep», «sigep rupe», «sicoes rupe» y «rupe sicoes» aparecen juntas porque en la práctica los tres nombres se cruzan: el portal de convocatorias es [SICOES](https://www.sicoes.gob.bo), el acceso al RUPE está en ese mismo portal, y según una fuente consultada el RUPE funciona como un módulo del SIGEP administrado por el Ministerio de Economía y Finanzas Públicas (MEFP). Es decir, comparten ecosistema, pero cumplen funciones distintas.",
        },
        {
          type: "p",
          text: "Esta guía profundiza en esa diferencia. Si lo que necesitas es el trámite del RUPE en sí, el procedimiento detallado está en [cómo registrarse en el RUPE](/blog/como-registrarse-en-el-rupe-bolivia); aquí nos concentramos en qué hace cada registro, cuál necesitas tú y en qué orden conviene tramitarlos.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Qué es y qué no es este artículo",
          text: "Es una guía orientativa basada en fuentes públicas (guías operativas de SICOES y SIGEP) y en ejemplos de convocatorias. **SICOES Monitor es un servicio independiente de Ribentek, no es el portal oficial ni está afiliado al Estado.** Los requisitos de cada proceso los define su documento base de contratación (DBC); verifica todo en sicoes.gob.bo.",
        },
      ],
    },
    {
      id: "que-es-el-rupe",
      heading: "¿Qué es el RUPE y para qué sirve?",
      blocks: [
        {
          type: "p",
          text: "El RUPE (Registro Único de Proveedores del Estado) es el registro donde un proveedor de bienes, obras, servicios o consultorías deja su información de identificación y de actividad para poder contratar con el Estado. Se accede desde sicoes.gob.bo, sección RUPE, opción «Registrarme», y aplica a persona natural, empresa unipersonal y persona jurídica.",
        },
        {
          type: "p",
          text: "Para qué sirve en la práctica:",
        },
        {
          type: "ul",
          items: [
            "**Identificarte ante las entidades públicas** con datos ya registrados, sin repetirlos en cada proceso.",
            "**Generar el Certificado RUPE**, que las entidades verifican ingresando su código de verificación en SICOES.",
            "**Presentar propuestas electrónicas:** para ofrecer propuestas por medios electrónicos se requiere información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado.",
          ],
        },
        {
          type: "p",
          text: "El registro tiene dos etapas: el registro inicial (tipo de proveedor, información general, domicilio, representante legal, bienes y servicios ofertados, responsable del registro) y la activación por correo electrónico, con la que obtienes tu usuario y contraseña. Los manuales oficiales son [RUPE Empresa](https://www.sicoes.gob.bo/portal/docs/manualRupeEmpresa.pdf) y [RUPE Persona Natural](https://www.sicoes.gob.bo/portal/docs/manualRupePersona.pdf).",
        },
      ],
    },
    {
      id: "que-es-el-sigep",
      heading: "¿Qué es el SIGEP y qué es el Registro de Beneficiario?",
      blocks: [
        {
          type: "p",
          text: "El SIGEP es el Sistema de Gestión Pública, la plataforma con la que el Estado administra sus recursos. Dentro de ese sistema, el **Registro de Beneficiario SIGEP** es el que registra a una persona o empresa para que pueda recibir pagos del Estado: sin ese registro, no se procesan pagos en el SIGEP.",
        },
        {
          type: "p",
          text: "Es un punto clave y a menudo ignorado: puedes tener un RUPE activo y aun así tener problemas para cobrar si tu registro de beneficiario no está en orden. Por eso algunas convocatorias, especialmente de consultoría individual, piden ambos registros desde la postulación. SIGEP publica una guía operativa para beneficiarios: [Guía SIGEP de ajustes de beneficiarios](https://portal.sigep.gob.bo/wp-content/uploads/2020/04/guia_operativa_ajustes_beneficiarios.pdf).",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Regla mnemotécnica",
          text: "RUPE = habilitación para participar y contratar. Beneficiario SIGEP = habilitación para recibir el pago. Un proveedor completo necesita pensar en las dos cosas, aunque no siempre se exijan en el mismo momento del proceso.",
        },
      ],
    },
    {
      id: "relacion-entre-ambos",
      heading: "¿Qué relación hay entre el RUPE, el SIGEP y SICOES?",
      blocks: [
        {
          type: "p",
          text: "SICOES es el portal donde se publican las convocatorias y desde donde se accede al RUPE; el SIGEP es el sistema de gestión pública donde se administran, entre otros, los registros de beneficiarios para pagos. Según una fuente consultada, el RUPE es un módulo del SIGEP administrado por el MEFP, lo que explica por qué las guías del RUPE aparecen publicadas también en el portal del SIGEP (por ejemplo, la guía de cambio de matrícula de comercio).",
        },
        {
          type: "ul",
          items: [
            "**SICOES:** portal de convocatorias (Convocatorias, Requerimiento de Personal, Formularios, Normativa, PAC y la entrada al RUPE).",
            "**RUPE:** registro de proveedores, accesible desde SICOES.",
            "**SIGEP:** sistema de gestión pública; su Registro de Beneficiario permite recibir pagos.",
          ],
        },
        {
          type: "p",
          text: "Si todavía no tienes claro cómo se organiza el portal, empieza por [qué es SICOES en Bolivia](/blog/que-es-sicoes-bolivia). Y si la duda es qué convocatorias existen, revisa la sección de [licitaciones vigentes](/licitaciones).",
        },
      ],
    },
    {
      id: "tabla-comparativa",
      heading: "RUPE vs. Registro de Beneficiario SIGEP: tabla comparativa",
      blocks: [
        {
          type: "p",
          text: "La tabla resume las diferencias principales. Es un resumen general: los detalles de cada trámite están en las guías operativas oficiales.",
        },
        {
          type: "table",
          caption: "Comparación general entre el RUPE y el Registro de Beneficiario SIGEP",
          head: ["Aspecto", "RUPE", "Registro de Beneficiario SIGEP"],
          rows: [
            [
              "Propósito",
              "Registrar al proveedor y habilitarlo para contratar con el Estado",
              "Registrar al beneficiario para que pueda recibir pagos del Estado",
            ],
            [
              "Quién lo necesita",
              "Persona natural, empresa unipersonal y persona jurídica que quieren ofertar",
              "Quien va a recibir pagos del Estado, por ejemplo un consultor individual o una empresa contratada",
            ],
            [
              "Dónde se tramita (en general)",
              "Desde la sección RUPE de sicoes.gob.bo",
              "En el ecosistema SIGEP; sigue su guía operativa de beneficiarios",
            ],
            [
              "Qué habilita",
              "Presentar propuestas electrónicas y generar el Certificado RUPE",
              "Que el pago pueda procesarse en el SIGEP",
            ],
            [
              "Se activa por",
              "Registro inicial y activación por correo electrónico",
              "Según la guía operativa de SIGEP",
            ],
            [
              "Cuándo suele pedirse",
              "Al postular y para participar en procesos",
              "A veces desde la postulación (ejemplo en consultoría individual) o para el pago",
            ],
          ],
        },
        {
          type: "p",
          text: "Lo que la tabla no dice es «cuál es obligatorio en tu caso». Eso lo define el DBC del proceso, la norma vigente y el tipo de contratación, como veremos más abajo.",
        },
      ],
    },
    {
      id: "consultor-individual",
      heading: "Si soy consultor individual, ¿necesito RUPE y registro de beneficiario SIGEP?",
      blocks: [
        {
          type: "p",
          text: "En algunos ejemplos de DBC de consultoría individual se pide estar registrado en el RUPE y en el SIGEP, así que es muy probable que debas tener ambos si postulas a cargos de personal o consultoría individual. Pero esto es un patrón observado, no una regla general: lo que vale es lo que diga el DBC del cargo al que postulas.",
        },
        {
          type: "p",
          text: "Los consultores individuales se inscriben como **persona natural**. Según una guía operativa consultada, la **cuenta bancaria registrada en el RUPE debe coincidir con la registrada en el SIGEP**; verifícalo en la convocatoria y en la guía vigente, porque si los datos no coinciden pueden aparecer problemas al momento del pago.",
        },
        {
          type: "p",
          text: "Un ejemplo de convocatoria de consultor individual pidió el **Registro de Beneficiario SIGEP** y la **Ciudadanía Digital**, además de otros documentos. Es un ejemplo, no una lista universal: otras convocatorias pueden pedir documentos distintos.",
        },
        {
          type: "h3",
          text: "Lo que conviene tener listo como consultor",
        },
        {
          type: "ul",
          items: [
            "RUPE como **persona natural**, activo y con el certificado generado.",
            "Registro de Beneficiario SIGEP, con la misma cuenta bancaria que declaraste en el RUPE (según la guía consultada).",
            "Ciudadanía Digital, si la convocatoria la solicita.",
            "Documentación digitalizada del DBC: hoja de vida y respaldos, formularios y términos de referencia revisados.",
          ],
        },
        {
          type: "p",
          text: "Las convocatorias de personal se publican en la sección Requerimiento de Personal. Para el proceso completo (etapas, hoja de vida, errores), lee [SICOES requerimiento de personal 2026](/blog/sicoes-requerimiento-de-personal-2026), y para el flujo de presentación [cómo postular en SICOES paso a paso](/blog/como-postular-en-sicoes-paso-a-paso).",
        },
        {
          type: "callout",
          tone: "warn",
          title: "No dejes el SIGEP para después de ser seleccionado",
          text: "Si el DBC pide el registro de beneficiario al postular, no tenerlo puede dejarte fuera. Y aunque no lo pida al postular, sin él el pago no se procesa. Revisa el DBC desde el primer día.",
        },
      ],
    },
    {
      id: "empresas",
      heading: "¿Qué necesita una empresa: RUPE, SIGEP o ambos?",
      blocks: [
        {
          type: "p",
          text: "Una empresa (empresa unipersonal o persona jurídica) necesita el RUPE para participar en procesos de contratación y, además, debe pensar en el registro de beneficiario SIGEP para poder cobrar si resulta adjudicada. El momento en que se exige cada uno depende del DBC y de la modalidad del proceso.",
        },
        {
          type: "ul",
          items: [
            "**Para ofertar:** RUPE con información válida y activa, representante legal registrado y rubros definidos con claridad.",
            "**Para cobrar:** registro de beneficiario en el SIGEP, con datos coherentes con los del RUPE y con los documentos legales de la empresa.",
            "**Ante cambios:** si cambias la matrícula de comercio, existe una guía operativa específica: [cambio de matrícula de comercio en RUPE](https://portal.sigep.gob.bo/wp-content/uploads/2021/06/GUIAOPERATIVACAMBIOMATRICULACOMERCIORUPE.pdf).",
          ],
        },
        {
          type: "p",
          text: "El tipo de proceso importa porque cada modalidad tiene su propio documento base y sus condiciones. Los rangos de monto por modalidad (Contratación Menor, ANPE y Licitación Pública) están explicados en [modalidades de contratación estatal en Bolivia](/blog/modalidades-de-contratacion-estatal-bolivia), y qué dice y cómo leer un DBC en [documento base de contratación (DBC)](/blog/documento-base-de-contratacion-dbc-bolivia).",
        },
      ],
    },
    {
      id: "monto-20000",
      heading: "¿A partir de qué monto es obligatorio el RUPE?",
      blocks: [
        {
          type: "p",
          text: "Según la guía operativa de SICOES consultada, el RUPE es obligatorio para contrataciones **mayores a Bs 20.000**. Esa cifra se atribuye a esa guía y otras fuentes de menor monto pueden diferir, de modo que no la tomes como regla definitiva: verifica en la norma vigente, en el portal y en el DBC del proceso.",
        },
        {
          type: "p",
          text: "Dos aclaraciones útiles. Primero, que un monto menor no exija el registro en ciertos casos no significa que convenga postergarlo: las convocatorias suelen tener plazos cortos y el RUPE requiere activación por correo, así que tramitarlo con anticipación te ahorra apuros. Segundo, el umbral del RUPE no tiene relación con los rangos de las modalidades (Contratación Menor hasta Bs 50.000, ANPE de Bs 50.000 hasta Bs 1.000.000, Licitación Pública sobre Bs 1.000.000, según el D.S. 0181); son criterios distintos.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Verifica antes de decidir",
          text: "Este artículo no establece costos de registro ni montos obligatorios propios. Si una fuente te dice otra cifra, contrástala con la norma vigente y el portal oficial antes de decidir si necesitas o no el registro.",
        },
      ],
    },
    {
      id: "orden-recomendado",
      heading: "¿En qué orden conviene hacer los trámites?",
      blocks: [
        {
          type: "p",
          text: "El orden recomendado es: primero ordenar tus datos y documentos, luego registrarte en el RUPE y activarlo, después tramitar el registro de beneficiario SIGEP con la misma cuenta bancaria y, recién entonces, buscar y postular a convocatorias. Es una secuencia práctica, no un requisito legal; si un DBC pide algo distinto, manda el DBC.",
        },
        {
          type: "ol",
          items: [
            "**Define tu perfil:** persona natural (consultor), empresa unipersonal o persona jurídica.",
            "**Reúne tus datos** exactamente como figuran en tus documentos legales (nombre o razón social, NIT, domicilio, datos bancarios).",
            "**Regístrate en el RUPE** y activa el registro desde tu correo.",
            "**Completa la información complementaria** y genera el Certificado RUPE.",
            "**Tramita el Registro de Beneficiario SIGEP** con la guía operativa y una cuenta bancaria coherente con la del RUPE.",
            "**Si postulas a consultoría individual,** verifica si el DBC pide Ciudadanía Digital u otros documentos.",
            "**Ubica convocatorias** y descarga el DBC antes de decidir.",
          ],
        },
        {
          type: "p",
          text: "Para saber dónde buscar convocatorias una vez que tengas todo listo, lee [cómo encontrar licitaciones en Bolivia](/blog/como-encontrar-licitaciones-en-bolivia).",
        },
      ],
    },
    {
      id: "problemas-frecuentes",
      heading: "¿Cuáles son los problemas más frecuentes con el RUPE y el SIGEP?",
      blocks: [
        {
          type: "p",
          text: "Los problemas más frecuentes son datos inconsistentes entre ambos registros, una cuenta bancaria que no coincide, el correo de activación que no se confirma y el desconocimiento de qué exige cada convocatoria. Casi todos se previenen con una revisión de datos antes de empezar.",
        },
        {
          type: "table",
          caption: "Problemas frecuentes y cómo prevenirlos",
          head: ["Problema", "Por qué ocurre", "Cómo prevenirlo"],
          rows: [
            [
              "Datos inconsistentes",
              "El nombre, el NIT o el domicilio se escriben distinto en cada registro",
              "Usa una sola fuente (tus documentos vigentes) para llenar ambos registros",
            ],
            [
              "Cuenta bancaria que no coincide",
              "Se registra una cuenta en el RUPE y otra en el SIGEP",
              "Según la guía consultada, deben coincidir; verifica en la convocatoria y en la guía vigente",
            ],
            [
              "Registro RUPE sin activar",
              "Se cree que terminó con la etapa 1",
              "Activa el registro desde el correo y guarda usuario y contraseña",
            ],
            [
              "Correo que no llega",
              "Dirección mal escrita o mensaje en spam",
              "Revisa spam, confirma la dirección y no repitas el registro varias veces",
            ],
            [
              "Falta de Ciudadanía Digital",
              "No se revisó el DBC y se descubre al postular",
              "Lee el DBC completo antes de empezar y tramita lo que pida con tiempo",
            ],
            [
              "Información desactualizada",
              "No se revisa tras cambios en la empresa o en los datos bancarios",
              "Actualiza ambos registros antes de postular",
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Guarda evidencia",
          text: "Toma capturas de cada etapa de los registros y conserva el certificado y los datos de verificación. Si debes consultar con soporte, te ahorrará tiempo. Para las observaciones que descalifican propuestas ya presentadas, revisa [errores que descalifican propuestas](/blog/errores-que-descalifican-propuestas-licitaciones-bolivia).",
        },
      ],
    },
    {
      id: "como-sicoes-monitor-te-ayuda",
      heading: "Cómo SICOES Monitor te ayuda cuando ya tienes tus registros",
      blocks: [
        {
          type: "p",
          text: "SICOES Monitor es un servicio gratuito e independiente de Ribentek que **no gestiona el RUPE ni el SIGEP** y no es el portal oficial. Lo que hace es leer cada día las convocatorias nacionales vigentes de SICOES, priorizarlas según el perfil de tu empresa y enviarte a las 9am (hora Bolivia) un resumen por correo con puntaje de relevancia y enlace directo al proceso.",
        },
        {
          type: "p",
          text: "Puedes explorar sin cuenta las [licitaciones vigentes](/licitaciones) o filtrar por [consultoría](/licitaciones/categoria/consultoria). Para recibir el resumen diario, ingresa con tu correo en [/login](/login). Para dudas, escribe a jbendek@ribentek.com. Hoy el servicio no ofrece alertas de requerimiento de personal, presentación de propuestas ni asesoría legal; verifica siempre en sicoes.gob.bo y en el DBC.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Qué diferencia hay entre RUPE y SIGEP?",
      a: "El RUPE es el Registro Único de Proveedores del Estado: te identifica como proveedor y te habilita para contratar con el Estado, y se accede desde sicoes.gob.bo. El SIGEP es el Sistema de Gestión Pública, y su Registro de Beneficiario permite recibir pagos del Estado. Uno responde a poder ofertar y el otro a poder cobrar; algunas convocatorias piden ambos.",
    },
    {
      q: "¿El RUPE es parte del SIGEP?",
      a: "Según una fuente consultada, el RUPE es un módulo del SIGEP administrado por el Ministerio de Economía y Finanzas Públicas. En la práctica, el acceso al RUPE se hace desde el portal SICOES y varias guías operativas del RUPE están publicadas también en el portal del SIGEP. Para trámites concretos, sigue siempre la guía operativa vigente de cada sistema.",
    },
    {
      q: "¿Qué relación hay entre SICOES y el RUPE?",
      a: "SICOES es el portal oficial donde se publican las convocatorias del Estado y desde donde se accede a la opción RUPE. El RUPE es el registro de proveedores al que entras desde ese portal. Para ofrecer propuestas electrónicas se requiere información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado.",
    },
    {
      q: "¿Qué es el Registro de Beneficiario SIGEP y para qué sirve?",
      a: "Es el registro que permite que una persona o empresa reciba pagos del Estado a través del SIGEP. Sin él no se procesan pagos en el sistema. Algunas convocatorias, como un ejemplo de consultoría individual, lo piden junto con la Ciudadanía Digital. SIGEP publica una guía operativa de beneficiarios; síguela y confirma qué exige tu convocatoria.",
    },
    {
      q: "¿Un consultor individual necesita RUPE y SIGEP?",
      a: "En algunos ejemplos de DBC de consultoría individual se pide registro en RUPE y en SIGEP, por lo que es probable que necesites ambos. No es una regla general: cada convocatoria define sus requisitos en su documento base de contratación. Antes de postular, descarga el DBC del cargo, léelo completo y confirma qué registros y documentos exige.",
    },
    {
      q: "¿La cuenta bancaria del RUPE debe ser la misma que la del SIGEP?",
      a: "Según una guía operativa consultada, sí: los consultores individuales se inscriben como persona natural y la cuenta bancaria registrada en el RUPE debe coincidir con la registrada en el SIGEP. Preséntalo como orientación y verifica en la convocatoria y en la guía vigente, porque una inconsistencia puede generar problemas al momento del pago.",
    },
    {
      q: "¿A partir de qué monto es obligatorio el RUPE?",
      a: "Según la guía operativa de SICOES consultada, el RUPE es obligatorio para contrataciones mayores a Bs 20.000. Otras fuentes pueden citar montos distintos, así que no tomes la cifra como definitiva: verifica en la norma vigente, en sicoes.gob.bo y en el DBC del proceso. Aunque un monto menor no lo exija, conviene registrarte con anticipación.",
    },
    {
      q: "¿Qué debo tramitar primero, el RUPE o el SIGEP?",
      a: "Como orden práctico, primero ordena tus datos, luego regístrate en el RUPE y actívalo por correo, y después tramita el Registro de Beneficiario SIGEP con una cuenta bancaria coherente con la del RUPE. No es un requisito legal y un DBC puede pedir otro orden o documentos adicionales; en ese caso, manda el documento base del proceso.",
    },
  ],
  related: [
    "como-registrarse-en-el-rupe-bolivia",
    "como-postular-en-sicoes-paso-a-paso",
    "sicoes-requerimiento-de-personal-2026",
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
      label: "Guía SIGEP de ajustes de beneficiarios",
      url: "https://portal.sigep.gob.bo/wp-content/uploads/2020/04/guia_operativa_ajustes_beneficiarios.pdf",
    },
    {
      label: "Guía operativa cambio de matrícula de comercio en RUPE (SIGEP)",
      url: "https://portal.sigep.gob.bo/wp-content/uploads/2021/06/GUIAOPERATIVACAMBIOMATRICULACOMERCIORUPE.pdf",
    },
  ],
  howTo: {
    name: "Cómo ordenar tus registros para postular a una convocatoria",
    description:
      "Pasos generales para tener en orden tu RUPE y tu Registro de Beneficiario SIGEP antes de postular a una convocatoria del Estado en Bolivia.",
    steps: [
      {
        name: "Define tu perfil de proveedor",
        text: "Determina si participarás como persona natural (por ejemplo, consultor individual), empresa unipersonal o persona jurídica, y consulta el manual RUPE que corresponda.",
      },
      {
        name: "Reúne tus datos y documentos",
        text: "Prepara nombre o razón social, NIT, domicilio, datos del representante legal si aplica y los datos de tu cuenta bancaria, tal como figuran en tus documentos vigentes.",
      },
      {
        name: "Regístrate en el RUPE",
        text: "Entra a sicoes.gob.bo, sección RUPE, opción «Registrarme», completa el registro inicial y finaliza.",
      },
      {
        name: "Activa el registro por correo",
        text: "Abre el correo de activación, obtén tu usuario y contraseña y revisa spam si no llega.",
      },
      {
        name: "Completa la información y genera el certificado",
        text: "Registra la información complementaria y genera el Certificado RUPE con su código de verificación.",
      },
      {
        name: "Tramita el Registro de Beneficiario SIGEP",
        text: "Sigue la guía operativa de beneficiarios del SIGEP y usa una cuenta bancaria coherente con la que declaraste en el RUPE, según la guía consultada.",
      },
      {
        name: "Revisa el DBC de la convocatoria",
        text: "Descarga el documento base de contratación y confirma qué registros y documentos pide, por ejemplo Ciudadanía Digital en algunas convocatorias de consultoría individual.",
      },
      {
        name: "Verifica todo antes del plazo",
        text: "Comprueba que tus registros estén activos y los datos coincidan entre sí, y deja margen antes de la fecha límite de presentación.",
      },
    ],
  },
};

export default post;
