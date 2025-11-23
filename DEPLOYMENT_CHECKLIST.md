# RFP AI - Production Deployment Checklist

Use this checklist when deploying RFP AI to production.

## Pre-Deployment

### Code Preparation

- [ ] All environment variables documented
- [ ] `.env` file not committed to git
- [ ] All TODOs and debug code removed
- [ ] Error messages don't expose sensitive data
- [ ] Console.logs reviewed and cleaned up
- [ ] TypeScript strict mode enabled and passing
- [ ] Build passes without errors: `npm run build`

### Security Review

- [ ] Passwords are hashed (bcrypt implemented ✓)
- [ ] SQL injection protection (N/A - using InstantDB)
- [ ] XSS protection reviewed
- [ ] CORS configured appropriately
- [ ] Rate limiting implemented (recommended)
- [ ] API authentication strengthened (consider JWT)
- [ ] File upload validation in place
- [ ] Environment variables secured
- [ ] Session management reviewed

### Database

- [ ] InstantDB production app created
- [ ] Production App ID obtained
- [ ] Data backup strategy planned
- [ ] Multi-tenancy isolation verified
- [ ] Test data removed from production

### File Storage

- [ ] Decision made: Local vs Cloud storage
- [ ] If cloud: S3/R2/Spaces configured
- [ ] If cloud: `file-processor.ts` updated
- [ ] Upload directory permissions set
- [ ] File size limits configured
- [ ] Allowed MIME types restricted

### API Keys

- [ ] OpenAI production API key obtained
- [ ] OpenAI billing configured
- [ ] OpenAI usage limits set
- [ ] API key rotation strategy planned
- [ ] Keys stored in secure environment

## Platform Selection

Choose your deployment platform:

### Option 1: Vercel (Recommended)

**Pros**:
- Built for Next.js
- Free tier available
- Automatic deployments
- Edge network (CDN)
- Zero configuration

**Cons**:
- File storage limitations (use S3)
- Serverless function limits (10 seconds)

### Option 2: Netlify

**Pros**:
- Good Next.js support
- Free tier available
- Easy to use

**Cons**:
- Less optimized for Next.js than Vercel

### Option 3: Railway / Render

**Pros**:
- Full server environment
- No serverless limitations
- Can use local file storage

**Cons**:
- More configuration required
- Paid plans

### Option 4: Self-Hosted (VPS)

**Pros**:
- Full control
- Can optimize costs
- No vendor lock-in

**Cons**:
- Requires DevOps knowledge
- Maintenance overhead

## Deployment Steps (Vercel)

### 1. Prepare Repository

```bash
# Ensure everything is committed
git status
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in
3. Click "New Project"
4. Import your Git repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_INSTANTDB_APP_ID=<production_app_id>
OPENAI_API_KEY=<production_openai_key>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
SESSION_SECRET=<generate_new_random_string>
```

**Important**: Use PRODUCTION values, not development!

### 4. Configure Domains

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate (automatic)

### 5. Deploy

```bash
# Automatic deployment via Git
git push origin main

# Or manual deployment
vercel --prod
```

### 6. Configure File Storage (S3)

Since Vercel is serverless, use S3 for file storage:

**1. Create S3 Bucket**:
- Go to AWS Console
- Create S3 bucket
- Enable versioning (optional)
- Set CORS policy

**2. Get Access Keys**:
- Create IAM user with S3 access
- Generate access key and secret

**3. Add Environment Variables**:
```
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_S3_BUCKET=<bucket_name>
AWS_REGION=us-east-1
```

**4. Update Code**:
Update `src/lib/file-processor.ts`:

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function saveUploadedFile(
  file: File,
  companyId: string
): Promise<string> {
  const key = `${companyId}/${Date.now()}_${file.name}`;
  
  const buffer = await file.arrayBuffer();
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    })
  );
  
  return key; // Store this in InstantDB
}
```

## Post-Deployment

### Immediate Checks

- [ ] Site loads without errors
- [ ] Can register new account
- [ ] Can log in
- [ ] Can upload document
- [ ] Document processing works
- [ ] Can create tender
- [ ] Can parse tender (AI works)
- [ ] Can generate proposal (AI works)
- [ ] Can export PDF/DOCX
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Check mobile responsiveness

### Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up OpenAI usage alerts
- [ ] Configure backup notifications

### Performance

- [ ] Run Lighthouse audit (target: >90)
- [ ] Check Core Web Vitals
- [ ] Test on slow network
- [ ] Test on mobile devices
- [ ] Verify CDN is working

### Documentation

- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create user guide/tutorial

## Ongoing Maintenance

### Daily

- [ ] Check error logs
- [ ] Monitor OpenAI usage
- [ ] Review user feedback

### Weekly

- [ ] Review system metrics
- [ ] Check disk space (if self-hosted)
- [ ] Update dependencies: `npm outdated`
- [ ] Review security advisories

### Monthly

- [ ] Update Node.js if needed
- [ ] Update npm packages: `npm update`
- [ ] Review and optimize costs
- [ ] Backup data
- [ ] Security audit
- [ ] Performance review

### Quarterly

- [ ] Major dependency updates
- [ ] Security penetration testing
- [ ] Architecture review
- [ ] Capacity planning
- [ ] User training sessions

## Scaling Checklist

When your app grows, consider:

### 100+ Users

- [ ] Implement caching (Redis)
- [ ] Add rate limiting
- [ ] Optimize database queries
- [ ] Monitor API latency
- [ ] Consider CDN for assets

### 500+ Users

- [ ] Implement queue system (for document processing)
- [ ] Add read replicas (if using SQL)
- [ ] Optimize embeddings storage
- [ ] Consider vector database (Pinecone)
- [ ] Implement auto-scaling

### 1000+ Users

- [ ] Microservices architecture
- [ ] Separate document processing service
- [ ] Load balancing
- [ ] Geographic distribution
- [ ] Enterprise support contracts

## Cost Estimates

### Small Deployment (10-50 users)

- **Hosting (Vercel)**: $0-20/month
- **InstantDB**: $0-25/month
- **OpenAI API**: $50-200/month
- **S3 Storage**: $5-10/month
- **Total**: ~$100-300/month

### Medium Deployment (50-200 users)

- **Hosting**: $20-100/month
- **InstantDB**: $25-99/month
- **OpenAI API**: $200-1000/month
- **S3 Storage**: $10-50/month
- **Total**: ~$300-1500/month

### Large Deployment (200+ users)

- **Hosting**: $100-500/month
- **Database**: $100-500/month
- **OpenAI API**: $1000-5000/month
- **Storage**: $50-200/month
- **Total**: ~$1500-6000/month

## Rollback Plan

If deployment fails:

1. **Quick Rollback** (Vercel):
   ```bash
   # In Vercel Dashboard
   Deployments → Previous Deployment → Promote to Production
   ```

2. **Environment Issue**:
   - Check environment variables
   - Verify API keys
   - Check InstantDB connection

3. **Code Issue**:
   ```bash
   git revert HEAD
   git push origin main
   ```

4. **Database Issue**:
   - Restore from backup
   - Verify schema
   - Check data integrity

## Emergency Contacts

Document key contacts:

- [ ] Vercel Support: [Vercel Dashboard](https://vercel.com/support)
- [ ] InstantDB Support: support@instantdb.com
- [ ] OpenAI Support: help.openai.com
- [ ] DNS Provider: _____________
- [ ] Cloud Storage Provider: _____________
- [ ] Your DevOps team: _____________

## Success Criteria

Deployment is successful when:

✅ All health checks pass
✅ Zero critical errors in logs
✅ Users can complete full workflow
✅ Performance metrics are acceptable
✅ Monitoring is active
✅ Team is trained
✅ Documentation is updated
✅ Backup strategy is in place

---

**Congratulations on deploying RFP AI to production!** 🚀



