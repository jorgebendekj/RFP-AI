# Mejoras al Modelo de IA - Replicación de Tablas y Análisis de Documentos

## Resumen de Mejoras Implementadas

Se han realizado mejoras significativas en el modelo de IA para que pueda:
1. ✅ Replicar tablas de documentos adjuntos
2. ✅ Analizar información en profundidad
3. ✅ Implementar correctamente los requisitos en las secciones
4. ✅ Extraer y usar datos específicos de documentos

## Cambios Realizados

### 1. **Mejora en Prompts de IA** (`src/app/api/ai/generate-proposal/route.ts`)

#### Nuevas Instrucciones Críticas:

**A. Análisis Profundo de Requisitos:**
- El modelo ahora lee y comprende cada requisito detalladamente
- Extrae información clave: entregables, plazos, especificaciones, cantidades
- Crea secciones que abordan directamente cada requisito con detalles específicos
- Hace referencias cruzadas para asegurar que no se pierda nada

**B. Replicación de Tablas:**
- Si detecta datos tabulares en documentos de referencia, los recrea usando estructura HTML
- Usa estructura HTML adecuada: `<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>`
- Incluye TODAS las filas y columnas de las tablas originales
- Mantiene los mismos encabezados de columna y estructura de datos
- Aplica clases CSS para formato apropiado

**C. Extracción de Datos Específicos:**
- Busca números concretos, porcentajes, fechas, nombres en documentos
- Usa estos datos específicos en la propuesta (no inventa datos)
- Si propuestas previas mencionan miembros del equipo, certificaciones, ejemplos de proyectos - los incluye
- Si hay especificaciones técnicas o estándares mencionados - los replica exactamente

**D. Implementación Correcta de Requisitos:**
Para cada requisito de licitación, crea contenido que muestra:
- Comprensión del requisito
- Cómo se cumplirá (metodología)
- Cuándo se entregará (cronograma)
- Quién lo hará (equipo/recursos)
- Usa detalles específicos, no genéricos

### 2. **Mejora en Prompts de Secciones** (`src/app/api/ai/complete-section/route.ts`)

#### Nuevas Capacidades:

**A. Análisis y Extracción:**
- Lee el contenido actual y contexto adicional exhaustivamente
- Identifica información clave, puntos de datos y requisitos
- Extrae números específicos, fechas, porcentajes, nombres de documentos
- No inventa información - usa lo que se proporciona

**B. Replicación de Tablas desde Contexto:**
- Si ve datos tabulares en el documento de contexto, crea tablas HTML
- Preserva TODAS las filas, columnas, encabezados del original
- Usa estructura HTML apropiada con clases CSS

**C. Especificidad y Concreción:**
- Usa ejemplos específicos del contexto
- Incluye detalles medibles (cantidades, plazos, porcentajes)
- Referencias proyectos concretos, certificaciones o experiencias
- Proporciona especificaciones técnicas cuando están disponibles

### 3. **Mejora en Extracción de Documentos** (`src/lib/file-processor.ts`)

#### Preservación de Estructura de Tablas:

**Antes:**
- Solo extraía texto plano de documentos DOCX
- Se perdía la estructura de las tablas

**Ahora:**
- Usa `mammoth.convertToHtml()` para documentos DOCX con tablas
- Preserva la estructura HTML de las tablas
- Etiqueta el contenido como `[HTML_CONTENT]...[/HTML_CONTENT]`
- Proporciona tanto HTML como texto plano para que la IA pueda procesar ambos

## Ejemplo de Tabla HTML Generada

```html
<table class="border-collapse border border-gray-300 w-full my-4">
  <thead>
    <tr>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Partida</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Descripción</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Cantidad</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Precio Unitario</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-2">1.1</td>
      <td class="border border-gray-300 p-2">Excavación</td>
      <td class="border border-gray-300 p-2">500 m³</td>
      <td class="border border-gray-300 p-2">$25.00</td>
    </tr>
    <tr>
      <td class="border border-gray-300 p-2">1.2</td>
      <td class="border border-gray-300 p-2">Relleno compactado</td>
      <td class="border border-gray-300 p-2">300 m³</td>
      <td class="border border-gray-300 p-2">$30.00</td>
    </tr>
  </tbody>
</table>
```

## Cómo Funciona Ahora

### 1. **Generación de Propuesta:**
1. Usuario carga documentos de licitación y documentos de referencia de la empresa
2. Sistema extrae texto y tablas (preservando estructura HTML)
3. IA analiza requisitos de licitación en profundidad
4. IA extrae tablas y datos de documentos de referencia
5. IA genera propuesta replicando:
   - Estructura de secciones
   - Formato y estilo de escritura
   - **Tablas con datos específicos**
   - Información técnica detallada

### 2. **Mejora de Sección con Documento Adicional:**
1. Usuario hace clic en "Improve" para una sección
2. Usuario adjunta un documento PDF/Excel/Word con información adicional
3. Sistema extrae texto y tablas del documento
4. IA analiza el documento y extrae:
   - Tablas y las replica
   - Datos específicos (números, fechas, nombres)
   - Especificaciones técnicas
   - Ejemplos y referencias
5. IA mejora la sección incorporando toda esta información

## Beneficios

### ✅ **Replicación Precisa:**
- Las tablas de documentos se replican exactamente
- Se mantiene la estructura y formato
- No se pierde información tabular

### ✅ **Análisis Profundo:**
- La IA ahora lee y comprende requisitos en detalle
- Extrae información específica en lugar de generalizar
- Hace referencias cruzadas entre requisitos

### ✅ **Implementación Correcta:**
- Cada requisito se aborda específicamente
- Se proporcionan detalles concretos: qué, cómo, cuándo, quién
- Se usan ejemplos y datos reales de documentos

### ✅ **Datos Específicos:**
- Números, porcentajes, fechas se extraen y usan
- Proyectos anteriores se referencian
- Certificaciones y credenciales se incluyen
- Especificaciones técnicas se replican exactamente

## Limitaciones Actuales y Mejoras Futuras

### Limitaciones:
1. **PDFs con tablas complejas:** La extracción de texto de PDF puede no preservar perfectamente la estructura de tablas complejas (esto es una limitación de la librería pdf-parse)
2. **Imágenes:** Actualmente no se extraen ni replican imágenes de documentos (solo texto y tablas)
3. **Formatos de Excel:** Las hojas de cálculo Excel se convierten a texto, pero podrían beneficiarse de procesamiento especializado

### Mejoras Futuras Recomendadas:
1. **Procesamiento PDF Avanzado:** 
   - Usar `pdf-lib` o `tabula-py` para mejor extracción de tablas de PDFs
   - Detectar y extraer imágenes de PDFs

2. **Procesamiento Excel Mejorado:**
   - Usar `xlsx` library para leer hojas de cálculo directamente
   - Preservar fórmulas y formato de celdas

3. **Extracción de Imágenes:**
   - Extraer imágenes de documentos
   - Usar GPT-4 Vision para analizar imágenes técnicas
   - Referenciar o incluir imágenes relevantes en propuestas

4. **Búsqueda Semántica (RAG):**
   - Actualmente se usan los primeros chunks de documentos
   - Implementar búsqueda vectorial para encontrar los chunks más relevantes
   - Usar embeddings de OpenAI para mejor matching

## Cómo Probar las Mejoras

### Prueba 1: Replicación de Tablas
1. Sube un documento DOCX con una tabla (por ejemplo, lista de precios o cronograma)
2. Márcalo como "Model RFP" o úsalo como contexto adicional
3. Genera una propuesta o mejora una sección
4. **Resultado esperado:** La tabla debe aparecer en el contenido generado con todos sus datos

### Prueba 2: Análisis de Requisitos
1. Sube un documento de licitación con requisitos detallados
2. Parsea los requisitos de licitación
3. Genera una propuesta
4. **Resultado esperado:** Cada requisito debe tener una sección específica que lo aborde con detalles concretos

### Prueba 3: Datos Específicos
1. Sube documentos de empresa con proyectos anteriores, certificaciones, nombres de equipo
2. Genera una propuesta
3. **Resultado esperado:** La propuesta debe incluir nombres específicos, números de proyectos, certificaciones reales (no inventados)

### Prueba 4: Mejora con Contexto Adicional
1. Crea o abre una propuesta
2. Ve a una sección
3. Haz clic en "Attach file for context" y sube un documento con información técnica y/o tablas
4. Escribe una instrucción como "add technical details from the document" o "include the pricing table"
5. Haz clic en "Improve"
6. **Resultado esperado:** La sección debe incluir información del documento, incluyendo tablas si las había

## Soporte Técnico

### Logs de Depuración:
Los logs del servidor mostrarán:
- Cuando se detectan tablas en documentos: `hasTables: true`
- El contenido extraído con etiquetas `[HTML_CONTENT]`
- Errores en el procesamiento de documentos

### Verificar Extracción de Tablas:
Revisa la base de datos:
```javascript
// En InstantDB, verifica documentos:
documents: {
  hasTables: boolean,  // debe ser true si el documento tiene tablas
  textExtracted: string  // debe contener [HTML_CONTENT] si hay tablas
}
```

## Modelo de IA Utilizado

**Modelo Principal:** `gpt-4o` (GPT-4 Omni)
- Usado para generación de propuestas
- Usado para mejora de secciones
- Usado para análisis de estilo de empresa
- Soporta JSON estructurado
- Excelente comprensión de contexto
- Capaz de seguir instrucciones complejas

**Modelo de Embeddings:** `text-embedding-3-small`
- Usado para crear vectores de chunks de documentos
- Permite búsqueda semántica futura

## Conclusión

El modelo de IA ahora está significativamente mejorado para:
- ✅ Replicar tablas y estructura de documentos
- ✅ Analizar información en profundidad
- ✅ Implementar requisitos correctamente con detalles específicos
- ✅ Usar datos reales en lugar de información genérica

Estas mejoras deberían resultar en propuestas más precisas, detalladas y profesionales que replican fielmente el formato y datos de los documentos de referencia.


