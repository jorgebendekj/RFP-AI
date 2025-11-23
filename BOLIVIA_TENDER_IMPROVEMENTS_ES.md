# Mejoras Especializadas para Licitaciones Bolivianas (Sistema RUPE)

## 🎯 Resumen

He analizado tus documentos y he implementado mejoras ESPECÍFICAS para licitaciones bolivianas del Sistema RUPE (Registro Único de Proveedores del Estado). El agente de IA ahora reconoce automáticamente los formularios estándar bolivianos y genera propuestas siguiendo el formato correcto.

## 📋 Documentos Bolivianos Detectados en Tu Sistema

Basándome en los archivos que subiste, veo que tienes:

1. **FORMULARIO A-1** - Identificación del Oferente
   - Contiene: Nombre empresa, NIT, representante legal, dirección, contacto
   - **Uso**: Portada y encabezados de la propuesta

2. **FORMULARIO B-2** - Experiencia de la Empresa  
   - Contiene: Proyectos anteriores similares con detalles
   - **Uso**: Sección de experiencia con proyectos específicos

3. **FORMULARIO B-3** - Experiencia del Personal (Angélica)
   - Contiene: Curriculum del equipo técnico, certificaciones
   - **Uso**: Tabla del equipo con nombres y calificaciones reales

4. **ANEXO 1** - Especificaciones Técnicas
   - Contiene: Requisitos técnicos y normas aplicables
   - **Uso**: Metodología técnica y cumplimiento de especificaciones

5. **proposal_62a9af93...** - Propuesta anterior (referencia)
   - **Uso**: Ejemplo de formato y estructura

## ✨ Nuevas Funcionalidades

### 1. Detección Automática de Formularios RUPE

He creado un analizador especializado (`bolivia-tender-analyzer.ts`) que:

✅ **Identifica automáticamente** el tipo de formulario por nombre:
- Formulario A-1, A-3, A-4
- Formulario B-2, B-3
- Anexos técnicos

✅ **Analiza el contenido** y detecta:
- Información de empresa (NIT, razón social)
- Información de equipo (nombres, cargos, certificaciones)
- Proyectos anteriores
- Tablas de precios
- Tablas en general

✅ **Genera instrucciones específicas** para cada tipo de formulario

### 2. Instrucciones Especializadas por Formulario

El sistema ahora da instrucciones específicas a la IA para cada tipo de documento:

#### FORMULARIO A-1 (Identificación):
```
DEBE extraer:
- Nombre EXACTO de la empresa
- NIT
- Representante Legal con nombre completo
- Dirección, teléfono, correo
- Usar esta info en portada, encabezados y firma
```

#### FORMULARIO B-2 (Experiencia Empresa):
```
DEBE extraer:
- Lista COMPLETA de proyectos similares
- Para cada proyecto: nombre, cliente, ubicación, monto, año
- Usar estos proyectos específicos (NO inventar)
```

#### FORMULARIO B-3 (Experiencia Personal):
```
DEBE extraer:
- Nombre COMPLETO de cada miembro
- Cargo específico
- Formación académica y certificaciones
- Crear tabla completa del equipo
```

### 3. Estructura de Propuesta Boliviana

El sistema ahora sigue la estructura estándar de propuestas bolivianas:

```
1. PORTADA
   - Nombre del proyecto
   - Código de licitación
   - Cliente (entidad pública)
   - Empresa oferente
   - Fecha

2. ÍNDICE

3. IDENTIFICACIÓN DEL OFERENTE (Formulario A-1)
   
4. EXPERIENCIA DE LA EMPRESA (Formulario B-2)
   - Tabla con proyectos anteriores

5. EXPERIENCIA DEL PERSONAL (Formulario B-3)
   - Tabla completa del equipo

6. PROPUESTA TÉCNICA
   - Comprensión del proyecto
   - Metodología
   - Cronograma
   - Plan de trabajo

7. PROPUESTA ECONÓMICA (Formulario A-3)
   - Tabla de precios completa

8. ANEXOS
```

### 4. Soporte para Archivos Excel

Ahora puedes subir archivos Excel (.xls, .xlsx, .xlsm) para:
- FORMULARIO A-3 - Propuesta Económica
- FORMULARIO A-4 - Modelo Indicativo de Precios
- Cualquier tabla de precios o datos

## 📊 Ejemplo de Mejoras en la Generación

### ANTES (Sin mejoras específicas):
```
La empresa cuenta con amplia experiencia en proyectos similares...

El equipo está conformado por profesionales calificados...
```

### AHORA (Con mejoras para Bolivia):
```
IDENTIFICACIÓN DEL OFERENTE

Razón Social: DRJ Construcciones y Servicios Ambientales
NIT: [número exacto del Formulario A-1]
Representante Legal: [nombre completo del documento]
Dirección: [dirección exacta del documento]
Teléfono: [teléfono del documento]
Correo: [correo del documento]

---

EXPERIENCIA DE LA EMPRESA

A continuación se detallan los proyectos similares ejecutados por 
DRJ Construcciones:

<table>
  <thead>
    <tr>
      <th>PROYECTO</th>
      <th>CLIENTE</th>
      <th>UBICACIÓN</th>
      <th>MONTO (Bs.)</th>
      <th>AÑO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[Proyecto real del Formulario B-2]</td>
      <td>[Cliente real]</td>
      <td>[Ubicación real]</td>
      <td>[Monto real]</td>
      <td>[Año real]</td>
    </tr>
    <!-- Más proyectos del documento -->
  </tbody>
</table>

---

EXPERIENCIA DEL PERSONAL

<table>
  <thead>
    <tr>
      <th>NOMBRE</th>
      <th>CARGO</th>
      <th>FORMACIÓN</th>
      <th>EXPERIENCIA</th>
      <th>CERTIFICACIONES</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Angélica [Apellido del Formulario B-3]</td>
      <td>[Cargo específico]</td>
      <td>[Título académico real]</td>
      <td>[Años específicos]</td>
      <td>[Certificaciones reales]</td>
    </tr>
    <!-- Más miembros del equipo -->
  </tbody>
</table>
```

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`src/lib/bolivia-tender-analyzer.ts`**
   - Analizador especializado para documentos bolivianos
   - Identificación automática de formularios
   - Generación de instrucciones específicas
   - 320+ líneas de código especializado

### Archivos Modificados:
1. **`src/app/api/ai/generate-proposal/route.ts`**
   - Integración del analizador boliviano
   - Detección automática de formularios
   - Instrucciones especializadas en el prompt
   - Logs detallados del análisis

2. **`src/app/dashboard/documents/page.tsx`**
   - Soporte para subir archivos Excel
   - Accept: .xls, .xlsx, .xlsm

## 🎬 Cómo Usar las Mejoras

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Reiniciar Servidor
```bash
npm run dev
```

### Paso 3: Subir Documentos Excel (Si tienes)
Si tienes FORMULARIO A-3 o A-4 en Excel:
1. Ve a **Documentos**
2. Selecciona tipo "Tender Document" o "Company Data"
3. Sube el archivo Excel
4. Espera que se procese

### Paso 4: Generar Nueva Propuesta
1. Ve a la licitación YPFB 4
2. Haz clic en **"Generar propuesta"**
3. Observa los logs en el terminal

### Paso 5: Verificar Logs

En el terminal deberías ver:
```
📋 Document: FORMULARIO A-1 RG-366-A-PG-1-GCO-21 IDENTIFICACIÓN OFERENTE REV01.DOCX
   Type: A-1
   Has Company Info: true
   Has Team Info: false
   Has Projects: false
   Has Tables: false

📋 Document: 4. FORMULARIO B-2 EXPERIENCIA EMPRESA.docx
   Type: B-2
   Has Company Info: false
   Has Team Info: false
   Has Projects: true
   Has Tables: true

📋 Document: 5. FORMULARIO B-3 EXPERIENCIA ANGELICA.docx
   Type: B-3
   Has Company Info: false
   Has Team Info: true
   Has Projects: false
   Has Tables: true

✅ Generated Bolivian tender-specific instructions
```

## 🎯 Qué Esperar en la Propuesta

### Portada:
```
PROPUESTA TÉCNICO-ECONÓMICA

PARA:
[Nombre del Cliente - del tender]

OBJETO:
[Título del proyecto]

PRESENTADA POR:
DRJ Construcciones y Servicios Ambientales
NIT: [del Formulario A-1]

REPRESENTANTE LEGAL:
[Nombre del Formulario A-1]

[Fecha]
```

### Sección de Experiencia Empresa:
- ✅ Tabla con proyectos reales del Formulario B-2
- ✅ Nombres específicos de proyectos, NO genéricos
- ✅ Clientes, montos y ubicaciones reales
- ✅ Años específicos

### Sección de Equipo:
- ✅ Tabla con todo el equipo del Formulario B-3
- ✅ Nombres completos (ej: "Angélica [Apellido]")
- ✅ Cargos específicos
- ✅ Formación académica real
- ✅ Certificaciones específicas

### Propuesta Económica (si subes Excel):
- ✅ Tabla completa de precios
- ✅ Todos los items
- ✅ Formato Bs. (Bolivianos)
- ✅ Subtotales y totales

## 📝 Reglas Críticas Implementadas

El sistema ahora asegura que:

1. ✅ **NUNCA inventa** nombres de empresas, personas o proyectos
2. ✅ **SIEMPRE usa datos exactos** de los formularios
3. ✅ **Replica tablas completas** si existen en documentos
4. ✅ **Mantiene formato boliviano** (fechas DD/MM/YYYY, moneda Bs.)
5. ✅ **Usa lenguaje formal** en español
6. ✅ **Sigue estructura RUPE** estándar

## 🚀 Mejoras Futuras Sugeridas

Para mejorar aún más el sistema:

1. **Validación de Completitud**:
   - Verificar que todos los formularios obligatorios estén presentes
   - Alert si falta A-1, B-2 o B-3

2. **Extracción Estructurada**:
   - Pre-extraer datos en formato JSON antes de enviar a IA
   - Ej: `{ empresa: "DRJ", nit: "123456", representante: "Juan Pérez" }`

3. **Templates por Tipo de Licitación**:
   - Obras Civiles
   - Consultoría
   - Bienes y Servicios

4. **Verificación de Coherencia**:
   - Verificar que el nombre de empresa es consistente en toda la propuesta
   - Validar que montos y totales son correctos

5. **Generación de Formularios**:
   - Generar automáticamente los formularios RUPE en formato correcto
   - Rellenar con datos de la empresa

## 🐛 Troubleshooting

### Problema: No detecta el tipo de formulario
**Solución**: Asegúrate que el nombre del archivo incluya:
- "FORMULARIO A-1" o "IDENTIFICACIÓN"
- "FORMULARIO B-2" o "EXPERIENCIA EMPRESA"
- "FORMULARIO B-3" o "EXPERIENCIA" + nombre persona

### Problema: No extrae datos específicos
**Verificar**:
1. El documento está "Processed" (no "Error")
2. Los logs muestran que detectó el tipo correcto
3. El contenido extraído incluye la información esperada

### Problema: La propuesta sigue siendo genérica
**Posibles causas**:
1. Documentos no vinculados correctamente a la licitación
2. Formularios están vacíos o mal formateados
3. Necesitas generar una NUEVA propuesta (no editar la anterior)

## 📚 Documentación de Referencia

- **Sistema RUPE Bolivia**: Registro Único de Proveedores del Estado
- **Formularios Estándar**: A-1, A-3, A-4, B-2, B-3
- **Formato de Moneda**: Bolivianos (Bs.)
- **Idioma**: Español formal
- **Fecha**: Formato DD/MM/YYYY

## ✅ Conclusión

El sistema ahora está especializado para licitaciones bolivianas y:

- ✅ Reconoce automáticamente formularios RUPE
- ✅ Extrae información específica de cada formulario
- ✅ Genera propuestas siguiendo estructura boliviana
- ✅ Usa datos reales de DRJ Construcciones
- ✅ Replica tablas de experiencia y precios
- ✅ Mantiene formato profesional boliviano

**Próximo paso**: Genera una nueva propuesta para YPFB 4 y verifica que incluya todos los datos específicos de DRJ Construcciones extraídos de los formularios!


