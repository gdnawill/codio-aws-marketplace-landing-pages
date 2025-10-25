# Codio AWS Marketplace Landing Page - Deployment Guide

## Overview

This repository contains a complete CDK-based solution for deploying and managing Codio's AWS Marketplace SaaS landing page. The solution includes:

- **Customized landing page** with Codio branding and dark theme
- **CDK infrastructure** that integrates with existing AWS resources
- **Automated deployment** that uploads web content and invalidates CloudFront
- **Simple registration form** collecting first name, last name, and email

## Quick Start

1. **Set AWS Credentials** (get fresh SSO credentials):
   ```bash
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_SESSION_TOKEN="your-session-token"
   ```

2. **Deploy Everything**:
   ```bash
   cd src/cdk
   npm install
   ./deploy.sh
   ```

3. **Verify Deployment**:
   ```bash
   ./verify-deployment.sh
   ```

## What Gets Deployed

### Infrastructure (CDK)
- **IAM Role** for deployment operations
- **S3 Deployment** automation for web content
- **CloudFront Integration** with cache invalidation
- **Existing Resource Integration** (preserves current AWS Marketplace setup)

### Web Content
- **Landing Page** (`index.html`) with Codio branding
- **Styles** (`css/codio-styles.css`) matching Codio's dark theme
- **JavaScript** (`js/registration.js`) for AWS Marketplace integration
- **Assets** (`assets/codio-logo.png`) Codio logo

## Key Features

### 🎨 Codio Branding
- Dark theme matching the main Codio website
- Codio logo and color scheme (#00b4d8 blue accent)
- Clean, modern typography using Inter font
- Responsive design for all devices

### 📝 Simple Registration
- **First Name** - Customer's first name
- **Last Name** - Customer's last name  
- **Email Address** - Customer's email
- **AWS Marketplace Integration** - Handles registration tokens automatically

### 🚀 Automated Deployment
- **One-command deployment** with `./deploy.sh`
- **Automatic S3 upload** of web assets
- **CloudFront cache invalidation** for immediate updates
- **Deployment verification** with `./verify-deployment.sh`

## File Structure

```
├── src/
│   ├── cdk/                    # CDK Infrastructure
│   │   ├── lib/
│   │   │   └── codio-marketplace-stack.ts
│   │   ├── bin/
│   │   │   └── app.ts
│   │   ├── deploy.sh           # Main deployment script
│   │   ├── verify-deployment.sh # Verification script
│   │   └── README.md           # Detailed CDK documentation
│   └── web/                    # Web Content
│       ├── index.html          # Landing page
│       ├── css/
│       │   └── codio-styles.css
│       ├── js/
│       │   └── registration.js
│       └── assets/
│           └── codio-logo.png
└── DEPLOYMENT_GUIDE.md         # This file
```

## Integration with Existing AWS Infrastructure

The solution works with existing AWS Marketplace resources:

- **S3 Bucket**: `web-f810b8a0` (landing page content)
- **Assets Bucket**: `codio-awsmp-assets` (logos and assets)
- **CloudFront**: `E3ROD9ZTO98QPP` (CDN distribution)
- **CloudFormation**: `codio-marketplace-saas` (existing marketplace stack)

## Customization

### Updating Content
1. Edit files in `src/web/`
2. Run `cd src/cdk && ./deploy.sh`
3. Changes are automatically uploaded and cache is invalidated

### Updating Infrastructure
1. Edit `src/cdk/lib/codio-marketplace-stack.ts`
2. Run `cd src/cdk && ./deploy.sh`
3. CDK will update the infrastructure

### Branding Changes
- **Colors**: Update CSS variables in `src/web/css/codio-styles.css`
- **Logo**: Replace `src/web/assets/codio-logo.png`
- **Content**: Edit `src/web/index.html`

## Troubleshooting

### Common Issues

1. **AWS Credentials Expired**
   - Get fresh SSO credentials from AWS console
   - Re-export the environment variables

2. **Website Not Loading**
   - Run `./verify-deployment.sh` to check status
   - CloudFront may take a few minutes to propagate changes

3. **CDK Bootstrap Required**
   - The deploy script handles this automatically
   - If issues persist, run `npx cdk bootstrap` manually

### Getting Help

- Check `src/cdk/README.md` for detailed CDK documentation
- Review CloudFormation console for deployment status
- Use `./verify-deployment.sh` to diagnose issues

## Handoff to Engineering Team

This solution is ready for the engineering team to:

1. **Take ownership** of the CDK infrastructure
2. **Customize content** as needed for different marketplace offers
3. **Integrate** with Codio's backend systems for registration processing
4. **Monitor** and maintain the deployment

The CDK approach ensures:
- **Infrastructure as Code** - All resources are version controlled
- **Repeatable Deployments** - Consistent across environments
- **Easy Updates** - Simple content and infrastructure changes
- **Integration Ready** - Works with existing AWS Marketplace setup

## Next Steps

1. **Test the registration flow** with AWS Marketplace tokens
2. **Integrate with Codio's user management system**
3. **Set up monitoring** and alerting for the landing page
4. **Create additional landing pages** for different marketplace offers

---

**Ready to deploy!** 🚀

The Codio AWS Marketplace landing page is now ready for production use with a complete CDK-based deployment pipeline.