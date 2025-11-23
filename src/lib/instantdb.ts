import { init } from '@instantdb/react';

// Define the schema for type safety
export type Schema = {
  users: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    companyId: string;
    preferredLanguage?: string; // 'en', 'es', 'pl', etc.
    createdAt: number;
  };
  companies: {
    id: string;
    name: string;
    industry: string;
    country: string;
    defaultLanguage: string;
    createdAt: number;
  };
  documents: {
    id: string;
    companyId: string;
    type: 'model_rfp' | 'company_data' | 'tender_document';
    fileName: string;
    filePath: string;
    mimeType: string;
    uploadedByUserId: string;
    uploadedAt: number;
    textExtracted: string;
    metadata: string; // JSON stringified
    hasTables: boolean;
    detectedLanguage?: string; // Auto-detected language code
    status: 'uploaded' | 'processed' | 'error';
  };
  documentChunks: {
    id: string;
    documentId: string;
    companyId: string;
    type: 'model_rfp' | 'company_data' | 'tender_document';
    content: string;
    section: string;
    orderIndex: number;
    embedding: string; // JSON stringified array
    createdAt: number;
  };
  tenders: {
    id: string;
    companyId: string;
    title: string;
    clientName: string;
    tenderCode: string;
    country: string;
    relatedDocumentIds: string; // JSON stringified array
    parsedRequirements: string; // JSON stringified
    deadline: number;
    createdAt: number;
  };
  proposals: {
    id: string;
    companyId: string;
    tenderId: string;
    name: string;
    status: 'draft' | 'in_review' | 'final';
    language?: string; // Proposal language ('en', 'es', 'pl', etc.)
    aiGeneratedStructure: string; // JSON stringified
    editorState: string; // JSON stringified
    lastEditedByUserId: string;
    finalExportPath?: string;
    createdAt: number;
    updatedAt: number;
  };
};

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || 'your_instantdb_app_id';

// Initialize InstantDB
export const db = init<Schema>({ appId: APP_ID });

// Helper function to generate embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('/api/ai/embed', {
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
    console.error('Error generating embedding:', error);
    return [];
  }
}

// Helper function to calculate cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

