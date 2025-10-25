# Codio AWS Marketplace CDK Infrastructure

This CDK project manages the infrastructure for Codio's AWS Marketplace SaaS integration landing page.

## Overview

The CDK stack works with existing AWS Marketplace infrastructure deployed in the Codio account, providing:

- IAM roles for deployment operations
- Integration with existing S3 buckets (`web-f810b8a0`, `codio-awsmp-assets`)
- CloudFront distribution management (`E3ROD9ZTO98QPP`)
- Permissions for CloudFormation stack integration

## Prerequisites

1. **AWS CLI** installed and configured
2. **Node.js** (v18 or later)
3. **AWS CDK** installed globally: `npm install -g aws-cdk`
4. **AWS SSO credentials** for the Codio Marketplace account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set AWS credentials (use the SSO credentials provided):
   ```bash
   export AWS_ACCESS_KEY_ID="your-access-key"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_SESSION_TOKEN="your-session-token"
   ```

3. Verify AWS connection:
   ```bash
   aws sts get-caller-identity
   ```

## Deployment

### Quick Deployment
Use the provided deployment script to deploy both infrastructure and web content:
```bash
./deploy.sh
```

This script will:
- Verify AWS credentials
- Build the CDK project
- Bootstrap CDK (if needed)
- Deploy the stack
- Upload web assets to S3
- Invalidate CloudFront cache
- Display the website URL

### Verify Deployment
After deployment, verify everything is working:
```bash
./verify-deployment.sh
```

### Manual Deployment
1. Build the project:
   ```bash
   npm run build
   ```

2. Bootstrap CDK (first time only):
   ```bash
   npx cdk bootstrap
   ```

3. Deploy the stack:
   ```bash
   npx cdk deploy
   ```

Note: The CDK deployment automatically uploads the web content from `../web/` to S3 and invalidates the CloudFront cache.

## Web Content Structure

The CDK automatically deploys web content from the `../web/` directory:

```
web/
├── index.html          # Main landing page
├── css/
│   └── codio-styles.css # Codio-branded styles
├── js/
│   └── registration.js  # Registration form logic
└── assets/
    └── codio-logo.png   # Codio logo
```

The web content features:
- **Dark theme** matching Codio's brand
- **Responsive design** for desktop and mobile
- **Simple registration form** (first name, last name, email)
- **AWS Marketplace integration** with token handling
- **Error handling** and user feedback

## Stack Configuration

The stack is configured via `cdk.json` context:

```json
{
  "codio-marketplace": {
    "bucketName": "web-f810b8a0",
    "assetsBucketName": "codio-awsmp-assets",
    "distributionId": "E3ROD9ZTO98QPP",
    "domainName": "d2c4qabg7j7d23.cloudfront.net",
    "existingResources": {
      "preserveS3": true,
      "preserveCloudFront": true,
      "existingStackName": "codio-marketplace-saas"
    }
  }
}
```

## Existing Infrastructure

This CDK stack integrates with existing AWS Marketplace infrastructure:

- **S3 Buckets**: 
  - `web-f810b8a0` - Landing page content
  - `codio-awsmp-assets` - Static assets (logos, etc.)
- **CloudFront Distribution**: `E3ROD9ZTO98QPP`
- **CloudFormation Stacks**: 
  - `codio-marketplace-saas`
  - `codio-marketplace-saas-SampleApp-*`

## Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run unit tests
- `npx cdk deploy` - Deploy the stack
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emit the synthesized CloudFormation template

## Outputs

After deployment, the stack provides these outputs:

- `ExistingBucketName` - S3 bucket for landing page content
- `ExistingAssetsBucketName` - S3 bucket for assets
- `ExistingDistributionId` - CloudFront distribution ID
- `ExistingDistributionDomainName` - CloudFront domain name
- `DeploymentRoleArn` - IAM role for deployment operations

## Security

The deployment role has minimal required permissions:
- Read/write access to the S3 buckets
- CloudFront invalidation permissions
- CloudFormation stack read permissions

## Troubleshooting

### Common Issues

1. **CDK Bootstrap Required**: Run `npx cdk bootstrap` if you see bootstrap-related errors
2. **AWS Credentials**: Ensure SSO credentials are properly set and not expired
3. **Node Version**: Use Node.js v18 or later for compatibility

### Useful Commands

```bash
# Check AWS identity
aws sts get-caller-identity

# List existing stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE

# Check S3 buckets
aws s3 ls

# Check CloudFront distributions
aws cloudfront list-distributions
```