import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Get document details before deleting
    const docResult = await adminDB.query({
      documents: {
        $: { where: { id: documentId } },
      },
    });

    if (!docResult.documents || docResult.documents.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = docResult.documents[0];

    // Delete document chunks
    const chunksResult = await adminDB.query({
      documentChunks: {
        $: { where: { documentId } },
      },
    });

    const chunks = chunksResult.documentChunks || [];
    const deleteChunksTx = chunks.map((chunk: any) => 
      adminDB.tx.documentChunks[chunk.id].delete()
    );

    // Delete the document record
    const deleteDocTx = adminDB.tx.documents[documentId].delete();

    // Execute all deletions in a single transaction
    await adminDB.transact([...deleteChunksTx, deleteDocTx]);

    // Try to delete the physical file (optional - don't fail if it doesn't exist)
    try {
      if (document.filePath) {
        const fullPath = path.join(process.cwd(), document.filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError);
      // Continue anyway - database record is deleted
    }

    return NextResponse.json({
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete document' }, { status: 500 });
  }
}


