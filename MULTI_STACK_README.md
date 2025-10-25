# Codio AWS Marketplace Multi-Stack Deployment

## Overview

This solution creates **separate, complete AWS infrastructure stacks** for each AWS Marketplace listing. Each listing gets its own:

- 🏗️ **Complete CDK Stack** with dedicated resources
- 🪣 **S3 Bucket** for hosting the landing page
- 🌐 **CloudFront Distribution** for global content delivery
- ⚡ **Lambda Function** for registration processing
- 🔗 **API Gateway** for registration endpoints
- 📊 **DynamoDB Tables** for subscribers and metering data
- 🔐 **IAM Roles** with least-privilege permissions

## Configuration-Driven Deployment

### 📋 Marketplace Configuration (`marketplace-config.json`)

```json
{
  "marketplaceListings": {
    "ai-skills": {
      "name": "Codio AI Skills Training",
      "description": "Build job-ready AI and machine learning skills...",
      "productCode": "CODIO_AI_SKILLS_2024",
      "path": "ai-skills",
      "enabled": true
    },
    "data-analytics": {
      "name": "Codio Data Analytics Training", 
      "description": "Master data science and analytics...",
      "productCode": "CODIO_DATA_ANALYTICS_2024",
      "path": "data-analytics",
      "enabled": true
    }
  },
  "deploymentSettings": {
    "region": "us-east-1",
    "environment": "production",
    "retainResources": true
  }
}
```

### 🚀 One-Command Deployment

```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_SESSION_TOKEN="your-session-token"

# Deploy all enabled listings
./deploy-marketplace.sh
```

## What Gets Created Per Listing

### 🏗️ Infrastructure Stack: `codio-marketplace-{listing-path}`

Each listing creates a complete, isolated stack:

```
Stack: codio-marketplace-ai-skills
├── S3 Bucket: codio-marketplace-ai-skills-{account-id}
├── CloudFront Distribution: {unique-id}.cloudfront.net
├── Lambda Function: Registration handler with listing-specific config
├── API Gateway: {api-id}.execute-api.us-east-1.amazonaws.com
├── DynamoDB Tables:
│   ├── codio-marketplace-subscribers-ai-skills
│   └── codio-marketplace-metering-ai-skills
└── IAM Roles: Least-privilege permissions for Lambda execution
```

### 🌐 Landing Page: `https://{distribution}.cloudfront.net`

Each listing gets a customized landing page:
- **Listing-specific branding** and messaging
- **Dedicated registration form** with product code
- **Unique API endpoint** for registration processing
- **AWS Marketplace token handling** for that specific product

### ⚡ Registration Flow Per Listing

1. **Customer clicks** from AWS Marketplace listing
2. **Lands on listing-specific page** with registration token
3. **Submits registration** to dedicated API Gateway endpoint
4. **Lambda processes** with listing-specific product code
5. **Data stored** in listing-specific DynamoDB tables
6. **Metering recorded** for that specific product

## Management Commands

### 🔧 Deploy All Listings
```bash
./deploy-marketplace.sh
```

### 📋 Check Deployment Status
```bash
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query 'StackSummaries[?contains(StackName, `codio-marketplace`)].{Name:StackName,Status:StackStatus}' --output table
```

### 🌐 Get Website URLs
```bash
aws cloudformation describe-stacks --stack-name codio-marketplace-ai-skills --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' --output text
```

### 📊 View Registration Data
```bash
aws dynamodb scan --table-name codio-marketplace-subscribers-ai-skills --query 'Items[*].{Email:contactEmail.S,Name:contactPerson.S,Date:registrationDate.S}'
```

## Adding New Listings

### 1. Update Configuration
Add new listing to `marketplace-config.json`:

```json
{
  "new-listing": {
    "name": "Codio New Skills Training",
    "description": "Description of the new training program",
    "productCode": "CODIO_NEW_SKILLS_2024",
    "path": "new-listing",
    "enabled": true
  }
}
```

### 2. Deploy
```bash
./deploy-marketplace.sh
```

### 3. Update AWS Marketplace
Use the generated Website URL in your AWS Marketplace listing configuration.

## Disabling Listings

Set `"enabled": false` in the configuration and redeploy:

```json
{
  "old-listing": {
    "enabled": false
  }
}
```

**Note**: This won't delete existing stacks - you'll need to manually delete them if no longer needed.

## Monitoring & Maintenance

### 📊 CloudWatch Metrics
Each stack creates separate CloudWatch metrics:
- Lambda execution metrics per listing
- API Gateway request metrics per listing
- DynamoDB read/write metrics per listing

### 🔍 Logging
Each Lambda function logs to its own CloudWatch Log Group:
- `/aws/lambda/CodioMarketplace-{listing}-RegistrationHandler`

### 💰 Cost Management
Each stack is separately tagged for cost allocation:
- Stack: `codio-marketplace-{listing}`
- Listing: `{listing-name}`

## Security

### 🔐 Isolation
- **Complete resource isolation** between listings
- **Separate IAM roles** with minimal permissions
- **Dedicated DynamoDB tables** prevent data mixing
- **Individual API endpoints** for each listing

### 🛡️ AWS Marketplace Integration
- **Token validation** per product code
- **Customer resolution** through AWS Marketplace APIs
- **Metering integration** for usage tracking
- **Secure registration** with proper error handling

## Troubleshooting

### Common Issues

1. **Stack deployment fails**
   - Check AWS credentials are valid
   - Verify CDK is bootstrapped: `npx cdk bootstrap`
   - Check CloudFormation console for detailed errors

2. **Registration not working**
   - Verify AWS Marketplace token is valid
   - Check Lambda logs in CloudWatch
   - Ensure DynamoDB tables exist and have proper permissions

3. **Website not loading**
   - Check S3 bucket has content
   - Verify CloudFront distribution is deployed
   - Wait for CloudFront propagation (up to 15 minutes)

### Getting Help

- **CloudFormation Console**: View stack deployment status and errors
- **CloudWatch Logs**: Check Lambda function execution logs
- **API Gateway Console**: Test registration endpoints
- **DynamoDB Console**: Verify data is being stored correctly

---

## 🎯 Ready for Production

This multi-stack approach provides:
- ✅ **Complete isolation** between marketplace listings
- ✅ **Scalable architecture** - add listings by updating config
- ✅ **Production-ready** with proper error handling and monitoring
- ✅ **Cost-effective** - pay only for resources you use
- ✅ **Maintainable** - clear separation of concerns

Perfect for managing multiple AWS Marketplace SaaS offerings! 🚀