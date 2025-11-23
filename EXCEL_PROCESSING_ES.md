# Procesamiento de Archivos Excel - Tablas de Precios y Formularios

## Resumen

Se ha agregado procesamiento completo de archivos Excel (.xls, .xlsx, .xlsm) para extraer tablas de:
- Propuestas Económicas (FORMULARIO A-3)
- Modelos Indicativos de Precios (FORMULARIO A-4)
- Cualquier otro formulario en Excel con tablas

## Archivos Modificados

### 1. **`package.json`**
Agregadas dependencias:
```json
"xlsx": "^0.18.5",           // Librería para procesar Excel
"@types/xlsx": "^0.0.36"     // Tipos TypeScript
```

### 2. **`src/lib/file-processor.ts`**
Agregado procesamiento de Excel:

```typescript
import * as XLSX from 'xlsx';

// Detecta archivos Excel por MIME type:
// - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (.xlsx)
// - application/vnd.ms-excel (.xls)
// - application/vnd.ms-excel.sheet.macroEnabled.12 (.xlsm)

// Por cada hoja de cálculo:
// 1. Convierte a HTML para preservar estructura de tabla
// 2. Convierte a texto plano
// 3. Etiqueta cada hoja con su nombre
```

### 3. **`src/app/api/documents/extract-text/route.ts`**
Actualizado para retornar:
- Texto extraído con HTML de tablas
- Flag `hasTables: true` para Excel
- Metadatos incluyendo nombres de hojas

## Cómo Funciona

### Procesamiento de Excel

Cuando subes un archivo Excel:

1. **Lectura del Workbook**:
   - Se lee todo el archivo Excel con todas sus hojas
   - Se obtienen los nombres de todas las hojas

2. **Procesamiento por Hoja**:
   Para cada hoja de cálculo:
   ```
   === SHEET: PROPUESTA ECONOMICA ===
   <table>
     <tr><td>Item</td><td>Descripción</td><td>Cantidad</td><td>Precio</td></tr>
     <tr><td>1.1</td><td>Excavación</td><td>500 m³</td><td>$25.00</td></tr>
     ...
   </table>
   === END SHEET ===
   ```

3. **Formato de Salida**:
   ```
   [HTML_CONTENT]
   === SHEET: FORMULARIO A-3 ===
   <table> ... tabla HTML completa ... </table>
   === END SHEET ===
   
   === SHEET: FORMULARIO A-4 ===
   <table> ... tabla HTML completa ... </table>
   === END SHEET ===
   [/HTML_CONTENT]
   
   [RAW_TEXT]
   === SHEET: FORMULARIO A-3 ===
   Item    Descripción    Cantidad    Precio
   1.1     Excavación     500 m³      $25.00
   ...
   === END SHEET ===
   [/RAW_TEXT]
   ```

## Tipos de Documentos Soportados

### Documentos de Licitación Bolivianos

✅ **FORMULARIO A-1** - Identificación del Oferente (DOCX)
- Información de la empresa
- Representante legal
- Datos de contacto

✅ **FORMULARIO A-2** - Experiencia de la Empresa (DOCX/Excel)
- Tabla con proyectos anteriores
- Nombres de proyectos, clientes, fechas
- Montos y detalles

✅ **FORMULARIO A-3** - Propuesta Económica (Excel)
- Tabla de precios con múltiples partidas
- Columnas: Item, Descripción, Unidad, Cantidad, Precio Unitario, Precio Total
- Subtotales y totales

✅ **FORMULARIO A-4** - Modelo Indicativo de Precios (Excel)
- Lista de precios unitarios
- Costos desglosados
- Análisis de precios

✅ **FORMULARIO B-2/B-3** - Experiencia del Personal (DOCX/Excel)
- Tabla con curriculum de equipo
- Nombres, títulos, experiencia, certificaciones
- Formación académica

✅ **ANEXOS** - Especificaciones Técnicas (PDF)
- Requisitos técnicos
- Normas y estándares
- Especificaciones detalladas

## Ejemplo de Uso en Propuesta

### Antes (Sin Procesamiento de Excel):
```
"La empresa presentará una propuesta económica competitiva..."
```

### Ahora (Con Procesamiento de Excel):
```html
<h2>PROPUESTA ECONÓMICA</h2>
<p>A continuación se presenta la propuesta económica detallada conforme a los 
términos de referencia del proyecto:</p>

<table class="border-collapse border border-gray-300 w-full my-4">
  <thead>
    <tr>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">ITEM</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">DESCRIPCIÓN</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">UNIDAD</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">CANTIDAD</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">PRECIO UNITARIO (Bs.)</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">PRECIO TOTAL (Bs.)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-2">1.1</td>
      <td class="border border-gray-300 p-2">Servicio de Mantenimiento de Infraestructura Civil</td>
      <td class="border border-gray-300 p-2">m²</td>
      <td class="border border-gray-300 p-2">1,500</td>
      <td class="border border-gray-300 p-2">85.00</td>
      <td class="border border-gray-300 p-2">127,500.00</td>
    </tr>
    <!-- Más filas de la tabla original -->
  </tbody>
  <tfoot>
    <tr>
      <td colspan="5" class="border border-gray-300 font-bold p-2 text-right">TOTAL GENERAL:</td>
      <td class="border border-gray-300 font-bold p-2">XXX,XXX.XX Bs.</td>
    </tr>
  </tfoot>
</table>

<p>El monto total de la propuesta es de <strong>XXX,XXX.XX Bolivianos</strong>, 
conforme al desglose presentado en el Formulario A-3 anexo.</p>
```

## Instrucciones Especiales para IA

El modelo de IA ahora recibe instrucciones específicas para procesar tablas de Excel:

```
Si encuentras datos entre [HTML_CONTENT]...[/HTML_CONTENT] con etiquetas === SHEET: nombre ===:

1. Identifica el tipo de hoja:
   - PROPUESTA ECONOMICA / FORMULARIO A-3 → Tabla de precios completa
   - MODELO INDICATIVO / FORMULARIO A-4 → Lista de precios unitarios
   - EXPERIENCIA / FORMULARIO B → Tabla de curriculum
   
2. Replica la tabla COMPLETA con TODAS las filas y columnas

3. Si es una propuesta económica:
   - Incluye TODOS los items con sus precios
   - Mantén los subtotales y totales
   - Preserva las unidades de medida
   - Conserva el formato de números y monedas

4. Si es experiencia del personal:
   - Incluye TODOS los miembros del equipo
   - Mantén nombres exactos, títulos, y calificaciones
   - Preserva fechas y detalles de proyectos

5. Convierte la tabla HTML de Excel a formato HTML apropiado con clases CSS
```

## Limitaciones y Consideraciones

### Limitaciones Actuales:
1. **Fórmulas**: Las fórmulas de Excel se convierten a valores calculados
2. **Formato Visual**: Colores y estilos de Excel no se preservan (solo estructura)
3. **Gráficos**: Los gráficos de Excel no se extraen (solo tablas de datos)
4. **Celdas Combinadas**: Pueden requerir ajuste manual en algunos casos

### Mejoras Futuras Sugeridas:
1. **Detección Inteligente**: Detectar automáticamente tipo de formulario (A-3, A-4, B-2, etc.)
2. **Validación**: Verificar que tabla generada incluye todas las filas del original
3. **Suma y Totales**: Validar que totales son correctos
4. **Formato de Moneda**: Preservar formato boliviano (Bs.) consistentemente

## Instalación de Dependencias

Para instalar las nuevas dependencias, ejecuta:

```bash
npm install
```

Esto instalará:
- `xlsx` - Librería para leer y procesar archivos Excel
- `@types/xlsx` - Definiciones de tipos TypeScript

## Pruebas Recomendadas

### 1. Prueba de Propuesta Económica
1. Sube un archivo Excel con tabla de precios (FORMULARIO A-3)
2. Genera una propuesta
3. Verifica que la sección de precios incluye:
   - ✅ TODOS los items de la tabla original
   - ✅ Precios unitarios y totales correctos
   - ✅ Formato de tabla HTML apropiado
   - ✅ Total general al final

### 2. Prueba de Experiencia del Personal
1. Sube un archivo Excel con curriculum del equipo (FORMULARIO B-2)
2. Genera una propuesta
3. Verifica que la sección de equipo incluye:
   - ✅ Nombres completos y títulos de todos los miembros
   - ✅ Experiencia específica de cada uno
   - ✅ Certificaciones y calificaciones
   - ✅ Tabla completa con todos los datos

### 3. Prueba de Documentos Mixtos
1. Sube 5 documentos: Excel con precios, Word con empresa, PDF con especificaciones
2. Genera propuesta
3. Verifica que combina información de todos los documentos:
   - ✅ Información de empresa del Word
   - ✅ Tablas de precios del Excel
   - ✅ Especificaciones técnicas del PDF

## Soporte Técnico

### Verificar Procesamiento
En la base de datos, verifica:
```javascript
document: {
  hasTables: true,  // Debe ser true para archivos Excel
  textExtracted: "...[HTML_CONTENT]...=== SHEET: nombre ===...",
  metadata: {
    sheets: ["FORMULARIO A-3", "HOJA 2"],
    sheetCount: 2
  }
}
```

### Logs de Depuración
El servidor mostrará:
```
Processing Excel file with X sheets
Sheet 1: [nombre] - Y rows, Z columns
Extracted X characters from Excel
```

## Ejemplo Completo de Flujo

1. **Usuario sube**: `FORMULARIO_A-3_PROPUESTA_ECONOMICA.xlsx`
2. **Sistema procesa**: 
   - Lee todas las hojas
   - Convierte tablas a HTML
   - Etiqueta contenido
3. **Usuario genera propuesta**:
   - IA lee `[HTML_CONTENT]` con tablas
   - Identifica que es propuesta económica
   - Replica tabla completa en HTML
   - Añade texto explicativo
4. **Resultado**: Propuesta con tabla de precios completa y profesional

## Conclusión

Con este procesamiento de Excel, el sistema ahora puede:
- ✅ Extraer tablas de precios completas
- ✅ Replicar curriculum del equipo con todos los detalles
- ✅ Preservar estructura de formularios oficiales
- ✅ Generar propuestas con datos específicos reales
- ✅ Mantener formato profesional de tablas

Esto es especialmente importante para licitaciones bolivianas donde los formularios RUPE son obligatorios y deben presentarse con datos precisos.


