import { NextRequest, NextResponse } from 'next/server';
import { processDocument } from '@/lib/file-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a temporary file path
    const tempPath = `/tmp/${Date.now()}_${file.name}`;
    const fs = require('fs');
    fs.writeFileSync(tempPath, buffer);

    try {
      // Extract text from the file
      const processed = await processDocument(tempPath, file.type);
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error('Failed to delete temp file:', cleanupError);
      }

      return NextResponse.json({
        text: processed.textExtracted,
        fileName: file.name,
        size: file.size,
        hasTables: processed.hasTables,
        metadata: processed.metadata,
      });
    } catch (extractError) {
      // Clean up on error
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error('Failed to delete temp file after error:', cleanupError);
      }
      throw extractError;
    }
  } catch (error: any) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract text from file' },
      { status: 500 }
    );
  }
}

