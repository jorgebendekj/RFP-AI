/**
 * Editorial content for the location pages. Kept deliberately factual and general
 * (capitals, kinds of public entities, public universities) so every page has its own
 * useful text even on days when the daily cache has few tenders for that place.
 */
export interface LocationInfo {
  capital: string;
  intro: string;
  entities: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
}

export const DEPARTMENT_INFO: Record<string, LocationInfo> = {
  "la-paz": {
    capital: "La Paz (sede de gobierno) y El Alto",
    intro:
      "La Paz concentra la sede de gobierno, por lo que aquí tienen oficinas los ministerios y muchas entidades del nivel central, además de la gobernación, los gobiernos municipales de La Paz y El Alto y empresas públicas. Esa mezcla de entidades nacionales y locales explica por qué es el departamento con más convocatorias visibles en SICOES.",
    entities: ["Gobernación de La Paz", "Gobierno Autónomo Municipal de La Paz", "Gobierno Autónomo Municipal de El Alto", "Ministerios y entidades del nivel central", "Universidad Mayor de San Andrés (UMSA)", "Empresas públicas"],
    tips: [
      "Distingue convocatorias de entidades nacionales (que pueden pedir trabajo en cualquier ciudad) de las municipales, que suelen ser obras y servicios locales.",
      "Revisa la lista de El Alto aparte: es un mercado propio con sus propios procesos.",
      "Si tu empresa no está en La Paz, confirma en el DBC dónde se entregan los bienes o se ejecuta el servicio antes de ofertar.",
    ],
    faqs: [
      { q: "¿Dónde veo las convocatorias SICOES de La Paz?", a: "En esta página tienes las convocatorias vigentes de entidades de La Paz que SICOES Monitor detectó hoy. La lista oficial y completa está en sicoes.gob.bo; usa el CUCE para abrir cada proceso." },
      { q: "¿Las convocatorias de ministerios cuentan como La Paz?", a: "Muchas entidades del nivel central tienen sede en La Paz, pero el lugar de ejecución lo define cada DBC. Verifica siempre dónde se presta el servicio o se entrega el bien." },
      { q: "¿Necesito RUPE para participar?", a: "Para presentar propuestas hay que estar inscrito en el RUPE. Te explicamos el trámite en la guía del RUPE de este sitio y en las guías oficiales de sicoes.gob.bo." },
    ],
  },
  "santa-cruz": {
    capital: "Santa Cruz de la Sierra",
    intro:
      "Santa Cruz de la Sierra es la capital del departamento y, junto con otros municipios grandes como Montero o Warnes, publica convocatorias de obras, bienes y servicios todo el año. También contratan la gobernación, la universidad pública y empresas estatales con operaciones en la región.",
    entities: ["Gobernación de Santa Cruz", "Gobierno Autónomo Municipal de Santa Cruz de la Sierra", "Municipios como Montero y Warnes", "Universidad Autónoma Gabriel René Moreno (UAGRM)", "Empresas estatales con operaciones en la región"],
    tips: [
      "Las distancias dentro del departamento son grandes: revisa el lugar de ejecución y el costo logístico antes de ofertar.",
      "Sigue por separado la gobernación y los municipios mayores: cada uno publica su propio plan anual de contrataciones.",
      "Activa alertas por tu rubro para enterarte el mismo día de publicación; los plazos de presentación suelen ser cortos.",
    ],
    faqs: [
      { q: "¿Cómo encuentro convocatorias SICOES en Santa Cruz?", a: "Aquí listamos las que SICOES Monitor detecta cada día para entidades de Santa Cruz. Para el universo completo consulta sicoes.gob.bo, filtrando por entidad, y usa el CUCE para ubicar cada proceso." },
      { q: "¿Puede una empresa de otro departamento ofertar en Santa Cruz?", a: "Sí, siempre que cumpla los requisitos del DBC y esté inscrita en el RUPE. Evalúa el costo de ejecutar el contrato lejos de tu sede." },
      { q: "¿Cada cuánto se actualiza esta página?", a: "Una vez al día, después de la lectura diaria de SICOES. Confirma plazos y detalles siempre en el portal oficial." },
    ],
  },
  cochabamba: {
    capital: "Cochabamba",
    intro:
      "Cochabamba reúne a la gobernación, al gobierno municipal de la capital y a los municipios de su área metropolitana, como Sacaba, Quillacollo, Tiquipaya, Vinto, Colcapirhua y Sipe Sipe. Muchas empresas proveedoras del valle atienden varios de estos municipios a la vez.",
    entities: ["Gobernación de Cochabamba", "Gobierno Autónomo Municipal de Cochabamba", "Municipios del área metropolitana", "Universidad Mayor de San Simón (UMSS)", "Servicios y empresas públicas de la región"],
    tips: [
      "Trata el área metropolitana como un solo mercado: puedes atender varios municipios con el mismo equipo y proveedores.",
      "Revisa las páginas por municipio (Sacaba, Quillacollo, Tiquipaya, Vinto) para ver convocatorias más pequeñas.",
      "Las convocatorias menores a Bs 1.000.000 suelen ser ANPE: es la modalidad natural para empresas medianas y pequeñas.",
    ],
    faqs: [
      { q: "¿Dónde veo las licitaciones de Cochabamba?", a: "En esta página, con las convocatorias de entidades de Cochabamba detectadas hoy; la información oficial completa está en sicoes.gob.bo." },
      { q: "¿Hay páginas para los municipios de Cochabamba?", a: "Sí: Sacaba, Quillacollo, Tiquipaya y Vinto tienen su propia página con las convocatorias de cada municipio." },
      { q: "¿Qué modalidad es la más común para pymes?", a: "El ANPE, para contrataciones mayores a Bs 50.000 y hasta Bs 1.000.000 según el D.S. 0181. Verifica los montos vigentes en la norma." },
    ],
  },
  oruro: {
    capital: "Oruro",
    intro:
      "En Oruro contratan la gobernación, el gobierno municipal de la capital, municipios del departamento, la universidad pública y empresas estatales ligadas a la minería. Es un mercado más acotado que otros departamentos, por eso conviene seguirlo con alertas diarias para no perder ninguna oportunidad.",
    entities: ["Gobernación de Oruro", "Gobierno Autónomo Municipal de Oruro", "Municipios del departamento", "Universidad Técnica de Oruro (UTO)", "Empresas mineras estatales"],
    tips: [
      "Al haber menos procesos, cada convocatoria cuenta: configura alertas por rubro y por palabras clave de tu especialidad.",
      "Revisa las convocatorias de empresas estatales mineras: sus requisitos pueden diferir de los de los municipios.",
      "Si buscas empleo o consultorías, la sección Requerimiento de Personal del portal oficial es el lugar correcto.",
    ],
    faqs: [
      { q: "¿Dónde ver las convocatorias de Oruro en SICOES?", a: "Aquí te mostramos las detectadas hoy para entidades de Oruro; el listado completo y oficial está en sicoes.gob.bo." },
      { q: "¿Estas páginas incluyen convocatorias de personal?", a: "No: muestran licitaciones de contratación de bienes, obras y servicios. Para personal usa la sección Requerimiento de Personal de sicoes.gob.bo; tenemos una guía por ciudad en el blog." },
      { q: "¿Se puede recibir alertas solo de Oruro?", a: "Puedes crear tu cuenta gratis y configurar tu rubro y palabras clave para recibir un resumen diario por email." },
    ],
  },
  potosi: {
    capital: "Potosí",
    intro:
      "Potosí combina una capital departamental con muchos municipios dispersos, como Llallagua o Villazón. Las convocatorias de la gobernación, de los gobiernos municipales y de la universidad pública aparecen en SICOES con plazos que varían mucho según la entidad.",
    entities: ["Gobernación de Potosí", "Gobierno Autónomo Municipal de Potosí", "Municipios como Llallagua y Villazón", "Universidad Autónoma Tomás Frías (UATF)", "Entidades con oficinas regionales"],
    tips: [
      "La dispersión geográfica encarece la logística: calcula bien el costo de entrega o ejecución en cada municipio.",
      "Busca proveedores locales que te permitan cumplir plazos en zonas alejadas.",
      "Revisa con calma el lugar de ejecución y las condiciones del DBC antes de decidir.",
    ],
    faqs: [
      { q: "¿Dónde encuentro licitaciones de Potosí?", a: "En esta página, con las convocatorias detectadas hoy para entidades de Potosí. Para el listado oficial completo entra a sicoes.gob.bo." },
      { q: "¿Los municipios pequeños también publican en SICOES?", a: "Sí, las entidades públicas publican sus procesos de contratación en SICOES, incluidos municipios de distinto tamaño." },
      { q: "¿Cómo me preparo para ofertar?", a: "Regístrate en el RUPE, lee el DBC completo y respeta los plazos. Tenemos guías paso a paso en el blog." },
    ],
  },
  tarija: {
    capital: "Tarija",
    intro:
      "Tarija publica convocatorias de la gobernación, del gobierno municipal de la capital, de municipios como Yacuiba y de la universidad pública. Los proveedores locales suelen atender además a las entidades de provincias del departamento.",
    entities: ["Gobernación de Tarija", "Gobierno Autónomo Municipal de Tarija", "Municipios del departamento, como Yacuiba", "Universidad Autónoma Juan Misael Saracho (UAJMS)", "Entidades con oficinas regionales"],
    tips: [
      "Revisa si el proceso es de la capital o de una provincia: cambian los plazos de entrega y los costos.",
      "Para obras, verifica requisitos de experiencia específica en el DBC antes de decidir presentarte.",
      "Mantén tu certificado RUPE actualizado: las entidades verifican su autenticidad con el código en SICOES.",
    ],
    faqs: [
      { q: "¿Dónde veo las convocatorias SICOES de Tarija?", a: "Aquí mostramos las que SICOES Monitor detectó hoy para entidades de Tarija; la lista oficial completa está en sicoes.gob.bo." },
      { q: "¿Qué documentos necesito?", a: "Lo define cada DBC. En general necesitas RUPE activo y los formularios y respaldos que pida el proceso." },
      { q: "¿Puedo recibir avisos por email?", a: "Sí, con una cuenta gratuita recibes un resumen diario según tu rubro." },
    ],
  },
  chuquisaca: {
    capital: "Sucre (capital constitucional)",
    intro:
      "Sucre es la capital constitucional de Bolivia y la capital del departamento de Chuquisaca. Aquí publican convocatorias la gobernación, el gobierno municipal de Sucre, otros municipios del departamento, la universidad pública y entidades que tienen oficinas en la ciudad.",
    entities: ["Gobernación de Chuquisaca", "Gobierno Autónomo Municipal de Sucre", "Municipios del departamento", "Universidad San Francisco Xavier (USFX)", "Entidades con oficinas en Sucre"],
    tips: [
      "Sigue las convocatorias del municipio de Sucre en su propia página, además de la general de Chuquisaca.",
      "Entidades con oficinas en Sucre pueden convocar para otras ciudades: confirma el lugar de ejecución.",
      "Prepara con tiempo documentos y garantías cuando el DBC las exija.",
    ],
    faqs: [
      { q: "¿Dónde ver licitaciones de Sucre y Chuquisaca?", a: "En esta página (departamento) y en la de Sucre (municipio) mostramos las convocatorias detectadas hoy. El listado oficial está en sicoes.gob.bo." },
      { q: "¿Sucre es lo mismo que Chuquisaca?", a: "Sucre es la capital del departamento de Chuquisaca. Mostramos ambas páginas para que encuentres lo que buscas." },
      { q: "¿Cómo participo?", a: "Con RUPE activo, leyendo el DBC y presentando tu propuesta antes del cierre. Consulta nuestra guía de cómo postular en SICOES." },
    ],
  },
  beni: {
    capital: "Trinidad",
    intro:
      "Trinidad es la capital del Beni. En el departamento contratan la gobernación, los gobiernos municipales (por ejemplo Trinidad, Riberalta y Guayaramerín), la universidad pública y entidades con oficinas regionales. Las distancias y la logística son factores centrales al preparar una propuesta.",
    entities: ["Gobernación del Beni", "Gobierno Autónomo Municipal de Trinidad", "Municipios como Riberalta y Guayaramerín", "Universidad Autónoma del Beni José Ballivián", "Entidades con oficinas regionales"],
    tips: [
      "Considera la logística y la conectividad al calcular costos y plazos de entrega.",
      "Si tu internet es inestable, adelanta la carga de tu propuesta electrónica: no esperes a la última hora.",
      "Revisa convocatorias de municipios además de las de la gobernación.",
    ],
    faqs: [
      { q: "¿Dónde veo las convocatorias SICOES del Beni?", a: "Aquí mostramos las detectadas hoy; el listado oficial completo está en sicoes.gob.bo." },
      { q: "¿Qué pasa si hay cortes de internet el día del cierre?", a: "Puede dejarte fuera del proceso. Presenta con anticipación y prevé contingencias; los plazos los define cada DBC." },
      { q: "¿Hay alertas para el Beni?", a: "Con una cuenta gratuita recibes un resumen diario según tu rubro y palabras clave." },
    ],
  },
  pando: {
    capital: "Cobija",
    intro:
      "Cobija es la capital de Pando. En el departamento contratan la gobernación, el gobierno municipal de Cobija, otros municipios, la universidad pública y entidades con oficinas regionales. Es un mercado pequeño: seguir las convocatorias a diario marca la diferencia.",
    entities: ["Gobernación de Pando", "Gobierno Autónomo Municipal de Cobija", "Otros municipios del departamento", "Universidad Amazónica de Pando", "Entidades con oficinas regionales"],
    tips: [
      "Al haber pocas convocatorias, prepara con anticipación tus documentos para reaccionar rápido.",
      "Calcula con cuidado la logística de entrega o ejecución.",
      "Verifica en el DBC si se exige experiencia o presencia local.",
    ],
    faqs: [
      { q: "¿Dónde veo licitaciones de Pando?", a: "Aquí mostramos las convocatorias de entidades de Pando detectadas hoy; el listado oficial completo está en sicoes.gob.bo." },
      { q: "¿Cada cuánto se actualiza?", a: "Una vez al día. Siempre confirma plazos y detalles en el portal oficial." },
      { q: "¿Puedo ofertar desde otro departamento?", a: "Sí, si cumples el DBC y tienes RUPE activo; evalúa la logística." },
    ],
  },
};

export const MUNICIPALITY_INFO: Record<string, { intro: string; parent: string; parentName: string }> = {
  sacaba: {
    intro: "Sacaba es uno de los municipios más poblados del área metropolitana de Cochabamba. Su gobierno municipal y otras entidades publican convocatorias de obras, bienes y servicios que aparecen en SICOES.",
    parent: "cochabamba", parentName: "Cochabamba",
  },
  "el-alto": {
    intro: "El Alto es la ciudad vecina de La Paz y un mercado propio de contratación pública. Su gobierno municipal y otras entidades publican procesos de obras, bienes y servicios en SICOES.",
    parent: "la-paz", parentName: "La Paz",
  },
  quillacollo: {
    intro: "Quillacollo forma parte del área metropolitana de Cochabamba. Las convocatorias de su gobierno municipal y de otras entidades se publican en SICOES.",
    parent: "cochabamba", parentName: "Cochabamba",
  },
  tiquipaya: {
    intro: "Tiquipaya es un municipio del área metropolitana de Cochabamba. Aquí reunimos las convocatorias de entidades del municipio que detectamos en SICOES.",
    parent: "cochabamba", parentName: "Cochabamba",
  },
  vinto: {
    intro: "Vinto es un municipio del departamento de Cochabamba. Mostramos las convocatorias de entidades de Vinto que aparecen en SICOES.",
    parent: "cochabamba", parentName: "Cochabamba",
  },
  viacha: {
    intro: "Viacha es un municipio del departamento de La Paz. Reunimos aquí las convocatorias de entidades de Viacha que se publican en SICOES.",
    parent: "la-paz", parentName: "La Paz",
  },
  sucre: {
    intro: "Sucre es la capital constitucional de Bolivia y la capital de Chuquisaca. Aquí mostramos las convocatorias de entidades de Sucre que se publican en SICOES.",
    parent: "chuquisaca", parentName: "Chuquisaca",
  },
};

/** Municipality-specific content (own entities, tips and FAQs — not the parent department's). */
export function buildMunicipalityInfo(slug: string, name: string): LocationInfo {
  const m = MUNICIPALITY_INFO[slug];
  return {
    capital: `${name} (departamento de ${m.parentName})`,
    intro: m.intro,
    entities: [
      `Gobierno Autónomo Municipal de ${name}`,
      `Entidades del departamento de ${m.parentName} con oficinas en ${name}`,
      "Unidades educativas, centros de salud y servicios básicos del municipio",
    ],
    tips: [
      `Revisa también la página del departamento de ${m.parentName} para ver convocatorias de la gobernación y de municipios vecinos.`,
      `Confirma en el DBC el lugar exacto de ejecución en ${name}: puede cambiar tus costos.`,
      "Prepara tu RUPE y tus documentos con anticipación; los plazos de presentación suelen ser cortos.",
    ],
    faqs: [
      { q: `¿Dónde veo las convocatorias SICOES de ${name}?`, a: `En esta página mostramos las convocatorias de entidades de ${name} que detectamos hoy en SICOES. El listado oficial completo está en sicoes.gob.bo; usa el CUCE para abrir cada proceso.` },
      { q: `¿Este listado incluye convocatorias de personal de ${name}?`, a: "No. Muestra licitaciones de contratación de bienes, obras y servicios. Para empleo y consultorías usa la sección Requerimiento de Personal del portal oficial; tenemos una guía por ciudad en el blog." },
      { q: `¿Cómo recibo avisos de nuevas convocatorias de ${name}?`, a: "Crea una cuenta gratis, elige tu rubro y tus palabras clave y recibirás un resumen diario por email a las 9am (hora Bolivia)." },
    ],
  };
}
