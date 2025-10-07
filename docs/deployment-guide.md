# Deployment Guide - Landing Pages Automation

Complete guide for deploying the Landing Pages Automation system to Netlify.

## Prerequisites

- GitHub repository (this code pushed to GitHub)
- Netlify account (free tier works)
- All API credentials collected

## Step 1: Create Netlify Site

### Option A: Netlify CLI (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize site:
```bash
cd C:\Dev\web-bundles
netlify init
```

4. Follow prompts:
   - Create & configure new site
   - Team: Select your team
   - Site name: landing-pages-automation (or your choice)
   - Build command: `npm run build`
   - Publish directory: `apps/frontend/.next`
   - Functions directory: `apps/frontend/netlify/functions`

### Option B: Netlify Web UI

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: Leave empty (monorepo root)
   - **Build command**: `npm run build`
   - **Publish directory**: `apps/frontend/.next`
   - **Functions directory**: `apps/frontend/netlify/functions`

## Step 2: Configure Environment Variables

Go to: Site settings → Environment variables → Add variables

### Required Variables

```bash
# Airtable
AIRTABLE_API_KEY=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_airtable_base_id

# reCAPTCHA Enterprise
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Claude API
CLAUDE_API_KEY=your_claude_api_key

# Make.com
MAKE_API_KEY=your_make_api_key
```

### Optional Variables

```bash
# reCAPTCHA Secret (for backend verification)
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Google Tag Manager
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX

# Netlify (auto-populated after site creation)
NETLIFY_SITE_ID=your-site-id
```

## Step 3: Deploy

### Via Netlify CLI

```bash
netlify deploy --prod
```

### Via Git Push

```bash
git push origin master
```

Netlify will automatically:
1. Detect the push
2. Install dependencies
3. Run build command
4. Deploy to production

## Step 4: Verify Deployment

### Check Site URL

Your site will be available at:
- **Production**: `https://your-site-name.netlify.app`
- **Custom domain** (if configured): `https://yourdomain.com`

### Test Landing Pages

Visit these URLs to verify:
- https://your-site-name.netlify.app/walk-in-shower
- https://your-site-name.netlify.app/full-bathroom-remodel
- https://your-site-name.netlify.app/phoenix/walk-in-shower (dynamic route)

### Test Form Submission

1. Fill out the 3-step form on any landing page
2. Check Netlify Function logs: Site → Functions → submit-lead
3. Verify record created in Airtable
4. Confirm reCAPTCHA executed (check browser console)

### Test Content Generation (Optional)

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "walk-in-shower",
    "location": "phoenix",
    "targetKeywords": ["walk-in shower", "Phoenix bathroom"]
  }'
```

## Step 5: Configure Custom Domain (Optional)

1. Go to: Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., bathroomremodeling.com)
4. Follow DNS configuration instructions:
   - **Netlify DNS**: Point nameservers to Netlify
   - **External DNS**: Add CNAME or A record

### SSL Certificate

Netlify automatically provisions Let's Encrypt SSL certificates for:
- *.netlify.app domains
- Custom domains (after DNS propagation)

## Step 6: Set Up Make.com Scenarios (Optional)

See `docs/make-scenario-setup.md` for detailed instructions.

Quick setup:
1. Create Make.com account
2. Create new scenario
3. Add webhook trigger
4. Copy webhook URL
5. Use webhook URL in content generation calls

## Step 7: Monitor and Optimize

### Netlify Analytics

Enable in: Site settings → Analytics

Tracks:
- Page views
- Top pages
- Unique visitors
- Bandwidth usage

### Function Logs

View in: Site → Functions → [function-name] → Logs

Monitor for:
- Form submission errors
- reCAPTCHA failures
- Airtable API errors
- Claude API errors

### Performance Monitoring

Use Lighthouse in Chrome DevTools:
1. Open any landing page
2. F12 → Lighthouse tab
3. Run audit for Performance, Accessibility, SEO

Target scores:
- Performance: 90+
- Accessibility: 95+
- SEO: 95+
- Best Practices: 90+

## Troubleshooting

### Build Failures

**Error**: "Command failed with exit code 1"
- Check build logs for specific error
- Verify all dependencies are in package.json
- Ensure Node version matches (20+)

**Error**: "Module not found"
- Check import paths are correct
- Verify @shared package is properly linked
- Run `npm install` locally to test

### Function Errors

**Error**: "Function execution timed out"
- Check function timeout settings (default: 10s)
- Increase timeout in netlify.toml if needed
- Optimize function code for performance

**Error**: "Environment variable not found"
- Verify all required env vars are set in Netlify
- Check variable names match exactly (case-sensitive)
- Redeploy after adding env vars

### Form Submission Issues

**Error**: "reCAPTCHA verification failed"
- Verify NEXT_PUBLIC_RECAPTCHA_SITE_KEY is correct
- Check site key is for reCAPTCHA Enterprise
- Ensure reCAPTCHA script loaded (check browser console)

**Error**: "Airtable API error"
- Verify API key has write permissions
- Check base ID and table ID are correct
- Ensure field names match exactly

### Content Generation Issues

**Error**: "Claude API error: 401"
- Verify CLAUDE_API_KEY is correct
- Check API key hasn't been revoked
- Ensure billing is set up in Anthropic console

**Error**: "Claude API error: 429"
- Rate limit exceeded
- Wait a minute and retry
- Consider implementing retry logic with backoff

## Performance Optimization

### Enable Next.js Image Optimization

Already configured in `next.config.js` for placehold.co.

When using real images:
1. Upload images to Netlify or CDN
2. Update next.config.js with allowed domains
3. Use Next.js Image component for automatic optimization

### Enable Caching

Headers already configured in netlify.toml:
- Static assets: 1 year cache
- HTML: No cache (for fresh content)

### Optimize Bundle Size

Current bundle: 138 kB First Load JS

To reduce:
- Use dynamic imports for large components
- Enable tree shaking (already enabled)
- Analyze bundle with: `npm run build -- --analyze`

## Scaling Considerations

### Traffic Scaling

Netlify automatically scales:
- **Free tier**: 100 GB bandwidth/month
- **Pro tier**: 400 GB bandwidth/month
- **Business**: Unlimited bandwidth

### Function Limits

Netlify Functions:
- **Free tier**: 125K requests/month, 100 hours runtime/month
- **Pro tier**: Unlimited requests, 100 hours runtime/month
- **Business**: Unlimited

### Database Scaling (Airtable)

Airtable limits:
- **Free tier**: 1,200 records/base
- **Plus tier**: 50,000 records/base
- **Pro tier**: 100,000 records/base

Consider migrating to PostgreSQL/MongoDB if exceeding limits.

## Cost Estimates

### Monthly Costs (Expected Traffic: 10,000 visitors)

- **Netlify**: $0 (Free tier sufficient)
- **Airtable**: $0-$20 (Free tier or Plus)
- **Claude API**: $10-50 (200-1,000 generated pages)
- **Make.com**: $0-9 (Free tier or paid)
- **Domain**: $12/year (optional)
- **Total**: $10-80/month

### Scaling Costs (100,000 visitors)

- **Netlify**: $19/month (Pro tier)
- **Airtable**: $20/month (Plus tier)
- **Claude API**: $50-200 (1,000-4,000 pages)
- **Make.com**: $9-29/month
- **Total**: $98-268/month

## Security Best Practices

### Protect API Keys

✅ All keys stored in Netlify environment variables
✅ Never commit .env files to Git
✅ Use NEXT_PUBLIC_ prefix only for client-safe vars

### Content Security

✅ reCAPTCHA Enterprise prevents spam
✅ Zod validation prevents malformed data
✅ Duplicate detection prevents abuse
✅ HTTPS enforced on all pages

### Data Privacy

- Add Privacy Policy page
- Include GDPR compliance if EU traffic
- Implement opt-out mechanisms (TCPA requirement already met)
- Secure Airtable API access (already using Personal Access Token)

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Configure environment variables
3. ✅ Test all landing pages
4. ✅ Test form submissions
5. ⏳ Set up Make.com scenarios (optional)
6. ⏳ Configure custom domain (optional)
7. ⏳ Run Lighthouse audits
8. ⏳ Set up monitoring and alerts

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **Airtable API**: https://airtable.com/developers/web/api/introduction
- **Claude API**: https://docs.anthropic.com
- **Make.com**: https://www.make.com/en/help/getting-started

## Rollback Procedure

If deployment has critical issues:

1. **Via Netlify UI**:
   - Go to Deploys tab
   - Find last working deploy
   - Click "Publish deploy"

2. **Via CLI**:
```bash
netlify rollback
```

3. **Via Git**:
```bash
git revert HEAD
git push origin master
```
