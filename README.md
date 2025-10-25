# Codio AWS Marketplace Landing Pages

Production-ready landing page system for Codio's AWS Marketplace offerings.

## 🚀 Live Deployments

All three product pages are **currently deployed and live**:

- **Cloud Labs**: https://d234aouv3s64w7.cloudfront.net/
- **AWS Labs**: https://d2ultfrcf31z94.cloudfront.net/  
- **AI Labs**: https://dfz8x9h0xd99s.cloudfront.net/

## 📁 Repository Structure

```
├── src/
│   ├── web-templates/index.template.html    # Main template
│   ├── cdk/                                 # Infrastructure as code
│   ├── lambda/                              # Registration functions
│   └── web-generated/                       # Generated static files
├── page-config.json                         # Product configurations
├── generate-pages.js                        # Page generator script
├── package.json                             # NPM scripts & dependencies
├── deploy-marketplace.sh                    # Deployment script
├── deploy-*.yaml                            # CloudFormation templates
└── marketplace-config.json                  # AWS deployment config
```

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install  # (if any dependencies added in future)
```

### 2. Make Content Changes
Edit `page-config.json` to update product descriptions, features, etc.

### 3. Generate Pages
```bash
npm run generate
```

### 4. Deploy Changes
```bash
npm run deploy:pages
```

## 🛠 NPM Scripts

- `npm run generate` - Generate all product pages from template
- `npm run deploy:pages` - Full deployment (generate + upload + cache invalidation)
- `npm run upload` - Upload generated pages to S3 buckets
- `npm run invalidate` - Invalidate CloudFront cache for immediate updates

## 🎨 Template System

### Template File
`src/web-templates/index.template.html` - Main template with placeholders

### Configuration
`page-config.json` - Product configurations including:
- Product names and descriptions
- Feature lists with icons
- AWS Marketplace product codes
- API endpoints

### Template Variables
- `{{LISTING_NAME}}` - Product name
- `{{LISTING_DESCRIPTION}}` - Product description  
- `{{FEATURES}}` - Generated feature list HTML
- `{{PRODUCT_CODE}}` - AWS Marketplace product code
- `{{API_ENDPOINT}}` - Registration API endpoint

## 🏗 AWS Infrastructure

### S3 Buckets (Static Hosting)
- `cloud-labs-web-68b3f5c0` → Cloud Labs
- `aws-labs-web-796a80b0` → AWS Labs
- `ai-labs-web-930e7cc0` → AI Labs

### CloudFront Distributions (CDN)
- `E13IJ9NI8XJ7T5` → Cloud Labs
- `E3L0YJ3DS46XHU` → AWS Labs  
- `E7K8B2EHD7P3U` → AI Labs

### Lambda Functions
- Registration processing and validation
- AWS Marketplace event handling
- SQS message processing for subscriptions

## 🔄 Development Workflow

1. **Content Updates**: Edit `page-config.json`
2. **Design Changes**: Modify `src/web-templates/index.template.html`
3. **Generate**: Run `npm run generate`
4. **Deploy**: Run `npm run deploy:pages`
5. **Verify**: Check live URLs (cache invalidation takes 1-2 minutes)

## 🎯 Design Features

- **Responsive Design** - Mobile-friendly layout
- **Dark Gradient Background** - Professional appearance
- **Two-Column Layout** - Content left, registration form right
- **Feature Highlights** - Icon-based feature showcase
- **AWS Marketplace Integration** - Handles registration tokens and API submission

## 🔐 Security & Best Practices

- Public repository with no sensitive data
- AWS credentials managed via IAM roles/profiles
- CloudFront provides HTTPS and global CDN
- Registration tokens validated server-side

## 📊 Monitoring & Troubleshooting

### Check Deployment Status
```bash
aws s3 ls s3://ai-labs-web-930e7cc0/
aws cloudfront get-distribution --id E7K8B2EHD7P3U
```

### Monitor Registration Issues
- Check Lambda function logs in CloudWatch
- Verify SQS queue message processing
- Test registration flow with marketplace tokens

## 🤝 Contributing

1. Fork the repository
2. Make changes to template or configuration
3. Test locally with `npm run generate`
4. Submit pull request with clear description
5. Deploy after review and approval

## 📞 Support

- **Repository Issues**: GitHub Issues
- **AWS Infrastructure**: Check CloudFormation stacks
- **Landing Page Problems**: Verify S3/CloudFront configurations
- **Registration Flow**: Check Lambda function logs in CloudWatch

---

**Status**: ✅ Production Ready | **Last Updated**: October 2024 | **Maintained By**: Codio Team