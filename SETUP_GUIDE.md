# RFP AI - Detailed Setup Guide

This guide provides step-by-step instructions for setting up RFP AI from scratch.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18 or higher installed
- [ ] npm, yarn, or pnpm package manager
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] An InstantDB account
- [ ] An OpenAI API account with credits

## Step 1: System Requirements

### Install Node.js

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify: `node --version` (should show v18+)

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step 2: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd rfp-ai

# Install dependencies
npm install

# This will install:
# - Next.js and React
# - InstantDB client
# - OpenAI SDK
# - TailwindCSS
# - shadcn/ui components
# - Document processing libraries
# - And more...
```

## Step 3: InstantDB Setup

### Create InstantDB Application

1. Go to [instantdb.com](https://www.instantdb.com/)
2. Sign up or log in
3. Click "Create App"
4. Name your app (e.g., "RFP AI Production")
5. Copy your App ID (looks like: `abc123-def456-ghi789`)

### Understanding InstantDB

InstantDB is a real-time database that:
- Automatically creates collections when you write data
- Provides real-time subscriptions
- Has built-in authentication (we use custom auth)
- Stores data as JSON documents
- No migration files needed!

The schema is defined in TypeScript in `src/lib/instantdb.ts` for type safety.

## Step 4: OpenAI API Setup

### Get Your API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. Add credits to your account (minimum $5 recommended)

### API Usage Estimates

- **Embeddings**: ~$0.0001 per 1000 tokens
- **GPT-4o completions**: ~$0.01-0.03 per request
- **Monthly estimate for small team**: $20-50

## Step 5: Environment Configuration

Create `.env` file in project root:

```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
nano .env
# or
code .env
```

Fill in your values:

```env
# InstantDB - Get from dashboard
NEXT_PUBLIC_INSTANTDB_APP_ID=your_app_id_here

# OpenAI - Get from platform.openai.com
OPENAI_API_KEY=sk-your_api_key_here

# App URL - Change for production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Session Secret - Generate random string
SESSION_SECRET=use_a_long_random_string_here
```

**Generate a secure SESSION_SECRET:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Step 6: File Storage Setup

The app stores uploaded files locally in the `uploads/` directory.

```bash
# Create uploads directory
mkdir uploads

# Set permissions (Linux/Mac)
chmod 755 uploads
```

**For Production:** Use cloud storage (S3, R2, etc.) - see README for migration guide.

## Step 7: Run Development Server

```bash
# Start the dev server
npm run dev

# Server starts at http://localhost:3000
```

You should see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

## Step 8: First-Time Setup

### Create Your Account

1. Open http://localhost:3000
2. You'll be redirected to `/auth/login`
3. Click "Register"
4. Fill in the form:
   - **Full Name**: Your name
   - **Email**: Your work email
   - **Password**: Strong password (min 8 chars)
   - **Company Name**: Your company
   - **Industry**: e.g., "Construction"
   - **Country**: Your country
5. Click "Create Account"
6. You'll be redirected to login
7. Log in with your credentials

### Verify Setup

After login, you should see:
- Dashboard with 0 tenders, 0 proposals, 0 documents
- Navigation sidebar with all menu items
- No errors in browser console

## Step 9: Upload Test Documents

### Prepare Test Files

For testing, you need:
1. **A sample RFP** (any previous proposal your company wrote)
2. **Company document** (company profile, price list, etc.)
3. **A tender document** (government RFP to respond to)

Supported formats: PDF, DOCX, TXT

### Upload Process

1. Go to **Documents** page
2. Select document type
3. Choose file
4. Click "Upload Document"
5. Wait for "processed" status

**Processing time:** 10-60 seconds per document depending on size.

## Step 10: Create First Tender

1. Go to **Tenders** page
2. Click "New Tender"
3. Fill in:
   - **Title**: e.g., "Highway Construction Project"
   - **Client**: e.g., "Department of Transportation"
   - **Tender Code**: e.g., "RFP-2024-001"
   - **Country**: USA
   - **Deadline**: Select future date
4. Check the tender documents to link
5. Click "Create Tender"

## Step 11: Generate Your First Proposal

1. Open the tender you just created
2. Click "Parse Tender Requirements"
3. Wait ~10 seconds for AI to analyze
4. Review parsed requirements
5. Click "Generate Proposal"
6. Wait ~30-60 seconds for AI to generate
7. You'll be redirected to the editor

## Step 12: Edit and Export

1. In the Canvas Editor:
   - Click sections to edit
   - Use toolbar for formatting
   - Try "Ask AI to improve" feature
2. Click "Save" frequently
3. When ready, click "Export PDF" or "Export DOCX"

## Troubleshooting

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### InstantDB connection fails

- Verify your App ID is correct
- Check you're using the NEXT_PUBLIC_ prefix
- Restart the dev server after changing .env

### OpenAI API errors

- Check your API key is valid
- Verify you have credits
- Check rate limits

### Documents not processing

- Check file size (max 10MB recommended)
- Verify file format (PDF/DOCX/TXT)
- Check console for errors
- Ensure OPENAI_API_KEY is set

### Database Schema Issues

InstantDB creates collections automatically. If you see schema errors:
1. Delete the app in InstantDB dashboard
2. Create a new app
3. Update your .env with new App ID
4. Restart dev server

## Next Steps

Now that setup is complete:

1. **Customize**: Update branding, colors, company info
2. **Add users**: Invite team members to register
3. **Build knowledge base**: Upload all your model RFPs
4. **Process tenders**: Start responding to real RFPs
5. **Deploy**: Follow deployment guide in README

## Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check terminal/server logs
3. Review this guide again
4. Check InstantDB and OpenAI status pages
5. Open an issue on GitHub

## Production Deployment

When ready to deploy:

1. Choose a platform (Vercel recommended)
2. Set environment variables
3. Configure cloud file storage
4. Set up custom domain
5. Configure backup strategy
6. Monitor costs (OpenAI usage)

See README.md for detailed deployment instructions.

---

**Congratulations! Your RFP AI system is now running.** 🎉



