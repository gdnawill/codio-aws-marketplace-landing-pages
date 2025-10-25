# Codio AWS Marketplace Landing Pages

This repository contains the landing page templates and deployment infrastructure for Codio's AWS Marketplace offerings.

## Products

- **Cloud Labs for Tech Skills** - Programming, data, and security skills labs
- **AWS Labs Sandboxes** - Secure AWS cloud training environments  
- **AI Lab Sandboxes** - AI/ML frameworks and tools

## Architecture

### Template System
- `src/web-templates/index.template.html` - Main template with placeholders
- `page-config.json` - Product configurations and content
- `generate-pages.js` - Script to generate individual product pages

### Generated Pages
- `cloud-labs-index.html` - Cloud Labs landing page
- `aws-labs-index.html` - AWS Labs landing page  
- `ai-labs-index.html` - AI Labs landing page

### Deployment
Pages are deployed to S3 buckets with CloudFront distributions:
- Cloud Labs: `s3://cloud-labs-web-68b3f5c0/` → `d234aouv3s64w7.cloudfront.net`
- AWS Labs: `s3://aws-labs-web-796a80b0/` → `d2ultfrcf31z94.cloudfront.net`
- AI Labs: `s3://ai-labs-web-930e7cc0/` → `dfz8x9h0xd99s.cloudfront.net`

## Development Workflow

### Making Changes

1. **Update Content**: Edit `page-config.json` to modify product descriptions, features, etc.

2. **Update Design**: Modify `src/web-templates/index.template.html` for layout/styling changes

3. **Generate Pages**: Run the generation script
   ```bash
   node generate-pages.js
   ```

4. **Deploy**: Upload to S3 and invalidate CloudFront cache
   ```bash
   # Upload to S3
   aws s3 cp ai-labs-index.html s3://ai-labs-web-930e7cc0/index.html
   aws s3 cp aws-labs-index.html s3://aws-labs-web-796a80b0/index.html
   aws s3 cp cloud-labs-index.html s3://cloud-labs-web-68b3f5c0/index.html
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id E7K8B2EHD7P3U --paths "/*"
   aws cloudfront create-invalidation --distribution-id E3L0YJ3DS46XHU --paths "/*"
   aws cloudfront create-invalidation --distribution-id E13IJ9NI8XJ7T5 --paths "/*"
   ```

### Template Variables

The template uses these placeholders:
- `{{LISTING_NAME}}` - Product name
- `{{LISTING_DESCRIPTION}}` - Product description
- `{{FEATURES}}` - Feature list HTML
- `{{PRODUCT_CODE}}` - AWS Marketplace product code
- `{{API_ENDPOINT}}` - Registration API endpoint

## Design Features

- **Responsive Design** - Works on desktop and mobile
- **Dark Gradient Background** - Professional appearance
- **Two-Column Layout** - Content left, registration form right
- **Feature Highlights** - Icon-based feature list
- **AWS Marketplace Integration** - Handles registration tokens and API submission

## Infrastructure

### AWS Resources
- S3 buckets for static hosting
- CloudFront distributions for CDN
- Lambda functions for registration processing
- SQS queues for marketplace events

### Registration Flow
1. User clicks from AWS Marketplace (includes registration token)
2. Landing page captures user details
3. Form submits to Lambda function via API Gateway
4. Lambda processes registration and handles marketplace integration

## Deployment Scripts

- `deploy-marketplace.sh` - Main deployment script
- `deploy-*.yaml` - CloudFormation templates for each product
- `marketplace-config.json` - Deployment configuration

## Contributing

1. Make changes to template or configuration
2. Test locally by generating pages
3. Deploy to staging environment first
4. Deploy to production after validation
5. Monitor CloudWatch logs for any issues

## Support

For issues with:
- **Landing Pages**: Check CloudFront distributions and S3 buckets
- **Registration**: Check Lambda function logs in CloudWatch
- **Marketplace Integration**: Verify SQS queues and subscription handlers