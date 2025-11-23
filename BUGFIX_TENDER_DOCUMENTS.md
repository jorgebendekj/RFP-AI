# Bug Fix: AI Not Using Tender Documents Information

## Problem Reported

User uploaded 5 documents with company information (DRJ Construcciones) but the AI generated proposal:
- Was too short
- Had random/generic information
- Did NOT use the specific information from the uploaded documents
- Did NOT use company name, team members, projects, certifications from documents

## Root Cause

The AI proposal generation was NOT loading the tender documents that were uploaded and linked to the tender.

### Code Issue:
In `src/app/api/ai/generate-proposal/route.ts`:

**Before:**
```typescript
// Only loaded model_rfp and company_data chunks
const modelRfpChunks = chunks
  .filter((c: any) => c.type === 'model_rfp')
  .slice(0, 10)  // Only 10 chunks
  .map((c: any) => c.content)
  .join('\n\n');

const companyDataChunks = chunks
  .filter((c: any) => c.type === 'company_data')
  .slice(0, 5)   // Only 5 chunks
  .map((c: any) => c.content)
  .join('\n\n');

// MISSING: No loading of tender documents!
```

The 5 documents uploaded were linked to the tender with `relatedDocumentIds` but were never fetched or passed to the AI.

## Solution Implemented

### 1. Load Tender Documents

Added code to fetch ALL tender documents:

```typescript
// Get ALL documents linked to this tender
let tenderDocumentsText = '';
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
      tenderDocumentsText = tenderDocs
        .map((doc: any) => `
=== DOCUMENT: ${doc.fileName} ===
${doc.textExtracted}
=== END DOCUMENT ===
`)
        .join('\n\n');
      
      console.log(`Loaded ${tenderDocs.length} tender documents with ${tenderDocumentsText.length} characters`);
    }
  } catch (e) {
    console.error('Error loading tender documents:', e);
  }
}
```

### 2. Pass Tender Documents to AI

Updated the prompt to include tender documents with HIGH PRIORITY:

```
===================================
TENDER DOCUMENTS (USE THIS INFORMATION - COMPANY CREDENTIALS, EXPERIENCE, CERTIFICATIONS):
===================================
${tenderDocumentsText.substring(0, 25000)}

CRITICAL: The tender documents above contain the company's actual information including:
- Company experience and completed projects
- Team member names, titles, and qualifications
- Certifications and credentials
- Technical capabilities and equipment
- Previous similar work
- Specific data, numbers, dates, and facts

YOU MUST USE THIS SPECIFIC INFORMATION FROM TENDER DOCUMENTS IN THE PROPOSAL.
Do NOT make up generic information. Extract and use the real data provided above.
```

### 3. Enhanced Instructions

Added critical instruction as #1 priority:

```
1. **USE TENDER DOCUMENTS INFORMATION FIRST**:
   - The TENDER DOCUMENTS section above contains THE ACTUAL COMPANY INFORMATION
   - Extract ALL company names, team member names, project names, dates, numbers from these documents
   - If you see "DRJ Construcciones" or any company name, USE IT
   - If you see team member names (e.g., "Ing. Juan Pérez"), USE THEM with exact titles
   - If you see project examples (e.g., "Proyecto Hospital Central 2022"), INCLUDE THEM
   - If you see certifications or qualifications, COPY THEM EXACTLY
   - If you see tables with experience, projects, or qualifications, REPLICATE THEM
   - Do NOT invent names, projects, or data - USE what's in the tender documents
```

### 4. Require Comprehensive Content

Added instruction to generate detailed content:

```
4. **CREATE COMPREHENSIVE AND DETAILED CONTENT**:
   - MINIMUM 4-6 paragraphs per major section (not 1-2 sentences!)
   - Each section should be substantial with specific details
   - Include concrete examples from tender documents
   - Reference actual team members by name and title from documents
   - Reference actual projects by name and details from documents
   - Use specific numbers: "15 años de experiencia" not "amplia experiencia"
   - Use real certifications and qualifications from documents
   - Provide technical depth and specifications
```

### 5. Increased Chunk Limits

Increased the amount of reference data:

```typescript
// Increased from 10 to 15
const modelRfpChunks = chunks
  .filter((c: any) => c.type === 'model_rfp')
  .slice(0, 15)
  
// Increased from 5 to 10
const companyDataChunks = chunks
  .filter((c: any) => c.type === 'company_data')
  .slice(0, 10)
```

## Changes Summary

### File: `src/app/api/ai/generate-proposal/route.ts`

1. **Line ~113-133**: Added code to load tender documents from `relatedDocumentIds`
2. **Line ~134-148**: Increased chunk limits for better context
3. **Line ~220-234**: Added TENDER DOCUMENTS section to prompt with 25,000 character limit
4. **Line ~236-247**: Added critical instruction #1 to use tender documents first
5. **Line ~254-262**: Enhanced table replication instructions
6. **Line ~264-272**: Added requirement for comprehensive, detailed content
7. **Line ~284-293**: Enhanced evidence documentation requirements

## Expected Results

After this fix, when generating a proposal with uploaded tender documents:

✅ **Company Name**: Should use "DRJ Construcciones" if that's in the documents  
✅ **Team Members**: Should include actual names and titles from documents  
✅ **Projects**: Should reference specific projects mentioned in documents  
✅ **Certifications**: Should list exact certifications from documents  
✅ **Experience**: Should use specific numbers and details from documents  
✅ **Tables**: Should replicate any tables from documents (team experience, project lists, etc.)  
✅ **Content Length**: Each section should be 4-6 paragraphs with substantial detail  
✅ **Specific Data**: Should use real numbers, dates, percentages from documents  

## Testing Instructions

1. **Upload Documents**: Upload 5 documents with company information to a tender
2. **Parse Tender**: Click "Analizar requisitos de licitación" to parse requirements
3. **Generate Proposal**: Click "Generar propuesta" to create proposal
4. **Verify**: Check that the generated proposal includes:
   - Actual company name from documents
   - Specific team member names and titles
   - Specific project names and details
   - Real certifications and qualifications
   - Tables if they exist in source documents
   - 4-6 paragraphs per section with detailed content

## Debugging

Check terminal logs for:
```
Loaded X tender documents with Y characters
```

This confirms tender documents were loaded successfully.

If still not working, check:
1. Are documents status = 'processed'? (not 'uploaded' or 'error')
2. Do documents have `textExtracted` populated?
3. Is `relatedDocumentIds` in tender properly formatted as JSON array?

## Additional Notes

- Tender documents are prioritized at 25,000 characters (vs 8,000 for model RFPs and 3,000 for company data)
- The AI is explicitly instructed to NOT invent information
- The AI is instructed to extract and replicate tables from documents
- Each document is clearly labeled with `=== DOCUMENT: filename ===` for the AI to identify source

## Future Improvements

1. **Semantic Search**: Instead of passing all text, use embeddings to find most relevant chunks
2. **Document Preprocessing**: Extract tables, names, and key entities before sending to AI
3. **Structured Extraction**: Pre-extract company name, team members, projects in structured format
4. **Validation**: Check that generated content includes extracted key entities
5. **User Feedback**: Allow user to mark which documents contain team info vs technical specs


