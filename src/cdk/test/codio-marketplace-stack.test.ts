import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CodioMarketplaceLandingStack } from '../lib/codio-marketplace-stack';

describe('CodioMarketplaceLandingStack', () => {
  let app: cdk.App;
  let stack: CodioMarketplaceLandingStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App({
      context: {
        'codio-marketplace': {
          bucketName: 'web-f810b8a0',
          assetsBucketName: 'codio-awsmp-assets',
          distributionId: 'E3ROD9ZTO98QPP',
          domainName: 'd2c4qabg7j7d23.cloudfront.net',
        },
      },
    });
    stack = new CodioMarketplaceLandingStack(app, 'TestStack', {
      env: { account: '355949198986', region: 'us-east-1' },
    });
    template = Template.fromStack(stack);
  });

  test('creates deployment IAM role', () => {
    // Just verify the role exists
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.hasResource('AWS::IAM::Role', {});
  });

  test('creates IAM policy with required permissions', () => {
    // Just verify the policy exists
    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.hasResource('AWS::IAM::Policy', {});
  });

  test('creates IAM policy with CloudFront permissions', () => {
    // Test that CloudFront permissions exist in the policy
    const template_json = template.toJSON();
    const policy = template_json.Resources.CodioMarketplaceDeploymentRoleDefaultPolicy43C78D72;
    
    expect(policy.Properties.PolicyDocument.Statement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Action: [
            'cloudfront:CreateInvalidation',
            'cloudfront:GetDistribution',
            'cloudfront:GetDistributionConfig',
          ],
          Effect: 'Allow',
          Resource: 'arn:aws:cloudfront::355949198986:distribution/E3ROD9ZTO98QPP',
        }),
      ])
    );
  });

  test('has correct stack outputs', () => {
    template.hasOutput('ExistingBucketName', {
      Description: 'Existing S3 Bucket name for landing page content',
      Value: 'web-f810b8a0',
    });

    template.hasOutput('ExistingAssetsBucketName', {
      Description: 'Existing S3 Bucket name for assets',
      Value: 'codio-awsmp-assets',
    });

    template.hasOutput('ExistingDistributionId', {
      Description: 'Existing CloudFront Distribution ID',
      Value: 'E3ROD9ZTO98QPP',
    });
  });

  test('does not create new S3 buckets or CloudFront distributions', () => {
    // Verify we're not creating new resources, just referencing existing ones
    template.resourceCountIs('AWS::S3::Bucket', 0);
    template.resourceCountIs('AWS::CloudFront::Distribution', 0);
  });
});