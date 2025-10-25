#!/bin/bash

# Codio AWS Marketplace Multi-Stack Deployment Script
# This script deploys separate stacks for each marketplace listing

set -e

echo "🚀 Codio AWS Marketplace Multi-Stack Deployment"
echo "================================================"

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

# Load marketplace configuration
if [ ! -f "marketplace-config.json" ]; then
    echo "❌ marketplace-config.json not found"
    echo "   Please create the configuration file with your marketplace listings"
    exit 1
fi

echo "📋 Loading marketplace configuration..."
ENABLED_LISTINGS=$(jq -r '.marketplaceListings | to_entries[] | select(.value.enabled == true) | .key' marketplace-config.json)
LISTING_COUNT=$(echo "$ENABLED_LISTINGS" | wc -l | tr -d ' ')

echo "📦 Found $LISTING_COUNT enabled marketplace listings:"
echo "$ENABLED_LISTINGS" | while read listing; do
    NAME=$(jq -r ".marketplaceListings.\"$listing\".name" marketplace-config.json)
    echo "   - $listing: $NAME"
done

# Build listing-specific landing pages
echo ""
echo "🔨 Building listing-specific landing pages..."
cd src
node build-listings.js
cd ..

# Install CDK dependencies
echo ""
echo "📦 Installing CDK dependencies..."
cd src/cdk
npm install

# Build CDK project
echo "🔨 Building CDK project..."
npm run build

# Bootstrap CDK if needed
echo ""
echo "🏗️  Checking CDK bootstrap status..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region us-east-1 >/dev/null 2>&1; then
    echo "📦 Bootstrapping CDK..."
    npx cdk bootstrap
else
    echo "✅ CDK already bootstrapped"
fi

# Deploy all stacks
echo ""
echo "🚀 Deploying marketplace stacks..."
echo "$ENABLED_LISTINGS" | while read listing; do
    STACK_NAME="CodioMarketplace-$listing"
    NAME=$(jq -r ".marketplaceListings.\"$listing\".name" ../../marketplace-config.json)
    
    echo ""
    echo "📋 Deploying stack: $STACK_NAME"
    echo "   Listing: $NAME"
    
    npx cdk deploy "$STACK_NAME" --require-approval never
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed: $STACK_NAME"
    else
        echo "❌ Failed to deploy: $STACK_NAME"
        exit 1
    fi
done

cd ../..

echo ""
echo "🎉 All marketplace stacks deployed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "======================"

echo "$ENABLED_LISTINGS" | while read listing; do
    STACK_NAME="CodioMarketplace-$listing"
    NAME=$(jq -r ".marketplaceListings.\"$listing\".name" marketplace-config.json)
    
    echo ""
    echo "📦 $NAME ($listing):"
    
    # Get stack outputs
    WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' --output text 2>/dev/null || echo "Not available")
    API_ENDPOINT=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text 2>/dev/null || echo "Not available")
    PRODUCT_CODE=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs[?OutputKey==`ProductCode`].OutputValue' --output text 2>/dev/null || echo "Not available")
    
    echo "   🌐 Website: $WEBSITE_URL"
    echo "   🔗 API: $API_ENDPOINT"
    echo "   📋 Product Code: $PRODUCT_CODE"
done

echo ""
echo "🎯 Next Steps:"
echo "1. Update AWS Marketplace listings with the Website URLs"
echo "2. Test registration flow with marketplace tokens"
echo "3. Configure monitoring and alerting"
echo ""
echo "✨ Codio AWS Marketplace is ready for customers!"