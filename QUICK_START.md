# RFP AI - Quick Start Guide

Get RFP AI running in 5 minutes!

## Installation

```bash
# Clone repository
git clone <repo-url>
cd rfp-ai

# Install dependencies
npm install
```

## Configuration

Create `.env` file:

```bash
NEXT_PUBLIC_INSTANTDB_APP_ID=your_instantdb_app_id
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=random_string_here
```

**Get API Keys:**
- InstantDB: [instantdb.com](https://instantdb.com) → Create App
- OpenAI: [platform.openai.com](https://platform.openai.com) → API Keys

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Register (30 seconds)

1. Click "Register"
2. Fill in:
   - Your name
   - Email
   - Password
   - Company name
   - Industry
   - Country
3. Click "Create Account"

### 2. Upload Knowledge Base (2 minutes)

Go to **Documents** page:

1. **Upload Model RFPs**:
   - Select type: "Model RFP"
   - Upload previous proposals (PDF/DOCX)
   - Wait for "processed" status

2. **Upload Company Docs**:
   - Select type: "Company Data"
   - Upload company profile, price lists, certs
   - Wait for processing

3. **Upload Tender Doc**:
   - Select type: "Tender Document"
   - Upload government RFP you want to respond to
   - Wait for processing

### 3. Create Tender (1 minute)

Go to **Tenders** page:

1. Click "New Tender"
2. Fill in:
   - Tender title
   - Client name
   - Tender code (optional)
   - Deadline
3. Link your uploaded tender documents
4. Click "Create Tender"

### 4. Generate Proposal (1 minute)

1. Open your tender
2. Click "Parse Tender Requirements" (wait 10s)
3. Review extracted requirements
4. Click "Generate Proposal" (wait 30-60s)
5. You're redirected to the editor!

### 5. Edit & Export (ongoing)

In Canvas Editor:

1. **Edit sections**:
   - Click section in sidebar
   - Edit text
   - Use formatting toolbar

2. **Improve with AI**:
   - Type instruction: "make this more formal"
   - Click "Improve"

3. **Export**:
   - Click "Export PDF" or "Export DOCX"
   - Download your proposal

## Sample Data

Want to test quickly? Here's what to upload:

1. **Model RFP**: Any previous proposal you've written (PDF)
2. **Company Doc**: Your company profile or brochure
3. **Tender**: Download a sample RFP from [grants.gov](https://grants.gov)

## Common Issues

**Documents stuck on "uploaded"?**
- Check OpenAI API key is valid
- Check console for errors
- File might be too large (max 10MB)

**AI not generating?**
- Ensure OpenAI has credits
- Check InstantDB connection
- Verify tender has parsed requirements

**Can't log in?**
- Check email/password
- Try registering again
- Clear browser cache

## What's Next?

- Read full [README.md](README.md) for details
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for in-depth setup
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system

## Need Help?

- Check existing documentation
- Open an issue on GitHub
- Review error logs in console

## Pro Tips

💡 **Upload Quality**: Better model RFPs = better AI outputs

💡 **Specificity**: The more specific your tender requirements, the better

💡 **Iteration**: Generate, edit, improve with AI, repeat

💡 **Save Often**: Click save regularly when editing

💡 **Multiple Attempts**: Try generating multiple times for best results

## System Requirements

- Node.js 18+
- Modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- 1GB disk space for uploads

## Performance

- Document processing: 10-60s per document
- Tender parsing: ~10s
- Proposal generation: 30-60s
- Section improvement: 5-10s

## Limits

Current setup:
- File uploads: PDF, DOCX, TXT only
- Max file size: 10MB (configurable)
- Max embeddings: Unlimited (InstantDB)
- Concurrent users: Unlimited (serverless)

## Costs

Estimated costs per month:

- **Development**: $0 (free tiers)
- **Small team (1-10)**: ~$50-100
- **Medium team (10-50)**: ~$200-500
- **Large team (50+)**: ~$500-2000

Most costs are from OpenAI API usage.

## Security

- Passwords are hashed (bcrypt)
- Company data is isolated
- Files stored securely
- Environment variables protected

For production, review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## Customization

Want to customize?

- **Branding**: Edit `src/app/globals.css` for colors
- **Logo**: Add to `public/` and update layout
- **Sections**: Modify AI prompts in `src/app/api/ai/`
- **Models**: Change OpenAI model in API routes

## Contributing

Contributions welcome!

1. Fork the repo
2. Create feature branch
3. Make changes
4. Submit PR

---

**That's it! You're ready to generate AI-powered proposals.** 🚀

For questions, issues, or feedback, open an issue on GitHub.



