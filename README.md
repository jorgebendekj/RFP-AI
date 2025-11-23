# RFP AI - Intelligent Proposal Generation Platform

RFP AI is a production-ready web application that uses artificial intelligence to help companies generate professional proposals for government tenders. The system learns from your previous proposals and company documents to create customized, high-quality tender responses.

## 🎯 Features

- **AI-Powered Proposal Generation**: Automatically generate complete proposal drafts based on tender requirements
- **Knowledge Base Management**: Upload and manage model RFPs, company documents, and tender files
- **Smart Document Processing**: Automatic text extraction, chunking, and embedding generation for semantic search
- **Canvas-Style Editor**: Microsoft Word-like rich text editor with 40+ formatting features, section management, AI-assisted writing, and real-time collaboration
- **Multi-Format Export**: Export proposals to PDF and DOCX formats
- **RAG Architecture**: Retrieval-Augmented Generation using your company's historical data
- **Multi-Company Support**: Full multi-tenancy with company isolation

## 🧱 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **TipTap** - Rich text editor for proposal canvas

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **InstantDB** - Real-time database (ONLY database used)
- **OpenAI GPT-4o** - Latest AI model for proposal generation
- **OpenAI Embeddings** - Semantic search and RAG

### Document Processing
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **docx** - DOCX generation for export
- **jsPDF** - PDF generation for export

## 📂 Project Structure

```
rfp-ai/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── ai/                # AI processing endpoints
│   │   │   ├── documents/         # Document management
│   │   │   ├── tenders/           # Tender management
│   │   │   └── proposals/         # Proposal management
│   │   ├── auth/                  # Auth pages (login/register)
│   │   ├── dashboard/             # Dashboard pages
│   │   │   ├── documents/         # Document upload & management
│   │   │   ├── tenders/           # Tender list & details
│   │   │   └── proposals/         # Proposal editor
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/                 # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── canvas-editor.tsx      # Proposal canvas editor
│   │   └── dashboard-layout.tsx   # Dashboard layout
│   └── lib/                       # Utilities and libraries
│       ├── instantdb.ts           # InstantDB configuration
│       ├── file-processor.ts      # Document processing
│       └── utils.ts               # Helper functions
├── uploads/                       # Uploaded files (gitignored)
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
└── next.config.js                 # Next.js config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- **InstantDB Account** - [Sign up at instantdb.com](https://www.instantdb.com/)
- **OpenAI API Key** - [Get one from OpenAI](https://platform.openai.com/)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd rfp-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure InstantDB

1. Go to [InstantDB Dashboard](https://www.instantdb.com/dash)
2. Create a new application
3. Copy your App ID

### 4. Set Environment Variables

Create a `.env` file in the root directory:

```bash
# InstantDB Configuration
NEXT_PUBLIC_INSTANTDB_APP_ID=your_instantdb_app_id_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here
```

**Important**: Never commit your `.env` file to version control!

### 5. Initialize InstantDB Schema

InstantDB automatically creates collections when you first write data. The schema is defined in `src/lib/instantdb.ts` and includes:

- **users** - User accounts
- **companies** - Company profiles
- **documents** - Uploaded files metadata
- **documentChunks** - Text chunks with embeddings
- **tenders** - Government tender records
- **proposals** - Generated proposals

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your First Account

1. Navigate to the register page
2. Create an account with your company information
3. You'll be automatically logged in to the dashboard

## 📖 User Guide

### Step 1: Build Your Knowledge Base

1. Go to **Documents** page
2. Upload your model RFPs and previous proposals:
   - Select "Model RFP / Previous Proposal"
   - Upload PDF or DOCX files
3. Upload company documents (pricing catalogs, certifications, etc.):
   - Select "Company Data / Internal Document"
   - Upload relevant files
4. Wait for documents to be processed (status will change from "uploaded" to "processed")

### Step 2: Upload a Government Tender

1. Still in **Documents** page
2. Upload tender documents:
   - Select "Tender Document"
   - Upload RFP files from government portals
3. Wait for processing to complete

### Step 3: Create a Tender Record

1. Go to **Tenders** page
2. Click "New Tender"
3. Fill in tender information:
   - Tender title
   - Client/Agency name
   - Tender code
   - Country
   - Deadline
4. Link the uploaded tender documents
5. Click "Create Tender"

### Step 4: Parse Tender Requirements

1. Open the tender detail page
2. Click "Parse Tender Requirements"
3. AI will analyze the tender and extract:
   - Mandatory requirements
   - Scope of work
   - Evaluation criteria
   - Bill of quantities
   - Technical specifications

### Step 5: Generate Proposal

1. On the tender detail page, click "Generate Proposal"
2. AI will:
   - Analyze tender requirements
   - Review your company's writing style
   - Retrieve relevant content from your knowledge base
   - Generate a complete proposal draft
3. You'll be redirected to the proposal editor

### Step 6: Edit and Refine

1. In the **Canvas Editor**:
   - View all sections in the left sidebar
   - Click a section to edit it
   - Use the comprehensive rich text toolbar with 40+ features:
     - **Text Formatting**: Bold, italic, underline, strikethrough, colors
     - **Headings**: Multiple heading levels (H1-H3)
     - **Alignment**: Left, center, right, justify
     - **Lists**: Bullets, numbers, task lists with checkboxes
     - **Tables**: Insert, resize, add rows/columns
     - **Links & Images**: Insert hyperlinks and images
     - **Special**: Code blocks, quotes, subscript, superscript
     - **Fonts**: Arial, Times New Roman, Courier, Georgia, Verdana
     - **Highlights**: Color highlighting for emphasis
   - Add/remove/reorder sections as needed
   - Use keyboard shortcuts for faster editing (Ctrl+B, Ctrl+I, etc.)
2. Use **AI Improvement**:
   - Type instructions like "make this more formal" or "add more technical details"
   - Click "Improve" to let AI enhance the section
3. Click "Save" regularly to save your changes

**See [CANVAS_EDITOR_FEATURES.md](CANVAS_EDITOR_FEATURES.md) for complete editor documentation**

### Step 7: Export

1. Click "Export DOCX" or "Export PDF"
2. The proposal will be downloaded in your selected format
3. Ready to submit!

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user and company
- `POST /api/auth/login` - Login user

### Documents

- `POST /api/documents/upload` - Upload and process document
- `GET /api/documents/list` - List company documents

### Tenders

- `POST /api/tenders/create` - Create tender record
- `GET /api/tenders/list` - List company tenders

### Proposals

- `GET /api/proposals/list` - List company proposals
- `POST /api/proposals/update` - Update proposal
- `POST /api/proposals/export` - Export proposal to PDF/DOCX

### AI Endpoints

- `POST /api/ai/embed` - Generate text embeddings
- `POST /api/ai/parse-tender` - Parse tender requirements
- `POST /api/ai/analyze-company-style` - Analyze writing style
- `POST /api/ai/generate-proposal` - Generate complete proposal
- `POST /api/ai/complete-section` - Improve proposal section

## 🗄️ Database Schema (InstantDB)

### users
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

### companies
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

### documents
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

### documentChunks
```typescript
{
  id: string;
  documentId: string;
  companyId: string;
  type: 'model_rfp' | 'company_data' | 'tender_document';
  content: string;
  section: string;
  orderIndex: number;
  embedding: string; // JSON array
  createdAt: number;
}
```

### tenders
```typescript
{
  id: string;
  companyId: string;
  title: string;
  clientName: string;
  tenderCode: string;
  country: string;
  relatedDocumentIds: string; // JSON array
  parsedRequirements: string; // JSON
  deadline: number;
  createdAt: number;
}
```

### proposals
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

## 🤖 AI Prompt Templates

The system uses carefully crafted prompts for different AI operations:

1. **Tender Parsing**: Extracts structured information from tender documents
2. **Company Style Analysis**: Identifies writing patterns and preferences
3. **Proposal Generation**: Creates complete proposals using RAG
4. **Section Improvement**: Refines sections based on user instructions

Prompt templates are embedded in the respective API routes under `src/app/api/ai/`.

## 🔐 Security Considerations

- Passwords are hashed with bcrypt before storage
- Company data is isolated (multi-tenancy)
- File uploads are validated for type and size
- API routes should include proper authentication middleware (implement JWT or session-based auth)
- Environment variables are kept secure

## 📊 Performance Optimization

- Document processing is asynchronous
- Embeddings are generated in background
- Large documents are chunked for better performance
- InstantDB provides real-time updates
- Static assets are optimized by Next.js

## 🧪 Testing

To test the application:

1. Register a test company
2. Upload sample RFP documents
3. Create a test tender
4. Generate a proposal
5. Verify AI outputs and exports

## 🐛 Troubleshooting

### Documents not processing
- Check that OPENAI_API_KEY is valid
- Verify file formats are supported (PDF, DOCX, TXT)
- Check server logs for errors

### AI generation fails
- Ensure OpenAI API key has credits
- Check if document chunks have embeddings
- Verify InstantDB connection

### Export not working
- Check file permissions in uploads directory
- Verify docx and jspdf packages are installed
- Check browser download settings

## 🚢 Deployment

### Recommended Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Environment Variables for Production

Set all environment variables from `.env.example` in your deployment platform.

### File Storage

For production, consider using:
- **AWS S3**
- **Cloudflare R2**
- **DigitalOcean Spaces**

Update `src/lib/file-processor.ts` to use cloud storage instead of local filesystem.

## 📝 License

MIT License - feel free to use this project for commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoint logs

## 🎉 Acknowledgments

- **InstantDB** for the real-time database
- **OpenAI** for GPT-4 and embeddings
- **Vercel** for Next.js framework
- **shadcn/ui** for beautiful components

---

**Built with ❤️ for government contractors and proposal teams**

