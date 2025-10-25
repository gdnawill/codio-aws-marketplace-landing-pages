import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { Construct } from 'constructs';

export interface MarketplaceListingConfig {
  name: string;
  description: string;
  productCode: string;
  path: string;
}

export interface CodioMarketplaceStackProps extends cdk.StackProps {
  listing: MarketplaceListingConfig;
  sharedConfig: any;
}

export class CodioMarketplaceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CodioMarketplaceStackProps) {
    super(scope, id, props);

    const { listing, sharedConfig } = props;
    // Create S3 bucket for this specific listing
    const landingPageBucket = new s3.Bucket(this, 'LandingPageBucket', {
      bucketName: `codio-marketplace-${listing.path}-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // CloudFront Distribution for this listing
    const distribution = new cloudfront.Distribution(this, 'LandingPageDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(landingPageBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // DynamoDB table for subscribers
    const subscribersTable = new dynamodb.Table(this, 'SubscribersTable', {
      tableName: `codio-marketplace-subscribers-${listing.path}`,
      partitionKey: { name: 'customerIdentifier', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // DynamoDB table for metering records
    const meteringTable = new dynamodb.Table(this, 'MeteringTable', {
      tableName: `codio-marketplace-metering-${listing.path}`,
      partitionKey: { name: 'customerIdentifier', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Lambda function for registration handling
    const registrationLambda = new lambda.Function(this, 'RegistrationHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/registration')),
      environment: {
        SUBSCRIBERS_TABLE: subscribersTable.tableName,
        METERING_TABLE: meteringTable.tableName,
        PRODUCT_CODE: listing.productCode,
        LISTING_NAME: listing.name,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant Lambda permissions to DynamoDB tables
    subscribersTable.grantReadWriteData(registrationLambda);
    meteringTable.grantReadWriteData(registrationLambda);

    // Grant Lambda permissions for AWS Marketplace APIs
    registrationLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'aws-marketplace:ResolveCustomer',
        'aws-marketplace:GetEntitlements',
        'metering.marketplace:BatchMeterUsage',
      ],
      resources: ['*'],
    }));

    // API Gateway for registration endpoint
    const api = new apigateway.RestApi(this, 'RegistrationApi', {
      restApiName: `codio-marketplace-${listing.path}-api`,
      description: `Registration API for ${listing.name}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const subscriberResource = api.root.addResource('subscriber');
    subscriberResource.addMethod('POST', new apigateway.LambdaIntegration(registrationLambda));

    // Deploy web assets to S3 (listing-specific content)
    const webDeployment = new s3deploy.BucketDeployment(this, 'WebsiteDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, `../../web-generated/${listing.path}`))],
      destinationBucket: landingPageBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
      prune: true, // Clean deployment for this specific listing
      exclude: ['*.md', '*.txt', '.DS_Store'],
      cacheControl: [
        s3deploy.CacheControl.setPublic(),
        s3deploy.CacheControl.maxAge(cdk.Duration.hours(1)),
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: landingPageBucket.bucketName,
      description: `S3 Bucket for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: `CloudFront Distribution ID for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: `CloudFront Domain for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: `Website URL for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: `API Gateway endpoint for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'RegistrationEndpoint', {
      value: `${api.url}subscriber`,
      description: `Registration endpoint for ${listing.name}`,
    });

    new cdk.CfnOutput(this, 'ProductCode', {
      value: listing.productCode,
      description: `AWS Marketplace Product Code for ${listing.name}`,
    });
  }
}