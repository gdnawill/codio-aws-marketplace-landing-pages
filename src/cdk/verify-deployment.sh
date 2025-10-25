#!/bin/bash

# Codio AWS Marketplace Deployment Verification Script
# This script verifies that the deployment was successful

set -e

echo "🔍 Verifying Codio AWS Marketplace Deployment"

# Check if stack exists
echo "📋 Checking CDK stack status..."
STACK_STATUS=$(aws cloudformation describe-stacks --stack-name CodioMarketplaceLandingStack --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$STACK_STATUS" = "NOT_FOUND" ]; then
    echo "❌ CDK stack not found. Please run ./deploy.sh first."
    exit 1
elif [ "$STACK_STATUS" != "CREATE_COMPLETE" ] && [ "$STACK_STATUS" != "UPDATE_COMPLETE" ]; then
    echo "⚠️  Stack status: $STACK_STATUS"
    echo "   Stack may still be deploying or in an error state."
else
    echo "✅ Stack status: $STACK_STATUS"
fi

# Get website URL
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name CodioMarketplaceLandingStack --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' --output text)
echo "🌐 Website URL: $WEBSITE_URL"

# Test website accessibility
echo "🔗 Testing website accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEBSITE_URL" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Website is accessible (HTTP $HTTP_STATUS)"
else
    echo "❌ Website returned HTTP $HTTP_STATUS"
    echo "   This might be normal if CloudFront is still propagating changes."
fi

# Check S3 bucket contents
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name CodioMarketplaceLandingStack --query 'Stacks[0].Outputs[?OutputKey==`ExistingBucketName`].OutputValue' --output text)
echo "📦 Checking S3 bucket contents..."
echo "Bucket: $BUCKET_NAME"

# Check main files
if aws s3 ls "s3://$BUCKET_NAME/index.html" >/dev/null 2>&1; then
    echo "✅ index.html found in S3 bucket"
else
    echo "❌ index.html not found in S3 bucket"
fi

if aws s3 ls "s3://$BUCKET_NAME/css/codio-styles.css" >/dev/null 2>&1; then
    echo "✅ CSS file found in S3 bucket"
else
    echo "❌ CSS file not found in S3 bucket"
fi

if aws s3 ls "s3://$BUCKET_NAME/js/registration.js" >/dev/null 2>&1; then
    echo "✅ JavaScript file found in S3 bucket"
else
    echo "❌ JavaScript file not found in S3 bucket"
fi

# Check listing-specific pages
echo "📄 Checking listing-specific pages..."
LISTINGS=("ai-skills" "data-analytics" "cybersecurity")
for listing in "${LISTINGS[@]}"; do
    if aws s3 ls "s3://$BUCKET_NAME/$listing/index.html" >/dev/null 2>&1; then
        echo "✅ $listing/index.html found"
    else
        echo "❌ $listing/index.html not found"
    fi
done

echo ""
echo "🎯 Deployment Summary:"
echo "   Stack Status: $STACK_STATUS"
echo "   Website URL: $WEBSITE_URL"
echo "   HTTP Status: $HTTP_STATUS"
echo ""

if [ "$STACK_STATUS" = "CREATE_COMPLETE" ] || [ "$STACK_STATUS" = "UPDATE_COMPLETE" ]; then
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "🎉 Deployment verification successful!"
        echo "   Your Codio AWS Marketplace landing page is ready!"
    else
        echo "⚠️  Deployment completed but website may still be propagating."
        echo "   Please wait a few minutes and try accessing the URL again."
    fi
else
    echo "❌ Deployment verification failed."
    echo "   Please check the CloudFormation console for more details."
fi