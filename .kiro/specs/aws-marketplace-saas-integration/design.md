# Design Document

## Overview

This design focuses on a simple, CDK-based approach to customize the existing AWS Marketplace SaaS landing page that's already deployed in the Codio MP account. The solution leverages the existing AWS workshop example as the foundation and applies minimal, targeted modifications to meet Codio's branding and functional requirements.

## Architecture

### High-Level Architecture

```
AWS Marketplace → CloudFront → S3 Bucket → Static Landing Page
                      ↓
                 Lambda@Edge (optional)
                      ↓
                 Registration Handler
```

### Core Components

1. **Existing Infrastructure**: Leverage the current AWS workshop deployment
2. **CDK Stack**: Infrastructure as Code for consistent deployments
3. **S3 Static Website**: Host customized HTML/CSS/JS files
4. **CloudFront Distribution**: CDN and custom domain support
5. **Registration Integration**: AWS Marketplace subscription handling

## Components and Interfaces

### CDK Stack Structure

```typescript
// Primary CDK Stack
CodioMarketplaceLandingStack
├── S3 Bucket (existing or new)
├── CloudFront Distribution (existing or update)
├── IAM Roles and Policies
└── Lambda Functions (registration handling)
```

### File Structure

```
src/
├── cdk/
│   ├── lib/
│   │   └── codio-marketplace-stack.ts
│   ├── bin/
│   │   └── app.ts
│   └── cdk.json
├── web/
│   ├── index.html (customized landing page)
│   ├── css/
│   │   └── codio-styles.css
│   ├── js/
│   │   └── registration.js
│   └── assets/
│       └── codio-logo.png
└── lambda/
    └── registration-handler/
        └── index.js
```

### Key Interfaces

#### S3 Bucket Configuration
- **Purpose**: Host static website files
- **Permissions**: Public read access for website content
- **Integration**: CloudFront origin

#### Registration Handler
- **Input**: AWS Marketplace subscription tokens
- **Output**: Registration confirmation and redirect
- **Integration**: AWS Marketplace APIs

## Data Models

### Customer Registration Data
```typescript
interface CustomerRegistration {
  marketplaceCustomerId: string;
  subscriptionId: string;
  productCode: string;
  customerEmail?: string;
  organizationName?: string;
  timestamp: Date;
}
```

### AWS Marketplace Integration
```typescript
interface MarketplaceSubscription {
  customerIdentifier: string;
  productCode: string;
  subscriptionArn: string;
  status: 'SUBSCRIBE_SUCCESS' | 'SUBSCRIBE_FAIL' | 'UNSUBSCRIBE_SUCCESS';
}
```

## Implementation Approach

### Phase 1: CDK Infrastructure Setup
1. **Examine Existing Deployment**: Review current AWS workshop setup in Codio MP account
2. **Create CDK Stack**: Define infrastructure as code based on existing resources
3. **Preserve Existing Configuration**: Maintain current AWS Marketplace integrations

### Phase 2: Content Customization
1. **Extract Current Landing Page**: Download existing HTML/CSS/JS from S3
2. **Apply Codio Branding**: Update colors, fonts, logo, and messaging
3. **Maintain AWS Integration**: Preserve all AWS Marketplace functionality

### Phase 3: Deployment and Testing
1. **Deploy via CDK**: Use `cdk deploy` for consistent infrastructure
2. **Upload Customized Content**: Deploy branded files to S3
3. **Test Registration Flow**: Verify AWS Marketplace integration works

## Error Handling

### Deployment Errors
- **CDK Deployment Failures**: Rollback mechanisms and error logging
- **S3 Upload Issues**: Retry logic and validation
- **CloudFront Invalidation**: Automatic cache clearing

### Runtime Errors
- **Registration Failures**: User-friendly error messages
- **AWS API Errors**: Graceful degradation and retry logic
- **Network Issues**: Offline-friendly messaging

## Testing Strategy

### Infrastructure Testing
- **CDK Unit Tests**: Validate stack configuration
- **Integration Tests**: Verify AWS service connections
- **Deployment Tests**: Confirm successful resource creation

### Functional Testing
- **Landing Page Tests**: Verify branding and content display
- **Registration Flow Tests**: End-to-end AWS Marketplace integration
- **Cross-browser Tests**: Ensure compatibility across browsers

### Performance Testing
- **Load Time Tests**: Verify 3-second load requirement
- **CDN Performance**: Test CloudFront distribution effectiveness
- **Mobile Responsiveness**: Validate mobile device compatibility

## Security Considerations

### AWS Security
- **IAM Least Privilege**: Minimal required permissions
- **S3 Bucket Policies**: Secure public access configuration
- **CloudFront Security**: HTTPS enforcement and security headers

### Data Protection
- **Customer Data Handling**: Comply with AWS Marketplace requirements
- **Secure Transmission**: HTTPS for all communications
- **No Sensitive Data Storage**: Avoid storing customer credentials

## Deployment Strategy

### CDK-First Approach
1. **Infrastructure Definition**: All resources defined in CDK
2. **Environment Management**: Separate stacks for dev/staging/prod
3. **Automated Deployment**: CI/CD pipeline integration

### Content Deployment
1. **S3 Sync**: Automated upload of web assets
2. **CloudFront Invalidation**: Cache clearing after updates
3. **Rollback Capability**: Quick reversion to previous versions

## Configuration Management

### Environment Variables
```typescript
// CDK Context
{
  "codio-marketplace": {
    "bucketName": "codio-marketplace-landing",
    "domainName": "marketplace.codio.com",
    "certificateArn": "arn:aws:acm:...",
    "existingResources": {
      "preserveS3": true,
      "preserveCloudFront": true
    }
  }
}
```

### Customization Points
- **Branding Assets**: Logo, colors, fonts via CSS variables
- **Content**: Messaging and feature descriptions
- **Integration**: AWS Marketplace product codes and endpoints