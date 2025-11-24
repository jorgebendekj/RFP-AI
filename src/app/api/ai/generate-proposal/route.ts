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
    
    // Get linked document IDs from tender
    const tenderDocumentIds = JSON.parse(tender.relatedDocumentIds || '[]');
    const companyDocumentIds = JSON.parse(tender.companyDocumentIds || '[]');
    const rfpSampleIds = JSON.parse(tender.rfpSampleIds || '[]');
    
    console.log(`\n📋 ===== TENDER DOCUMENT LINKING =====`);
    console.log(`Tender Documents (from government): ${tenderDocumentIds.length}`);
    console.log(`Company Documents (linked): ${companyDocumentIds.length}`);
    console.log(`RFP Samples (linked): ${rfpSampleIds.length}`);

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

    // Get tender documents (ONLY those linked to this tender)
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
      } catch (e) {
        console.error('Error loading tender documents:', e);
      }
    }

    // Get company_data documents (ONLY those linked to this tender)
    let companyDataDocumentsText = '';
    try {
      let companyDocs: any[] = [];
      
      if (companyDocumentIds.length > 0) {
        console.log(`\n🔗 Loading ${companyDocumentIds.length} linked company documents...`);
        // Load only the documents linked to this tender
        const companyDocsResult = await adminDB.query({
          documents: {
            $: { where: { id: { in: companyDocumentIds } } },
          },
        });
        companyDocs = companyDocsResult.documents || [];
        console.log(`✅ Successfully loaded ${companyDocs.length} company documents from ${companyDocumentIds.length} linked IDs`);
      } else {
        console.log(`\n⚠️  WARNING: No company documents linked to this tender!`);
        console.log(`   The AI will NOT have access to company-specific information (prices, contact, projects, etc.)`);
        console.log(`   To fix: Go to the tender and link Company Data Documents`);
      }
      
      console.log(`\n📁 ===== COMPANY DATA DOCUMENTS =====`);
      console.log(`Found ${companyDocs.length} company_data documents (${companyDocumentIds.length > 0 ? 'linked to tender' : 'all available'})`);
      companyDocs.forEach((doc: any, index: number) => {
        console.log(`  ${index + 1}. ${doc.fileName} (${doc.documentType || 'unknown'}) - Status: ${doc.status} - Length: ${doc.textExtracted?.length || 0} chars`);
      });
      
      if (companyDocs.length > 0) {
        companyDataDocumentsText = companyDocs
          .filter((doc: any) => doc.textExtracted && doc.textExtracted.length > 0)
          .map((doc: any) => {
            const docType = doc.documentType || 'company_data';
            return `
=== COMPANY DATA DOCUMENT: ${doc.fileName} ===
TYPE: ${docType}
STATUS: ${doc.status}
${doc.textExtracted}
=== END DOCUMENT ===
`;
          })
          .join('\n\n');
        
        console.log(`✅ Loaded ${companyDocs.length} company_data documents (${companyDataDocumentsText.length} characters)`);
      }
    } catch (error) {
      console.error('Error loading company_data documents:', error);
    }

    // Get model_rfp documents (ONLY those linked to this tender)
    let modelRfpDocumentsText = '';
    try {
      let modelRfpDocs: any[] = [];
      
      if (rfpSampleIds.length > 0) {
        console.log(`\n🔗 Loading ${rfpSampleIds.length} linked RFP sample documents...`);
        // Load only the documents linked to this tender
        const modelRfpDocsResult = await adminDB.query({
          documents: {
            $: { where: { id: { in: rfpSampleIds } } },
          },
        });
        modelRfpDocs = modelRfpDocsResult.documents || [];
        console.log(`✅ Successfully loaded ${modelRfpDocs.length} RFP samples from ${rfpSampleIds.length} linked IDs`);
      } else {
        console.log(`\n⚠️  WARNING: No RFP proposal samples linked to this tender!`);
        console.log(`   The AI will NOT have examples of your previous successful proposals to replicate format`);
        console.log(`   To fix: Go to the tender and link RFP Proposal Samples`);
      }
      
      console.log(`\n📄 ===== MODEL RFP (PROPOSAL SAMPLES) DOCUMENTS =====`);
      console.log(`Found ${modelRfpDocs.length} model_rfp (proposal sample) documents (${rfpSampleIds.length > 0 ? 'linked to tender' : 'all available'})`);
      modelRfpDocs.forEach((doc: any, index: number) => {
        console.log(`  ${index + 1}. ${doc.fileName} (${doc.documentType || 'unknown'}) - Status: ${doc.status} - Length: ${doc.textExtracted?.length || 0} chars`);
      });
      
      if (modelRfpDocs.length > 0) {
        modelRfpDocumentsText = modelRfpDocs
          .filter((doc: any) => doc.textExtracted && doc.textExtracted.length > 0)
          .map((doc: any) => {
            const docType = doc.documentType || 'previous_proposal';
            return `
=== PREVIOUS PROPOSAL SAMPLE: ${doc.fileName} ===
TYPE: ${docType}
STATUS: ${doc.status}
${doc.textExtracted}
=== END DOCUMENT ===
`;
          })
          .join('\n\n');
        
        console.log(`✅ Loaded ${modelRfpDocs.length} model_rfp documents (${modelRfpDocumentsText.length} characters)`);
      }
    } catch (error) {
      console.error('Error loading model_rfp documents:', error);
    }

    // Also get chunks for additional context (as backup)
    const chunksResult = await adminDB.query({
      documentChunks: {
        $: { where: { companyId } },
      },
    });

    const chunks = chunksResult.documentChunks || [];
    
    // Get model RFP chunks for style reference (as additional context)
    const modelRfpChunks = chunks
      .filter((c: any) => c.type === 'model_rfp')
      .slice(0, 15)
      .map((c: any) => c.content)
      .join('\n\n');

    // Get company data chunks (as additional context)
    const companyDataChunks = chunks
      .filter((c: any) => c.type === 'company_data')
      .slice(0, 10)
      .map((c: any) => c.content)
      .join('\n\n');

    // Get extracted tables from linked company documents
    let extractedTablesHTML = '';
    try {
      // Get tables from linked company documents
      const allLinkedDocIds = [...companyDocumentIds, ...tenderDocumentIds];
      
      let tablesResult: any = { extractedTables: [] };
      if (allLinkedDocIds.length > 0) {
        // Get documents first to get their IDs
        const docsResult = await adminDB.query({
          documents: {
            $: { where: { id: { in: allLinkedDocIds } } },
          },
        });
        const docIds = (docsResult.documents || []).map((d: any) => d.id);
        
        if (docIds.length > 0) {
          tablesResult = await adminDB.query({
            extractedTables: {
              $: { where: { documentId: { in: docIds } } },
            },
          });
        }
      } else {
        // Fallback: get all tables from company (for backward compatibility)
        tablesResult = await adminDB.query({
          extractedTables: {
            $: { where: { companyId } },
          },
        });
      }

      const tables = tablesResult.extractedTables || [];
      console.log(`📊 Found ${tables.length} extracted tables for this company`);
      
      if (tables.length > 0) {
        extractedTablesHTML = `
===================================
EXTRACTED TABLES FROM COMPANY DOCUMENTS (PRICING, MATERIALS, LABOR, ETC.)
===================================

CRITICAL: These tables contain EXACT PRICES, RATES, MATERIALS, and RESOURCES from the company's data.
YOU MUST USE THESE EXACT VALUES in the proposal. DO NOT invent prices or resources.

`;
        
        for (const table of tables) {
          const headers = JSON.parse(table.headers || '[]');
          const rows = JSON.parse(table.rows || '[]');
          const metadata = JSON.parse(table.metadata || '{}');
          
          extractedTablesHTML += `
--- TABLE: ${table.title || 'Untitled'} ---
${metadata.currency ? `Currency: ${metadata.currency}\n` : ''}
<table class="border-collapse border border-gray-300 w-full my-4">
  <thead>
    <tr>
      ${headers.map((h: string) => `<th class="border border-gray-300 bg-gray-100 font-bold p-2">${h}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    ${rows.map((row: string[]) => `
    <tr>
      ${row.map((cell: string) => `<td class="border border-gray-300 p-2">${cell}</td>`).join('')}
    </tr>`).join('')}
  </tbody>
</table>
${metadata.calculations ? `\nCalculations: ${metadata.calculations.map((c: any) => `${c.description}: ${c.value}`).join(', ')}\n` : ''}
`;
        }
        
        console.log('✅ Formatted tables for AI prompt');
      }
    } catch (error) {
      console.error('Error loading extracted tables:', error);
    }

    // Detect language from tender documents
    let detectedLanguage = company?.defaultLanguage || 'en';
    if (tenderDocumentIds.length > 0) {
      try {
          const docsResult = await adminDB.query({
            documents: {
            $: { where: { id: tenderDocumentIds[0] } },
            },
          });
          if (docsResult.documents && docsResult.documents[0]?.detectedLanguage) {
            detectedLanguage = docsResult.documents[0].detectedLanguage;
        }
      } catch (e) {
        console.log('Could not detect language from documents');
      }
    }

    const languageInstruction = getLanguageInstructions(detectedLanguage);

    // Log summary of what we're sending to AI
    console.log(`\n📊 ===== PROMPT SUMMARY =====`);
    console.log(`\n✅ DOCUMENTS BEING USED BY AI:`);
    console.log(`   📄 Tender Documents: ${tenderDocumentsText.length} characters (${tenderDocumentIds.length} linked)`);
    console.log(`   📁 Company Data: ${companyDataDocumentsText.length} characters (${companyDocumentIds.length} linked)`);
    console.log(`   📋 RFP Samples: ${modelRfpDocumentsText.length} characters (${rfpSampleIds.length} linked)`);
    console.log(`   📊 Extracted Tables: ${extractedTablesHTML.length} characters`);
    console.log(`   🔄 Company Data Chunks (backup): ${companyDataChunks.length} characters`);
    console.log(`   🔄 Model RFP Chunks (backup): ${modelRfpChunks.length} characters`);
    console.log(`\n🌐 Language: ${detectedLanguage}`);
    
    if (companyDataDocumentsText.length === 0) {
      console.log(`\n⚠️  WARNING: No company data documents loaded! AI will NOT have company-specific information.`);
    }
    if (modelRfpDocumentsText.length === 0) {
      console.log(`\n⚠️  WARNING: No RFP samples loaded! AI will NOT have format examples to replicate.`);
    }
    
    console.log(`================================\n`);

    // Generate proposal using AI
    const prompt = `You are an EXPERT proposal writer. Your task is to analyze the provided documents and create a COMPLETE RFP draft from scratch.

${languageInstruction}

CRITICAL: Generate ALL content in the same language as the tender documents (${detectedLanguage}).

🚨🚨🚨 YOUR WORKFLOW - FOLLOW EXACTLY 🚨🚨🚨:

PHASE 1: DEEP ANALYSIS (DO THIS FIRST - DO NOT SKIP)
Before creating ANY content, you MUST thoroughly analyze ALL documents provided below:

A) TENDER DOCUMENTS ANALYSIS:
   - Read EVERY tender document completely
   - Identify the EXACT structure, format, and organization required
   - Extract ALL section titles, form names, and required sections (e.g., "PORTADA", "ÍNDICE", "FORMULARIO A-1", "FORMULARIO B-2", "FORMULARIO B-3")
   - Note ALL requirements, specifications, evaluation criteria
   - Identify table structures, forms, and data presentation formats
   - Extract terminology, language style, and formatting requirements
   - Understand what the client expects in terms of structure and content

B) PREVIOUS PROPOSAL SAMPLES ANALYSIS (if available):
   - Study the EXACT structure: all section titles and their order
   - Note the format, style, tone, and writing patterns
   - Extract table structures, list formats, and data presentation methods
   - Note section depth and length (how many paragraphs per section)
   - Understand the preferred format and organization

C) COMPANY DATA DOCUMENTS ANALYSIS:
   - Extract ALL company information: exact name, contact details, address, email, phones
   - Extract ALL team members: full names, titles, qualifications, experience, certifications
   - Extract ALL projects: complete names, clients, locations, dates, values, descriptions
   - Extract ALL pricing data: materials, labor rates, costs, calculations
   - Extract ALL certifications, credentials, licenses, qualifications
   - Extract ALL financial information, equipment, capabilities
   - Note ALL structured data, tables, and formatted information

D) EXTRACTED TABLES ANALYSIS:
   - Review ALL pricing tables, material lists, rate tables
   - Note currency, units, calculations, formulas
   - Understand how to present this data in the proposal

PHASE 2: STRUCTURE CREATION (BASED ON ANALYSIS)
Based on your analysis, determine the proposal structure:
- If PREVIOUS PROPOSAL SAMPLES exist: Use their EXACT section titles and order
- If TENDER DOCUMENTS specify sections/forms: Include ALL of them with EXACT titles
- Create sections for ALL information found in COMPANY DATA DOCUMENTS
- Create sections for ALL requirements found in TENDER DOCUMENTS
- The structure should be COMPLETE - create ALL necessary sections (typically 20-40+ sections)
- DO NOT use generic section names - use EXACT names from documents

PHASE 3: CONTENT GENERATION (USE ONLY DOCUMENT INFORMATION)
For EVERY section you create:
- Extract ALL relevant information from ALL documents for that section
- Use EXACT names, dates, numbers, prices, project names, team member names from documents
- Include tables, lists, and structured data exactly as they appear in documents
- Write 10-15 detailed paragraphs per major section (NOT 1-2 paragraphs!)
- Each paragraph should be 6-8 sentences with specific details from documents
- DO NOT write generic statements - every sentence must reference specific data from documents
- Cross-reference information across documents to ensure completeness
- Include ALL relevant details - do not summarize or skip information
- Make it COMPREHENSIVE and DETAILED

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
STEP 1: ANALYZE TENDER DOCUMENTS FIRST (UNDERSTAND STRUCTURE AND REQUIREMENTS)
===================================
🚨 START HERE: These documents define the REQUIRED structure, format, and content for the RFP.

${bolivianInstructions}

${tenderDocumentsText.substring(0, 80000)}

CRITICAL ANALYSIS TASKS:
1. Identify ALL required sections, forms, and structure (e.g., "PORTADA", "ÍNDICE", "FORMULARIO A-1", "FORMULARIO B-2", "FORMULARIO B-3")
2. Understand the format, style, and organization expected
3. Extract ALL requirements, specifications, and evaluation criteria
4. Note table structures, forms, and data presentation formats
5. Extract terminology, language style, and formatting requirements
6. Identify any company information mentioned (experience, projects, team, certifications)

YOU MUST USE THIS INFORMATION TO DETERMINE THE PROPOSAL STRUCTURE.
The structure of your proposal MUST match what is required in these tender documents.

===================================
STEP 2: ANALYZE PREVIOUS PROPOSAL SAMPLES (UNDERSTAND PREFERRED FORMAT)
===================================
🚨 SECOND: These documents show the PREFERRED format and structure for successful proposals.

${modelRfpDocumentsText.substring(0, 100000)}

CRITICAL ANALYSIS TASKS:
1. Identify the EXACT structure: all section titles and their order
2. Note the format, style, tone, and writing patterns
3. Extract table structures, list formats, and data presentation methods
4. Note section depth and length (how many paragraphs per section)
5. Understand the preferred format and organization

IF PREVIOUS PROPOSAL SAMPLES EXIST: Use their EXACT section titles and order as the foundation for your proposal structure.

NOTE: If you see [HTML_CONTENT]...[/HTML_CONTENT] tags, the content between them contains HTML tables that you MUST replicate.

===================================
STEP 3: USE COMPANY DATA DOCUMENTS (FILL CONTENT WITH REAL INFORMATION)
===================================
🚨 THIRD: These documents contain ALL the real company information to use in the proposal.

${companyDataDocumentsText.substring(0, 100000)}

${companyDataChunks.length > 0 ? `\n--- Additional Company Data Context ---\n${companyDataChunks.substring(0, 10000)}` : ''}

${extractedTablesHTML}

CRITICAL: These documents contain:
- Exact company information (name, contact, address, email, phones) - USE EXACTLY
- Pricing tables (materials, labor rates, costs) - USE EXACT VALUES
- Project portfolio and experience - USE EXACT PROJECT NAMES, CLIENTS, DATES, VALUES
- Team member information and CVs - USE EXACT NAMES, TITLES, QUALIFICATIONS
- Certifications and qualifications - USE EXACTLY AS WRITTEN
- Financial information - USE EXACT NUMBERS

YOU MUST USE THIS SPECIFIC INFORMATION IN THE PROPOSAL.
Do NOT make up generic information. Extract and use the real data provided above.

${modelRfpChunks.length > 0 ? `\n--- Additional Proposal Format Context ---\n${modelRfpChunks.substring(0, 8000)}` : ''}

🚨🚨🚨 CRITICAL INSTRUCTIONS - FOLLOW THESE IN ORDER OF PRIORITY 🚨🚨🚨:

1. **ANALYZE TENDER DOCUMENTS FIRST** (HIGHEST PRIORITY - DETERMINE STRUCTURE):
   - ⚠️ The TENDER DOCUMENTS define the REQUIRED structure, format, and organization
   - ⚠️ Identify ALL required sections, forms, and structure from tender documents
   - ⚠️ Use the EXACT section titles and structure specified in tender documents
   - ⚠️ Follow the format, style, and organization required by tender documents
   - ⚠️ The proposal structure MUST match what tender documents require

2. **ANALYZE PREVIOUS PROPOSAL SAMPLES SECOND** (UNDERSTAND PREFERRED FORMAT):
   - ⚠️ If PREVIOUS PROPOSAL SAMPLES exist, use their EXACT section titles and order
   - ⚠️ Replicate the same format, style, and structure from previous proposals
   - ⚠️ Match the depth and length of content from previous proposals
   - ⚠️ Use the same table structures and data presentation methods

3. **USE COMPANY DATA DOCUMENTS FOR ALL COMPANY INFORMATION** (FILL CONTENT - MANDATORY):
   - ⚠️ EVERY piece of company information MUST come from COMPANY DATA DOCUMENTS
   - Extract and use EXACT company name, contact person, email, phones, address from these documents
   - If you see "DRJ CONSTRUCCIONES Y SERVICIOS AMBIENTALES" or any company name, USE IT EXACTLY
   - If you see email addresses (e.g., "gerencia_adm@drj-construcciones.com"), USE THEM EXACTLY
   - If you see phone numbers, addresses, or contact persons, USE THEM EXACTLY
   - If you see project names, clients, dates, values, locations - INCLUDE THEM EXACTLY in the proposal
   - If you see team member names, titles, qualifications, experience - USE THEM EXACTLY
   - If you see certifications, credentials, licenses - USE THEM EXACTLY
   - If you see prices, rates, materials, costs - USE THEM EXACTLY
   - DO NOT invent or make up ANY company information - USE ONLY what's in the COMPANY DATA DOCUMENTS
   - If information is not in the documents, DO NOT include it

4. **USE EXTRACTED TABLES FOR EXACT PRICING AND MATERIALS** (CRITICAL):
   - The "EXTRACTED TABLES FROM COMPANY DOCUMENTS" section contains EXACT prices, rates, and quantities
   - If you see a table with "Precio" or "Price" column, USE THOSE EXACT VALUES
   - If you see materials (Cemento, Arena, Ladrillo, etc.) with prices, USE THEM EXACTLY
   - If you see labor rates (Maestro Albañil, Contramaestro, etc.) with Bs/día, USE THEM EXACTLY
   - If you see percentages (Carga Social: 33.39%), USE THEM EXACTLY
   - When creating pricing sections, REPLICATE these tables with the exact same values
   - Calculate totals correctly: Price × Quantity = Total
   - DO NOT invent prices - use ONLY the prices from the extracted tables

5. **REPLICATE FORMAT FROM PREVIOUS PROPOSAL SAMPLES** (ALREADY COVERED IN STEP 2):
   - The "PREVIOUS PROPOSAL SAMPLES" section shows how successful proposals are structured
   - Use the EXACT same section titles and order as in the samples
   - Match the depth and length: if samples have 4-6 paragraphs per section, do the same
   - Replicate the same table formats and HTML structure
   - Follow the same writing style and tone
   - Use the same introduction and conclusion patterns
   - If samples use specific terminology or phrases, use them too

6. **ANALYZE TENDER DOCUMENTS THOROUGHLY AND FOLLOW THEIR GUIDELINES** (ALREADY COVERED IN STEP 1):
   - ⚠️ The TENDER DOCUMENTS section contains the OFFICIAL REQUIREMENTS, SPECIFICATIONS, and GUIDELINES
   - ⚠️ READ EVERY WORD of the tender documents - they contain the exact format, structure, and content requirements
   - Extract ALL requirements, deliverables, deadlines, specifications, evaluation criteria, and mandatory sections
   - If tender documents specify section titles (e.g., "PORTADA", "ÍNDICE", "FORMULARIO A-1"), use them EXACTLY as written
   - If tender documents specify a format (tables, forms, structure), REPLICATE IT EXACTLY
   - Use the EXACT terminology and language from the tender documents
   - If tender documents mention specific company info, cross-reference with COMPANY DATA DOCUMENTS
   - Do NOT invent requirements - USE ONLY what's in the tender documents
   - If tender documents specify minimum content length or detail level, EXCEED those requirements
   - Follow the tender document's organization structure if it's specified
   - Address EVERY evaluation criterion mentioned in the tender documents
   - Ensure compliance with ALL technical specifications from tender documents
   - Create sections based on what you find in tender documents, not on generic templates

5. **ANALYZE TENDER REQUIREMENTS DEEPLY AND ADDRESS EACH ONE**:
   - Read and understand EVERY requirement in TENDER REQUIREMENTS section
   - For EACH requirement, extract: deliverables, deadlines, specifications, quantities, quality standards
   - Create dedicated sections or subsections that directly address EACH requirement with extensive details
   - Cross-reference requirements and ensure NOTHING is missed
   - For each requirement, explain:
     * What you will deliver (specific deliverables)
     * How you will deliver it (detailed methodology)
     * When you will deliver it (specific timeline with dates)
     * Who will deliver it (team members with names from documents)
     * Why your approach is best (justification with examples from company data)
   - Include compliance statements for each requirement

4. **REPLICATE TABLES FROM DOCUMENTS**:
   - If you see tabular data in ANY documents above (especially TENDER DOCUMENTS), recreate them using HTML tables
   - Tables with team experience, project lists, qualifications are CRITICAL - must be replicated
   - Use proper HTML table structure: <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>
   - Include ALL rows and columns from the original tables
   - Maintain the same column headers and data structure
   - Apply these CSS classes: <table class="border-collapse border border-gray-300 w-full my-4">
   - For headers: <th class="border border-gray-300 bg-gray-100 font-bold p-2">
   - For cells: <td class="border border-gray-300 p-2">

6. **CREATE COMPREHENSIVE AND DETAILED CONTENT** (MINIMUM 8-12 PARAGRAPHS PER MAJOR SECTION):
   - 🚨 CRITICAL: Each major section MUST be 8-12 paragraphs minimum (NOT 1-2 paragraphs or 3-4 sentences!)
   - Each paragraph should be 5-7 sentences with specific details from documents
   - DO NOT write generic statements like "We have experience" or "We are qualified"
   - INSTEAD write: "DRJ Construcciones has completed 25 infrastructure projects over 15 years, including the [EXACT PROJECT NAME from documents] for [EXACT CLIENT NAME from documents] in [EXACT YEAR from documents], valued at [EXACT AMOUNT from documents], demonstrating our expertise in [SPECIFIC AREA from documents]"
   - Include concrete examples from COMPANY DATA DOCUMENTS and TENDER DOCUMENTS in EVERY section
   - Reference actual team members by FULL NAME and EXACT TITLE from COMPANY DATA DOCUMENTS
   - Reference actual projects by COMPLETE NAME, CLIENT, LOCATION, VALUE, and YEAR from COMPANY DATA DOCUMENTS
   - Use specific numbers from documents: "15 años de experiencia" not "amplia experiencia"
   - Use real certifications and qualifications EXACTLY as they appear in COMPANY DATA DOCUMENTS
   - Provide technical depth: Include specifications, methodologies, processes, equipment details from documents
   - Include quantifiable metrics from documents: "25 proyectos completados" not "varios proyectos"
   - Mention specific clients and project locations EXACTLY as they appear in COMPANY DATA DOCUMENTS
   - Explain HOW and WHY with specific details from documents, not just WHAT
   - Add context, background, and rationale using information from documents
   - Include ALL relevant details about processes, methodologies, and approaches from documents
   - DO NOT summarize - include ALL relevant information from documents

7. **CREATE STRUCTURE BASED ON DOCUMENTS (NOT PRE-DEFINED TEMPLATES)** (MANDATORY):
   - ⚠️ ANALYZE PREVIOUS PROPOSAL SAMPLES FIRST - they show the EXACT structure, section titles, and organization you must use
   - ⚠️ ANALYZE TENDER DOCUMENTS SECOND - they specify ALL required sections, forms, and mandatory content
   - ⚠️ CREATE the proposal structure based ONLY on what you find in these documents
   - If PREVIOUS PROPOSAL SAMPLES exist: Use the EXACT section titles and order from them
   - If you see section titles like "PORTADA", "ÍNDICE", "IDENTIFICACIÓN DEL OFERENTE", "FORMULARIO A-1", "FORMULARIO B-2", "FORMULARIO B-3", use them EXACTLY
   - Follow the formatPatterns from the samples (bullet points, numbering style, etc.)
   - Match the length: if samples have 6-10 paragraphs per section, write 6-10 paragraphs
   - Maintain the same tone and writing style as the samples
   - Replicate introduction and conclusion patterns from the samples
   - If samples use specific table structures, replicate them exactly
   - Include ALL sections that appear in the tender documents or previous proposals
   - DO NOT skip sections - create a COMPLETE proposal structure
   - DO NOT create sections that don't appear in the documents

8. **IMPLEMENT REQUIREMENTS CORRECTLY**:
   - For each tender requirement, create corresponding content that shows:
     * Understanding of the requirement
     * How you will meet it (methodology with specific approach)
     * When you will deliver it (timeline with specific dates/durations)
     * Who will do it (team/resources with actual names from documents)
   - Be specific and detailed, not generic

9. **DOCUMENT EVIDENCE FROM COMPANY DATA** (USE SPECIFIC INFORMATION, NOT GENERIC STATEMENTS):
   - Reference specific projects from COMPANY DATA DOCUMENTS by COMPLETE name, client, location, value, and year
   - Include concrete examples that demonstrate capability from COMPANY DATA DOCUMENTS in EVERY relevant section
   - Use quantifiable metrics: "15 proyectos similares completados entre 2018-2024" not "varios proyectos"
   - Cite certifications and credentials EXACTLY as they appear in COMPANY DATA DOCUMENTS (include certificate numbers if available)
   - Mention team members with their EXACT FULL NAMES, EXACT TITLES, and SPECIFIC experience from COMPANY DATA DOCUMENTS
   - Include financial information if available in COMPANY DATA DOCUMENTS
   - DO NOT write "We have experience" - INSTEAD write "DRJ Construcciones completed [PROJECT NAME] for [CLIENT] in [YEAR], a [TYPE] project valued at [AMOUNT], demonstrating our expertise in [SPECIFIC AREA]"
   - DO NOT write "Our team is qualified" - INSTEAD write "Our team includes [FULL NAME], [TITLE], with [X] years of experience in [SPECIFIC AREA], as evidenced by [SPECIFIC PROJECT/CERTIFICATION]"
   - DO NOT write generic statements - ALWAYS include specific names, dates, numbers, and facts

10. **ANALYZE ALL AVAILABLE INFORMATION BEFORE WRITING**:
   - Before writing each section, review ALL relevant information from:
     * TENDER DOCUMENTS (requirements, specifications, guidelines)
     * COMPANY DATA DOCUMENTS (company info, projects, team, prices)
     * EXTRACTED TABLES (exact prices, materials, rates)
     * PREVIOUS PROPOSAL SAMPLES (format, structure, style)
   - Cross-reference information across documents to ensure consistency
   - If information appears in multiple documents, use the most detailed version
   - Extract and use ALL relevant details - do not skip information
   - If a document mentions a project, person, or fact, include it in the proposal where relevant

CONTENT LENGTH REQUIREMENTS:
- Each major section must contain MINIMUM 10-15 paragraphs (NOT 1-2 paragraphs!)
- Each paragraph must be 6-8 sentences with specific details from documents
- Total proposal should be COMPREHENSIVE (create ALL necessary sections - typically 25-50+ sections for a complete proposal)
- DO NOT create short sections - if a section is less than 10 paragraphs, expand it with more details from documents
- Include tables, lists, and structured data exactly as they appear in documents
- Use examples, case studies, and specific references from documents throughout
- Make it EXTENSIVE and DETAILED - this is a complete RFP, not a summary

🚨 STRUCTURE CREATION (TOTAL FREEDOM):
- You have COMPLETE FREEDOM to create the structure based on documents
- Create ALL sections that are required by the tender documents
- Create ALL sections that appear in the previous proposal samples
- Add ALL sections that are relevant based on company data and requirements
- DO NOT limit yourself - create a COMPLETE, COMPREHENSIVE proposal
- Each section should be substantial and detailed (8-12 paragraphs minimum)
- Include ALL information from documents - do not skip or summarize

Return the proposal as JSON in this exact format:
{
  "sections": [
    {
      "id": "section_1",
      "title": "EXACT section title from tender documents or previous proposal samples (e.g., 'PORTADA', 'ÍNDICE', 'FORMULARIO A-1', 'FORMULARIO B-2', 'FORMULARIO B-3', etc.). Use EXACT titles from documents - DO NOT use generic titles.",
      "content": "EXTENSIVE rich text content in HTML format (10-15 paragraphs minimum) with tables if needed. Each paragraph must be 6-8 sentences with specific details using ONLY information from the documents provided. Include EXACT names, dates, numbers, projects, team members, prices, certifications from documents. DO NOT write generic statements - every sentence must reference specific data from documents. Make it COMPREHENSIVE and DETAILED.",
      "order": 0
    }
  ]
}

🚨 CRITICAL REQUIREMENTS FOR JSON RESPONSE:
- Create ALL sections that appear in tender documents or previous proposals (typically 25-50+ sections)
- Use EXACT section titles from documents (do not modify or translate them)
- Each section must contain 10-15 paragraphs with specific information from documents
- Each paragraph must be 6-8 sentences with specific details from documents
- Include tables, lists, and structured data exactly as they appear in documents
- Do not limit the number of sections - include everything needed for a complete proposal
- Do not create sections that don't appear in or relate to the documents
- Every piece of information must come from the documents provided
- Cross-reference information across documents to ensure completeness
- Include ALL relevant details - do not summarize or skip information
- Make it COMPREHENSIVE - this is a complete RFP, not a summary

HTML FORMATTING REQUIREMENTS:
- Use <p> for paragraphs (each paragraph should be 5-7 sentences with specific details from documents)
- Use <strong> for bold text (NOT **text**)
- Use <em> for italic text
- Use <ul><li> for bullet lists (use lists to break down complex information)
- Use <ol><li> for numbered lists (use for step-by-step processes)
- Use <h2>, <h3> for sub-headings (break long sections into subsections)
- Use <table> with proper structure for tabular data (include tables wherever data is presented)
- Use <br> for line breaks if needed
- Use <blockquote> for important quotes or highlights
- Structure content with clear hierarchy: sections → subsections → paragraphs → details

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

⚠️ STRUCTURE CREATION GUIDELINES (MANDATORY - CREATE BASED ON DOCUMENTS ONLY):
- ⚠️ DO NOT use generic or pre-defined sections like "Executive Summary" or "Company Profile" unless they appear in the documents
- ⚠️ ANALYZE the TENDER DOCUMENTS FIRST to identify ALL required sections, forms, and structure
- ⚠️ ANALYZE the PREVIOUS PROPOSAL SAMPLES SECOND to understand the exact format and section organization
- ⚠️ CREATE the structure based ONLY on what you find in the documents, NOT on templates or memory
- ⚠️ If tender documents specify section titles (like "PORTADA", "ÍNDICE", "FORMULARIO A-1", "FORMULARIO B-2", "FORMULARIO B-3"), use them EXACTLY
- ⚠️ If previous proposals have specific sections, replicate that EXACT structure
- ⚠️ Include ALL sections that are required by the tender documents
- ⚠️ Add sections that are relevant based on the company data and tender requirements
- ⚠️ The structure should be COMPLETE and COMPREHENSIVE - include everything needed for a winning proposal
- ⚠️ DO NOT create sections that don't appear in any of the documents provided

⚠️⚠️⚠️ FINAL CRITICAL REMINDERS BEFORE GENERATING ⚠️⚠️⚠️:

1. ⚠️ ANALYZE ALL DOCUMENTS FIRST - Read EVERY section of EVERY document provided. Do NOT start writing until you've analyzed everything.

2. ⚠️ CREATE STRUCTURE FROM DOCUMENTS ONLY - Build the proposal structure based EXCLUSIVELY on what you find in tender documents and previous proposals. DO NOT use pre-defined templates or generic sections.

3. ⚠️ USE ONLY DOCUMENT INFORMATION - EVERY name, date, number, project, team member, price, certification MUST come from the documents. DO NOT invent anything.

4. ⚠️ GENERATE EXTENSIVE CONTENT - Each section MUST be 10-15 paragraphs minimum with specific details from documents. Each paragraph must be 6-8 sentences. This is a COMPLETE RFP, not a summary.

5. ⚠️ FOLLOW TENDER GUIDELINES EXACTLY - Replicate format, structure, section titles, and requirements from tender documents exactly as written.

6. ⚠️ REPLICATE PREVIOUS PROPOSAL FORMAT - Use the EXACT same structure, section titles, order, and style as successful proposals if available.

7. ⚠️ CREATE ALL REQUIRED SECTIONS - Include EVERY section mentioned in tender documents or previous proposals. DO NOT skip any.

8. ⚠️ DO NOT WRITE GENERIC CONTENT - Every statement must reference specific data from documents. NO generic statements like "We have experience" - instead "DRJ Construcciones completed [PROJECT NAME] for [CLIENT] in [YEAR]".

9. ⚠️ INCLUDE TABLES AND STRUCTURED DATA - Replicate ALL tables from documents using HTML with exact values.

10. ⚠️ BE COMPREHENSIVE - Address every requirement, include all relevant information from documents, leave nothing out.

11. ⚠️ DO NOT CREATE SECTIONS NOT IN DOCUMENTS - If a section doesn't appear in the documents, don't create it.

12. ⚠️ VERIFY EVERY STATEMENT - Before writing anything, verify it exists in the documents. If it doesn't, don't write it.

Return only valid JSON with HTML content, no markdown syntax.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8, // Increased for more creative and extensive content generation
      max_tokens: 16384, // Maximum allowed by gpt-4o model for comprehensive proposals
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

