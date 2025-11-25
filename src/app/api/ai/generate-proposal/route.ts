import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import { getLanguageInstructions } from '@/lib/language-detector';
import { identifyBoliviaFormType, generateBolivianTenderPromptInstructions, analyzeDocumentContent, type BoliviaTenderDocument } from '@/lib/bolivia-tender-analyzer';
import { v4 as uuidv4 } from 'uuid';
import { googleAI, GEMINI_MODEL, generateContentWithRetry } from '@/lib/gemini';

// Safe limits for Free Tier
const MAX_CHARS_PER_SECTION = 100000; // Reduced from 500k to 100k to fit in Free Tier TPM

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenderId, companyId, userId } = body;

    if (!tenderId || !companyId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get tender
    const tenderResult = await adminDB.query({
      tenders: {
        $: { where: { id: tenderId } },
      },
    });

    if (!tenderResult.tenders || tenderResult.tenders.length === 0) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }

    const tender = tenderResult.tenders[0];
    const parsedRequirements = JSON.parse(tender.parsedRequirements || '{}');
    
    // Get linked document IDs from tender
    const tenderDocumentIds = JSON.parse(tender.relatedDocumentIds || '[]');
    const companyDocumentIds = JSON.parse(tender.companyDocumentIds || '[]');
    const rfpSampleIds = JSON.parse(tender.rfpSampleIds || '[]');
    
    // Get company info
    const companyResult = await adminDB.query({
      companies: {
        $: { where: { id: companyId } },
      },
    });

    const company = companyResult.companies?.[0];

    // Get tender documents
    let tenderDocumentsText = '';
    let bolivianTenderDocs: BoliviaTenderDocument[] = [];
    let bolivianInstructions = '';
    
    if (tenderDocumentIds.length > 0) {
      try {
        const tenderDocsResult = await adminDB.query({
          documents: {
            $: { where: { id: { in: tenderDocumentIds } } },
          },
        });
        
        const tenderDocs = tenderDocsResult.documents || [];
        
        // Analyze structure
        for (const doc of tenderDocs) {
          const formType = identifyBoliviaFormType(doc.fileName);
          bolivianTenderDocs.push({
            type: formType,
            detectedName: doc.fileName,
            originalFileName: doc.fileName,
            content: doc.textExtracted,
          });
        }
        
        if (bolivianTenderDocs.length > 0) {
          bolivianInstructions = generateBolivianTenderPromptInstructions(bolivianTenderDocs);
        }
        
        const prioritizedTenderDocs = tenderDocs.sort((a: any, b: any) => {
          const aType = identifyBoliviaFormType(a.fileName);
          const bType = identifyBoliviaFormType(b.fileName);
          const priority: any = { 'A-1': 1, 'B-2': 2, 'B-3': 3, 'A-3': 4, 'A-4': 5, 'ANEXO': 6, 'UNKNOWN': 7 };
          return (priority[aType] || 99) - (priority[bType] || 99);
        });
        
        // Truncate to safe limits for Free Tier
        tenderDocumentsText = prioritizedTenderDocs
          .map((doc: any) => {
            const formType = identifyBoliviaFormType(doc.fileName);
            let content = doc.textExtracted;
            if (content.length > MAX_CHARS_PER_SECTION) {
                content = content.substring(0, MAX_CHARS_PER_SECTION) + '\n\n[... content truncated ...]';
            }
            return `=== DOCUMENT: ${doc.fileName} ===\nTIPO DETECTADO: ${formType}\n${content}\n=== END DOCUMENT ===`;
          })
          .join('\n\n');
      } catch (e) {
        console.error('Error loading tender documents:', e);
      }
    }

    // Get company documents
    let companyDataDocumentsText = '';
    try {
      if (companyDocumentIds.length > 0) {
        const companyDocsResult = await adminDB.query({
          documents: { $: { where: { id: { in: companyDocumentIds } } } },
        });
        const companyDocs = companyDocsResult.documents || [];
        
        const prioritizedCompanyDocs = companyDocs
          .filter((doc: any) => doc.textExtracted && doc.textExtracted.length > 0)
          .sort((a: any, b: any) => {
            const aType = (a.documentType || '').toLowerCase();
            const bType = (b.documentType || '').toLowerCase();
            const priority: Record<string, number> = { 'formulario_a1': 1, 'formulario_b2': 2, 'formulario_b3': 3, 'formulario_a3': 4, 'formulario_a4': 5, 'price_table': 6, 'other': 99 };
            return (priority[aType] || 99) - (priority[bType] || 99);
          });
        
        companyDataDocumentsText = prioritizedCompanyDocs
          .map((doc: any) => {
            const docType = doc.documentType || 'company_data';
            let content = doc.textExtracted;
            if (content.length > MAX_CHARS_PER_SECTION) {
                content = content.substring(0, MAX_CHARS_PER_SECTION) + '\n\n[... content truncated ...]';
            }
            return `=== COMPANY DATA DOCUMENT: ${doc.fileName} ===\nTYPE: ${docType}\n${content}\n=== END DOCUMENT ===`;
          })
          .join('\n\n');
      }
    } catch (error) {
      console.error('Error loading company_data documents:', error);
    }

    // Get model RFP documents
    let modelRfpDocumentsText = '';
    try {
      if (rfpSampleIds.length > 0) {
        const modelRfpDocsResult = await adminDB.query({
          documents: { $: { where: { id: { in: rfpSampleIds } } } },
        });
        const modelRfpDocs = modelRfpDocsResult.documents || [];
        
        modelRfpDocumentsText = modelRfpDocs
          .filter((doc: any) => doc.textExtracted && doc.textExtracted.length > 0)
          .map((doc: any) => {
            const docType = doc.documentType || 'previous_proposal';
            let content = doc.textExtracted;
            if (content.length > MAX_CHARS_PER_SECTION) {
                content = content.substring(0, MAX_CHARS_PER_SECTION) + '\n\n[... content truncated ...]';
            }
            return `=== PREVIOUS PROPOSAL SAMPLE: ${doc.fileName} ===\nTYPE: ${docType}\n${content}\n=== END DOCUMENT ===`;
          })
          .join('\n\n');
      }
    } catch (error) {
      console.error('Error loading model_rfp documents:', error);
    }

    // Extracted tables
    let extractedTablesHTML = '';
    try {
      const allLinkedDocIds = [...companyDocumentIds, ...tenderDocumentIds];
      let tablesResult: any = { extractedTables: [] };
      if (allLinkedDocIds.length > 0) {
        const docsResult = await adminDB.query({ documents: { $: { where: { id: { in: allLinkedDocIds } } } } });
        const docIds = (docsResult.documents || []).map((d: any) => d.id);
        if (docIds.length > 0) {
          tablesResult = await adminDB.query({ extractedTables: { $: { where: { documentId: { in: docIds } } } } });
        }
      } else {
        tablesResult = await adminDB.query({ extractedTables: { $: { where: { companyId } } } });
      }
      const tables = tablesResult.extractedTables || [];
      if (tables.length > 0) {
        extractedTablesHTML = `===================================\nEXTRACTED TABLES FROM COMPANY DOCUMENTS\n===================================\n`;
        for (const table of tables) {
          const headers = JSON.parse(table.headers || '[]');
          const rows = JSON.parse(table.rows || '[]');
          extractedTablesHTML += `--- TABLE: ${table.title || 'Untitled'} ---\n| ${headers.join(' | ')} |\n${rows.map((r: any[]) => `| ${r.join(' | ')} |`).join('\n')}\n`;
        }
      }
    } catch (e) { console.error('Table extraction error', e); }

    // Detect language
    let detectedLanguage = company?.defaultLanguage || 'en';
    if (tenderDocumentIds.length > 0) {
        try {
            const docsResult = await adminDB.query({ documents: { $: { where: { id: tenderDocumentIds[0] } } } });
            if (docsResult.documents?.[0]?.detectedLanguage) detectedLanguage = docsResult.documents[0].detectedLanguage;
        } catch(e) {}
    }
    const languageInstruction = getLanguageInstructions(detectedLanguage);

    const prompt = `You are an EXPERT proposal writer using Gemini 3.
    
TASK: Create a COMPREHENSIVE and COMPLETE proposal draft.
1. **IGNORE PRE-DEFINED TEMPLATES**. Create the structure FREELY based on the RFP samples provided.
2. **REPLICATE THE EXACT STRUCTURE** of the RFP samples below. If the sample has 50 sections, create 50 sections.
3. **FILL EVERY SECTION** with extensive, specific details from the company data documents.
4. **GENERATE THE FULL CONTENT** as a single cohesive document. Do not split it into small JSON sections.
5. **REPLICATE ALL TABLES** found in the samples or required by the tender using HTML tables.

${languageInstruction}
CRITICAL: Generate in ${detectedLanguage}.

INPUT DOCUMENTS (Truncated for processing):
--- RFP SAMPLES (YOUR STRUCTURE TEMPLATE) ---
${modelRfpDocumentsText.substring(0, 200000)}

--- COMPANY DATA (YOUR CONTENT SOURCE) ---
${companyDataDocumentsText.substring(0, 200000)}
${extractedTablesHTML}

--- TENDER REQUIREMENTS (MUST COMPLY) ---
${bolivianInstructions}
${tenderDocumentsText.substring(0, 200000)}

Tender Info: ${tender.title}, ${tender.clientName}
Requirements: ${JSON.stringify(parsedRequirements)}

OUTPUT FORMAT (JSON):
{
  "sections": [
    {
      "id": "full_proposal",
      "title": "Full Proposal",
      "content": "THE ENTIRE PROPOSAL CONTENT IN HTML. Start with the Title Page, then Index, then all sections. Use <h1> for main sections (like '1. EXPERIENCIA'), <h2> for subsections. Include ALL content here. 20,000+ words if needed. Replicate tables using <table>. Use specific prices, names, and dates.",
      "order": 0
    }
  ]
}

CRITICAL: Return ONE section containing the WHOLE document. Do NOT split into multiple sections. This allows for free-flowing content generation.`;

    console.log('🚀 Sending request to Gemini 3 (optimized for Free Tier)...');
    
    // Use the retry wrapper
    const completion = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        maxOutputTokens: 60000,
      }
    }, 5, 5000); // 5 retries, starting at 5s wait

    console.log('✅ Received response from Gemini 3');

    let jsonString = completion.text || '{}';
    if (jsonString.startsWith('```json')) jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (jsonString.startsWith('```')) jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const proposalStructure = JSON.parse(jsonString);
    
    // HTML cleanup
    if (proposalStructure.sections) {
      proposalStructure.sections = proposalStructure.sections.map((section: any) => ({
        ...section,
        content: section.content
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/^# (.+)$/gm, '<h1>$1</h1>')
          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      }));
    }

    // Create proposal record
    const proposalId = uuidv4();
    await adminDB.transact([
      adminDB.tx.proposals[proposalId].update({
        companyId,
        tenderId,
        name: `Proposal for ${tender.title}`,
        status: 'draft',
        language: detectedLanguage,
        aiGeneratedStructure: JSON.stringify(proposalStructure),
        editorState: JSON.stringify(proposalStructure),
        lastEditedByUserId: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    ]);

    return NextResponse.json({
      proposalId,
      proposal: proposalStructure,
    });
  } catch (error: any) {
    console.error('Generate proposal error:', error);
    // Check if it's still a rate limit error after retries
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429')) {
        return NextResponse.json({ 
            error: 'Gemini Free Tier Limit Reached. Please wait 1-2 minutes and try again, or reduce the number of attached documents.',
            details: 'Resource Exhausted' 
        }, { status: 429 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to generate proposal',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
