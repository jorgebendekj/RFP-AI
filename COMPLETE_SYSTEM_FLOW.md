# 🏗️ Flujo Completo del Sistema RFP AI

## 📊 Estructura de 3 Capas de Documentos

### 1️⃣ COMPANY DATA (Información de la Empresa)

El usuario sube documentos con información interna de su empresa. El AI extrae y almacena esta información para usarla en TODAS las propuestas.

#### 1.1 Tabla de Materiales de Construcción
**Archivo**: `materiales_construccion_bolivia.xlsx`

**Estructura**:
| Nombre | Precio | Cantidad |
|--------|--------|----------|
| Cemento | 65 | 20 |
| Arena fina | 120 | 15 |
| Arena gruesa | 130 | 12 |
| Grava m³ | 140 | 10 |
| Ladrillo hueco | 2.5 | 500 |
| Ladrillo macizo | 3.2 | 400 |
| Fierro corrugado 6mm | 55 | 60 |
| Fierro corrugado 8mm | 85 | 40 |
| Fierro corrugado 10mm | 120 | 30 |
| Yeso bolsa | 55 | 25 |
| Cal hidratada | 45 | 30 |
| Bloque de cemento 9cm | 9 | 200 |
| Bloque de cemento 7.5cm | 7.5 | 250 |
| Malla electrosoldada 260 | 260 | 15 |
| Malla electrosoldada 230 | 230 | 18 |
| Clavo 2" | 24 | 20 |
| Clavo 3" | 26 | 18 |
| Clavo 4" | 28 | 15 |
| Alambre recocido | 18 | 40 |
| Tubo PVC 1/2" | 22 | 35 |
| Tubo PVC 3/4" | 28 | 30 |

**Qué extrae el AI**:
- ✅ Lista completa de materiales disponibles
- ✅ Precios unitarios en Bolivianos
- ✅ Cantidades estándar por material
- ✅ Categorías (cemento, arena, fierro, etc.)

**Cómo se usa**:
- Cuando el tender solicita "materiales para construcción", el AI usa estos precios exactos
- El AI calcula costos multiplicando precio × cantidad requerida
- El AI genera tablas de presupuesto con estos datos

#### 1.2 Tabla de Mano de Obra
**Archivo**: FORMULARIO A-4 (analizado previamente)

**Mano de Obra Directa**:
| Función | Cantidad | Bs/día |
|---------|----------|--------|
| Maestro Albañil | 1.00 | 159.09 |
| Contramaestro | 2.00 | 145.45 |
| Ayudante de Albañil | 4.00 | 136.36 |

**Mano de Obra Indirecta**:
| Función | Cantidad | Bs/día |
|---------|----------|--------|
| Supervisor / Monitor SMS | 1.00 | 500.00 |

**Carga Social**: 33.39%

#### 1.3 Información de Contacto
**Archivo**: FORMULARIO A-1 (analizado previamente)

- **Empresa**: DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES
- **Representante Legal**: Daniel Ribera Justiniano
- **Email**: gerencia_adm@drj-construcciones.com
- **Teléfonos**: 76003883 - 76002808
- **Dirección**: Zona Noreste, Av. Barrio Cordecruz Calle N° 5 Este Nro 76
- **Ciudad**: Santa Cruz de la Sierra, Bolivia

---

### 2️⃣ TENDER DOCUMENTS (Documentos de la Licitación)

El usuario sube los documentos que recibió de la entidad pública. El AI los analiza para entender QUÉ se está solicitando.

#### 2.1 Especificaciones Técnicas
**Archivo**: ANEXO 1 - ESPECIFICACIONES TÉCNICAS (analizado previamente)

**Información extraída**:
- **Proceso N°**: 50003715
- **Objeto**: SERVICIO TÉCNICO PARA OBRAS CIVILES MENORES
- **Cliente**: Refinería Guillermo Elder Bell (RSCZ)
- **Alcance**: Provisión de personal para obras civiles menores
- **Requisitos específicos**: Detallados en 10 páginas

**Qué extrae el AI**:
- ✅ Objetivo del proyecto
- ✅ Alcance del servicio
- ✅ Requisitos técnicos específicos
- ✅ Terminología técnica a usar
- ✅ Nombre del cliente
- ✅ Ubicación del proyecto

#### 2.2 Otros Formularios Requeridos
- FORMULARIO A-3: Propuesta Económica (template vacío)
- DCD: Documento de Contratación
- Términos de Referencia

---

### 3️⃣ RFP PROPOSALS (Propuestas Previas)

El usuario sube propuestas que ya ganó antes. El AI aprende el FORMATO y ESTILO exitoso.

**Qué extrae el AI**:
- ✅ Estructura de secciones (títulos, orden)
- ✅ Estilo de redacción
- ✅ Formato de tablas
- ✅ Longitud de contenido por sección
- ✅ Tipo de información incluida en cada sección
- ✅ Frases y vocabulario usado
- ✅ Formato de presentación

---

## 🔄 Flujo de Generación de Propuesta

### Paso 1: Usuario Prepara Información

```
Company Data (1 vez por empresa):
├── materiales_construccion_bolivia.xlsx → Precios de materiales
├── FORMULARIO A-4.xlsx → Precios de mano de obra  
├── FORMULARIO A-1.docx → Datos de contacto
├── portafolio_proyectos.pdf → Proyectos previos
└── cvs_equipo.pdf → Currículos del equipo

RFP Proposals (1 vez por empresa, actualizar periódicamente):
├── propuesta_ypfb_2023.docx → Propuesta ganadora
├── propuesta_gobernacion_2024.docx → Propuesta ganadora
└── propuesta_entel_2024.docx → Propuesta ganadora
```

### Paso 2: Usuario Recibe Nueva Licitación

```
Tender Documents (1 vez por licitación):
├── ANEXO_1_especificaciones.pdf
├── DCD_documento_contratacion.pdf
├── terminos_referencia.pdf
└── formularios_vacios.xlsx
```

### Paso 3: Sistema Procesa Todo

#### 3.1 Procesar Company Data (una vez)
```javascript
// Extrae información de empresa
const companyInfo = {
  name: "DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES",
  contact: {
    representative: "Daniel Ribera Justiniano",
    email: "gerencia_adm@drj-construcciones.com",
    phones: ["76003883", "76002808"],
    address: "Zona Noreste, Av. Barrio Cordecruz Calle N° 5 Este Nro 76",
    city: "Santa Cruz de la Sierra, Bolivia"
  }
};

// Extrae tabla de materiales
const materials = [
  { name: "Cemento", price: 65, unit: "bolsa", quantity: 20 },
  { name: "Arena fina", price: 120, unit: "m³", quantity: 15 },
  { name: "Arena gruesa", price: 130, unit: "m³", quantity: 12 },
  // ... todos los materiales
];

// Extrae tabla de mano de obra
const labor = {
  direct: [
    { position: "Maestro Albañil", quantity: 1.00, dailyRate: 159.09 },
    { position: "Contramaestro", quantity: 2.00, dailyRate: 145.45 },
    { position: "Ayudante de Albañil", quantity: 4.00, dailyRate: 136.36 }
  ],
  indirect: [
    { position: "Supervisor / Monitor SMS", quantity: 1.00, dailyRate: 500.00 }
  ],
  socialCharge: 33.39
};

// GUARDA TODO EN BASE DE DATOS (se reutiliza para todas las propuestas)
await db.companyInfo.insert({ organizationId, data: companyInfo });
await db.materials.insertMany(materials);
await db.labor.insertMany(labor);
```

#### 3.2 Procesar Tender Documents
```javascript
// Extrae requisitos del tender
const tenderRequirements = {
  processNumber: "50003715",
  objective: "SERVICIO TÉCNICO PARA OBRAS CIVILES MENORES",
  client: "Refinería Guillermo Elder Bell (RSCZ)",
  location: "Santa Cruz de la Sierra",
  scope: "Provisión de personal para obras civiles...",
  technicalRequirements: [
    "Personal calificado para obras civiles",
    "Experiencia mínima de 5 años",
    "Certificaciones de seguridad",
    // ... más requisitos
  ]
};

// Guarda para esta licitación específica
await db.tenders.update(tenderId, { requirements: tenderRequirements });
```

#### 3.3 Analizar RFP Proposals Previas
```javascript
// Extrae estructura de propuestas ganadoras
const proposalStructure = {
  sections: [
    { title: "1. IDENTIFICACIÓN DEL OFERENTE", order: 1 },
    { title: "2. PROPUESTA TÉCNICA", order: 2 },
    { title: "3. PROPUESTA ECONÓMICA", order: 3 },
    { title: "4. EXPERIENCIA DE LA EMPRESA", order: 4 },
    { title: "5. EQUIPO TÉCNICO", order: 5 }
  ],
  styleNotes: [
    "Usar tablas HTML con bordes para datos estructurados",
    "Incluir logos y firmas al final",
    "Usar negritas para títulos de sección",
    "Párrafos de 4-6 líneas",
    "Incluir notas legales sobre impuestos"
  ]
};

// Guarda estructura aprendida
await db.proposalTemplates.insert({ organizationId, structure: proposalStructure });
```

### Paso 4: Generar Propuesta

Cuando el usuario hace click en "Generate Proposal", el sistema:

#### 4.1 Recopila Información
```javascript
// 1. Cargar información de la empresa
const companyInfo = await db.companyInfo.findOne({ organizationId });
const materials = await db.materials.find({ organizationId });
const labor = await db.labor.find({ organizationId });
const projects = await db.projects.find({ organizationId });

// 2. Cargar requisitos del tender
const tender = await db.tenders.findOne({ tenderId });

// 3. Cargar estructura de propuestas previas
const template = await db.proposalTemplates.findOne({ organizationId });

// 4. Cargar documentos completos para contexto
const companyDocs = await db.documents.find({ 
  organizationId, 
  category: 'company_data' 
});
const tenderDocs = await db.documents.find({ 
  tenderId, 
  category: 'tender_documents' 
});
const previousProposals = await db.documents.find({ 
  organizationId, 
  category: 'rfp_proposals' 
});
```

#### 4.2 Construir Prompt Mejorado
```javascript
const prompt = `
# INFORMACIÓN DE LA EMPRESA (USA EXACTAMENTE)

## Datos de Contacto
- Empresa: ${companyInfo.name}
- Representante: ${companyInfo.contact.representative}
- Email: ${companyInfo.contact.email}
- Teléfonos: ${companyInfo.contact.phones.join(', ')}
- Dirección: ${companyInfo.contact.address}, ${companyInfo.contact.city}

## Tabla de Materiales de Construcción
<table style="border: 1px solid #000; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">Material</th>
      <th style="border: 1px solid #000; padding: 8px;">Precio (Bs)</th>
      <th style="border: 1px solid #000; padding: 8px;">Unidad</th>
    </tr>
  </thead>
  <tbody>
    ${materials.map(m => `
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">${m.name}</td>
      <td style="border: 1px solid #000; padding: 8px;">${m.price}</td>
      <td style="border: 1px solid #000; padding: 8px;">${m.unit}</td>
    </tr>
    `).join('')}
  </tbody>
</table>

## Tabla de Mano de Obra
### Directa:
<table style="border: 1px solid #000; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">Función</th>
      <th style="border: 1px solid #000; padding: 8px;">Cantidad</th>
      <th style="border: 1px solid #000; padding: 8px;">Bs/día</th>
    </tr>
  </thead>
  <tbody>
    ${labor.direct.map(l => `
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">${l.position}</td>
      <td style="border: 1px solid #000; padding: 8px;">${l.quantity}</td>
      <td style="border: 1px solid #000; padding: 8px;">${l.dailyRate}</td>
    </tr>
    `).join('')}
  </tbody>
</table>

**Carga Social: ${labor.socialCharge}%**

---

# REQUISITOS DE LA LICITACIÓN

- **Proceso N°**: ${tender.requirements.processNumber}
- **Objeto**: ${tender.requirements.objective}
- **Cliente**: ${tender.requirements.client}
- **Ubicación**: ${tender.requirements.location}

## Requisitos Específicos:
${tender.requirements.technicalRequirements.map((r, i) => `${i+1}. ${r}`).join('\n')}

---

# ESTRUCTURA DE PROPUESTA (USAR ESTE FORMATO)

${template.sections.map(s => `
## ${s.title}
[El AI debe generar contenido para esta sección]
`).join('\n')}

---

# INSTRUCCIONES CRÍTICAS

1. **USA LOS DATOS EXACTOS**:
   - Nombre de empresa: "${companyInfo.name}"
   - Email: "${companyInfo.contact.email}"
   - Representante: "${companyInfo.contact.representative}"
   - NO inventes ningún dato

2. **USA LOS PRECIOS EXACTOS**:
   - Cemento: Bs ${materials.find(m => m.name === 'Cemento')?.price}
   - Arena fina: Bs ${materials.find(m => m.name === 'Arena fina')?.price}
   - Maestro Albañil: Bs ${labor.direct.find(l => l.position === 'Maestro Albañil')?.dailyRate}/día
   - NO inventes precios

3. **REPLICA LAS TABLAS EN HTML**:
   - Usa <table>, <tr>, <th>, <td> con estilos inline
   - Incluye bordes: style="border: 1px solid #000;"
   - Replica la estructura exacta mostrada arriba

4. **CALCULA COSTOS CORRECTAMENTE**:
   - Precio Total = Precio Unitario × Cantidad
   - Mano de Obra Total = (Suma Directa + Suma Indirecta) × (1 + Carga Social/100)
   - Muestra todos los cálculos en tablas

5. **MENCIONA PROYECTOS REALES**:
   ${projects.map(p => `- ${p.name} (Cliente: ${p.client}, Valor: ${p.value} ${p.currency})`).join('\n   ')}

6. **CONTENIDO EXTENSO**:
   - Mínimo 4-6 párrafos por sección
   - Incluye detalles técnicos específicos
   - Usa terminología del tender: "${tender.requirements.objective}"

7. **NOTAS LEGALES**:
   - "Validez de la Oferta: 60 días calendarios"
   - "Incluye todos los impuestos con factura fiscal boliviana"
   - "Se adjunta FORMULARIO A-4 para cálculos detallados"

# GENERA LA PROPUESTA COMPLETA AHORA:
`;

// Enviar a OpenAI
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "Eres un experto en redacción de propuestas para licitaciones bolivianas." },
    { role: "user", content: prompt }
  ],
  temperature: 0.7,
  max_tokens: 8000
});
```

#### 4.3 Resultado Esperado

```html
<h2>FORMULARIO A-1: IDENTIFICACIÓN DEL OFERENTE</h2>

<table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="border: 1px solid #000; padding: 10px; font-weight: bold; width: 40%;">
      NOMBRE Y RAZÓN SOCIAL DEL OFERENTE:
    </td>
    <td style="border: 1px solid #000; padding: 10px;">
      DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">
      REPRESENTANTE LEGAL:
    </td>
    <td style="border: 1px solid #000; padding: 10px;">
      DANIEL RIBERA JUSTINIANO
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">
      CORREO ELECTRÓNICO:
    </td>
    <td style="border: 1px solid #000; padding: 10px;">
      gerencia_adm@drj-construcciones.com
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">
      TELÉFONOS:
    </td>
    <td style="border: 1px solid #000; padding: 10px;">
      76003883 - 76002808
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">
      DIRECCIÓN:
    </td>
    <td style="border: 1px solid #000; padding: 10px;">
      Zona Noreste, Avenida Barrio Cordecruz Calle N° 5 Este Nro 76<br>
      Santa Cruz de la Sierra, Bolivia
    </td>
  </tr>
</table>

<h2>PROPUESTA ECONÓMICA - MATERIALES</h2>

<table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin: 20px 0;">
  <thead style="background-color: #f0f0f0;">
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">Material</th>
      <th style="border: 1px solid #000; padding: 8px;">Cantidad</th>
      <th style="border: 1px solid #000; padding: 8px;">Precio Unit. (Bs)</th>
      <th style="border: 1px solid #000; padding: 8px;">Precio Total (Bs)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">Cemento</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">20</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">65.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">1,300.00</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">Arena fina</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">15 m³</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">120.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">1,800.00</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">Ladrillo hueco</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">500</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">2.50</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">1,250.00</td>
    </tr>
    <tr style="font-weight: bold; background-color: #f0f0f0;">
      <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right;">SUBTOTAL MATERIALES:</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">4,350.00</td>
    </tr>
  </tbody>
</table>

<h2>PROPUESTA ECONÓMICA - MANO DE OBRA</h2>

<h3>A- MANO DE OBRA DIRECTA</h3>
<table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin: 20px 0;">
  <thead style="background-color: #f0f0f0;">
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">Ítem</th>
      <th style="border: 1px solid #000; padding: 8px;">Función</th>
      <th style="border: 1px solid #000; padding: 8px;">Cantidad</th>
      <th style="border: 1px solid #000; padding: 8px;">Bs/día</th>
      <th style="border: 1px solid #000; padding: 8px;">Total Bs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-1</td>
      <td style="border: 1px solid #000; padding: 8px;">Maestro Albañil</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">1.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">159.09</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">159.09</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-2</td>
      <td style="border: 1px solid #000; padding: 8px;">Contramaestro</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">2.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">145.45</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">290.90</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-3</td>
      <td style="border: 1px solid #000; padding: 8px;">Ayudante de Albañil</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">4.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">136.36</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">545.44</td>
    </tr>
    <tr style="font-weight: bold;">
      <td colspan="4" style="border: 1px solid #000; padding: 8px; text-align: right;">SUBTOTAL A1:</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">995.43</td>
    </tr>
  </tbody>
</table>

<p><strong>Carga Social (33.39%):</strong> Bs 332.42</p>
<p><strong>TOTAL MANO DE OBRA DIRECTA:</strong> Bs 1,327.85</p>

<h3>NOTAS IMPORTANTES</h3>
<ul>
  <li><strong>Validez de la Oferta:</strong> La presente oferta tiene una validez de 60 días calendarios a partir de la fecha límite de presentación.</li>
  <li><strong>Impuestos:</strong> La presente oferta incluye todos los costos, gestiones, aranceles y tributos, con la emisión de la correspondiente factura fiscal boliviana (con derecho a crédito fiscal), incluyendo todos los impuestos aplicables por ley.</li>
  <li><strong>Nota:</strong> Se adjunta FORMULARIO A-4 MODELO INDICATIVO DE PRECIOS para el cálculo detallado de todos los ítems.</li>
</ul>
```

---

## ✅ Validación de Éxito

Para verificar que el sistema funciona correctamente, la propuesta generada DEBE contener:

### Información de Empresa
- ✅ Nombre exacto: "DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES"
- ✅ Email exacto: "gerencia_adm@drj-construcciones.com"
- ✅ Contacto exacto: "Daniel Ribera Justiniano"
- ✅ Teléfonos exactos: "76003883 - 76002808"

### Precios de Materiales
- ✅ Cemento: Bs 65
- ✅ Arena fina: Bs 120/m³
- ✅ Ladrillo hueco: Bs 2.50
- ✅ Ladrillo macizo: Bs 3.20
- ✅ Fierro corrugado 6mm: Bs 55
- ✅ (Todos los demás materiales con precios correctos)

### Precios de Mano de Obra
- ✅ Maestro Albañil: Bs 159.09/día
- ✅ Contramaestro: Bs 145.45/día
- ✅ Ayudante de Albañil: Bs 136.36/día
- ✅ Supervisor SMS: Bs 500.00/día
- ✅ Carga Social: 33.39%

### Formato
- ✅ Tablas HTML con bordes y estilos
- ✅ Cálculos correctos (precio × cantidad)
- ✅ Estructura de secciones de propuestas previas
- ✅ Notas legales sobre validez e impuestos

---

## 🎯 Mejoras Técnicas Necesarias

### 1. Base de Datos

Agregar tablas para almacenar datos estructurados:

```javascript
// Schema de InstantDB
{
  materials: {
    organization: ref('organizations'),
    name: 'string',
    price: 'number',
    unit: 'string',
    quantity: 'number',
    category: 'string'
  },
  
  labor: {
    organization: ref('organizations'),
    position: 'string',
    quantity: 'number',
    dailyRate: 'number',
    type: 'string' // 'direct' or 'indirect'
  },
  
  laborSettings: {
    organization: ref('organizations'),
    socialChargePercent: 'number'
  }
}
```

### 2. Procesador de Company Data

Cuando el usuario sube `materiales_construccion_bolivia.xlsx`:

```typescript
// src/lib/company-data-processor.ts
export async function processMaterialsTable(
  fileBuffer: Buffer,
  organizationId: string
) {
  // Extraer tabla
  const tables = await extractTablesFromDocument(fileBuffer, 'xlsx', 'materiales.xlsx');
  
  // Procesar cada fila
  const materials = tables[0].rows.map(row => ({
    organizationId,
    name: row[0],
    price: parseFloat(row[1]),
    quantity: parseFloat(row[2]),
    unit: detectUnit(row[0]) // 'bolsa', 'm³', 'unidad', etc.
  }));
  
  // Guardar en DB
  await db.materials.insertMany(materials);
  
  console.log(`Extracted ${materials.length} materials for ${organizationId}`);
}
```

### 3. Prompt Constructor Mejorado

```typescript
// src/lib/prompt-builder.ts
export async function buildProposalPrompt(
  tenderId: string,
  organizationId: string
): Promise<string> {
  // Cargar toda la información
  const companyInfo = await loadCompanyInfo(organizationId);
  const materials = await loadMaterials(organizationId);
  const labor = await loadLabor(organizationId);
  const tenderReqs = await loadTenderRequirements(tenderId);
  const previousProposals = await loadPreviousProposals(organizationId);
  
  // Construir tablas HTML
  const materialsTableHTML = buildMaterialsTable(materials);
  const laborTableHTML = buildLaborTable(labor);
  
  // Construir prompt completo
  return `
# INFORMACIÓN DE LA EMPRESA
${companyInfoSection(companyInfo)}

# PRECIOS DE MATERIALES
${materialsTableHTML}

# PRECIOS DE MANO DE OBRA
${laborTableHTML}

# REQUISITOS DE LA LICITACIÓN
${tenderRequirementsSection(tenderReqs)}

# ESTRUCTURA Y ESTILO
${proposalStructureSection(previousProposals)}

# INSTRUCCIONES
${buildInstructions(companyInfo, materials, labor, tenderReqs)}

# GENERA LA PROPUESTA:
`;
}
```

---

## 📊 Resumen del Flujo

1. **Setup (1 vez)**:
   - Usuario sube materiales → Sistema extrae precios
   - Usuario sube FORMULARIO A-4 → Sistema extrae mano de obra
   - Usuario sube FORMULARIO A-1 → Sistema extrae contacto
   - Usuario sube propuestas previas → Sistema aprende formato

2. **Por Cada Licitación**:
   - Usuario sube ANEXO 1 → Sistema extrae requisitos
   - Usuario sube DCD → Sistema extrae más requisitos
   - Usuario hace click "Generate" → Sistema combina todo

3. **Resultado**:
   - Propuesta con datos reales de la empresa
   - Tablas con precios reales
   - Formato de propuestas ganadoras previas
   - Contenido extenso y profesional

---

**Creado**: 24 de noviembre de 2025  
**Para**: Jorge Bendek - RFP AI Project



