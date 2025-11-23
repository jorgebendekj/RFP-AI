/**
 * Analizador especializado para documentos de licitaciones bolivianas (Sistema RUPE)
 * 
 * Este módulo identifica y estructura información de formularios estándar bolivianos
 */

export interface BoliviaTenderDocument {
  type: 'A-1' | 'A-3' | 'A-4' | 'B-2' | 'B-3' | 'ANEXO' | 'UNKNOWN';
  detectedName: string;
  originalFileName: string;
  content: string;
}

export interface CompanyInfo {
  nombreEmpresa?: string;
  nit?: string;
  representanteLegal?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
}

export interface TeamMember {
  nombre: string;
  cargo: string;
  especialidad?: string;
  experiencia?: string;
  certificaciones?: string[];
  formacionAcademica?: string;
  proyectosRelevantes?: string[];
}

export interface ProjectExperience {
  nombreProyecto: string;
  cliente?: string;
  ubicacion?: string;
  monto?: string;
  duracion?: string;
  descripcion?: string;
  año?: string;
}

/**
 * Identifica el tipo de formulario basándose en el nombre del archivo
 */
export function identifyBoliviaFormType(fileName: string): BoliviaTenderDocument['type'] {
  const upperName = fileName.toUpperCase();
  
  if (upperName.includes('FORMULARIO A-1') || upperName.includes('IDENTIFICACIÓN') || upperName.includes('OFERENTE')) {
    return 'A-1';
  }
  
  if (upperName.includes('FORMULARIO A-3') || upperName.includes('PROPUESTA ECONÓMICA') || upperName.includes('PROPUESTA ECONOMICA')) {
    return 'A-3';
  }
  
  if (upperName.includes('FORMULARIO A-4') || upperName.includes('MODELO INDICATIVO') || upperName.includes('PRECIOS')) {
    return 'A-4';
  }
  
  if (upperName.includes('FORMULARIO B-2') || upperName.includes('EXPERIENCIA') && upperName.includes('EMPRESA')) {
    return 'B-2';
  }
  
  if (upperName.includes('FORMULARIO B-3') || upperName.includes('EXPERIENCIA') && (upperName.includes('PERSONAL') || upperName.includes('ANGELICA') || upperName.includes('JEFE'))) {
    return 'B-3';
  }
  
  if (upperName.includes('ANEXO') || upperName.includes('ESPECIFICACIONES') || upperName.includes('TÉCNICAS')) {
    return 'ANEXO';
  }
  
  return 'UNKNOWN';
}

/**
 * Obtiene el nombre descriptivo del formulario
 */
export function getFormName(type: BoliviaTenderDocument['type']): string {
  switch (type) {
    case 'A-1':
      return 'FORMULARIO A-1: Identificación del Oferente';
    case 'A-3':
      return 'FORMULARIO A-3: Propuesta Económica';
    case 'A-4':
      return 'FORMULARIO A-4: Modelo Indicativo de Precios';
    case 'B-2':
      return 'FORMULARIO B-2: Experiencia de la Empresa';
    case 'B-3':
      return 'FORMULARIO B-3: Experiencia del Personal';
    case 'ANEXO':
      return 'ANEXO: Especificaciones Técnicas';
    default:
      return 'Documento';
  }
}

/**
 * Obtiene instrucciones específicas para el tipo de formulario
 */
export function getFormInstructions(type: BoliviaTenderDocument['type']): string {
  switch (type) {
    case 'A-1':
      return `Este documento contiene la identificación del oferente. DEBE extraer:
- Nombre EXACTO de la empresa (ej: "DRJ Construcciones y Servicios Ambientales")
- NIT
- Representante Legal con nombre completo
- Dirección física
- Teléfono y correo electrónico
- Usar esta información en TODA la propuesta (portada, encabezados, firma)`;
      
    case 'A-3':
      return `Este documento contiene la propuesta económica. DEBE:
- Replicar la tabla COMPLETA de precios con TODOS los items
- Incluir TODAS las columnas: Item, Descripción, Unidad, Cantidad, Precio Unitario, Precio Total
- Mantener subtotales y total general
- Usar formato de moneda boliviano (Bs.)
- NO inventar precios - usar solo los del documento`;
      
    case 'A-4':
      return `Este documento contiene el modelo indicativo de precios. DEBE:
- Replicar tabla de precios unitarios
- Incluir análisis de precios si está presente
- Mantener estructura de costos desglosados`;
      
    case 'B-2':
      return `Este documento contiene la experiencia de la empresa. DEBE extraer:
- Lista COMPLETA de proyectos similares anteriores
- Para cada proyecto: nombre, cliente, ubicación, monto, duración, año
- Usar estos proyectos específicos en la sección de experiencia
- NO inventar proyectos - usar solo los listados`;
      
    case 'B-3':
      return `Este documento contiene el curriculum del personal. DEBE extraer:
- Nombre COMPLETO de cada miembro del equipo
- Cargo específico (ej: "Jefe de Obra", "Supervisor", "Ingeniero Residente")
- Años de experiencia en el área
- Formación académica (títulos, universidades)
- Certificaciones específicas
- Proyectos relevantes donde participó
- Crear tabla completa del equipo en la propuesta`;
      
    case 'ANEXO':
      return `Este documento contiene especificaciones técnicas. DEBE:
- Extraer requisitos técnicos específicos
- Identificar normas y estándares mencionados
- Usar estas especificaciones al describir la metodología técnica`;
      
    default:
      return 'Extraer toda información relevante del documento';
  }
}

/**
 * Genera instrucciones de prompt específicas para documentos bolivianos
 */
export function generateBolivianTenderPromptInstructions(documents: BoliviaTenderDocument[]): string {
  const docsByType = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, BoliviaTenderDocument[]>);
  
  let instructions = `
DOCUMENTOS DE LICITACIÓN BOLIVIANA DETECTADOS:
===============================================

Estos son documentos del Sistema RUPE (Registro Único de Proveedores del Estado) de Bolivia.
Cada formulario tiene un propósito específico y DEBE ser procesado correctamente:

`;

  // Add specific instructions for each detected form type
  Object.keys(docsByType).forEach(type => {
    const formType = type as BoliviaTenderDocument['type'];
    const docs = docsByType[type];
    
    instructions += `\n📋 ${getFormName(formType)}`;
    instructions += `\n   Archivos: ${docs.map(d => d.originalFileName).join(', ')}`;
    instructions += `\n   ${getFormInstructions(formType)}`;
    instructions += `\n`;
  });
  
  instructions += `
ESTRUCTURA DE PROPUESTA BOLIVIANA REQUERIDA:
============================================

La propuesta DEBE seguir este orden de secciones (usar nombres en español):

1. PORTADA
   - Nombre del proyecto
   - Código de licitación
   - Cliente (entidad pública)
   - Nombre COMPLETO de la empresa (del Formulario A-1)
   - Fecha

2. ÍNDICE
   - Lista de todas las secciones con números de página

3. IDENTIFICACIÓN DEL OFERENTE (Formulario A-1)
   - Usar información EXACTA del Formulario A-1
   - Incluir razón social, NIT, representante legal
   - Datos de contacto

4. EXPERIENCIA DE LA EMPRESA (Formulario B-2)
   - Tabla con proyectos similares anteriores
   - Usar proyectos ESPECÍFICOS del documento
   - Incluir: nombre proyecto, cliente, monto, duración, ubicación

5. EXPERIENCIA DEL PERSONAL (Formulario B-3)
   - Tabla completa del equipo técnico
   - Usar nombres REALES y cargos específicos
   - Incluir formación, experiencia, certificaciones

6. PROPUESTA TÉCNICA
   - Comprensión del proyecto
   - Metodología de trabajo
   - Cronograma de actividades
   - Plan de trabajo

7. PROPUESTA ECONÓMICA (Formulario A-3)
   - Tabla COMPLETA de precios
   - Todos los items con descripción, unidad, cantidad, precio
   - Total en Bolivianos

8. ANEXOS
   - Documentos de respaldo
   - Certificados
   - Referencias

REGLAS CRÍTICAS:
===============
1. NUNCA inventar nombres de empresas, personas o proyectos
2. SIEMPRE usar datos exactos de los formularios
3. Si hay tabla en el documento, REPLICARLA COMPLETA
4. Mantener formato profesional boliviano
5. Usar moneda Bolivianos (Bs.)
6. Fechas en formato DD/MM/YYYY
7. Lenguaje formal en español
`;

  return instructions;
}

/**
 * Analiza el contenido de un documento para determinar si contiene información específica
 */
export function analyzeDocumentContent(content: string, fileName: string): {
  hasCompanyInfo: boolean;
  hasTeamInfo: boolean;
  hasProjects: boolean;
  hasPricing: boolean;
  hasTables: boolean;
  type: BoliviaTenderDocument['type'];
} {
  const type = identifyBoliviaFormType(fileName);
  const upperContent = content.toUpperCase();
  
  return {
    type,
    hasCompanyInfo: upperContent.includes('NIT') || upperContent.includes('RAZÓN SOCIAL') || upperContent.includes('REPRESENTANTE LEGAL'),
    hasTeamInfo: upperContent.includes('CURRICULUM') || upperContent.includes('EXPERIENCIA PROFESIONAL') || upperContent.includes('FORMACIÓN'),
    hasProjects: upperContent.includes('PROYECTO') && (upperContent.includes('CLIENTE') || upperContent.includes('MONTO')),
    hasPricing: upperContent.includes('PRECIO') && (upperContent.includes('UNITARIO') || upperContent.includes('TOTAL')),
    hasTables: content.includes('<table>') || content.includes('|') || content.includes('\t'),
  };
}


