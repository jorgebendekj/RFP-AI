# RFP AI - Intelligent Proposal Generation System

An AI-powered platform for automated RFP (Request for Proposal) document analysis and proposal generation, with specialized support for Bolivian RUPE tender forms.

## 🚀 Features

- **📄 Document Processing**: Upload and analyze PDF, DOCX, Excel, and TXT files
- **🤖 AI-Powered Analysis**: Automatic tender requirement extraction using GPT-4o
- **📝 Smart Proposal Generation**: Generate comprehensive proposals based on tender documents and company data
- **🇧🇴 Bolivia RUPE Support**: Specialized processing for Bolivian tender forms (A-1, B-2, B-3, Anexo 1)
- **✍️ Rich Text Editor**: Advanced canvas editor with AI-powered section improvements
- **🌍 Multilingual**: Support for English, Spanish, and Polish
- **📊 Table Extraction**: Preserve and replicate table structures from source documents
- **🔍 RAG System**: Retrieval Augmented Generation for accurate, context-aware proposals
- **📁 Document Management**: Organize and link documents to specific tenders
- **💾 Export Functionality**: Export proposals to DOCX format

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **AI**: OpenAI GPT-4o, text-embedding-3-small
- **Database**: InstantDB (real-time database)
- **Editor**: Tiptap (rich text editing)
- **File Processing**: pdf-parse, mammoth, xlsx
- **Authentication**: Custom auth with InstantDB

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key
- InstantDB account and credentials

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/jorgebendekj/RFP-AI.git
cd RFP-AI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
INSTANT_APP_ID=your_instant_app_id_here
INSTANT_ADMIN_TOKEN=your_instant_admin_token_here
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## 📚 Usage

### 1. Register/Login
Create an account or log in to access the dashboard.

### 2. Upload Documents
Navigate to the Documents section and upload your company documents:
- Company profile and certifications
- Past project references
- Team member CVs
- Economic proposals and price models

### 3. Create a Tender
Go to Tenders > New Tender and:
- Upload the tender document
- Fill in basic tender information
- Click "Parse Tender Requirements" to extract key information using AI

### 4. Link Documents
Associate relevant company documents with the tender.

### 5. Generate Proposal
Click "Generate Proposal" to create an AI-powered draft based on:
- Tender requirements
- Your company documents
- Industry best practices (especially for Bolivia RUPE forms)

### 6. Edit and Improve
Use the canvas editor to:
- Review and edit the generated content
- Use the "Improve" button with AI assistance
- Upload additional files for context-aware improvements
- Format text with bold, italic, lists, etc.

### 7. Export
Export your finalized proposal to DOCX format.

## 🇧🇴 Bolivia RUPE Support

The system automatically detects and processes Bolivian RUPE forms:

- **FORMULARIO A-1**: Company identification (NIT, legal representative, contact info)
- **FORMULARIO B-2**: Specific experience (projects, clients, amounts)
- **FORMULARIO B-3**: General experience (certifications, training)
- **ANEXO 1**: Equipment and personnel resources

When these forms are detected, the AI uses specialized instructions to:
- Extract structured data (tables, lists)
- Replicate the exact format required
- Use proper Bolivian conventions (dates, currency, terminology)

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   └── dashboard/        # Dashboard pages
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility libraries
│       ├── bolivia-tender-analyzer.ts
│       ├── file-processor.ts
│       └── instantdb-admin.ts
├── messages/                 # Translation files
└── public/                   # Static assets
```

## 🎨 Customization

### Color Scheme
The application uses a blue color scheme defined in `src/app/globals.css`. Modify the CSS custom properties to change the theme.

### AI Prompts
AI behavior can be customized in:
- `src/app/api/ai/generate-proposal/route.ts` - Main proposal generation
- `src/app/api/ai/complete-section/route.ts` - Section improvements
- `src/app/api/ai/parse-tender/route.ts` - Tender parsing
- `src/lib/bolivia-tender-analyzer.ts` - Bolivia-specific logic

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `INSTANT_APP_ID` | InstantDB application ID |
| `INSTANT_ADMIN_TOKEN` | InstantDB admin token |
| `NEXT_PUBLIC_INSTANT_APP_ID` | InstantDB app ID (public) |
| `NEXT_PUBLIC_APP_URL` | Application URL |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, please contact [your-email@example.com] or open an issue on GitHub.

## 🙏 Acknowledgments

- OpenAI for GPT-4o and embeddings API
- InstantDB for real-time database
- Shadcn/ui for beautiful UI components
- Tiptap for the rich text editor

---

**Made with ❤️ for better, faster proposal generation**
