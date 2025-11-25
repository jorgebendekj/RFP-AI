# 📊 Análisis Completo de Documentos y Mejoras del AI Agent

## 🎯 Objetivo del Sistema

El sistema debe permitir que los usuarios suban:
1. **Company Data**: Tablas de precios, formas de cálculo, información de la empresa
2. **Tender Documents**: Documentos guía de la licitación (especificaciones técnicas, formularios)
3. **RFP Proposals**: Ejemplos de licitaciones previas ganadas

El AI debe analizar toda esta información y generar propuestas personalizadas que:
- Repliquen el formato exacto de los documentos de ejemplo
- Usen la información real de la empresa (nombres, precios, proyectos)
- Cumplan con todos los requisitos de la licitación

---

## 📑 Análisis de los Documentos Ejemplo

### 1. FORMULARIO A-1: IDENTIFICACIÓN DEL OFERENTE

**Información Clave Extraída:**
- **Empresa**: DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES
- **Proceso N°**: 50003715
- **Objeto**: SERVICIO TÉCNICO PARA OBRAS CIVILES MENORES
- **Contacto**: Daniel Ribera Justiniano
- **Dirección**: Zona Noreste, Avenida Barrio Cordecruz Calle N° 5 Este Nro 76
- **Ciudad**: Santa Cruz de la Sierra - Bolivia
- **Teléfonos**: 76003883 - 76002808
- **Email**: gerencia_adm@drj-construcciones.com

**Lo que el AI debe hacer:**
- Extraer estos datos exactos de los documentos subidos
- Replicar el formato de tabla del formulario
- Usar la información de contacto real en todas las secciones generadas

### 2. ANEXO 1: ESPECIFICACIONES TÉCNICAS

**Información Clave:**
- 10 páginas de especificaciones técnicas detalladas
- Estructura jerárquica:
  - 1. CARACTERÍSTICAS DEL REQUERIMIENTO
    - 1.1. DESCRIPCIÓN DEL SERVICIO
      - 1.1.1. Objetivo
      - 1.1.2. Alcance del Servicio
- Objetivo: "Servicio técnico de Obras Civiles Menores en la Refinería Guillermo Elder Bell (RSCZ)"

**Lo que el AI debe hacer:**
- Analizar la estructura completa del documento (las 10 páginas)
- Extraer requisitos específicos, objetivos, alcances
- Identificar palabras clave técnicas (ej: "Refinería", "RSCZ", "Obras Civiles Menores")
- Usar estos términos exactos en la propuesta generada

### 3. FORMULARIO A-3: PROPUESTA ECONÓMICA

**Estructura de la Tabla:**
```
| Ítem | Detalle | Unidad | Cantidad | Precio Unitario | Precio Total |
|------|---------|--------|----------|-----------------|--------------|
| 1    | SERVICIO TÉCNICO PARA OBRAS CIVILES MENORES | Servicio | 1 | [Calculado] | [Calculado] |
```

**Notas Importantes:**
- "Se adjunta FORMULARIO A-4 MODELO INDICATIVO DE PRECIOS, para el cálculo del Item 1"
- Moneda: Bolivianos
- Validez: 60 días calendarios
- Incluye todos los impuestos con factura fiscal boliviana

**Lo que el AI debe hacer:**
- Replicar la estructura de tabla en HTML
- Referenciar el FORMULARIO A-4 cuando corresponda
- Incluir las notas sobre validez e impuestos
- Calcular precios basándose en el FORMULARIO A-4

### 4. FORMULARIO A-4: MODELO INDICATIVO DE PRECIOS

**Estructura Detallada:**

**A- MANO DE OBRA**

**1 – Directa:**
| Ítem | Función | Cantidad de Empleados | Bs / día |
|------|---------|----------------------|----------|
| A1-1 | Maestro Albañil | 1.00 | 159.09 |
| A1-2 | Contramaestro | 2.00 | 145.45 |
| A1-3 | Ayudante de Albañil | 4.00 | 136.36 |

- **Carga Social**: 33.39%
- **Total A1**: [Calculado]

**2 – Indirecta:**
| Ítem | Función | Cantidad de Empleados | Bs / día |
|------|---------|----------------------|----------|
| A2-1 | Supervisor / Monitor de SMS | 1.00 | 500.00 |

**Lo que el AI debe hacer:**
- Extraer tablas completas con todas las filas y columnas
- Preservar la estructura jerárquica (A, A1, A2, etc.)
- Mantener los cálculos de carga social (33.39%)
- Replicar el formato exacto en HTML
- Usar los precios reales de la empresa para cada función

---

## 🔧 Mejoras Críticas Necesarias en el AI Agent

### Mejora 1: Sistema de Categorización de Documentos

**Archivo:** `src/app/api/documents/upload/route.ts`

Necesitamos agregar tipos de documentos más específicos:

```typescript
// Nuevo enum de tipos de documentos
export enum DocumentType {
  // Datos de la empresa
  COMPANY_PROFILE = 'company_profile',
  PRICE_TABLE = 'price_table',
  CALCULATION_METHOD = 'calculation_method',
  CERTIFICATIONS = 'certifications',
  TEAM_CVS = 'team_cvs',
  PROJECT_PORTFOLIO = 'project_portfolio',
  
  // Documentos de licitación (tender)
  TENDER_DOCUMENT = 'tender_document',
  TECHNICAL_SPECS = 'technical_specifications',
  FORMULARIO_A1 = 'formulario_a1_identificacion',
  FORMULARIO_A3 = 'formulario_a3_propuesta_economica',
  FORMULARIO_A4 = 'formulario_a4_modelo_precios',
  ANEXO_1 = 'anexo_1_especificaciones',
  
  // Ejemplos de propuestas previas
  PREVIOUS_PROPOSAL = 'previous_proposal',
  WINNING_PROPOSAL = 'winning_proposal',
}
```

### Mejora 2: Extractor Especializado de Tablas

**Nuevo archivo:** `src/lib/table-extractor.ts`

```typescript
export interface ExtractedTable {
  title: string;
  headers: string[];
  rows: string[][];
  metadata: {
    currency?: string;
    totals?: Record<string, number>;
    calculations?: string[];
  };
}

export async function extractTablesFromDocument(
  fileContent: string,
  fileType: string
): Promise<ExtractedTable[]> {
  // Para Excel: usar xlsx para leer tablas estructuradas
  // Para PDF: usar regex avanzado para detectar patrones tabulares
  // Para DOCX: usar mammoth con preservación de estructura HTML
  
  // Detectar patrones específicos de formularios bolivianos:
  // - "Ítem | Detalle | Unidad | Cantidad | Precio Unitario | Precio Total"
  // - "Función | Cantidad de Empleados | Bs / día"
  // - Cálculos de carga social (X.XX%)
}
```

### Mejora 3: Analizador de Información de Empresa

**Nuevo archivo:** `src/lib/company-info-extractor.ts`

```typescript
export interface CompanyInfo {
  name: string;
  representative: string;
  contact: {
    person: string;
    address: string;
    city: string;
    country: string;
    phones: string[];
    email: string;
  };
  pricing: {
    laborDirect: Array<{
      position: string;
      quantity: number;
      dailyRate: number;
    }>;
    laborIndirect: Array<{
      position: string;
      quantity: number;
      dailyRate: number;
    }>;
    socialCharge: number; // %
  };
  projects: Array<{
    name: string;
    client: string;
    description: string;
    value: number;
    year: number;
  }>;
  team: Array<{
    name: string;
    position: string;
    experience: string;
  }>;
}

export async function extractCompanyInfo(
  documents: Array<{ content: string; type: DocumentType }>
): Promise<CompanyInfo> {
  // Usar AI para extraer información estructurada de múltiples documentos
  // Priorizar información de:
  // 1. FORMULARIO_A1 para datos de contacto
  // 2. FORMULARIO_A4 para precios y mano de obra
  // 3. PROJECT_PORTFOLIO para proyectos
  // 4. TEAM_CVS para equipo
}
```

### Mejora 4: Prompt Mejorado para Generación de Propuestas

**Archivo:** `src/app/api/ai/generate-proposal/route.ts`

```typescript
const improvedPrompt = `
# INSTRUCCIONES CRÍTICAS PARA GENERAR PROPUESTA

## INFORMACIÓN DE LA EMPRESA (USAR ESTA INFO EXACTA)
${JSON.stringify(companyInfo, null, 2)}

## TABLAS EXTRAÍDAS DE DOCUMENTOS DE LA EMPRESA
${extractedTables.map(table => `
### ${table.title}
${formatTableAsHTML(table)}
`).join('\n\n')}

## REQUISITOS DE LA LICITACIÓN
${tenderRequirements}

## EJEMPLOS DE PROPUESTAS PREVIAS GANADORAS
${previousProposals.map(p => p.content).join('\n\n---\n\n')}

---

# TAREAS ESPECÍFICAS:

1. **REPLICAR FORMATO EXACTO**:
   - Usa la misma estructura de secciones que las propuestas previas
   - Replica las tablas HTML exactamente como aparecen
   - Usa los mismos títulos de sección

2. **USAR INFORMACIÓN REAL DE LA EMPRESA**:
   - Nombre: "${companyInfo.name}"
   - Representante: "${companyInfo.representative}"
   - Email: "${companyInfo.contact.email}"
   - Teléfonos: ${companyInfo.contact.phones.join(', ')}
   - NO inventes nombres, usa solo los de los documentos

3. **TABLAS DE PRECIOS**:
   - Replica la tabla de FORMULARIO A-4 completa
   - Usa los precios exactos: Maestro Albañil ${companyInfo.pricing.laborDirect[0]?.dailyRate} Bs/día
   - Incluye carga social: ${companyInfo.pricing.socialCharge}%
   - Calcula totales correctamente

4. **REFERENCIAS A PROYECTOS**:
   - Menciona proyectos reales: ${companyInfo.projects.map(p => p.name).join(', ')}
   - Usa valores reales de proyectos
   - Incluye clientes reales

5. **FORMATO HTML**:
   - Usa <table>, <tr>, <th>, <td> para tablas
   - Usa <strong> para negritas (NO usar **)
   - Usa <ul>/<ol> para listas
   - Incluye estilos inline para tablas:
     <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
       <thead style="background-color: #f0f0f0;">
         <tr>
           <th style="border: 1px solid #000; padding: 8px; text-align: left;">Ítem</th>
           <th style="border: 1px solid #000; padding: 8px; text-align: left;">Detalle</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td style="border: 1px solid #000; padding: 8px;">1</td>
           <td style="border: 1px solid #000; padding: 8px;">Servicio técnico...</td>
         </tr>
       </tbody>
     </table>

6. **TERMINOLOGÍA ESPECÍFICA**:
   - Usa términos técnicos exactos de la licitación
   - Ej: "Refinería Guillermo Elder Bell (RSCZ)"
   - Ej: "Servicio Técnico para Obras Civiles Menores"

7. **VALIDEZ Y NOTAS LEGALES**:
   - Incluye "Validez de la Oferta: 60 días calendarios"
   - Incluye nota sobre impuestos y factura fiscal boliviana
   - Menciona "Se adjunta FORMULARIO A-4" cuando corresponda

8. **CONTENIDO EXTENSO**:
   - Cada sección debe tener 4-6 párrafos
   - Proporciona detalles específicos, no generalidades
   - Usa datos cuantitativos (años de experiencia, número de proyectos, valores)

# GENERA LA PROPUESTA AHORA:
`;
```

### Mejora 5: Interfaz de Usuario para Categorización

**Archivo:** `src/app/dashboard/documents/page.tsx`

Agregar un selector de tipo de documento al subir:

```tsx
<select
  value={documentType}
  onChange={(e) => setDocumentType(e.target.value)}
  className="..."
>
  <optgroup label="Datos de la Empresa">
    <option value="company_profile">Perfil de la Empresa</option>
    <option value="price_table">Tabla de Precios</option>
    <option value="calculation_method">Método de Cálculo</option>
    <option value="certifications">Certificaciones</option>
    <option value="team_cvs">CVs del Equipo</option>
    <option value="project_portfolio">Portafolio de Proyectos</option>
  </optgroup>
  
  <optgroup label="Documentos de Licitación">
    <option value="tender_document">Documento de Licitación General</option>
    <option value="technical_specifications">Especificaciones Técnicas</option>
    <option value="formulario_a1_identificacion">Formulario A-1 (Identificación)</option>
    <option value="formulario_a3_propuesta_economica">Formulario A-3 (Propuesta Económica)</option>
    <option value="formulario_a4_modelo_precios">Formulario A-4 (Modelo de Precios)</option>
    <option value="anexo_1_especificaciones">Anexo 1 (Especificaciones)</option>
  </optgroup>
  
  <optgroup label="Ejemplos de Propuestas">
    <option value="previous_proposal">Propuesta Previa</option>
    <option value="winning_proposal">Propuesta Ganadora</option>
  </optgroup>
</select>
```

### Mejora 6: Base de Datos de Información Empresarial

**Nuevo esquema en InstantDB:**

```typescript
// Agregar a instantdb schema
{
  companyInfo: {
    $: {
      organization: ref('organizations'),
      updatedAt: 'date'
    },
    data: {
      name: 'string',
      representative: 'string',
      contact: 'json', // ContactInfo
      pricing: 'json', // PricingInfo
      projects: 'json[]', // ProjectInfo[]
      team: 'json[]', // TeamMemberInfo[]
    }
  },
  
  extractedTables: {
    $: {
      document: ref('documents'),
      createdAt: 'date'
    },
    data: {
      title: 'string',
      headers: 'string[]',
      rows: 'json[][]',
      metadata: 'json'
    }
  }
}
```

### Mejora 7: Procesamiento Inteligente al Subir Documentos

**Archivo:** `src/app/api/documents/upload/route.ts`

```typescript
// Después de procesar el documento
if (documentType === 'formulario_a4_modelo_precios') {
  // Extraer tablas automáticamente
  const tables = await extractTablesFromDocument(extractedText, file.type);
  
  // Guardar tablas en la base de datos
  await saveExtractedTables(orgId, docId, tables);
  
  // Extraer información de precios
  const pricingInfo = await extractPricingInfo(tables);
  await updateCompanyInfo(orgId, { pricing: pricingInfo });
}

if (documentType === 'formulario_a1_identificacion') {
  // Extraer información de contacto
  const contactInfo = await extractContactInfo(extractedText);
  await updateCompanyInfo(orgId, { contact: contactInfo });
}

if (documentType === 'project_portfolio') {
  // Extraer lista de proyectos
  const projects = await extractProjects(extractedText);
  await updateCompanyInfo(orgId, { projects });
}
```

---

## 🎯 Flujo Completo Mejorado

### 1. Usuario Sube Documentos

```
Company Data:
- Formulario A-1 (identificación) → Extrae: nombre, contacto, representante
- Formulario A-4 (precios) → Extrae: tablas de precios, cálculos
- Portafolio de proyectos → Extrae: lista de proyectos con detalles

Tender Documents:
- Anexo 1 (especificaciones técnicas) → Analiza: requisitos, objetivos
- DCD (documento de licitación) → Analiza: requisitos generales

Previous Proposals:
- Propuesta ganadora anterior → Analiza: formato, estructura, secciones
```

### 2. Sistema Procesa y Almacena

```
1. Extrae texto de todos los documentos
2. Identifica y extrae tablas estructuradas
3. Analiza con AI para extraer información clave
4. Almacena en base de datos estructurada
5. Crea vectores de embeddings para búsqueda semántica
```

### 3. Usuario Genera Propuesta

```
1. Click en "Generate Proposal"
2. Sistema recopila:
   - Información de la empresa (de Company Data)
   - Requisitos de la licitación (de Tender Documents)
   - Ejemplos de formato (de Previous Proposals)
   - Tablas extraídas (de todos los documentos)
3. AI genera propuesta que:
   - Usa información real de la empresa
   - Replica formato de propuestas previas
   - Incluye tablas con precios reales
   - Cumple requisitos de la licitación
   - Genera contenido extenso y detallado
```

### 4. Usuario Edita y Mejora

```
1. Revisa en el canvas editor
2. Puede mejorar secciones específicas
3. Puede subir documentos adicionales para contexto
4. AI ajusta basándose en feedback
```

---

## ✅ Checklist de Implementación

### Fase 1: Infraestructura (1-2 días)
- [ ] Crear enum de tipos de documentos extendido
- [ ] Actualizar schema de InstantDB con nuevas tablas
- [ ] Implementar `table-extractor.ts`
- [ ] Implementar `company-info-extractor.ts`

### Fase 2: UI (1 día)
- [ ] Agregar selector de tipo de documento en upload
- [ ] Mostrar información de empresa extraída en dashboard
- [ ] Agregar vista de tablas extraídas

### Fase 3: Procesamiento (2-3 días)
- [ ] Implementar extracción automática al subir documentos
- [ ] Implementar análisis de formularios bolivianos
- [ ] Implementar extracción de tablas de Excel mejorada
- [ ] Implementar actualización de companyInfo

### Fase 4: AI (2-3 días)
- [ ] Actualizar prompt de generate-proposal con nuevo formato
- [ ] Agregar lógica para cargar companyInfo
- [ ] Agregar lógica para cargar extractedTables
- [ ] Agregar lógica para cargar previousProposals
- [ ] Mejorar generación de tablas HTML

### Fase 5: Testing (1-2 días)
- [ ] Probar con los 5 documentos de ejemplo
- [ ] Verificar que extrae información correcta
- [ ] Verificar que genera propuestas con datos reales
- [ ] Verificar que replica formato de tablas

---

## 🎨 Ejemplo de Output Esperado

Cuando el usuario genere una propuesta, debería ver algo como:

```html
<h2>FORMULARIO A-1: IDENTIFICACIÓN DEL OFERENTE</h2>

<table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
  <tr>
    <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">
      NOMBRE Y APELLIDO O RAZÓN SOCIAL DEL OFERENTE/PROPONENTE:
    </td>
    <td style="border: 1px solid #000; padding: 8px;">
      DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">
      NOMBRE DE PERSONA DE CONTACTO
    </td>
    <td style="border: 1px solid #000; padding: 8px;">
      DANIEL RIBERA JUSTINIANO
    </td>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">
      CORREOS ELECTRÓNICOS PARA EFECTUAR NOTIFICACIONES:
    </td>
    <td style="border: 1px solid #000; padding: 8px;">
      gerencia_adm@drj-construcciones.com
    </td>
  </tr>
</table>

<h2>FORMULARIO A-4: MODELO INDICATIVO DE PRECIOS</h2>

<h3>A- MANO DE OBRA</h3>
<h4>1 – Directa</h4>

<table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
  <thead style="background-color: #f0f0f0;">
    <tr>
      <th style="border: 1px solid #000; padding: 8px;">Ítem</th>
      <th style="border: 1px solid #000; padding: 8px;">Función</th>
      <th style="border: 1px solid #000; padding: 8px;">Cantidad de Empleados</th>
      <th style="border: 1px solid #000; padding: 8px;">Bs / día</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-1</td>
      <td style="border: 1px solid #000; padding: 8px;">Maestro Albañil</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">1.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">159.09</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-2</td>
      <td style="border: 1px solid #000; padding: 8px;">Contramaestro</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">2.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">145.45</td>
    </tr>
    <tr>
      <td style="border: 1px solid #000; padding: 8px;">A1-3</td>
      <td style="border: 1px solid #000; padding: 8px;">Ayudante de Albañil</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">4.00</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: right;">136.36</td>
    </tr>
  </tbody>
</table>

<p><strong>Carga Social: 33.39%</strong></p>
```

Este formato debería replicar exactamente los documentos originales de DRJ Construcciones.



