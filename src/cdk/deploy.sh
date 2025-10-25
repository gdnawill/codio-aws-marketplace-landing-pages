#!/bin/bash

# Codio AWS Marketplace CDK Deployment Script
# This script sets up AWS credentials and deploys the CDK stack with web content

set -e

echo "🚀 Starting Codio AWS Marketplace CDK Deployment"

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
    echo "❌ AWS credentials not found. Please set the following environment variables:"
    echo "   export AWS_ACCESS_KEY_ID=\"your-access-key\""
    echo "   export AWS_SECRET_ACCESS_KEY=\"your-secret-key\""
    echo "   export AWS_SESSION_TOKEN=\"your-session-token\""
    exit 1
fi

# Verify AWS connection
echo "🔍 Verifying AWS connection..."
aws sts get-caller-identity

# Check if web templates exist
if [ ! -d "../web-templates" ]; then
    echo "❌ Web templates directory not found at ../web-templates"
    echo "   Please ensure the web-templates directory exists"
    exit 1
fi

# Build listing-specific landing pages
echo "🔨 Building listing-specific landing pages..."
cd ..
node build-listings.js
cd cdk

echo "📁 Generated web content:"
ls -la ../web-generated/

# Build the CDK project
echo "🔨 Building CDK project..."
npm run build

# Bootstrap CDK if needed (only run once per account/region)
echo "🏗️  Checking CDK bootstrap status..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region us-east-1 >/dev/null 2>&1; then
    echo "📦 Bootstrapping CDK..."
    npx cdk bootstrap
else
    echo "✅ CDK already bootstrapped"
fi

# Deploy the stack (this will also upload web content to S3)
echo "🚀 Deploying CDK stack and uploading web content..."
npx cdk deploy --require-approval never

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Stack Outputs:"
aws cloudformation describe-stacks --stack-name CodioMarketplaceLandingStack --query 'Stacks[0].Outputs' --output table

echo ""
echo "🌐 Testing website..."
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name CodioMarketplaceLandingStack --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' --output text)
echo "Website URL: $WEBSITE_URL"

echo ""
echo "🎉 Codio AWS Marketplace landing page is live!"
echo "   Visit: $WEBSITE_URL"