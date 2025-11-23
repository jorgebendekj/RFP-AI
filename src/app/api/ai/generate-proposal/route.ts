import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import { getLanguageInstructions } from '@/lib/language-detector';
import { identifyBoliviaFormType, generateBolivianTenderPromptInstructions, analyzeDocumentContent, type BoliviaTenderDocument } from '@/lib/bolivia-tender-analyzer';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Get company info
    const companyResult = await adminDB.query({
      companies: {
        $: { where: { id: companyId } },
      },
    });

    const company = companyResult.companies?.[0];

    // Get company style analysis
    let companyStyle = {
      tone: 'professional',
      structure: 'standard',
      keyPhrases: [],
    };
    
    try {
      // Get model RFP documents for style analysis
      const docsResult = await adminDB.query({
        documents: {
          $: { where: { companyId, type: 'model_rfp' } },
        },
      });

      const documents = docsResult.documents || [];
      
      if (documents.length > 0) {
        // Sample text from documents
        const sampleTexts = documents
          .slice(0, 3)
          .map((doc: any) => doc.textExtracted.substring(0, 5000))
          .join('\n\n---\n\n');

        // Analyze company style using AI - focus on format extraction
        const stylePrompt = `You are an expert at analyzing proposal documents and extracting their structure and format. 
Analyze the following sample proposal documents from a company and identify their writing style, structure, formatting patterns, and section organization.

Sample Proposals:
${sampleTexts}

Return a JSON object with:
{
  "tone": "formal/professional/technical/conversational",
  "structure": "detailed description of document structure and organization",
  "keyPhrases": ["commonly used phrases and expressions"],
  "sectionOrder": ["exact section names and titles in order as they appear"],
  "sectionTitles": {
    "coverPage": "actual title used for cover page if any",
    "executiveSummary": "actual title used",
    "companyProfile": "actual title used",
    "methodology": "actual title used",
    "team": "actual title used",
    "timeline": "actual title used",
    "pricing": "actual title used"
  },
  "writingStyle": "detailed analysis of writing patterns, sentence structure, paragraph length",
  "formatPatterns": "description of formatting like bullet points, numbering, tables usage",
  "typicalIntroductions": "how sections typically start",
  "typicalConclusions": "how sections typically end"
}

IMPORTANT: Extract the EXACT section titles and structure used in these documents so we can replicate the format.

Return only valid JSON, no other text.`;

        const styleCompletion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: stylePrompt }],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        });

        companyStyle = JSON.parse(styleCompletion.choices[0].message.content || '{}');
      }
    } catch (error) {
      console.error('Style analysis error:', error);
      // Continue with default style
    }

    // Get ALL documents linked to this tender and analyze them
    let tenderDocumentsText = '';
    let bolivianTenderDocs: BoliviaTenderDocument[] = [];
    let bolivianInstructions = '';
    
    if (tender.relatedDocumentIds) {
      try {
        const docIds = JSON.parse(tender.relatedDocumentIds);
        if (docIds.length > 0) {
          const tenderDocsResult = await adminDB.query({
            documents: {
              $: { where: { id: { in: docIds } } },
            },
          });
          
          const tenderDocs = tenderDocsResult.documents || [];
          
          // Analyze each document for Bolivian tender forms
          for (const doc of tenderDocs) {
            const formType = identifyBoliviaFormType(doc.fileName);
            const analysis = analyzeDocumentContent(doc.textExtracted, doc.fileName);
            
            bolivianTenderDocs.push({
              type: formType,
              detectedName: doc.fileName,
              originalFileName: doc.fileName,
              content: doc.textExtracted,
            });
            
            console.log(`📋 Document: ${doc.fileName}`);
            console.log(`   Type: ${formType}`);
            console.log(`   Has Company Info: ${analysis.hasCompanyInfo}`);
            console.log(`   Has Team Info: ${analysis.hasTeamInfo}`);
            console.log(`   Has Projects: ${analysis.hasProjects}`);
            console.log(`   Has Tables: ${analysis.hasTables}`);
          }
          
          // Generate specialized instructions for Bolivian documents
          if (bolivianTenderDocs.length > 0) {
            bolivianInstructions = generateBolivianTenderPromptInstructions(bolivianTenderDocs);
            console.log('✅ Generated Bolivian tender-specific instructions');
          }
          
          tenderDocumentsText = tenderDocs
            .map((doc: any) => {
              const formType = identifyBoliviaFormType(doc.fileName);
              return `
=== DOCUMENT: ${doc.fileName} ===
TIPO DETECTADO: ${formType}
${doc.textExtracted}
=== END DOCUMENT ===
`;
            })
            .join('\n\n');
          
          console.log(`Loaded ${tenderDocs.length} tender documents with ${tenderDocumentsText.length} characters`);
        }
      } catch (e) {
        console.error('Error loading tender documents:', e);
      }
    }

    // Get relevant document chunks using RAG
    const chunksResult = await adminDB.query({
      documentChunks: {
        $: { where: { companyId } },
      },
    });

    const chunks = chunksResult.documentChunks || [];
    
    // Get model RFP chunks for style reference
    const modelRfpChunks = chunks
      .filter((c: any) => c.type === 'model_rfp')
      .slice(0, 15)
      .map((c: any) => c.content)
      .join('\n\n');

    // Get company data chunks
    const companyDataChunks = chunks
      .filter((c: any) => c.type === 'company_data')
      .slice(0, 10)
      .map((c: any) => c.content)
      .join('\n\n');

    // Detect language from tender documents
    let detectedLanguage = company?.defaultLanguage || 'en';
    if (tender.relatedDocumentIds) {
      try {
        const docIds = JSON.parse(tender.relatedDocumentIds);
        if (docIds.length > 0) {
          const docsResult = await adminDB.query({
            documents: {
              $: { where: { id: docIds[0] } },
            },
          });
          if (docsResult.documents && docsResult.documents[0]?.detectedLanguage) {
            detectedLanguage = docsResult.documents[0].detectedLanguage;
          }
        }
      } catch (e) {
        console.log('Could not detect language from documents');
      }
    }

    const languageInstruction = getLanguageInstructions(detectedLanguage);

    // Generate proposal using AI
    const prompt = `You are an expert proposal writer and document analyst. Generate a complete proposal draft for a government tender.

${languageInstruction}

IMPORTANT: Generate ALL content in the same language as the tender documents (${detectedLanguage}).

COMPANY INFORMATION:
Company Name: ${company?.name || 'Company'}
Industry: ${company?.industry || 'Construction'}
Country: ${company?.country || 'USA'}

COMPANY WRITING STYLE:
${JSON.stringify(companyStyle, null, 2)}

TENDER INFORMATION:
Title: ${tender.title}
Client: ${tender.clientName}
Tender Code: ${tender.tenderCode}

TENDER REQUIREMENTS:
${JSON.stringify(parsedRequirements, null, 2)}

===================================
DOCUMENTOS DE LICITACIÓN (USAR ESTA INFORMACIÓN - CREDENCIALES, EXPERIENCIA, CERTIFICACIONES):
===================================

${bolivianInstructions}

${tenderDocumentsText.substring(0, 30000)}

CRITICAL: The tender documents above contain the company's actual information including:
- Company experience and completed projects
- Team member names, titles, and qualifications
- Certifications and credentials
- Technical capabilities and equipment
- Previous similar work
- Specific data, numbers, dates, and facts

YOU MUST USE THIS SPECIFIC INFORMATION FROM TENDER DOCUMENTS IN THE PROPOSAL.
Do NOT make up generic information. Extract and use the real data provided above.

===================================
REFERENCE - PREVIOUS PROPOSALS (FOR FORMAT AND STRUCTURE):
===================================
NOTE: If you see [HTML_CONTENT]...[/HTML_CONTENT] tags, the content between them contains HTML tables that you MUST replicate.
${modelRfpChunks.substring(0, 8000)}

===================================
REFERENCE - ADDITIONAL COMPANY DATA:
===================================
${companyDataChunks.substring(0, 3000)}

CRITICAL INSTRUCTIONS:

1. **USE TENDER DOCUMENTS INFORMATION FIRST**:
   - The TENDER DOCUMENTS section above contains THE ACTUAL COMPANY INFORMATION
   - Extract ALL company names, team member names, project names, dates, numbers from these documents
   - If you see "DRJ Construcciones" or any company name, USE IT
   - If you see team member names (e.g., "Ing. Juan Pérez"), USE THEM with exact titles
   - If you see project examples (e.g., "Proyecto Hospital Central 2022"), INCLUDE THEM
   - If you see certifications or qualifications, COPY THEM EXACTLY
   - If you see tables with experience, projects, or qualifications, REPLICATE THEM
   - Do NOT invent names, projects, or data - USE what's in the tender documents

2. **ANALYZE TENDER REQUIREMENTS DEEPLY**:
   - Read and understand each requirement in TENDER REQUIREMENTS
   - For each requirement, extract key information: deliverables, deadlines, specifications, quantities
   - Create sections that directly address each requirement with specific details
   - Cross-reference requirements and ensure nothing is missed

3. **REPLICATE TABLES FROM DOCUMENTS**:
   - If you see tabular data in ANY documents above (especially TENDER DOCUMENTS), recreate them using HTML tables
   - Tables with team experience, project lists, qualifications are CRITICAL - must be replicated
   - Use proper HTML table structure: <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>
   - Include ALL rows and columns from the original tables
   - Maintain the same column headers and data structure
   - Apply these CSS classes: <table class="border-collapse border border-gray-300 w-full my-4">
   - For headers: <th class="border border-gray-300 bg-gray-100 font-bold p-2">
   - For cells: <td class="border border-gray-300 p-2">

4. **CREATE COMPREHENSIVE AND DETAILED CONTENT**:
   - MINIMUM 4-6 paragraphs per major section (not 1-2 sentences!)
   - Each section should be substantial with specific details
   - Include concrete examples from tender documents
   - Reference actual team members by name and title from documents
   - Reference actual projects by name and details from documents
   - Use specific numbers: "15 años de experiencia" not "amplia experiencia"
   - Use real certifications and qualifications from documents
   - Provide technical depth and specifications

5. **REPLICATE FORMAT AND STRUCTURE**:
   - Use the EXACT section titles from COMPANY WRITING STYLE (sectionTitles and sectionOrder)
   - Follow the formatPatterns described (bullet points, numbering style, etc.)
   - Maintain the company's tone and writing style
   - Replicate introduction and conclusion patterns

6. **IMPLEMENT REQUIREMENTS CORRECTLY**:
   - For each tender requirement, create corresponding content that shows:
     * Understanding of the requirement
     * How you will meet it (methodology with specific approach)
     * When you will deliver it (timeline with specific dates/durations)
     * Who will do it (team/resources with actual names from documents)
   - Be specific and detailed, not generic

7. **DOCUMENT EVIDENCE**:
   - Reference specific projects from tender documents by name, location, and details
   - Include concrete examples that demonstrate capability
   - Use quantifiable metrics: "15 proyectos similares completados" not "varios proyectos"
   - Cite certifications and credentials exactly as they appear in documents

Return the proposal as JSON in this exact format:
{
  "sections": [
    {
      "id": "section_1",
      "title": "EXACT section title from company's format",
      "content": "Rich text content in HTML format with tables if needed",
      "order": 0
    }
  ]
}

HTML FORMATTING REQUIREMENTS:
- Use <p> for paragraphs
- Use <strong> for bold text (NOT **text**)
- Use <em> for italic text
- Use <ul><li> for bullet lists
- Use <ol><li> for numbered lists
- Use <h2>, <h3> for sub-headings
- Use <table> with proper structure for tabular data
- Use <br> for line breaks if needed

TABLE EXAMPLE:
<table class="border-collapse border border-gray-300 w-full my-4">
  <thead>
    <tr>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Header 1</th>
      <th class="border border-gray-300 bg-gray-100 font-bold p-2">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-2">Data 1</td>
      <td class="border border-gray-300 p-2">Data 2</td>
    </tr>
  </tbody>
</table>

Fallback Standard Sections (only if no company format is available):
- Cover Page / Portada
- Executive Summary / Resumen Ejecutivo
- Company Profile and Experience / Perfil de la Compañía y Experiencia
- Understanding of Requirements / Comprensión de los Requisitos
- Technical Approach and Methodology / Enfoque Técnico y Metodología
- Project Team and Organization / Equipo del Proyecto y Organización
- Timeline and Deliverables / Cronograma y Entregables
- Quality Assurance / Aseguramiento de la Calidad
- Bill of Quantities and Pricing / Lista de Cantidades y Precios
- Compliance Matrix / Matriz de Cumplimiento

Return only valid JSON with HTML content, no markdown syntax.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const proposalStructure = JSON.parse(completion.choices[0].message.content || '{"sections":[]}');
    
    // Convert any markdown to HTML in sections (safety fallback)
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
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    return NextResponse.json({ 
      error: error.message || 'Failed to generate proposal',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

