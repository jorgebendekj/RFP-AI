import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export interface ProcessedDocument {
  textExtracted: string;
  metadata: {
    pages?: number;
    sections?: string[];
    wordCount: number;
  };
  hasTables: boolean;
}

export async function processDocument(
  filePath: string,
  mimeType: string
): Promise<ProcessedDocument> {
  try {
    let textExtracted = '';
    let metadata: any = {};
    let hasTables = false;

    if (mimeType === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdf(dataBuffer);
      textExtracted = pdfData.text;
      metadata.pages = pdfData.numpages;
      hasTables = detectTablesInText(textExtracted);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const dataBuffer = await fs.readFile(filePath);
      // Use convertToHtml to preserve table structure
      const htmlResult = await mammoth.convertToHtml({ buffer: dataBuffer });
      const rawResult = await mammoth.extractRawText({ buffer: dataBuffer });
      
      // Store HTML if tables are detected, otherwise use raw text
      if (htmlResult.value.includes('<table>')) {
        textExtracted = `[HTML_CONTENT]\n${htmlResult.value}\n[/HTML_CONTENT]\n\n[RAW_TEXT]\n${rawResult.value}\n[/RAW_TEXT]`;
        hasTables = true;
      } else {
        textExtracted = rawResult.value;
        hasTables = detectTablesInText(textExtracted);
      }
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.ms-excel.sheet.macroEnabled.12'
    ) {
      // Process Excel files
      const dataBuffer = await fs.readFile(filePath);
      const workbook = XLSX.read(dataBuffer, { type: 'buffer' });
      
      let allSheetsText = '';
      let allSheetsHtml = '';
      
      // Process each sheet
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to HTML to preserve table structure
        const htmlTable = XLSX.utils.sheet_to_html(worksheet);
        
        // Convert to plain text
        const plainText = XLSX.utils.sheet_to_txt(worksheet, { blankrows: false });
        
        allSheetsHtml += `\n\n=== SHEET: ${sheetName} ===\n${htmlTable}\n=== END SHEET ===\n`;
        allSheetsText += `\n\n=== SHEET: ${sheetName} ===\n${plainText}\n=== END SHEET ===\n`;
      }
      
      // Store both HTML and text
      textExtracted = `[HTML_CONTENT]\n${allSheetsHtml}\n[/HTML_CONTENT]\n\n[RAW_TEXT]\n${allSheetsText}\n[/RAW_TEXT]`;
      hasTables = true;
      metadata.sheets = workbook.SheetNames;
      metadata.sheetCount = workbook.SheetNames.length;
    } else if (mimeType === 'text/plain') {
      textExtracted = await fs.readFile(filePath, 'utf-8');
      hasTables = detectTablesInText(textExtracted);
    }

    // Extract sections (simple heuristic based on headings)
    const sections = extractSections(textExtracted);
    metadata.sections = sections;
    metadata.wordCount = textExtracted.split(/\s+/).length;

    return {
      textExtracted,
      metadata,
      hasTables,
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

function detectTablesInText(text: string): boolean {
  // Simple heuristic: detect multiple tabs or pipe characters in consecutive lines
  const lines = text.split('\n');
  let consecutiveTabLines = 0;
  
  for (const line of lines) {
    if (line.includes('\t') || line.includes('|')) {
      consecutiveTabLines++;
      if (consecutiveTabLines >= 3) return true;
    } else {
      consecutiveTabLines = 0;
    }
  }
  
  return false;
}

function extractSections(text: string): string[] {
  const sections: string[] = [];
  const lines = text.split('\n');
  
  // Look for lines that look like headings (all caps, numbered, etc.)
  const headingPatterns = [
    /^[A-Z][A-Z\s]{5,}$/,  // All caps
    /^\d+\.\s+[A-Z]/,       // Numbered headings
    /^[IVX]+\.\s+/,         // Roman numerals
  ];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 100) {
      for (const pattern of headingPatterns) {
        if (pattern.test(trimmed)) {
          sections.push(trimmed);
          break;
        }
      }
    }
  }
  
  return sections;
}

export function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

export async function saveUploadedFile(
  file: File,
  companyId: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads', companyId);
  await fs.mkdir(uploadsDir, { recursive: true });
  
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  
  const buffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));
  
  return filePath;
}



