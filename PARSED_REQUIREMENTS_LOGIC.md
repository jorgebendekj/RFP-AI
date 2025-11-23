# Parsed Requirements Logic Documentation

## Overview

The **Parse Tender Requirements** feature uses AI (GPT-4o) to analyze uploaded tender documents and extract structured information that is later used to generate tailored proposals.

## How It Works

### 1. Document Upload & Processing
When you upload tender documents:

```
User uploads PDF/DOCX → File saved to disk → Text extraction → 
Document stored in database → Processing status updated
```

**Files involved:**
- `src/app/api/documents/upload/route.ts` - Handles file upload
- `src/lib/file-processor.ts` - Extracts text from PDFs/DOCX

**What happens:**
- Text is extracted from the document
- Document chunks are created (500 token chunks)
- Embeddings are generated for semantic search
- Status changes: `uploaded` → `processing` → `processed`

### 2. Linking Documents to Tenders
When creating a tender:

```
User selects documents → Document IDs stored in tender.relatedDocumentIds → 
These documents are used for parsing and proposal generation
```

**Files involved:**
- `src/app/dashboard/tenders/new/page.tsx` - Tender creation form
- `src/app/api/tenders/create/route.ts` - Creates tender with linked docs

**What's stored:**
```json
{
  "tenderId": "uuid",
  "title": "YPFB 3",
  "relatedDocumentIds": "[\"doc-id-1\", \"doc-id-2\", \"doc-id-3\"]"
}
```

### 3. Parse Tender Requirements
When you click **"Parse Tender Requirements"**:

```
Click button → Fetch tender → Get linked documents → 
Extract text from documents → Send to GPT-4o → Parse requirements →
Store parsed data → Display on UI
```

**Files involved:**
- `src/app/api/ai/parse-tender/route.ts` - Main parsing logic
- `src/app/dashboard/tenders/[id]/page.tsx` - UI for displaying parsed data

**API Flow:**
```typescript
POST /api/ai/parse-tender
Body: { tenderId: "uuid" }

// 1. Get tender from database
const tender = await db.query({ tenders: { where: { id: tenderId } } });

// 2. Get linked document IDs
const documentIds = JSON.parse(tender.relatedDocumentIds || '[]');

// 3. Fetch actual documents
const documents = await db.query({ 
  documents: { where: { id: { in: documentIds } } } 
});

// 4. Combine text from all linked documents
const combinedText = documents
  .map(doc => doc.textExtracted)
  .join('\n\n');

// 5. Send to GPT-4o for analysis
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{
    role: 'user',
    content: `Analyze this tender document and extract:
    - Mandatory requirements
    - Scope of work
    - Evaluation criteria (with weights)
    - Bill of quantities
    - Technical specifications
    - Eligibility criteria
    - Documentation required
    
    Tender text: ${combinedText.substring(0, 15000)}`
  }],
  response_format: { type: 'json_object' }
});

// 6. Parse and store result
const parsedRequirements = JSON.parse(completion.choices[0].message.content);
await db.update({ tenders: { [tenderId]: { parsedRequirements: JSON.stringify(parsedRequirements) } } });
```

**What AI extracts:**
```json
{
  "requirements": ["List of mandatory requirements"],
  "scopeOfWork": "Detailed scope description",
  "evaluationCriteria": [
    { "criterion": "Technical approach", "weight": "40%" },
    { "criterion": "Price", "weight": "60%" }
  ],
  "billOfQuantities": [
    {
      "item": "Item description",
      "unit": "m²",
      "quantity": 100,
      "estimatedPrice": 5000
    }
  ],
  "technicalSpecifications": ["List of technical specs"],
  "eligibilityCriteria": ["List of eligibility requirements"],
  "documentationRequired": ["List of required documents"]
}
```

### 4. Generate Proposal
When you click **"Generate Proposal"**:

```
Click button → Get tender + parsed requirements → Get company documents → 
Analyze company style → Get RAG chunks → Send all to GPT-4o → 
Generate proposal sections → Store proposal → Redirect to editor
```

**Files involved:**
- `src/app/api/ai/generate-proposal/route.ts` - Main generation logic

**API Flow:**
```typescript
POST /api/ai/generate-proposal
Body: { tenderId: "uuid", companyId: "uuid", userId: "uuid" }

// 1. Get tender with parsed requirements
const tender = await db.query({ tenders: { where: { id: tenderId } } });
const parsedRequirements = JSON.parse(tender.parsedRequirements);

// 2. Get company information
const company = await db.query({ companies: { where: { id: companyId } } });

// 3. Get company's previous proposals (for style reference)
const modelRfpDocs = await db.query({ 
  documents: { where: { companyId, type: 'model_rfp' } } 
});

// 4. Get company data (certificates, experience, etc.)
const companyDataDocs = await db.query({ 
  documents: { where: { companyId, type: 'company_data' } } 
});

// 5. Get document chunks for RAG
const chunks = await db.query({ 
  documentChunks: { where: { companyId } } 
});

// 6. Detect language from tender documents
const tenderDocs = await db.query({ 
  documents: { where: { id: { in: documentIds } } } 
});
const detectedLanguage = tenderDocs[0]?.detectedLanguage || 'en';

// 7. Send everything to GPT-4o
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{
    role: 'user',
    content: `Generate a proposal in ${detectedLanguage} language.
    
    TENDER REQUIREMENTS: ${JSON.stringify(parsedRequirements)}
    COMPANY INFO: ${company.name}, ${company.industry}
    COMPANY STYLE: ${companyStyle}
    PREVIOUS PROPOSALS (for reference): ${modelRfpChunks}
    COMPANY DATA (certificates, experience): ${companyDataChunks}
    
    Generate a complete proposal that:
    1. Addresses ALL tender requirements
    2. Matches company's writing style
    3. Uses company's previous successful proposals as reference
    4. Includes company data (experience, certificates, etc.)
    5. Is in the same language as the tender`
  }]
});

// 8. Store proposal
const proposalId = uuidv4();
await db.create({ proposals: { 
  id: proposalId,
  tenderId,
  companyId,
  editorState: JSON.stringify(generatedSections),
  language: detectedLanguage
} });
```

## Key Points

### ✅ AI USES ONLY TENDER DOCUMENTS
- The AI receives the **actual text** from uploaded tender documents
- It analyzes up to **15,000 characters** from the combined tender documents
- The parsed requirements are **directly extracted** from your uploaded PDFs/DOCX

### ✅ Proposal Generation Uses:
1. **Parsed requirements** (from tender docs)
2. **Company's previous proposals** (model_rfp documents)
3. **Company data** (company_data documents - certificates, experience, etc.)
4. **Company style analysis** (tone, structure from previous proposals)

### ✅ Language Detection
- AI automatically detects the tender language
- Proposal is generated in the **same language** as the tender
- Supports 50+ languages

### ✅ RAG (Retrieval Augmented Generation)
- Document chunks are stored with embeddings
- Relevant chunks are retrieved based on tender requirements
- AI uses these chunks to generate contextually relevant proposals

## Troubleshooting

### Issue: "No documents uploaded yet"
**Cause:** No documents are linked to the tender
**Solution:** 
1. Go to Documents page
2. Upload tender documents (select "Tender Document" type)
3. Wait for processing to complete
4. When creating tender, select the uploaded documents

### Issue: Parse button doesn't work
**Cause:** No linked documents or documents not processed
**Solution:**
1. Check tender detail page → "Linked Documents" section
2. Ensure documents show "✓ Ready" status
3. If documents are "Uploaded" (not processed), wait a few minutes

### Issue: Generated proposal is in wrong language
**Cause:** Language detection failed
**Solution:**
1. Check if tender documents are properly processed
2. Documents should have `detectedLanguage` field
3. System defaults to English if detection fails

### Issue: Proposal doesn't match requirements
**Cause:** Parsed requirements might be incomplete
**Solution:**
1. Click "Parse Tender Requirements" again
2. Check if all sections are filled in the parsed results
3. Ensure tender documents are clear and structured

## Files Reference

| File | Purpose |
|------|---------|
| `src/app/api/ai/parse-tender/route.ts` | Parses tender documents |
| `src/app/api/ai/generate-proposal/route.ts` | Generates proposals |
| `src/app/api/documents/upload/route.ts` | Handles document uploads |
| `src/lib/file-processor.ts` | Extracts text from files |
| `src/lib/language-detector.ts` | Language detection utilities |

## Environment Variables

```bash
OPENAI_API_KEY=sk-...         # Required for AI features
INSTANTDB_ADMIN_TOKEN=...     # Required for database access
```

## AI Model

**GPT-4o** is used for all AI operations:
- ✅ Fast and accurate
- ✅ Supports 50+ languages
- ✅ JSON mode for structured outputs
- ✅ Large context window (128K tokens)

---

**Last Updated:** November 21, 2025


