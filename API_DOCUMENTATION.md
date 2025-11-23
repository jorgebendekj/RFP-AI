# RFP AI - API Documentation

Complete API reference for all endpoints in the RFP AI system.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

Current implementation uses localStorage for session management. All authenticated requests should include the user's `userId` and `companyId` from localStorage.

**Future**: Implement JWT tokens in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register User

Create a new user account and company.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "companyName": "Acme Construction",
  "industry": "Construction",
  "country": "United States"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "userId": "uuid-string",
  "companyId": "uuid-string"
}
```

**Errors**:
- 400: Missing required fields
- 400: User already exists
- 500: Registration failed

---

### Login User

Authenticate user and retrieve user information.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "uuid-string",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "admin",
    "companyId": "uuid-string"
  }
}
```

**Errors**:
- 400: Email and password are required
- 401: Invalid credentials
- 500: Login failed

---

## Document Management Endpoints

### Upload Document

Upload and process a document (PDF, DOCX, or TXT).

**Endpoint**: `POST /api/documents/upload`

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: File (PDF/DOCX/TXT)
- `companyId`: string
- `userId`: string
- `type`: "model_rfp" | "company_data" | "tender_document"

**Response** (200):
```json
{
  "documentId": "uuid-string",
  "message": "Document uploaded successfully"
}
```

**Processing**:
Document is processed asynchronously:
1. Text extraction
2. Chunking (500 tokens)
3. Embedding generation
4. Status updated to "processed"

**Errors**:
- 400: Missing required fields
- 500: Upload failed

---

### List Documents

Get all documents for a company.

**Endpoint**: `GET /api/documents/list`

**Query Parameters**:
- `companyId` (required): string
- `type` (optional): "model_rfp" | "company_data" | "tender_document"

**Response** (200):
```json
{
  "documents": [
    {
      "id": "uuid-string",
      "companyId": "uuid-string",
      "type": "model_rfp",
      "fileName": "Previous_Proposal_2023.pdf",
      "filePath": "/uploads/company-id/file.pdf",
      "mimeType": "application/pdf",
      "uploadedByUserId": "uuid-string",
      "uploadedAt": 1234567890,
      "textExtracted": "Full text content...",
      "metadata": "{\"pages\":10,\"wordCount\":5000}",
      "hasTables": true,
      "status": "processed"
    }
  ]
}
```

**Errors**:
- 400: Company ID is required
- 500: Failed to list documents

---

## Tender Management Endpoints

### Create Tender

Create a new tender record.

**Endpoint**: `POST /api/tenders/create`

**Request Body**:
```json
{
  "companyId": "uuid-string",
  "title": "Highway Construction Project",
  "clientName": "Department of Transportation",
  "tenderCode": "RFP-2024-001",
  "country": "United States",
  "deadline": 1735689600000,
  "relatedDocumentIds": ["doc-id-1", "doc-id-2"]
}
```

**Response** (200):
```json
{
  "tenderId": "uuid-string",
  "message": "Tender created successfully"
}
```

**Errors**:
- 400: Missing required fields (companyId, title, clientName)
- 500: Failed to create tender

---

### List Tenders

Get all tenders for a company.

**Endpoint**: `GET /api/tenders/list`

**Query Parameters**:
- `companyId` (required): string

**Response** (200):
```json
{
  "tenders": [
    {
      "id": "uuid-string",
      "companyId": "uuid-string",
      "title": "Highway Construction Project",
      "clientName": "Department of Transportation",
      "tenderCode": "RFP-2024-001",
      "country": "United States",
      "relatedDocumentIds": "[\"doc-id-1\",\"doc-id-2\"]",
      "parsedRequirements": "{\"requirements\":[...]}",
      "deadline": 1735689600000,
      "createdAt": 1234567890
    }
  ]
}
```

**Errors**:
- 400: Company ID is required
- 500: Failed to list tenders

---

## Proposal Management Endpoints

### List Proposals

Get all proposals for a company.

**Endpoint**: `GET /api/proposals/list`

**Query Parameters**:
- `companyId` (required): string

**Response** (200):
```json
{
  "proposals": [
    {
      "id": "uuid-string",
      "companyId": "uuid-string",
      "tenderId": "uuid-string",
      "name": "Proposal for Highway Construction",
      "status": "draft",
      "aiGeneratedStructure": "{\"sections\":[...]}",
      "editorState": "{\"sections\":[...]}",
      "lastEditedByUserId": "uuid-string",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

**Errors**:
- 400: Company ID is required
- 500: Failed to list proposals

---

### Update Proposal

Update proposal editor state or status.

**Endpoint**: `POST /api/proposals/update`

**Request Body**:
```json
{
  "proposalId": "uuid-string",
  "editorState": {
    "sections": [
      {
        "id": "section-1",
        "title": "Executive Summary",
        "content": "<p>Updated content...</p>",
        "order": 0
      }
    ]
  },
  "status": "in_review",
  "userId": "uuid-string"
}
```

**Response** (200):
```json
{
  "message": "Proposal updated successfully"
}
```

**Errors**:
- 400: Proposal ID is required
- 500: Failed to update proposal

---

### Export Proposal

Export proposal to PDF or DOCX format.

**Endpoint**: `POST /api/proposals/export`

**Request Body**:
```json
{
  "proposalId": "uuid-string",
  "format": "pdf"
}
```

**Response** (200):
Binary file download with appropriate Content-Type:
- PDF: `application/pdf`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Errors**:
- 400: Missing required fields
- 404: Proposal not found
- 400: Invalid format
- 500: Export failed

---

## AI Endpoints

### Generate Embeddings

Generate embeddings for text using OpenAI.

**Endpoint**: `POST /api/ai/embed`

**Request Body**:
```json
{
  "text": "Text to embed..."
}
```

**Response** (200):
```json
{
  "embedding": [0.123, -0.456, 0.789, ...]
}
```

**Notes**:
- Uses `text-embedding-3-small` model
- Text is truncated to 8000 characters
- Returns 1536-dimensional vector

**Errors**:
- 400: Text is required
- 500: Failed to generate embedding

---

### Parse Tender

Analyze tender documents and extract structured requirements.

**Endpoint**: `POST /api/ai/parse-tender`

**Request Body**:
```json
{
  "tenderId": "uuid-string"
}
```

**Response** (200):
```json
{
  "parsedRequirements": {
    "requirements": [
      "Minimum 10 years experience",
      "ISO 9001 certification required"
    ],
    "scopeOfWork": "Design and construction of 5km highway...",
    "evaluationCriteria": [
      "Technical capability (40%)",
      "Price (30%)",
      "Experience (30%)"
    ],
    "billOfQuantities": [
      {
        "item": "Asphalt paving",
        "unit": "square meter",
        "quantity": 5000,
        "estimatedPrice": 50
      }
    ],
    "technicalSpecifications": [...],
    "submissionDeadline": "December 31, 2024",
    "eligibilityCriteria": [...],
    "documentationRequired": [...]
  }
}
```

**Processing**:
1. Retrieves tender documents
2. Combines text (max 15,000 chars)
3. Sends to GPT-4o with structured prompt
4. Extracts requirements, scope, criteria, BOQ, etc.
5. Stores in tender.parsedRequirements

**Errors**:
- 400: Tender ID is required
- 404: Tender not found
- 500: Failed to parse tender

---

### Analyze Company Style

Analyze company's writing style from model RFPs.

**Endpoint**: `POST /api/ai/analyze-company-style`

**Request Body**:
```json
{
  "companyId": "uuid-string"
}
```

**Response** (200):
```json
{
  "companyStyle": {
    "typicalSections": [
      {
        "name": "Executive Summary",
        "order": 1,
        "description": "Brief overview highlighting key strengths"
      }
    ],
    "toneOfVoice": "Professional and technical with emphasis on quantifiable results",
    "writingPatterns": [
      "Uses bullet points for key achievements",
      "Includes specific metrics and KPIs",
      "Emphasizes safety and quality"
    ],
    "commonPhrases": [
      "proven track record",
      "industry-leading",
      "commitment to excellence"
    ],
    "structuralElements": [
      "Executive summary at start",
      "Tables for project history",
      "Charts for timeline"
    ],
    "technicalDepth": "High - includes detailed technical specifications and methodologies",
    "visualElements": [
      "Project timelines",
      "Organization charts",
      "Photo galleries"
    ]
  }
}
```

**Processing**:
1. Retrieves up to 3 model RFP documents
2. Samples 5000 chars from each
3. Sends to GPT-4o for analysis
4. Returns structured style profile

**Errors**:
- 400: Company ID is required
- 404: No model RFP documents found
- 500: Failed to analyze company style

---

### Generate Proposal

Generate a complete proposal draft using AI and RAG.

**Endpoint**: `POST /api/ai/generate-proposal`

**Request Body**:
```json
{
  "tenderId": "uuid-string",
  "companyId": "uuid-string",
  "userId": "uuid-string"
}
```

**Response** (200):
```json
{
  "proposalId": "uuid-string",
  "proposal": {
    "sections": [
      {
        "id": "cover",
        "title": "Cover Page",
        "content": "<h1>Proposal for Highway Construction</h1>...",
        "order": 0
      },
      {
        "id": "executive_summary",
        "title": "Executive Summary",
        "content": "<p>We are pleased to submit...</p>",
        "order": 1
      }
    ]
  }
}
```

**Processing** (30-60 seconds):
1. Retrieve tender requirements
2. Get company information
3. Analyze company writing style
4. Retrieve relevant document chunks (RAG)
5. Build comprehensive prompt with context
6. Generate proposal with GPT-4o
7. Create proposal record in database
8. Return proposal ID and structure

**Standard Sections**:
- Cover Page
- Executive Summary
- Company Profile and Experience
- Understanding of Requirements
- Technical Approach and Methodology
- Project Team and Organization
- Timeline and Deliverables
- Quality Assurance
- Bill of Quantities and Pricing
- Compliance Matrix
- Appendices

**Errors**:
- 400: Missing required fields
- 404: Tender not found
- 500: Failed to generate proposal

---

### Improve Section

Use AI to improve a specific proposal section.

**Endpoint**: `POST /api/ai/complete-section`

**Request Body**:
```json
{
  "proposalId": "uuid-string",
  "sectionId": "executive_summary",
  "instructions": "Make this more formal and add emphasis on our 20 years of experience",
  "currentContent": "<p>Current content...</p>"
}
```

**Response** (200):
```json
{
  "content": "<p>Improved content with requested changes...</p>"
}
```

**Processing**:
1. Retrieve proposal and section
2. Build prompt with current content and instructions
3. Send to GPT-4o
4. Update section content in database
5. Return improved content

**Common Instructions**:
- "Make this more formal"
- "Add more technical details"
- "Shorten to 300 words"
- "Emphasize our experience"
- "Make it more persuasive"

**Errors**:
- 400: Missing required fields
- 404: Proposal or section not found
- 500: Failed to complete section

---

## Data Models

### User

```typescript
{
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  companyId: string;
  createdAt: number;
}
```

### Company

```typescript
{
  id: string;
  name: string;
  industry: string;
  country: string;
  defaultLanguage: string;
  createdAt: number;
}
```

### Document

```typescript
{
  id: string;
  companyId: string;
  type: 'model_rfp' | 'company_data' | 'tender_document';
  fileName: string;
  filePath: string;
  mimeType: string;
  uploadedByUserId: string;
  uploadedAt: number;
  textExtracted: string;
  metadata: string; // JSON
  hasTables: boolean;
  status: 'uploaded' | 'processed' | 'error';
}
```

### DocumentChunk

```typescript
{
  id: string;
  documentId: string;
  companyId: string;
  type: 'model_rfp' | 'company_data' | 'tender_document';
  content: string;
  section: string;
  orderIndex: number;
  embedding: string; // JSON array of numbers
  createdAt: number;
}
```

### Tender

```typescript
{
  id: string;
  companyId: string;
  title: string;
  clientName: string;
  tenderCode: string;
  country: string;
  relatedDocumentIds: string; // JSON array
  parsedRequirements: string; // JSON object
  deadline: number;
  createdAt: number;
}
```

### Proposal

```typescript
{
  id: string;
  companyId: string;
  tenderId: string;
  name: string;
  status: 'draft' | 'in_review' | 'final';
  aiGeneratedStructure: string; // JSON
  editorState: string; // JSON
  lastEditedByUserId: string;
  finalExportPath?: string;
  createdAt: number;
  updatedAt: number;
}
```

---

## Error Handling

All endpoints follow this error format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limits

**Current**: No rate limiting implemented

**Recommended** for production:
- Authentication: 5 requests per minute
- Document upload: 10 requests per minute
- AI generation: 5 requests per minute per user
- Other endpoints: 60 requests per minute

---

## Webhooks (Future)

Planned webhook support for:
- Document processing complete
- Proposal generation complete
- User actions (audit trail)

---

## SDK / Client Libraries (Future)

Planned support for:
- JavaScript/TypeScript SDK
- Python SDK
- REST client examples

---

## Changelog

### v1.0.0 (Current)
- Initial release
- All core endpoints implemented
- InstantDB integration
- OpenAI GPT-4o integration

### Future Versions
- v1.1.0: Add rate limiting
- v1.2.0: Add webhooks
- v2.0.0: GraphQL API



