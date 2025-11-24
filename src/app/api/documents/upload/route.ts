import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { processDocument, chunkText, saveUploadedFile } from '@/lib/file-processor';
import { adminDB } from '@/lib/instantdb-admin';
import { DocumentType, detectDocumentType } from '@/lib/document-types';
import { extractTablesFromDocument } from '@/lib/table-extractor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const companyId = formData.get('companyId') as string;
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as 'model_rfp' | 'company_data' | 'tender_document';
    const documentType = formData.get('documentType') as string | null;

    if (!file || !companyId || !userId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save file to disk
    const filePath = await saveUploadedFile(file, companyId);

    // Create document record
    const documentId = uuidv4();
    await adminDB.transact([
      adminDB.tx.documents[documentId].update({
        companyId,
        type,
        fileName: file.name,
        filePath,
        mimeType: file.type,
        uploadedByUserId: userId,
        uploadedAt: Date.now(),
        textExtracted: '',
        metadata: JSON.stringify({}),
        hasTables: false,
        status: 'uploaded',
        documentType: documentType || 'other',
      }),
    ]);

    // Process document in background
    processDocumentAsync(documentId, filePath, file.type, file.name, companyId, type, documentType);

    return NextResponse.json({
      documentId,
      message: 'Document uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

async function processDocumentAsync(
  documentId: string,
  filePath: string,
  mimeType: string,
  fileName: string,
  companyId: string,
  type: string,
  providedDocumentType: string | null
) {
  try {
    console.log(`[Processing] Starting document ${documentId}: ${fileName}`);
    
    // Process document
    const processed = await processDocument(filePath, mimeType);
    console.log(`[Processing] Extracted ${processed.textExtracted.length} characters from ${fileName}`);

    // Detect specific document type if not provided
    let documentType = providedDocumentType;
    if (!documentType || documentType === 'other') {
      documentType = detectDocumentType(fileName, processed.textExtracted);
      console.log(`[Processing] Auto-detected document type: ${documentType}`);
    }

    // Extract tables from document
    let extractedTables: any[] = [];
    try {
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(filePath);
      extractedTables = await extractTablesFromDocument(fileBuffer, mimeType, fileName);
      console.log(`[Processing] Extracted ${extractedTables.length} tables from ${fileName}`);
    } catch (error) {
      console.error('[Processing] Table extraction failed:', error);
    }

    // Detect language from extracted text
    let detectedLanguage = 'en';
    if (processed.textExtracted.length > 100) {
      try {
        const langResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/detect-language`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: processed.textExtracted.substring(0, 1000) }),
        });
        const langData = await langResponse.json();
        detectedLanguage = langData.language || 'en';
        console.log(`[Processing] Detected language: ${detectedLanguage}`);
      } catch (e) {
        console.log('[Processing] Language detection failed, defaulting to English');
      }
    }

    // Prepare enhanced metadata
    const enhancedMetadata = {
      ...processed.metadata,
      documentType,
      detectedLanguage,
      tablesCount: extractedTables.length,
      hasPricingInfo: extractedTables.some(t => 
        t.headers.some((h: string) => /precio|price|costo|cost/i.test(h))
      ),
      hasContactInfo: /email|teléfono|phone|dirección|address/i.test(processed.textExtracted),
    };

    // Update document with all extracted information
    await adminDB.transact([
      adminDB.tx.documents[documentId].update({
        textExtracted: processed.textExtracted,
        metadata: JSON.stringify(enhancedMetadata),
        hasTables: extractedTables.length > 0,
        detectedLanguage,
        documentType,
        status: 'processed',
      }),
    ]);

    // Save extracted tables as separate records
    for (let i = 0; i < extractedTables.length; i++) {
      const tableId = uuidv4();
      await adminDB.transact([
        adminDB.tx.extractedTables[tableId].update({
          documentId,
          companyId,
          title: extractedTables[i].title || `Table ${i + 1}`,
          headers: JSON.stringify(extractedTables[i].headers),
          rows: JSON.stringify(extractedTables[i].rows),
          metadata: JSON.stringify(extractedTables[i].metadata),
          orderIndex: i,
          createdAt: Date.now(),
        }),
      ]);
    }
    console.log(`[Processing] Saved ${extractedTables.length} tables to database`);

    // Create chunks and generate embeddings
    const chunks = chunkText(processed.textExtracted, 500);
    console.log(`[Processing] Created ${chunks.length} chunks for embedding`);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkId = uuidv4();
      
      // Generate embedding
      const embedding = await generateEmbedding(chunks[i]);
      
      await adminDB.transact([
        adminDB.tx.documentChunks[chunkId].update({
          documentId,
          companyId,
          type: type as any,
          content: chunks[i],
          section: processed.metadata.sections?.[0] || 'General',
          orderIndex: i,
          embedding: JSON.stringify(embedding),
          createdAt: Date.now(),
        }),
      ]);
    }

    console.log(`[Processing] ✅ Successfully processed ${fileName}`);
  } catch (error) {
    console.error('[Processing] ❌ Document processing error:', error);
    await adminDB.transact([
      adminDB.tx.documents[documentId].update({
        status: 'error',
        metadata: JSON.stringify({ error: (error as Error).message }),
      }),
    ]);
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Embedding error:', error);
    return [];
  }
}

