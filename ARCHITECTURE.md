# RFP AI - System Architecture

## Overview

RFP AI is built as a modern, serverless web application using Next.js 14 with the App Router. The architecture follows a clear separation between frontend presentation, API logic, and data persistence.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   Auth   │  │Dashboard │  │ Tenders  │  │   Canvas     │   │
│  │  Pages   │  │   Pages  │  │  Pages   │  │   Editor     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────┴────────────────────────────────────────┐
│                    Next.js API Routes                            │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐      │
│  │  Auth   │  │Documents│  │ Tenders  │  │   AI APIs   │      │
│  │  APIs   │  │  APIs   │  │   APIs   │  │  (RAG/Gen)  │      │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────┘      │
└──────────┬────────────────────────────┬────────────────────────┘
           │                            │
           │                            │
           ▼                            ▼
    ┌─────────────┐            ┌──────────────────┐
    │  InstantDB  │            │   OpenAI API     │
    │  (Database) │            │  - GPT-4o        │
    │             │            │  - Embeddings    │
    └─────────────┘            └──────────────────┘
           │
           │ Stores
           ▼
    ┌─────────────────────────────────────┐
    │  Collections:                       │
    │  - users                            │
    │  - companies                        │
    │  - documents                        │
    │  - documentChunks (with embeddings) │
    │  - tenders                          │
    │  - proposals                        │
    └─────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer

**Framework**: Next.js 14 (App Router)
- Server-side rendering (SSR)
- Client-side navigation
- Automatic code splitting
- Image optimization

**UI Library**: React 18
- Functional components with hooks
- Client-side state management (useState, useEffect)
- Form handling

**Styling**: TailwindCSS + shadcn/ui
- Utility-first CSS
- Responsive design
- Accessible components
- Dark mode support (configurable)

**Rich Text Editor**: TipTap
- Based on ProseMirror
- Extensible with plugins
- Table support
- Markdown-like editing

### Backend Layer

**Runtime**: Node.js (serverless functions)
- Stateless API routes
- Automatic scaling
- Cold start optimization

**API Routes**: Next.js Route Handlers
- RESTful endpoints
- TypeScript type safety
- Middleware support

**Authentication**: Custom (bcrypt + localStorage)
- Password hashing with bcrypt
- Session management (can be upgraded to JWT)
- Role-based access control

### Data Layer

**Primary Database**: InstantDB
- Real-time NoSQL database
- Automatic schema management
- Built-in subscriptions
- Type-safe queries

**File Storage**: Local filesystem (production: S3/R2)
- Uploaded files stored in `/uploads`
- Metadata in InstantDB
- Supports PDF, DOCX, TXT

### AI Layer

**LLM Provider**: OpenAI
- Model: GPT-4o (latest)
- Embeddings: text-embedding-3-small
- Structured JSON outputs
- Temperature tuning per use case

**RAG Architecture**:
1. Document chunking (500 tokens)
2. Embedding generation
3. Semantic search (cosine similarity)
4. Context retrieval
5. Prompt augmentation
6. LLM generation

## Data Flow

### 1. Document Upload Flow

```
User uploads file
       ↓
Frontend → POST /api/documents/upload
       ↓
Save file to disk
       ↓
Create document record in InstantDB
       ↓
Background processing starts:
  - Extract text (pdf-parse/mammoth)
  - Chunk text (500 tokens)
  - Generate embeddings
  - Store chunks + embeddings in InstantDB
       ↓
Update document status to "processed"
```

### 2. Tender Parsing Flow

```
User clicks "Parse Tender"
       ↓
Frontend → POST /api/ai/parse-tender
       ↓
Retrieve tender documents from InstantDB
       ↓
Combine document text
       ↓
Send to OpenAI with structured prompt
       ↓
Extract:
  - Requirements
  - Scope of work
  - Evaluation criteria
  - BOQ
       ↓
Store parsed data in tender.parsedRequirements
```

### 3. Proposal Generation Flow

```
User clicks "Generate Proposal"
       ↓
Frontend → POST /api/ai/generate-proposal
       ↓
Retrieve:
  - Tender requirements
  - Company documents (model RFPs)
  - Company writing style
       ↓
Semantic search for relevant chunks
       ↓
Build RAG prompt with context
       ↓
Send to OpenAI GPT-4o
       ↓
Parse JSON response (sections)
       ↓
Create proposal record in InstantDB
       ↓
Return proposal ID to frontend
       ↓
Redirect to Canvas Editor
```

### 4. Canvas Editor Flow

```
User opens proposal
       ↓
Load proposal.editorState from InstantDB
       ↓
Render sections in sidebar
       ↓
User edits in TipTap editor
       ↓
Auto-save on blur
       ↓
Frontend → POST /api/proposals/update
       ↓
Update editorState in InstantDB
```

### 5. Export Flow

```
User clicks "Export PDF"
       ↓
Frontend → POST /api/proposals/export
       ↓
Retrieve proposal from InstantDB
       ↓
Convert sections to PDF (jsPDF) or DOCX (docx lib)
       ↓
Return binary file
       ↓
Browser downloads file
```

## Database Schema Design

### Multi-Tenancy

All data is isolated by `companyId`:
- Users belong to one company
- Documents are company-specific
- Tenders are company-specific
- Proposals are company-specific

### Relationships

```
companies 
    ↓ (1:N)
  users
    ↓ (uploads)
documents
    ↓ (1:N)
documentChunks (with embeddings)

companies
    ↓ (1:N)
  tenders
    ↓ (1:N)
proposals
```

### Indexing Strategy

InstantDB automatically indexes:
- Document IDs (primary keys)
- Company IDs (for filtering)
- Foreign key references

For semantic search:
- Embeddings stored as JSON strings
- In-memory cosine similarity calculation
- (Future: Vector database like Pinecone/Weaviate)

## Security Architecture

### Authentication

1. **Registration**:
   - Password hashed with bcrypt (10 rounds)
   - Company created atomically
   - User assigned as admin

2. **Login**:
   - Email + password verification
   - User info stored in localStorage
   - (Production: Use JWT tokens)

3. **Authorization**:
   - CompanyId checked on all queries
   - Role-based access (admin/editor/viewer)
   - File paths validated

### Data Isolation

- All database queries filter by `companyId`
- Users cannot access other companies' data
- File uploads stored in company-specific directories

### API Security

Current:
- Environment variable protection
- Input validation
- Error handling

Recommended additions:
- Rate limiting (e.g., express-rate-limit)
- CSRF protection
- API key rotation
- Request signing

## Performance Optimization

### Frontend

- **Code Splitting**: Automatic per-route
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js automatic
- **Caching**: Browser cache for static assets

### Backend

- **Serverless Functions**: Auto-scaling
- **Database Queries**: Indexed by companyId
- **Document Processing**: Asynchronous background jobs
- **Embedding Caching**: Store embeddings for reuse

### AI Optimization

- **Prompt Caching**: Reuse common prompts
- **Token Limits**: Truncate long inputs
- **Temperature Tuning**: Lower for factual, higher for creative
- **Streaming**: (Future) Stream responses for better UX

## Scalability Considerations

### Current Capacity

- **Users**: Unlimited (InstantDB scales)
- **Documents**: Limited by storage (local disk)
- **Embeddings**: Limited by database size
- **Concurrent Requests**: Serverless auto-scaling

### Scaling Path

1. **Small Team (1-10 users)**:
   - Current setup works
   - Cost: ~$50/month

2. **Medium Team (10-100 users)**:
   - Move to S3 for file storage
   - Add Redis for caching
   - Implement rate limiting
   - Cost: ~$200-500/month

3. **Enterprise (100+ users)**:
   - Vector database (Pinecone/Weaviate)
   - CDN for static assets
   - Load balancing
   - Dedicated infrastructure
   - Cost: ~$1000+/month

## Deployment Architecture

### Development

```
Local Machine
  ↓
Next.js Dev Server (localhost:3000)
  ↓
InstantDB Cloud
  ↓
OpenAI API
```

### Production (Vercel)

```
User Browser
  ↓
Vercel Edge Network (CDN)
  ↓
Next.js App (Serverless Functions)
  ↓
InstantDB Cloud
  ↓
OpenAI API
  ↓
S3/R2 (File Storage)
```

## Monitoring & Observability

### Current

- Browser console logs
- Server-side console logs
- InstantDB dashboard

### Recommended Additions

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics / Google Analytics
- **Performance**: Vercel Speed Insights
- **Logging**: Structured logging (Winston/Pino)
- **Metrics**: OpenAI usage tracking

## Future Enhancements

### Short Term

1. Real-time collaboration (InstantDB subscriptions)
2. Version history for proposals
3. Team comments and annotations
4. Advanced permission system

### Medium Term

1. Vector database integration
2. Multi-model AI (Claude, Gemini)
3. Advanced analytics dashboard
4. Template marketplace

### Long Term

1. Mobile app (React Native)
2. Offline mode
3. Advanced workflow automation
4. AI agent for proposal review

## Technology Decisions

### Why InstantDB?

✅ Real-time by default
✅ No schema migrations
✅ TypeScript support
✅ Generous free tier
✅ Easy to learn

### Why Not Supabase/PostgreSQL?

- InstantDB is simpler for this use case
- No SQL knowledge required
- Real-time built-in
- Better for rapid prototyping

### Why OpenAI?

✅ Best-in-class models
✅ Structured output support
✅ Reliable API
✅ Embeddings included

### Why Next.js?

✅ Full-stack in one framework
✅ Excellent DX
✅ Vercel deployment
✅ SEO-friendly
✅ TypeScript native

## Conclusion

This architecture provides:
- **Scalability**: From 1 to 1000+ users
- **Maintainability**: Clear separation of concerns
- **Performance**: Optimized at every layer
- **Security**: Multi-tenant with data isolation
- **Extensibility**: Easy to add features

The system is production-ready for small to medium teams and can be scaled horizontally for enterprise use.



