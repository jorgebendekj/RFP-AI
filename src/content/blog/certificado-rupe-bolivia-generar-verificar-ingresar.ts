import type { BlogPost } from "@/lib/blogTypes";

const post: BlogPost = {
  slug: "certificado-rupe-bolivia-generar-verificar-ingresar",
  title: "Certificado RUPE Bolivia: generarlo, verificarlo e ingresar",
  seoTitle: "Certificado RUPE Bolivia: generar, verificar e ingresar",
  description:
    "Cómo generar el certificado RUPE en Bolivia, verificarlo con su código, ingresar a tu cuenta y recuperar la contraseña. Errores frecuentes y soporte oficial.",
  tldr:
    "El certificado RUPE de Bolivia se genera desde tu cuenta del Registro Único de Proveedores del Estado, después de activar el registro por correo y completar la información complementaria. Incluye un código de verificación que las entidades ingresan en SICOES (sicoes.gob.bo) para comprobar su autenticidad. Para entrar a tu cuenta se usa la opción «Ingresar» del portal.",
  category: "Registro y trámites",
  datePublished: "2026-10-02",
  dateModified: "2026-10-02",
  keywords: [
    "certificado RUPE",
    "cómo sacar certificado RUPE 2026",
    "generar certificado RUPE Bolivia",
    "RUPE ingresar",
    "RUPE iniciar sesión",
    "RUPE login",
    "cambio de contraseña RUPE",
    "recuperar contraseña RUPE",
    "verificar RUPE",
    "imprimir RUPE",
    "código de verificación RUPE",
  ],
  sections: [
    {
      id: "que-es-el-certificado-rupe",
      heading: "¿Qué es el certificado RUPE?",
      blocks: [
        {
          type: "p",
          text: "El **certificado RUPE** es el documento que genera el sistema a partir de tu registro en el Registro Único de Proveedores del Estado (RUPE) y que sirve para demostrar ante una entidad pública que estás registrado como proveedor. Lo emite el propio sistema desde tu cuenta y lleva un **código de verificación** con el que la entidad puede comprobar que el documento es auténtico.",
        },
        {
          type: "p",
          text: "Conviene distinguir tres cosas que suelen mezclarse en las búsquedas «rupe», «certificado rupe» y «sicoes rupe». El **RUPE** es el registro en sí, al que se accede desde la sección RUPE del portal oficial [sicoes.gob.bo](https://www.sicoes.gob.bo). Tu **cuenta** es el usuario y la contraseña que obtienes al activar ese registro. Y el **certificado** es el documento que generas desde esa cuenta cuando necesitas acreditar tu registro.",
        },
        {
          type: "p",
          text: "Si todavía no tienes registro, este artículo no reemplaza el trámite inicial: sigue primero [cómo registrarte en el RUPE paso a paso](/blog/como-registrarse-en-el-rupe-bolivia). Aquí nos concentramos en lo que viene después: generar el certificado, verificarlo, entrar a tu cuenta y resolver los problemas de acceso más comunes.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Alcance de esta guía",
          text: "Es una guía orientativa basada en las guías operativas oficiales del RUPE y en información visible del portal. **SICOES Monitor es un servicio independiente de Ribentek; no es el portal oficial, no gestiona tu RUPE ni emite certificados.** Los menús y pasos pueden cambiar: verifica siempre en sicoes.gob.bo y en la guía vigente.",
        },
      ],
    },
    {
      id: "cuando-lo-piden",
      heading: "¿Cuándo piden el certificado RUPE las entidades?",
      blocks: [
        {
          type: "p",
          text: "Las entidades piden el certificado RUPE cuando necesitan comprobar que el proveedor tiene un registro válido, ya sea al evaluar una propuesta o, en algunos procesos, al momento de firmar el contrato. Qué documento exacto se exige, en qué formato y con qué antigüedad **depende del documento base de contratación (DBC) de cada proceso**.",
        },
        {
          type: "p",
          text: "En los ejemplos de DBC de consultoría individual que revisamos, entre los documentos para la firma del contrato aparece el certificado RUPE verificado por código. Es un ejemplo observado en algunas convocatorias, no una regla general. En contrataciones de bienes, obras o servicios, la exigencia puede ubicarse en otra etapa o formularse de otra manera.",
        },
        {
          type: "ul",
          items: [
            "**Al postular:** algunos DBC piden adjuntar el certificado junto con los formularios y respaldos. Léelo en la sección de documentos requeridos.",
            "**Al adjudicarse:** la entidad puede pedirlo para verificar tu registro antes de firmar el contrato, y lo valida con el código.",
            "**Para propuestas electrónicas:** se requiere información válida y activa en el RUPE y no tener impedimentos para contratar con el Estado.",
          ],
        },
        {
          type: "p",
          text: "Para ubicar con rapidez qué te piden en cada proceso, aprende a recorrer el documento base: [cómo leer el DBC](/blog/documento-base-de-contratacion-dbc-bolivia). Según la guía operativa de SICOES consultada, el RUPE es obligatorio para contrataciones mayores a Bs 20.000; atribúyelo a esa guía y verifícalo en la norma vigente, porque otras fuentes pueden citar montos distintos.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "No esperes a que te lo pidan",
          text: "Genera y revisa tu certificado antes de postular. Si descubres un dato inconsistente cuando ya corre el plazo de una convocatoria, tendrás menos margen para corregirlo.",
        },
      ],
    },
    {
      id: "como-generar",
      heading: "¿Cómo generar el certificado RUPE paso a paso?",
      blocks: [
        {
          type: "p",
          text: "Para generar el certificado RUPE necesitas tener el registro **activado** (con tu usuario y contraseña) y la **información complementaria** completa. Con eso, ingresas a tu cuenta y generas el certificado desde las opciones que ofrece el sistema. Los nombres exactos de los menús los detallan las guías operativas oficiales, así que síguelas en paralelo.",
        },
        {
          type: "ol",
          items: [
            "**Confirma que tu registro está activo.** Si nunca activaste el registro desde el correo, el certificado no estará disponible. Revisa que recibiste el segundo mensaje con usuario y contraseña.",
            "**Ingresa a tu cuenta** desde el portal oficial (ver la sección siguiente).",
            "**Completa la información complementaria** que el sistema solicite. Una información incompleta puede impedir generar el certificado o dejarlo con datos desactualizados.",
            "**Genera el certificado** desde las opciones de tu cuenta, según la guía operativa que corresponda: [manual RUPE Persona Natural](https://www.sicoes.gob.bo/portal/docs/manualRupePersona.pdf) o [manual RUPE Empresa](https://www.sicoes.gob.bo/portal/docs/manualRupeEmpresa.pdf).",
            "**Revisa los datos** del documento generado (nombre o razón social, NIT, tipo de proveedor) contra tus documentos legales vigentes.",
            "**Guarda el archivo y su código de verificación** en un lugar ordenado, y no lo modifiques.",
          ],
        },
        {
          type: "p",
          text: "Para «imprimir el RUPE», que es una búsqueda frecuente, lo habitual es generar el documento desde el sistema y luego guardarlo como archivo o imprimirlo desde tu navegador o visor de PDF. Presenta la versión generada por el sistema, tal cual, porque la entidad verifica su autenticidad con el código y no con el aspecto del documento.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Persona natural o empresa",
          text: "Las guías son distintas para persona natural y para empresa. Según las guías, una persona natural necesita su cédula de identidad y un correo personal; una empresa, su NIT, el documento de identidad del representante legal y el registro de comercio. Usa el manual que corresponda a tu caso.",
        },
      ],
    },
    {
      id: "como-ingresar",
      heading: "¿Cómo ingreso a mi cuenta RUPE (login)?",
      blocks: [
        {
          type: "p",
          text: "Para ingresar a tu cuenta RUPE, entra al portal oficial [sicoes.gob.bo](https://www.sicoes.gob.bo) y usa la opción **«Ingresar»** que aparece en la página de inicio; allí introduces el usuario y la contraseña que recibiste al activar tu registro. Si aún no tienes cuenta, el camino es otro: RUPE y luego «Registrarme».",
        },
        {
          type: "p",
          text: "Quienes buscan «rupe ingresar», «rupe iniciar sesión» o «rupe login» suelen toparse con tres problemas: usar un enlace que no es el del portal oficial, confundir el usuario con el correo o escribir mal la contraseña. Estas prácticas ayudan:",
        },
        {
          type: "ul",
          items: [
            "**Entra siempre desde la dirección oficial** que escribes tú mismo en el navegador, y desconfía de enlaces recibidos por mensajes o redes sociales que pidan tus credenciales.",
            "**Usa el usuario tal como lo entregó el sistema** al activar tu registro. Si no lo recuerdas, busca el correo de activación en tu bandeja y en spam.",
            "**Escribe la contraseña con cuidado**, respetando mayúsculas y minúsculas, y revisa que no esté activado el bloqueo de mayúsculas.",
            "**No compartas tus credenciales** por canales abiertos y evita iniciar sesión desde equipos públicos.",
          ],
        },
        {
          type: "p",
          text: "Una vez dentro, puedes completar la información complementaria, generar el certificado y, cuando el proceso lo requiera, presentar propuestas electrónicas. La presentación electrónica se realiza a través del RUPE y exige información válida y activa; para el flujo completo, lee [cómo postular en SICOES paso a paso](/blog/como-postular-en-sicoes-paso-a-paso).",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Cuidado con los intermediarios",
          text: "Ninguna persona legítima necesita que le entregues tu contraseña para «generar tu certificado». Si decides pedir ayuda a un tercero, hazlo sin compartir tus credenciales y verifica siempre en el portal oficial qué trámites son gratuitos.",
        },
      ],
    },
    {
      id: "contrasena",
      heading: "¿Cómo cambio o recupero mi contraseña del RUPE?",
      blocks: [
        {
          type: "p",
          text: "El portal de SICOES muestra en su página de inicio la opción **«Cambio de contraseña - Proveedores RUPE»**, que es el punto de partida para cambiar o restablecer tu clave. Los pasos internos del procedimiento no los describimos aquí para no inducirte a error: sigue las indicaciones en pantalla y las guías operativas oficiales, o consulta a soporte.",
        },
        {
          type: "p",
          text: "Si lo que necesitas es **recuperar** una contraseña olvidada, antes de nada reúne lo que normalmente te pedirán para comprobar tu identidad como proveedor: los datos con los que te registraste y acceso al correo que indicaste. Si ya no controlas ese correo, el caso es más delicado y conviene recurrir directamente al soporte oficial.",
        },
        {
          type: "ul",
          items: [
            "Ubica la opción de cambio de contraseña para proveedores RUPE en la página de inicio del portal.",
            "Ten a mano tus datos de registro y acceso al correo asociado a la cuenta.",
            "Revisa spam por si el sistema envía mensajes de confirmación.",
            "Si el proceso no funciona o no recuerdas el correo, contacta al soporte oficial.",
          ],
        },
        {
          type: "h3",
          text: "Soporte oficial del portal",
        },
        {
          type: "p",
          text: "Según la página de comunicados del portal, el soporte atiende por la línea gratuita **800-10-6337** y por el teléfono **(591-2) 2177300**, de lunes a viernes de 8:30 a 16:30 (hora de La Paz). Son datos publicados en el portal en el momento de la consulta: **verifica los números y horarios vigentes en sicoes.gob.bo antes de llamar**.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Qué decir al llamar",
          text: "Ten a mano tu NIT o cédula de identidad, el tipo de proveedor, el correo con el que te registraste y una descripción breve del problema (por ejemplo, «no me llega el correo de activación»). Las capturas de pantalla ayudan a explicar qué ocurre.",
        },
      ],
    },
    {
      id: "verificacion",
      heading: "¿Cómo se verifica un certificado RUPE con el código?",
      blocks: [
        {
          type: "p",
          text: "Las entidades públicas verifican la autenticidad del certificado RUPE **ingresando su código de verificación en SICOES**. Si el código corresponde a un certificado generado por el sistema, la entidad puede comprobar que el documento es legítimo y que los datos que muestra son los registrados. Por eso es importante que presentes el documento sin alteraciones.",
        },
        {
          type: "p",
          text: "Si tú mismo quieres «verificar el RUPE» (otra búsqueda frecuente), tienes dos lecturas posibles. La primera es comprobar que **tu propio registro está activo** y actualizado, ingresando a tu cuenta. La segunda es revisar que **el certificado que vas a presentar** tiene el código visible y los datos correctos. Para validar certificados de terceros, el mecanismo descrito corresponde a las entidades públicas; consulta al portal si necesitas un procedimiento específico.",
        },
        {
          type: "ul",
          items: [
            "Conserva el código de verificación junto con el archivo.",
            "No tapes, recortes ni edites el código ni los datos del documento.",
            "Si cambias algún dato de tu registro, genera un certificado nuevo en lugar de reutilizar uno anterior.",
            "Revisa en el DBC si piden una versión reciente del certificado.",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Un certificado alterado es un riesgo serio",
          text: "Modificar un documento que se verifica por código puede derivar en la descalificación de tu propuesta y en consecuencias mayores. Presenta siempre el original generado por el sistema.",
        },
      ],
    },
    {
      id: "vigencia-actualizacion",
      heading: "¿Cuánto dura el certificado y cómo mantener mis datos al día?",
      blocks: [
        {
          type: "p",
          text: "Este artículo no afirma un plazo de vigencia del certificado RUPE porque no figura en las fuentes verificadas. Lo que sí está claro es que tu registro debe mantenerse **válido y actualizado** para ofrecer propuestas electrónicas, y que cada DBC puede fijar su propio criterio sobre la antigüedad del certificado que acepta. **Verifica en la guía vigente y en el DBC.**",
        },
        {
          type: "p",
          text: "En la práctica, la regla segura es sencilla: cada vez que cambie un dato relevante de tu actividad (representante legal, domicilio, rubros, correo de contacto o matrícula de comercio), actualiza tu registro y genera un certificado nuevo antes de volver a presentarlo.",
        },
        {
          type: "p",
          text: "Para el **cambio de matrícula de comercio** existe una guía operativa específica publicada por SIGEP: [Guía operativa de cambio de matrícula de comercio en RUPE](https://portal.sigep.gob.bo/wp-content/uploads/2021/06/GUIAOPERATIVACAMBIOMATRICULACOMERCIORUPE.pdf). Sigue ese procedimiento en lugar de crear un registro nuevo.",
        },
        {
          type: "ul",
          items: [
            "Revisa tu registro antes de cada postulación importante.",
            "Mantén el correo de contacto bajo tu control y actualizado.",
            "Haz coincidir los datos con tus documentos legales vigentes.",
            "Si eres consultor y vas a cobrar del Estado, revisa también tu registro de beneficiario: lee [RUPE y SIGEP: diferencias](/blog/rupe-y-sigep-diferencias-bolivia).",
          ],
        },
      ],
    },
    {
      id: "errores-frecuentes",
      heading: "¿Qué hago si algo falla? Problemas frecuentes y soluciones",
      blocks: [
        {
          type: "p",
          text: "La mayoría de los problemas con el certificado RUPE se originan en tres puntos: un registro que no se activó, datos que no coinciden con los documentos legales o un correo mal escrito o inaccesible. La tabla resume causas probables y qué hacer; no sustituye a las guías oficiales ni al soporte del portal.",
        },
        {
          type: "table",
          caption: "Problemas frecuentes con el certificado y el acceso al RUPE",
          head: ["Problema", "Causa probable", "Qué hacer"],
          rows: [
            [
              "No llega el correo de activación",
              "Dirección mal escrita, mensaje en spam o bandeja llena",
              "Revisa spam y la dirección registrada; no repitas el registro varias veces y consulta la guía o el soporte",
            ],
            [
              "No encuentro usuario y contraseña",
              "El registro quedó sin activar o no se guardó el segundo correo",
              "Busca el correo con tus credenciales; si no existe, confirma si completaste la activación",
            ],
            [
              "No puedo generar el certificado",
              "Registro sin activar o información complementaria incompleta",
              "Activa el registro y completa la información que pide el sistema",
            ],
            [
              "Los datos del certificado no coinciden con mis documentos",
              "Se transcribió mal el nombre, NIT u otros datos, o hubo cambios sin actualizar",
              "Corrige el registro con tus documentos vigentes y genera un certificado nuevo",
            ],
            [
              "Olvidé mi contraseña",
              "Clave perdida o cambiada",
              "Usa la opción «Cambio de contraseña - Proveedores RUPE» del portal y sigue las indicaciones",
            ],
            [
              "La entidad no puede verificar mi certificado",
              "Documento alterado o código ilegible",
              "Presenta el original generado por el sistema, con el código visible",
            ],
            [
              "Cambió mi matrícula de comercio",
              "Actualización pendiente en el registro",
              "Sigue la guía operativa de cambio de matrícula de comercio",
            ],
          ],
        },
        {
          type: "p",
          text: "Cuando todo lo anterior no resuelve el problema, escribe o llama al soporte oficial del portal con tu caso bien descrito. Y si el problema aparece con una propuesta ya presentada, revisa también [los errores que descalifican propuestas](/blog/errores-que-descalifican-propuestas-licitaciones-bolivia).",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Guarda evidencia",
          text: "Toma capturas de cada etapa del registro y conserva el certificado con su código. Si más adelante necesitas reclamar o consultar, tendrás un registro claro de lo que hiciste.",
        },
      ],
    },
    {
      id: "como-sicoes-monitor-te-ayuda",
      heading: "Cómo SICOES Monitor te ayuda cuando ya tienes tu RUPE",
      blocks: [
        {
          type: "p",
          text: "Con el RUPE listo, lo siguiente es enterarte a tiempo de las convocatorias que te convienen. **SICOES Monitor** es un servicio gratuito e independiente de Ribentek: **no es el portal oficial, no está afiliado al Estado y no tramita el RUPE ni emite certificados**. Lee cada día las convocatorias nacionales vigentes de SICOES y te envía un resumen por correo a las 9am (hora Bolivia), con puntaje de relevancia según tu perfil y enlace directo al proceso.",
        },
        {
          type: "p",
          text: "Puedes explorar sin cuenta las [licitaciones vigentes](/licitaciones) o filtrar por [servicios](/licitaciones/categoria/servicios) y [tecnología](/licitaciones/categoria/tecnologia). Para recibir el resumen diario, ingresa con tu correo en [/login](/login). Si tienes dudas sobre el servicio, escribe a jbendek@ribentek.com.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Verifica siempre en la fuente oficial",
          text: "Confirma cada dato en sicoes.gob.bo y en el DBC del proceso. Hoy el servicio no ofrece alertas de requerimiento de personal, presentación de propuestas ni asesoría legal.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "¿Qué es el certificado RUPE?",
      a: "Es el documento que genera el sistema del Registro Único de Proveedores del Estado a partir de tu registro activo, y que permite acreditar ante una entidad pública que estás registrado como proveedor. Incluye un código de verificación que las entidades ingresan en SICOES para comprobar su autenticidad. Qué se exige en cada proceso depende del documento base de contratación.",
    },
    {
      q: "¿Cómo sacar el certificado RUPE en 2026?",
      a: "Primero activa tu registro desde el correo y obtén tu usuario y contraseña. Luego ingresa a tu cuenta desde sicoes.gob.bo, completa la información complementaria y genera el certificado según la guía operativa que corresponda a persona natural o empresa. Revisa que los datos coincidan con tus documentos y guarda el código de verificación junto con el archivo.",
    },
    {
      q: "¿Cómo ingreso a mi cuenta RUPE?",
      a: "Entra al portal oficial sicoes.gob.bo y usa la opción «Ingresar» de la página de inicio, donde introduces el usuario y la contraseña que recibiste al activar tu registro. Si aún no tienes cuenta, debes registrarte desde la sección RUPE con la opción «Registrarme» y activar el registro por correo electrónico antes de poder entrar.",
    },
    {
      q: "¿Cómo recupero o cambio mi contraseña del RUPE?",
      a: "El portal de SICOES muestra la opción «Cambio de contraseña - Proveedores RUPE» en su página de inicio. Úsala y sigue las indicaciones en pantalla. No detallamos pasos internos para evitar errores: consulta las guías operativas oficiales y, si no controlas el correo del registro o el proceso falla, contacta al soporte oficial del portal.",
    },
    {
      q: "¿Cómo se verifica el certificado RUPE?",
      a: "Las entidades públicas verifican la autenticidad ingresando el código de verificación del certificado en SICOES. Por eso debes presentar el documento original generado por el sistema, sin ediciones y con el código visible. Si quieres comprobar tu propio registro, ingresa a tu cuenta y revisa que esté activo y con la información actualizada.",
    },
    {
      q: "¿Cuánto tiempo es válido el certificado RUPE?",
      a: "No hemos verificado un plazo de vigencia en las fuentes consultadas, por lo que no afirmamos una cifra. Lo recomendable es mantener tu información actualizada, generar un certificado nuevo cuando cambie algún dato relevante y revisar en el DBC de cada proceso qué antigüedad acepta la entidad. Confirma también en la guía vigente y en sicoes.gob.bo.",
    },
    {
      q: "¿Cómo puedo imprimir el RUPE?",
      a: "Genera el certificado desde tu cuenta, una vez activado el registro y completa la información complementaria, y luego guárdalo como archivo o imprímelo desde tu navegador o visor de PDF. Presenta la versión generada por el sistema sin modificaciones, con el código de verificación visible, porque es el dato con el que la entidad comprueba su autenticidad.",
    },
    {
      q: "¿Qué hago si no me llega el correo de activación?",
      a: "Revisa spam y correo no deseado, confirma que la dirección esté bien escrita y espera unos minutos. Evita repetir el registro varias veces seguidas. Si sigue sin llegar, consulta la guía operativa oficial y contacta al soporte del portal; según el portal, hay una línea gratuita y un teléfono de atención, pero verifica números y horarios vigentes antes de llamar.",
    },
  ],
  related: [
    "como-registrarse-en-el-rupe-bolivia",
    "rupe-y-sigep-diferencias-bolivia",
    "como-postular-en-sicoes-paso-a-paso",
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
      label: "Guía operativa cambio de matrícula de comercio en RUPE (SIGEP)",
      url: "https://portal.sigep.gob.bo/wp-content/uploads/2021/06/GUIAOPERATIVACAMBIOMATRICULACOMERCIORUPE.pdf",
    },
    {
      label: "Manual de Operaciones del SICOES (MEFP)",
      url: "https://www.economiayfinanzas.gob.bo/sites/default/files/2024-06/Manual%20de%20Operaciones%20del%20SICOES_2022.pdf",
    },
  ],
  howTo: {
    name: "Cómo generar y verificar tu certificado RUPE (Bolivia)",
    description:
      "Pasos generales para ingresar a tu cuenta RUPE, generar el certificado y conservar su código de verificación, según las guías operativas oficiales.",
    steps: [
      {
        name: "Confirma que tu registro está activo",
        text: "Verifica que activaste el registro desde el correo y que recibiste tu usuario y contraseña. Sin activación no podrás generar el certificado.",
      },
      {
        name: "Ingresa a tu cuenta desde el portal oficial",
        text: "Entra a sicoes.gob.bo, usa la opción «Ingresar» e introduce tu usuario y contraseña. Escribe la dirección tú mismo en el navegador.",
      },
      {
        name: "Recupera la contraseña si hace falta",
        text: "Si no la recuerdas, usa la opción «Cambio de contraseña - Proveedores RUPE» del portal o consulta al soporte oficial; verifica números y horarios vigentes.",
      },
      {
        name: "Completa la información complementaria",
        text: "Registra los datos que solicite el sistema y revisa que coincidan con tus documentos legales vigentes.",
      },
      {
        name: "Genera el certificado",
        text: "Sigue la guía operativa de persona natural o de empresa para generar el Certificado RUPE desde tu cuenta.",
      },
      {
        name: "Revisa los datos del documento",
        text: "Comprueba nombre o razón social, NIT y tipo de proveedor. Si hay errores, corrige el registro y genera un certificado nuevo.",
      },
      {
        name: "Guarda el archivo y el código de verificación",
        text: "Conserva el original sin modificarlo, con el código visible, que las entidades ingresan en SICOES para verificar su autenticidad.",
      },
    ],
  },
};

export default post;
