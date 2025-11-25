# 🚀 Plan de Implementación - Mejoras del AI Agent

## ✅ Completado (24 Nov 2024)

### 1. Análisis Completo de Documentos
- ✅ Analicé los 5 documentos de ejemplo de DRJ Construcciones
- ✅ Identifiqué la estructura exacta de cada formulario
- ✅ Extraje información clave (empresa, precios, tablas, contactos)
- ✅ Documenté el formato esperado en `AI_AGENT_ANALYSIS_AND_IMPROVEMENTS.md`

### 2. Sistema de Tipos de Documentos
- ✅ Creado `src/lib/document-types.ts` con enum extendido
- ✅ 20+ tipos de documentos organizados en categorías
- ✅ Detección automática de tipo basada en nombre de archivo y contenido
- ✅ Soporte para formularios bolivianos RUPE (A-1, A-3, A-4, B-2, B-3, Anexo 1)

### 3. Extractor de Tablas
- ✅ Creado `src/lib/table-extractor.ts`
- ✅ Extracción de tablas de Excel (XLSX, XLS, XLSM)
- ✅ Extracción de tablas HTML (de DOCX procesados con mammoth)
- ✅ Extracción de tablas ASCII y Markdown
- ✅ Detección de metadatos (moneda, cálculos, totales)
- ✅ Formato de salida en HTML y Markdown

## 📋 Pendiente de Implementación

### Fase 1: Procesamiento de Documentos (Prioridad ALTA)

#### 1.1 Actualizar Upload de Documentos
**Archivo:** `src/app/dashboard/documents/page.tsx`

**Cambios:**
```typescript
// Agregar selector de tipo de documento
<Label htmlFor="document-type">Tipo de Documento</Label>
<select id="document-type" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
  <optgroup label="Datos de la Empresa">
    <option value="company_profile">Perfil de la Empresa</option>
    <option value="price_table">Tabla de Precios</option>
    <option value="project_portfolio">Portafolio de Proyectos</option>
    <option value="team_cvs">CVs del Equipo</option>
  </optgroup>
  <optgroup label="Documentos de Licitación">
    <option value="tender_document">Documento de Licitación</option>
    <option value="formulario_a1_identificacion">Formulario A-1 (Identificación)</option>
    <option value="formulario_a3_propuesta_economica">Formulario A-3 (Propuesta Económica)</option>
    <option value="formulario_a4_modelo_precios">Formulario A-4 (Modelo de Precios)</option>
  </optgroup>
  <optgroup label="Ejemplos de Propuestas">
    <option value="previous_proposal">Propuesta Previa</option>
  </optgroup>
</select>
```

#### 1.2 Actualizar API de Upload
**Archivo:** `src/app/api/documents/upload/route.ts`

**Cambios:**
1. Aceptar `documentType` en el body del request
2. Llamar a `detectDocumentType()` si no se proporciona tipo
3. Guardar tipo en la base de datos
4. Después de guardar, llamar a `processDocumentIntelligently()`

```typescript
import { DocumentType, detectDocumentType } from '@/lib/document-types';
import { extractTablesFromDocument } from '@/lib/table-extractor';

// Después de procesar el documento
const detectedType = documentType || detectDocumentType(file.name, extractedText);

// Guardar en DB con tipo
await db.tx.documents[newDocId].update({
  documentType: detectedType
});

// Procesar según tipo
await processDocumentIntelligently(newDocId, detectedType, extractedText, fileBuffer);
```

#### 1.3 Crear Procesador Inteligente
**Nuevo archivo:** `src/lib/intelligent-document-processor.ts`

**Función:**
```typescript
export async function processDocumentIntelligently(
  documentId: string,
  documentType: DocumentType,
  textContent: string,
  fileBuffer: Buffer
) {
  // Extraer tablas
  const tables = await extractTablesFromDocument(fileBuffer, '...', '...');
  
  // Guardar tablas en DB
  await saveExtractedTables(documentId, tables);
  
  // Procesar según tipo específico
  switch (documentType) {
    case DocumentType.FORMULARIO_A1:
      await extractContactInfo(documentId, textContent);
      break;
    case DocumentType.FORMULARIO_A4:
      await extractPricingInfo(documentId, tables);
      break;
    case DocumentType.PROJECT_PORTFOLIO:
      await extractProjects(documentId, textContent);
      break;
  }
}
```

### Fase 2: Schema de Base de Datos (Prioridad ALTA)

**Actualizar:** `instantdb schema`

**Agregar tablas:**

```javascript
// Company information extracted from documents
companyInfo: {
  organization: ref('organizations'),
  data: {
    name: 'string',
    representative: 'string',
    contactPerson: 'string',
    address: 'string',
    city: 'string',
    country: 'string',
    phones: 'json', // string[]
    email: 'string',
  },
  updatedAt: 'date'
},

// Extracted tables from documents
extractedTables: {
  document: ref('documents'),
  data: {
    title: 'string',
    headers: 'json', // string[]
    rows: 'json', // string[][]
    metadata: 'json',
  },
  createdAt: 'date'
},

// Pricing information
pricingInfo: {
  organization: ref('organizations'),
  data: {
    laborDirect: 'json', // Array<{position, quantity, dailyRate}>
    laborIndirect: 'json',
    socialChargePercent: 'number',
    materials: 'json',
  },
  updatedAt: 'date'
},

// Project portfolio
projects: {
  organization: ref('organizations'),
  data: {
    name: 'string',
    client: 'string',
    description: 'string',
    value: 'number',
    currency: 'string',
    year: 'number',
    status: 'string',
  },
  createdAt: 'date'
},

// Team members
teamMembers: {
  organization: ref('organizations'),
  data: {
    name: 'string',
    position: 'string',
    experience: 'string',
    education: 'string',
    certifications: 'json',
  },
  createdAt: 'date'
}
```

### Fase 3: Mejora de Prompts AI (Prioridad CRÍTICA)

#### 3.1 Actualizar Generate Proposal
**Archivo:** `src/app/api/ai/generate-proposal/route.ts`

**Cambios Principales:**

1. **Cargar información estructurada de la empresa:**
```typescript
// Cargar companyInfo
const companyInfoData = await db.query({
  companyInfo: {
    $: {
      where: {
        organization: tenderId.organizationId
      }
    }
  }
});

// Cargar tablas extraídas de documentos relevantes
const extractedTablesData = await db.query({
  extractedTables: {
    document: {
      $: {
        where: {
          tenderId: tenderId
        }
      }
    }
  }
});

// Cargar proyectos
const projectsData = await db.query({
  projects: {
    $: {
      where: {
        organization: tenderId.organizationId
      }
    }
  }
});
```

2. **Mejorar el prompt con información estructurada:**
```typescript
const enhancedPrompt = `
# INFORMACIÓN DE LA EMPRESA (USAR EXACTAMENTE)

## Datos de Contacto
- **Nombre de la Empresa**: ${companyInfo.data.name}
- **Representante Legal**: ${companyInfo.data.representative}
- **Persona de Contacto**: ${companyInfo.data.contactPerson}
- **Dirección**: ${companyInfo.data.address}
- **Ciudad**: ${companyInfo.data.city}, ${companyInfo.data.country}
- **Teléfonos**: ${companyInfo.data.phones.join(', ')}
- **Email**: ${companyInfo.data.email}

## Tablas de Precios y Recursos
${extractedTables.map(table => formatTableAsHTML(table)).join('\n\n')}

## Proyectos de Referencia
${projects.map(p => `
- **${p.data.name}**
  - Cliente: ${p.data.client}
  - Valor: ${p.data.value} ${p.data.currency}
  - Año: ${p.data.year}
  - Descripción: ${p.data.description}
`).join('\n')}

---

# INSTRUCCIONES CRÍTICAS

1. **USA LOS DATOS EXACTOS DE LA EMPRESA**:
   - NO inventes nombres, usa "${companyInfo.data.name}"
   - NO inventes contactos, usa "${companyInfo.data.contactPerson}"
   - NO inventes emails, usa "${companyInfo.data.email}"
   
2. **REPLICA LAS TABLAS EXACTAMENTE**:
   - Usa las tablas proporcionadas arriba
   - Mantén la estructura HTML
   - Usa los precios reales
   
3. **MENCIONA PROYECTOS REALES**:
   - Referencia proyectos de la lista de arriba
   - Usa nombres de clientes reales
   - Usa valores y años correctos

4. **FORMATO HTML**:
   - Usa <table> con estilos inline para tablas
   - Usa <strong> para negritas (NO **)
   - Usa <h2>, <h3> para títulos
   
5. **CONTENIDO EXTENSO**:
   - Mínimo 4-6 párrafos por sección
   - Incluye datos cuantitativos específicos
   - Proporciona detalles técnicos relevantes

6. **TERMINOLOGÍA ESPECÍFICA**:
   - Usa términos exactos de la licitación: "${tenderRequirements.objective}"
   - Mantén nombres técnicos en español
   - Usa convenciones bolivianas cuando aplique

# GENERA LA PROPUESTA AHORA:
`;
```

### Fase 4: UI/UX Mejoras (Prioridad MEDIA)

#### 4.1 Dashboard de Información Empresarial
**Nuevo archivo:** `src/app/dashboard/company-info/page.tsx`

**Características:**
- Vista de información de contacto extraída
- Vista de tablas de precios
- Lista de proyectos
- Lista de equipo
- Botón para editar información manualmente

#### 4.2 Vista de Tablas Extraídas
**Componente:** `src/components/extracted-tables-viewer.tsx`

**Características:**
- Mostrar tablas extraídas de cada documento
- Editar tablas manualmente si AI cometió errores
- Marcar tablas como "verificadas"

### Fase 5: Testing y Validación (Prioridad ALTA)

#### Test 1: Upload y Procesamiento
1. Subir los 5 documentos de DRJ Construcciones
2. Verificar que se detectan los tipos correctamente:
   - Formulario A-1 → `formulario_a1_identificacion`
   - Formulario A-3 → `formulario_a3_propuesta_economica`
   - Formulario A-4 → `formulario_a4_modelo_precios`
   - Anexo 1 → `anexo_1_especificaciones`
3. Verificar que se extraen tablas:
   - De Formulario A-3: Tabla de items
   - De Formulario A-4: Tablas de mano de obra directa e indirecta
4. Verificar que se extrae información de empresa:
   - Nombre: "DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES"
   - Contacto: "Daniel Ribera Justiniano"
   - Email: "gerencia_adm@drj-construcciones.com"

#### Test 2: Generación de Propuesta
1. Crear un nuevo tender
2. Vincular los 5 documentos
3. Generar propuesta
4. Verificar que la propuesta contiene:
   - ✅ Nombre real de la empresa
   - ✅ Contacto real
   - ✅ Email real
   - ✅ Tablas replicadas con formato HTML
   - ✅ Precios correctos (Maestro Albañil: 159.09 Bs/día, etc.)
   - ✅ Referencias a proyectos reales (si están en los docs)
   - ✅ Carga social: 33.39%

#### Test 3: Mejora de Secciones
1. Usar botón "Improve" en una sección
2. Subir documento adicional con contexto
3. Verificar que el AI mejora con datos del documento
4. Verificar que mantiene el formato HTML

## 📊 Estimación de Tiempo

| Fase | Tareas | Tiempo Estimado |
|------|--------|-----------------|
| Fase 1 | Procesamiento de Documentos | 2-3 días |
| Fase 2 | Schema de Base de Datos | 1 día |
| Fase 3 | Mejora de Prompts AI | 2-3 días |
| Fase 4 | UI/UX Mejoras | 2 días |
| Fase 5 | Testing y Validación | 1-2 días |
| **TOTAL** | | **8-11 días** |

## 🎯 Próximos Pasos Inmediatos

1. **Actualizar schema de InstantDB** con las nuevas tablas
2. **Implementar `intelligent-document-processor.ts`**
3. **Actualizar la página de upload de documentos** con selector de tipos
4. **Modificar el API de upload** para usar el nuevo sistema
5. **Probar con los 5 documentos de DRJ** para verificar extracción

## 💡 Recomendaciones

1. **Empezar con Fase 1 y 2**: Sin esto, no podemos almacenar la información estructurada
2. **Priorizar Fase 3**: Los prompts mejorados son críticos para la calidad del output
3. **Iterar con tests reales**: Usar los documentos de DRJ para validar cada mejora
4. **Documentar casos edge**: Algunos documentos pueden tener formatos inesperados

## 📝 Notas Importantes

- **Backup de datos**: Antes de cambiar el schema, hacer backup de la DB
- **Versionado**: Mantener compatibilidad con documentos ya subidos
- **Performance**: Procesar documentos de forma asíncrona para no bloquear UI
- **Costos de AI**: Las llamadas adicionales a OpenAI aumentarán costos, considerar cache

---

**Última actualización**: 24 de noviembre de 2025

**Creado por**: AI Assistant (Claude Sonnet 4.5)

**Para**: Jorge Bendek (DRJ / RFP AI Project)



