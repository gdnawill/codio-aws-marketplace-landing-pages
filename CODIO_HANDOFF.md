# 🚀 Codio AWS Marketplace Landing Pages - Production Handoff

## Repository
**GitHub**: https://github.com/gdnawill/codio-aws-marketplace-landing-pages

## ✅ Live Production Deployments
- **Cloud Labs**: https://d234aouv3s64w7.cloudfront.net/
- **AWS Labs**: https://d2ultfrcf31z94.cloudfront.net/  
- **AI Labs**: https://dfz8x9h0xd99s.cloudfront.net/

## 🎯 What's Delivered
- ✅ **Template System** - Single template generates all product pages
- ✅ **Live Pages** - All three products deployed and functional
- ✅ **Professional Design** - Dark gradient, responsive, mobile-friendly
- ✅ **AWS Integration** - Full marketplace registration flow
- ✅ **Deployment Scripts** - One-command deployment with npm
- ✅ **Clean Codebase** - Production-ready, no dev files

## 🔄 Repository Transfer Options

### Option 1: Fork to Codio Org (Recommended)
```bash
gh repo fork gdnawill/codio-aws-marketplace-landing-pages --org codio --clone
```

### Option 2: Direct Transfer
Provide Codio's GitHub org name for direct ownership transfer

### Option 3: Mirror/Upstream
```bash
git remote add upstream https://github.com/gdnawill/codio-aws-marketplace-landing-pages.git
```

## ⚡ Quick Start
```bash
# 1. Clone
git clone https://github.com/gdnawill/codio-aws-marketplace-landing-pages.git
cd codio-aws-marketplace-landing-pages

# 2. Make changes
# Edit page-config.json for content updates
# Edit src/web-templates/index.template.html for design changes

# 3. Deploy
npm run deploy:pages
```

## 🛠 Key Commands
- `npm run generate` - Generate pages from template
- `npm run deploy:pages` - Full deployment (generate + upload + cache clear)
- `npm run upload` - Upload to S3 buckets
- `npm run invalidate` - Clear CloudFront cache

## 📁 Essential Files
```
├── src/web-templates/index.template.html    # Main template
├── page-config.json                         # Product content & config
├── generate-pages.js                        # Page generator
├── package.json                             # NPM scripts
├── deploy-*.yaml                            # CloudFormation templates
└── README.md                                # Full documentation
```

## 🏗 AWS Infrastructure (Live)
### S3 Buckets
- `cloud-labs-web-68b3f5c0` → Cloud Labs
- `aws-labs-web-796a80b0` → AWS Labs
- `ai-labs-web-930e7cc0` → AI Labs

### CloudFront Distributions  
- `E13IJ9NI8XJ7T5` → Cloud Labs
- `E3L0YJ3DS46XHU` → AWS Labs
- `E7K8B2EHD7P3U` → AI Labs

## 🔧 Maintenance
- **Content Updates**: Edit `page-config.json` → `npm run deploy:pages`
- **Design Changes**: Edit template → `npm run deploy:pages`
- **Monitor**: CloudWatch logs for Lambda functions
- **Troubleshoot**: Check S3/CloudFront in AWS Console

## 🔐 Security
- Public repo with no sensitive data
- AWS credentials via IAM roles (not in code)
- HTTPS via CloudFront
- Registration tokens validated server-side

## 📞 Support
- **Repo Questions**: GitHub Issues
- **AWS Issues**: CloudFormation stacks in AWS Console
- **Page Problems**: Check S3/CloudFront configurations

---
**Status**: ✅ Production Ready & Live | **Handoff**: Ready for Codio Team