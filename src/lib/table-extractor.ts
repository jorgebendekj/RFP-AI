/**
 * Table Extraction Utility
 * Extracts structured tables from documents (PDF, DOCX, Excel)
 */

import * as XLSX from 'xlsx';

export interface ExtractedTable {
  /** Title or caption of the table */
  title: string;
  
  /** Column headers */
  headers: string[];
  
  /** Table rows (array of cell values) */
  rows: string[][];
  
  /** Metadata about the table */
  metadata: {
    /** Currency used in monetary columns */
    currency?: string;
    
    /** Totals row if present */
    totals?: Record<string, number>;
    
    /** Special calculations or formulas */
    calculations?: Array<{
      description: string;
      formula: string;
      value: string;
    }>;
    
    /** Row and column spans for merged cells */
    mergedCells?: Array<{
      row: number;
      col: number;
      rowSpan: number;
      colSpan: number;
    }>;
    
    /** Source location in document */
    source?: {
      page?: number;
      sheet?: string;
      range?: string;
    };
  };
}

/**
 * Extract tables from document content
 */
export async function extractTablesFromDocument(
  fileContent: string | Buffer,
  fileType: string,
  filename: string
): Promise<ExtractedTable[]> {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (extension === 'xlsx' || extension === 'xls' || extension === 'xlsm') {
    return extractTablesFromExcel(fileContent as Buffer);
  }
  
  if (typeof fileContent === 'string') {
    return extractTablesFromText(fileContent, extension || '');
  }
  
  return [];
}

/**
 * Extract tables from Excel files
 */
function extractTablesFromExcel(buffer: Buffer): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Convert sheet to JSON to analyze structure
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        raw: false 
      });
      
      if (jsonData.length === 0) return;
      
      // Try to identify table regions in the sheet
      const tableRegions = identifyTableRegions(jsonData);
      
      tableRegions.forEach((region) => {
        const headers = region.headers;
        const rows = region.rows;
        
        // Detect metadata
        const metadata: ExtractedTable['metadata'] = {
          source: {
            sheet: sheetName,
            range: `${XLSX.utils.encode_cell({r: region.startRow, c: region.startCol})}:${XLSX.utils.encode_cell({r: region.endRow, c: region.endCol})}`,
          },
        };
        
        // Detect currency
        const allText = rows.flat().join(' ');
        if (allText.match(/bs\.?|bolivianos/i)) {
          metadata.currency = 'BOB'; // Bolivianos
        } else if (allText.match(/\$/)) {
          metadata.currency = 'USD';
        }
        
        // Detect calculations (e.g., "Carga Social: 33.39%")
        const calculations: Array<{description: string; formula: string; value: string}> = [];
        rows.forEach((row) => {
          const rowText = row.join(' ');
          const calcMatch = rowText.match(/(.*?):\s*(\d+\.?\d*)%/);
          if (calcMatch) {
            calculations.push({
              description: calcMatch[1].trim(),
              formula: '',
              value: calcMatch[2] + '%',
            });
          }
        });
        if (calculations.length > 0) {
          metadata.calculations = calculations;
        }
        
        tables.push({
          title: region.title || sheetName,
          headers,
          rows,
          metadata,
        });
      });
    });
  } catch (error) {
    console.error('Error extracting tables from Excel:', error);
  }
  
  return tables;
}

interface TableRegion {
  title: string;
  headers: string[];
  rows: string[][];
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

/**
 * Identify table regions within a sheet
 * A table is identified by:
 * - A row with non-empty cells (headers)
 * - Followed by rows with similar structure (data rows)
 */
function identifyTableRegions(data: any[][]): TableRegion[] {
  const regions: TableRegion[] = [];
  let currentRegion: TableRegion | null = null;
  let title = '';
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const nonEmptyCells = row.filter(cell => cell !== '' && cell !== null && cell !== undefined);
    
    // Check if this looks like a title row (single merged cell or short row)
    if (nonEmptyCells.length === 1 && row[0] && !currentRegion) {
      title = String(row[0]);
      continue;
    }
    
    // Check if this looks like a header row (multiple non-empty cells)
    if (nonEmptyCells.length >= 2 && !currentRegion) {
      const startCol = row.findIndex(cell => cell !== '' && cell !== null);
      const endCol = row.length - 1 - [...row].reverse().findIndex(cell => cell !== '' && cell !== null);
      
      currentRegion = {
        title: title || '',
        headers: row.slice(startCol, endCol + 1).map(cell => String(cell || '')),
        rows: [],
        startRow: i,
        endRow: i,
        startCol,
        endCol,
      };
      title = '';
      continue;
    }
    
    // If we have a current region, check if this row belongs to it
    if (currentRegion) {
      // Check if row has data in the same columns as headers
      const regionRow = row.slice(currentRegion.startCol, currentRegion.endCol + 1);
      const hasData = regionRow.some(cell => cell !== '' && cell !== null && cell !== undefined);
      
      if (hasData) {
        currentRegion.rows.push(regionRow.map(cell => String(cell || '')));
        currentRegion.endRow = i;
      } else {
        // Empty row or different structure - end this region
        if (currentRegion.rows.length > 0) {
          regions.push(currentRegion);
        }
        currentRegion = null;
      }
    }
  }
  
  // Add last region if exists
  if (currentRegion && currentRegion.rows.length > 0) {
    regions.push(currentRegion);
  }
  
  return regions;
}

/**
 * Extract tables from text content (PDF or DOCX converted to text)
 */
function extractTablesFromText(text: string, extension: string): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  
  // Check if text contains HTML tables (from DOCX with mammoth)
  if (text.includes('<table')) {
    tables.push(...extractTablesFromHTML(text));
  }
  
  // Try to detect ASCII-style tables
  tables.push(...extractASCIITables(text));
  
  // Try to detect markdown-style tables
  tables.push(...extractMarkdownTables(text));
  
  return tables;
}

/**
 * Extract tables from HTML content
 */
function extractTablesFromHTML(html: string): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  
  while ((match = tableRegex.exec(html)) !== null) {
    const tableHTML = match[1];
    
    // Extract headers
    const headerRegex = /<th[^>]*>(.*?)<\/th>/gi;
    const headers: string[] = [];
    let headerMatch;
    while ((headerMatch = headerRegex.exec(tableHTML)) !== null) {
      headers.push(stripHTML(headerMatch[1]));
    }
    
    // Extract rows
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows: string[][] = [];
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
      const rowHTML = rowMatch[1];
      
      // Skip if this is a header row
      if (rowHTML.includes('<th')) continue;
      
      const cellRegex = /<td[^>]*>(.*?)<\/td>/gi;
      const cells: string[] = [];
      let cellMatch;
      
      while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
        cells.push(stripHTML(cellMatch[1]));
      }
      
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
    
    if (headers.length > 0 || rows.length > 0) {
      // Try to find a title before the table
      const beforeTable = html.substring(0, match.index);
      const titleMatch = beforeTable.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>(?:(?!<h[1-6])[\s\S])*$/i);
      const title = titleMatch ? stripHTML(titleMatch[1]) : '';
      
      tables.push({
        title,
        headers: headers.length > 0 ? headers : (rows.length > 0 ? rows[0] : []),
        rows: headers.length > 0 ? rows : rows.slice(1),
        metadata: {},
      });
    }
  }
  
  return tables;
}

/**
 * Extract ASCII-style tables (with | or + separators)
 */
function extractASCIITables(text: string): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  
  // Pattern: lines with multiple | or + characters
  const lines = text.split('\n');
  let currentTable: {headers: string[]; rows: string[][]} | null = null;
  let title = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line looks like a table separator
    if (/^[\+\-\|=\s]+$/.test(line) && line.length > 10) {
      continue;
    }
    
    // Check if line contains table cells (multiple | or consistent spacing)
    const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    if (cells.length >= 2) {
      if (!currentTable) {
        // This might be a header row
        currentTable = {
          headers: cells,
          rows: [],
        };
      } else {
        // This is a data row
        currentTable.rows.push(cells);
      }
    } else if (currentTable && currentTable.rows.length > 0) {
      // Table ended
      tables.push({
        title,
        headers: currentTable.headers,
        rows: currentTable.rows,
        metadata: {},
      });
      currentTable = null;
      title = '';
    } else if (!currentTable && line && cells.length === 1) {
      // Might be a title
      title = line;
    }
  }
  
  // Add last table
  if (currentTable && currentTable.rows.length > 0) {
    tables.push({
      title,
      headers: currentTable.headers,
      rows: currentTable.rows,
      metadata: {},
    });
  }
  
  return tables;
}

/**
 * Extract Markdown-style tables
 */
function extractMarkdownTables(text: string): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();
    
    // Check for markdown table header separator (| --- | --- |)
    if (line.includes('|') && nextLine.match(/^\|[\s\-:]+\|/)) {
      const headers = line.split('|').map(h => h.trim()).filter(h => h);
      const rows: string[][] = [];
      
      // Read subsequent rows
      for (let j = i + 2; j < lines.length; j++) {
        const rowLine = lines[j].trim();
        if (!rowLine.includes('|')) break;
        
        const cells = rowLine.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length > 0) {
          rows.push(cells);
        }
      }
      
      if (rows.length > 0) {
        // Look for title above
        let title = '';
        if (i > 0) {
          const prevLine = lines[i - 1].trim();
          if (prevLine && !prevLine.includes('|')) {
            title = prevLine.replace(/^#+\s*/, ''); // Remove markdown heading markers
          }
        }
        
        tables.push({
          title,
          headers,
          rows,
          metadata: {},
        });
      }
      
      // Skip processed rows
      i += rows.length + 1;
    }
  }
  
  return tables;
}

/**
 * Strip HTML tags from text
 */
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Format table as HTML for display or AI input
 */
export function formatTableAsHTML(table: ExtractedTable): string {
  let html = '';
  
  if (table.title) {
    html += `<h3>${table.title}</h3>\n`;
  }
  
  html += `<table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin: 10px 0;">\n`;
  
  // Headers
  if (table.headers.length > 0) {
    html += `  <thead style="background-color: #f0f0f0;">\n`;
    html += `    <tr>\n`;
    table.headers.forEach(header => {
      html += `      <th style="border: 1px solid #000; padding: 8px; text-align: left; font-weight: bold;">${header}</th>\n`;
    });
    html += `    </tr>\n`;
    html += `  </thead>\n`;
  }
  
  // Body
  html += `  <tbody>\n`;
  table.rows.forEach(row => {
    html += `    <tr>\n`;
    row.forEach(cell => {
      html += `      <td style="border: 1px solid #000; padding: 8px;">${cell}</td>\n`;
    });
    html += `    </tr>\n`;
  });
  html += `  </tbody>\n`;
  
  html += `</table>\n`;
  
  // Metadata
  if (table.metadata.calculations && table.metadata.calculations.length > 0) {
    table.metadata.calculations.forEach(calc => {
      html += `<p><strong>${calc.description}: ${calc.value}</strong></p>\n`;
    });
  }
  
  return html;
}

/**
 * Convert table to markdown format
 */
export function formatTableAsMarkdown(table: ExtractedTable): string {
  let md = '';
  
  if (table.title) {
    md += `### ${table.title}\n\n`;
  }
  
  // Headers
  if (table.headers.length > 0) {
    md += '| ' + table.headers.join(' | ') + ' |\n';
    md += '| ' + table.headers.map(() => '---').join(' | ') + ' |\n';
  }
  
  // Rows
  table.rows.forEach(row => {
    md += '| ' + row.join(' | ') + ' |\n';
  });
  
  md += '\n';
  
  // Metadata
  if (table.metadata.calculations && table.metadata.calculations.length > 0) {
    table.metadata.calculations.forEach(calc => {
      md += `**${calc.description}**: ${calc.value}\n`;
    });
    md += '\n';
  }
  
  return md;
}


