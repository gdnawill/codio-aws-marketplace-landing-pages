"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const codio_marketplace_stack_1 = require("../lib/codio-marketplace-stack");
describe('CodioMarketplaceLandingStack', () => {
    let app;
    let stack;
    let template;
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
        stack = new codio_marketplace_stack_1.CodioMarketplaceLandingStack(app, 'TestStack', {
            env: { account: '355949198986', region: 'us-east-1' },
        });
        template = assertions_1.Template.fromStack(stack);
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
        expect(policy.Properties.PolicyDocument.Statement).toEqual(expect.arrayContaining([
            expect.objectContaining({
                Action: [
                    'cloudfront:CreateInvalidation',
                    'cloudfront:GetDistribution',
                    'cloudfront:GetDistributionConfig',
                ],
                Effect: 'Allow',
                Resource: 'arn:aws:cloudfront::355949198986:distribution/E3ROD9ZTO98QPP',
            }),
        ]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kaW8tbWFya2V0cGxhY2Utc3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGlvLW1hcmtldHBsYWNlLXN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQWtEO0FBQ2xELDRFQUE4RTtBQUU5RSxRQUFRLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO0lBQzVDLElBQUksR0FBWSxDQUFDO0lBQ2pCLElBQUksS0FBbUMsQ0FBQztJQUN4QyxJQUFJLFFBQWtCLENBQUM7SUFFdkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxFQUFFO2dCQUNQLG1CQUFtQixFQUFFO29CQUNuQixVQUFVLEVBQUUsY0FBYztvQkFDMUIsZ0JBQWdCLEVBQUUsb0JBQW9CO29CQUN0QyxjQUFjLEVBQUUsZ0JBQWdCO29CQUNoQyxVQUFVLEVBQUUsK0JBQStCO2lCQUM1QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxHQUFHLElBQUksc0RBQTRCLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtZQUN6RCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7U0FDdEQsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUN2Qyw4QkFBOEI7UUFDOUIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QyxRQUFRLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxnQ0FBZ0M7UUFDaEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCx1REFBdUQ7UUFDdkQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hDLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsbURBQW1ELENBQUM7UUFFM0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDeEQsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRTtvQkFDTiwrQkFBK0I7b0JBQy9CLDRCQUE0QjtvQkFDNUIsa0NBQWtDO2lCQUNuQztnQkFDRCxNQUFNLEVBQUUsT0FBTztnQkFDZixRQUFRLEVBQUUsOERBQThEO2FBQ3pFLENBQUM7U0FDSCxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtRQUNyQyxRQUFRLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFO1lBQ3ZDLFdBQVcsRUFBRSxrREFBa0Q7WUFDL0QsS0FBSyxFQUFFLGNBQWM7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsRUFBRTtZQUM3QyxXQUFXLEVBQUUsb0NBQW9DO1lBQ2pELEtBQUssRUFBRSxvQkFBb0I7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRTtZQUMzQyxXQUFXLEVBQUUscUNBQXFDO1lBQ2xELEtBQUssRUFBRSxnQkFBZ0I7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3RFLDBFQUEwRTtRQUMxRSxRQUFRLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxlQUFlLENBQUMsK0JBQStCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQ29kaW9NYXJrZXRwbGFjZUxhbmRpbmdTdGFjayB9IGZyb20gJy4uL2xpYi9jb2Rpby1tYXJrZXRwbGFjZS1zdGFjayc7XG5cbmRlc2NyaWJlKCdDb2Rpb01hcmtldHBsYWNlTGFuZGluZ1N0YWNrJywgKCkgPT4ge1xuICBsZXQgYXBwOiBjZGsuQXBwO1xuICBsZXQgc3RhY2s6IENvZGlvTWFya2V0cGxhY2VMYW5kaW5nU3RhY2s7XG4gIGxldCB0ZW1wbGF0ZTogVGVtcGxhdGU7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IGNkay5BcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnY29kaW8tbWFya2V0cGxhY2UnOiB7XG4gICAgICAgICAgYnVja2V0TmFtZTogJ3dlYi1mODEwYjhhMCcsXG4gICAgICAgICAgYXNzZXRzQnVja2V0TmFtZTogJ2NvZGlvLWF3c21wLWFzc2V0cycsXG4gICAgICAgICAgZGlzdHJpYnV0aW9uSWQ6ICdFM1JPRDlaVE85OFFQUCcsXG4gICAgICAgICAgZG9tYWluTmFtZTogJ2QyYzRxYWJnN2o3ZDIzLmNsb3VkZnJvbnQubmV0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgc3RhY2sgPSBuZXcgQ29kaW9NYXJrZXRwbGFjZUxhbmRpbmdTdGFjayhhcHAsICdUZXN0U3RhY2snLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzM1NTk0OTE5ODk4NicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICB9KTtcbiAgICB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZXMgZGVwbG95bWVudCBJQU0gcm9sZScsICgpID0+IHtcbiAgICAvLyBKdXN0IHZlcmlmeSB0aGUgcm9sZSBleGlzdHNcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2UoJ0FXUzo6SUFNOjpSb2xlJywge30pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIElBTSBwb2xpY3kgd2l0aCByZXF1aXJlZCBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAvLyBKdXN0IHZlcmlmeSB0aGUgcG9saWN5IGV4aXN0c1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDEpO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlKCdBV1M6OklBTTo6UG9saWN5Jywge30pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIElBTSBwb2xpY3kgd2l0aCBDbG91ZEZyb250IHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIC8vIFRlc3QgdGhhdCBDbG91ZEZyb250IHBlcm1pc3Npb25zIGV4aXN0IGluIHRoZSBwb2xpY3lcbiAgICBjb25zdCB0ZW1wbGF0ZV9qc29uID0gdGVtcGxhdGUudG9KU09OKCk7XG4gICAgY29uc3QgcG9saWN5ID0gdGVtcGxhdGVfanNvbi5SZXNvdXJjZXMuQ29kaW9NYXJrZXRwbGFjZURlcGxveW1lbnRSb2xlRGVmYXVsdFBvbGljeTQzQzc4RDcyO1xuICAgIFxuICAgIGV4cGVjdChwb2xpY3kuUHJvcGVydGllcy5Qb2xpY3lEb2N1bWVudC5TdGF0ZW1lbnQpLnRvRXF1YWwoXG4gICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ2Nsb3VkZnJvbnQ6Q3JlYXRlSW52YWxpZGF0aW9uJyxcbiAgICAgICAgICAgICdjbG91ZGZyb250OkdldERpc3RyaWJ1dGlvbicsXG4gICAgICAgICAgICAnY2xvdWRmcm9udDpHZXREaXN0cmlidXRpb25Db25maWcnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnYXJuOmF3czpjbG91ZGZyb250OjozNTU5NDkxOTg5ODY6ZGlzdHJpYnV0aW9uL0UzUk9EOVpUTzk4UVBQJyxcbiAgICAgICAgfSksXG4gICAgICBdKVxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2hhcyBjb3JyZWN0IHN0YWNrIG91dHB1dHMnLCAoKSA9PiB7XG4gICAgdGVtcGxhdGUuaGFzT3V0cHV0KCdFeGlzdGluZ0J1Y2tldE5hbWUnLCB7XG4gICAgICBEZXNjcmlwdGlvbjogJ0V4aXN0aW5nIFMzIEJ1Y2tldCBuYW1lIGZvciBsYW5kaW5nIHBhZ2UgY29udGVudCcsXG4gICAgICBWYWx1ZTogJ3dlYi1mODEwYjhhMCcsXG4gICAgfSk7XG5cbiAgICB0ZW1wbGF0ZS5oYXNPdXRwdXQoJ0V4aXN0aW5nQXNzZXRzQnVja2V0TmFtZScsIHtcbiAgICAgIERlc2NyaXB0aW9uOiAnRXhpc3RpbmcgUzMgQnVja2V0IG5hbWUgZm9yIGFzc2V0cycsXG4gICAgICBWYWx1ZTogJ2NvZGlvLWF3c21wLWFzc2V0cycsXG4gICAgfSk7XG5cbiAgICB0ZW1wbGF0ZS5oYXNPdXRwdXQoJ0V4aXN0aW5nRGlzdHJpYnV0aW9uSWQnLCB7XG4gICAgICBEZXNjcmlwdGlvbjogJ0V4aXN0aW5nIENsb3VkRnJvbnQgRGlzdHJpYnV0aW9uIElEJyxcbiAgICAgIFZhbHVlOiAnRTNST0Q5WlRPOThRUFAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCBjcmVhdGUgbmV3IFMzIGJ1Y2tldHMgb3IgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25zJywgKCkgPT4ge1xuICAgIC8vIFZlcmlmeSB3ZSdyZSBub3QgY3JlYXRpbmcgbmV3IHJlc291cmNlcywganVzdCByZWZlcmVuY2luZyBleGlzdGluZyBvbmVzXG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OlMzOjpCdWNrZXQnLCAwKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywgMCk7XG4gIH0pO1xufSk7Il19