# Codio AWS Marketplace Landing Pages - Handoff Guide

## Repository Information

**GitHub Repository**: https://github.com/gdnawill/codio-aws-marketplace-landing-pages

This repository contains the complete landing page system for Codio's AWS Marketplace offerings.

## What's Been Delivered

### ✅ Template System
- **Template File**: `src/web-templates/index.template.html`
- **Configuration**: `page-config.json` 
- **Generator**: `generate-pages.js`
- **Package Management**: `package.json` with npm scripts

### ✅ Live Landing Pages
All three product pages are **currently deployed and live**:

1. **Cloud Labs**: https://d234aouv3s64w7.cloudfront.net/
2. **AWS Labs**: https://d2ultfrcf31z94.cloudfront.net/  
3. **AI Labs**: https://dfz8x9h0xd99s.cloudfront.net/

### ✅ Professional Design
- Dark gradient background matching your original design
- Two-column responsive layout
- Clean typography and spacing
- Mobile-friendly responsive design
- AWS Marketplace integration ready

### ✅ Deployment Infrastructure
- S3 buckets configured for static hosting
- CloudFront distributions for global CDN
- Lambda functions for registration processing
- Automated deployment scripts

## Repository Transfer Options

### Option 1: Fork to Codio Organization (Recommended)
```bash
# Codio team member runs:
gh repo fork gdnawill/codio-aws-marketplace-landing-pages --org codio --clone
```

### Option 2: Transfer Ownership
I can transfer the repository directly to the Codio organization if you provide:
- Codio's GitHub organization name
- Admin access to accept the transfer

### Option 3: Mirror Setup
Set up automatic mirroring so updates flow from your repo to Codio's:
```bash
# In Codio's repo:
git remote add upstream https://github.com/gdnawill/codio-aws-marketplace-landing-pages.git
git fetch upstream
git merge upstream/main
```

## Quick Start for Codio Team

### 1. Clone the Repository
```bash
git clone https://github.com/gdnawill/codio-aws-marketplace-landing-pages.git
cd codio-aws-marketplace-landing-pages
```

### 2. Make Content Changes
Edit `page-config.json` to update:
- Product descriptions
- Feature lists
- Product codes
- API endpoints

### 3. Generate Updated Pages
```bash
npm run generate
```

### 4. Deploy Changes
```bash
npm run deploy:pages
```

## Development Workflow

### Making Updates
1. **Content Changes**: Edit `page-config.json`
2. **Design Changes**: Edit `src/web-templates/index.template.html`
3. **Generate**: Run `npm run generate`
4. **Deploy**: Run `npm run deploy:pages`

### NPM Scripts Available
- `npm run generate` - Generate all product pages
- `npm run deploy:pages` - Full deployment (generate + upload + cache invalidation)
- `npm run upload` - Upload pages to S3
- `npm run invalidate` - Invalidate CloudFront cache

## AWS Resources (Currently Deployed)

### S3 Buckets
- `cloud-labs-web-68b3f5c0` → Cloud Labs
- `aws-labs-web-796a80b0` → AWS Labs  
- `ai-labs-web-930e7cc0` → AI Labs

### CloudFront Distributions
- `E13IJ9NI8XJ7T5` → Cloud Labs
- `E3L0YJ3DS46XHU` → AWS Labs
- `E7K8B2EHD7P3U` → AI Labs

### Lambda Functions
- Registration processing
- Marketplace event handling
- SQS message processing

## Maintenance Tasks

### Regular Updates
- Update product descriptions in `page-config.json`
- Monitor CloudWatch logs for registration issues
- Update AWS Marketplace product codes as needed

### Troubleshooting
- Check S3 bucket permissions
- Verify CloudFront cache invalidation
- Monitor Lambda function logs in CloudWatch
- Test registration flow with marketplace tokens

## Security Considerations

### Sensitive Files (Not in Repo)
- AWS credentials (use IAM roles/profiles)
- Environment-specific configurations
- Private deployment keys

### Public Repository
This repo is currently public, containing:
- Template code (safe to share)
- Configuration structure (safe to share)
- Deployment scripts (safe to share)

## Next Steps for Codio

1. **Repository Access**: Choose transfer/fork option above
2. **Team Access**: Add Codio team members as collaborators
3. **CI/CD Setup**: Consider GitHub Actions for automated deployment
4. **Documentation**: Add team-specific deployment procedures
5. **Monitoring**: Set up alerts for deployment failures

## Support

For questions about:
- **Repository Setup**: Contact Will Horn
- **AWS Infrastructure**: Check CloudFormation stacks
- **Landing Page Issues**: Check S3/CloudFront configurations
- **Registration Flow**: Check Lambda function logs

## Files Overview

```
├── src/
│   ├── web-templates/index.template.html    # Main template
│   ├── cdk/                                 # Infrastructure as code
│   └── lambda/                              # Registration functions
├── page-config.json                         # Product configurations
├── generate-pages.js                        # Page generator
├── package.json                             # NPM scripts
├── deploy-marketplace.sh                    # Deployment script
└── README.md                                # Technical documentation
```

The system is **production-ready** and **currently serving live traffic**. All three landing pages are deployed and functional.