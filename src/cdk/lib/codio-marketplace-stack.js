"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodioMarketplaceLandingStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const iam = require("aws-cdk-lib/aws-iam");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const path = require("path");
class CodioMarketplaceLandingStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Get configuration from CDK context
        const config = this.node.tryGetContext('codio-marketplace') || {};
        // Import existing S3 bucket for the landing page
        const landingPageBucket = s3.Bucket.fromBucketName(this, 'ExistingLandingPageBucket', config.bucketName || 'web-f810b8a0');
        // Import existing assets bucket
        const assetsBucket = s3.Bucket.fromBucketName(this, 'ExistingAssetsBucket', config.assetsBucketName || 'codio-awsmp-assets');
        // Import existing CloudFront distribution
        const distribution = cloudfront.Distribution.fromDistributionAttributes(this, 'ExistingDistribution', {
            distributionId: config.distributionId || 'E3ROD9ZTO98QPP',
            domainName: config.domainName || 'd2c4qabg7j7d23.cloudfront.net',
        });
        // IAM Role for deployment operations
        const deploymentRole = new iam.Role(this, 'CodioMarketplaceDeploymentRole', {
            assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('lambda.amazonaws.com'), new iam.ArnPrincipal(`arn:aws:sts::${this.account}:assumed-role/AWSReservedSSO_CodioMarketplaceAccess_e8b93c63407b447d/will@codio.com`)),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });
        // Grant deployment role permissions to update S3 buckets
        landingPageBucket.grantReadWrite(deploymentRole);
        assetsBucket.grantReadWrite(deploymentRole);
        // Grant CloudFront invalidation permissions
        deploymentRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'cloudfront:CreateInvalidation',
                'cloudfront:GetDistribution',
                'cloudfront:GetDistributionConfig',
            ],
            resources: [`arn:aws:cloudfront::${this.account}:distribution/${config.distributionId}`],
        }));
        // Grant permissions to read CloudFormation stacks (for integration)
        deploymentRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'cloudformation:DescribeStacks',
                'cloudformation:DescribeStackResources',
                'cloudformation:ListStacks',
            ],
            resources: [
                `arn:aws:cloudformation:${this.region}:${this.account}:stack/codio-marketplace-saas/*`,
                `arn:aws:cloudformation:${this.region}:${this.account}:stack/codio-marketplace-saas-SampleApp-*/*`,
            ],
        }));
        // Deploy web assets to S3
        const webDeployment = new s3deploy.BucketDeployment(this, 'WebsiteDeployment', {
            sources: [s3deploy.Source.asset(path.join(__dirname, '../../web'))],
            destinationBucket: landingPageBucket,
            distribution: distribution,
            distributionPaths: ['/*'],
            prune: false,
            exclude: ['*.md', '*.txt', '.DS_Store'],
            cacheControl: [
                s3deploy.CacheControl.setPublic(),
                s3deploy.CacheControl.maxAge(cdk.Duration.hours(1)),
            ],
        });
        // Outputs for existing resources
        new cdk.CfnOutput(this, 'ExistingBucketName', {
            value: landingPageBucket.bucketName,
            description: 'Existing S3 Bucket name for landing page content',
        });
        new cdk.CfnOutput(this, 'ExistingAssetsBucketName', {
            value: assetsBucket.bucketName,
            description: 'Existing S3 Bucket name for assets',
        });
        new cdk.CfnOutput(this, 'ExistingDistributionId', {
            value: config.distributionId || 'E3ROD9ZTO98QPP',
            description: 'Existing CloudFront Distribution ID',
        });
        new cdk.CfnOutput(this, 'ExistingDistributionDomainName', {
            value: config.domainName || 'd2c4qabg7j7d23.cloudfront.net',
            description: 'Existing CloudFront Distribution Domain Name',
        });
        new cdk.CfnOutput(this, 'DeploymentRoleArn', {
            value: deploymentRole.roleArn,
            description: 'IAM Role ARN for deployment operations',
        });
        new cdk.CfnOutput(this, 'WebsiteUrl', {
            value: `https://${config.domainName || 'd2c4qabg7j7d23.cloudfront.net'}`,
            description: 'Website URL',
        });
    }
}
exports.CodioMarketplaceLandingStack = CodioMarketplaceLandingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kaW8tbWFya2V0cGxhY2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2Rpby1tYXJrZXRwbGFjZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMseUNBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCwyQ0FBMkM7QUFDM0MsMERBQTBEO0FBQzFELDZCQUE2QjtBQUc3QixNQUFhLDRCQUE2QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3pELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIscUNBQXFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO1FBRWxFLGlEQUFpRDtRQUNqRCxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUNoRCxJQUFJLEVBQ0osMkJBQTJCLEVBQzNCLE1BQU0sQ0FBQyxVQUFVLElBQUksY0FBYyxDQUNwQyxDQUFDO1FBRUYsZ0NBQWdDO1FBQ2hDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUMzQyxJQUFJLEVBQ0osc0JBQXNCLEVBQ3RCLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxvQkFBb0IsQ0FDaEQsQ0FBQztRQUVGLDBDQUEwQztRQUMxQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUNyRSxJQUFJLEVBQ0osc0JBQXNCLEVBQ3RCO1lBQ0UsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjLElBQUksZ0JBQWdCO1lBQ3pELFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxJQUFJLCtCQUErQjtTQUNqRSxDQUNGLENBQUM7UUFFRixxQ0FBcUM7UUFDckMsTUFBTSxjQUFjLEdB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QUksZ0JBQWdCO1lBQ2hELFdBQVcsRUFBRSxxQ0FBcUM7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxnQ0FBZ0MsRUFBRTtZQUN4RCxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSwrQkFBK0I7WUFDM0QsV0FBVyxFQUFFLDhDQUE4QztTQUM1RCxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzNDLEtBQUssRUFBRSxjQUFjLENBQUMsT0FBTztZQUM3QixXQUFXLEVBQUUsd0NBQXdDO1NBQ3RELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRSxXQUFXLE1BQU0sQ0FBQyxVQUFVLElBQUksK0JBQStCLEVBQUU7WUFDeEUsV0FBVyxFQUFFLGFBQWE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBcEhELG9FQW9IQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBjbGFzcyBDb2Rpb01hcmtldHBsYWNlTGFuZGluZ1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gR2V0IGNvbmZpZ3VyYXRpb24gZnJvbSBDREsgY29udGV4dFxuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdjb2Rpby1tYXJrZXRwbGFjZScpIHx8IHt9O1xuICAgIFxuICAgIC8vIEltcG9ydCBleGlzdGluZyBTMyBidWNrZXQgZm9yIHRoZSBsYW5kaW5nIHBhZ2VcbiAgICBjb25zdCBsYW5kaW5nUGFnZUJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShcbiAgICAgIHRoaXMsIFxuICAgICAgJ0V4aXN0aW5nTGFuZGluZ1BhZ2VCdWNrZXQnLCBcbiAgICAgIGNvbmZpZy5idWNrZXROYW1lIHx8ICd3ZWItZjgxMGI4YTAnXG4gICAgKTtcblxuICAgIC8vIEltcG9ydCBleGlzdGluZyBhc3NldHMgYnVja2V0XG4gICAgY29uc3QgYXNzZXRzQnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKFxuICAgICAgdGhpcyxcbiAgICAgICdFeGlzdGluZ0Fzc2V0c0J1Y2tldCcsXG4gICAgICBjb25maWcuYXNzZXRzQnVja2V0TmFtZSB8fCAnY29kaW8tYXdzbXAtYXNzZXRzJ1xuICAgICk7XG5cbiAgICAvLyBJbXBvcnQgZXhpc3RpbmcgQ2xvdWRGcm9udCBkaXN0cmlidXRpb25cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbi5mcm9tRGlzdHJpYnV0aW9uQXR0cmlidXRlcyhcbiAgICAgIHRoaXMsXG4gICAgICAnRXhpc3RpbmdEaXN0cmlidXRpb24nLFxuICAgICAge1xuICAgICAgICBkaXN0cmlidXRpb25JZDogY29uZmlnLmRpc3RyaWJ1dGlvbklkIHx8ICdFM1JPRDlaVE85OFFQUCcsXG4gICAgICAgIGRvbWFpbk5hbWU6IGNvbmZpZy5kb21haW5OYW1lIHx8ICdkMmM0cWFiZzdqN2QyMy5jbG91ZGZyb250Lm5ldCcsXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIElBTSBSb2xlIGZvciBkZXBsb3ltZW50IG9wZXJhdGlvbnNcbiAgICBjb25zdCBkZXBsb3ltZW50Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ29kaW9NYXJrZXRwbGFjZURlcGxveW1lbnRSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkNvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICBuZXcgaWFtLkFyblByaW5jaXBhbChgYXJuOmF3czpzdHM6OiR7dGhpcy5hY2NvdW50fTphc3N1bWVkLXJvbGUvQVdTUmVzZXJ2ZWRTU09fQ29kaW9NYXJrZXRwbGFjZUFjY2Vzc19lOGI5M2M2MzQwN2I0NDdkL3dpbGxAY29kaW8uY29tYClcbiAgICAgICksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gR3JhbnQgZGVwbG95bWVudCByb2xlIHBlcm1pc3Npb25zIHRvIHVwZGF0ZSBTMyBidWNrZXRzXG4gICAgbGFuZGluZ1BhZ2VCdWNrZXQuZ3JhbnRSZWFkV3JpdGUoZGVwbG95bWVudFJvbGUpO1xuICAgIGFzc2V0c0J1Y2tldC5ncmFudFJlYWRXcml0ZShkZXBsb3ltZW50Um9sZSk7XG4gICAgXG4gICAgLy8gR3JhbnQgQ2xvdWRGcm9udCBpbnZhbGlkYXRpb24gcGVybWlzc2lvbnNcbiAgICBkZXBsb3ltZW50Um9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicsXG4gICAgICAgICdjbG91ZGZyb250OkdldERpc3RyaWJ1dGlvbicsXG4gICAgICAgICdjbG91ZGZyb250OkdldERpc3RyaWJ1dGlvbkNvbmZpZycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbYGFybjphd3M6Y2xvdWRmcm9udDo6JHt0aGlzLmFjY291bnR9OmRpc3RyaWJ1dGlvbi8ke2NvbmZpZy5kaXN0cmlidXRpb25JZH1gXSxcbiAgICB9KSk7XG5cbiAgICAvLyBHcmFudCBwZXJtaXNzaW9ucyB0byByZWFkIENsb3VkRm9ybWF0aW9uIHN0YWNrcyAoZm9yIGludGVncmF0aW9uKVxuICAgIGRlcGxveW1lbnRSb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tzJyxcbiAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tSZXNvdXJjZXMnLFxuICAgICAgICAnY2xvdWRmb3JtYXRpb246TGlzdFN0YWNrcycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIGBhcm46YXdzOmNsb3VkZm9ybWF0aW9uOiR7dGhpcy5yZWdpb259OiR7dGhpcy5hY2NvdW50fTpzdGFjay9jb2Rpby1tYXJrZXRwbGFjZS1zYWFzLypgLFxuICAgICAgICBgYXJuOmF3czpjbG91ZGZvcm1hdGlvbjoke3RoaXMucmVnaW9ufToke3RoaXMuYWNjb3VudH06c3RhY2svY29kaW8tbWFya2V0cGxhY2Utc2Fhcy1TYW1wbGVBcHAtKi8qYCxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgLy8gRGVwbG95IHdlYiBhc3NldHMgdG8gUzNcbiAgICBjb25zdCB3ZWJEZXBsb3ltZW50ID0gbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ1dlYnNpdGVEZXBsb3ltZW50Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vd2ViJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBsYW5kaW5nUGFnZUJ1Y2tldCxcbiAgICAgIGRpc3RyaWJ1dGlvbjogZGlzdHJpYnV0aW9uLFxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFsnLyonXSxcbiAgICAgIHBydW5lOiBmYWxzZSwgLy8gRG9uJ3QgZGVsZXRlIGV4aXN0aW5nIGZpbGVzIHRvIHByZXNlcnZlIG90aGVyIGNvbnRlbnRcbiAgICAgIGV4Y2x1ZGU6IFsnKi5tZCcsICcqLnR4dCcsICcuRFNfU3RvcmUnXSxcbiAgICAgIGNhY2hlQ29udHJvbDogW1xuICAgICAgICBzM2RlcGxveS5DYWNoZUNvbnRyb2wuc2V0UHVibGljKCksXG4gICAgICAgIHMzZGVwbG95LkNhY2hlQ29udHJvbC5tYXhBZ2UoY2RrLkR1cmF0aW9uLmhvdXJzKDEpKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXRzIGZvciBleGlzdGluZyByZXNvdXJjZXNcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRXhpc3RpbmdCdWNrZXROYW1lJywge1xuICAgICAgdmFsdWU6IGxhbmRpbmdQYWdlQnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4aXN0aW5nIFMzIEJ1Y2tldCBuYW1lIGZvciBsYW5kaW5nIHBhZ2UgY29udGVudCcsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRXhpc3RpbmdBc3NldHNCdWNrZXROYW1lJywge1xuICAgICAgdmFsdWU6IGFzc2V0c0J1Y2tldC5idWNrZXROYW1lLFxuICAgICAgZGVzY3JpcHRpb246ICdFeGlzdGluZyBTMyBCdWNrZXQgbmFtZSBmb3IgYXNzZXRzJyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdFeGlzdGluZ0Rpc3RyaWJ1dGlvbklkJywge1xuICAgICAgdmFsdWU6IGNvbmZpZy5kaXN0cmlidXRpb25JZCB8fCAnRTNST0Q5WlRPOThRUFAnLFxuICAgICAgZGVzY3JpcHRpb246ICdFeGlzdGluZyBDbG91ZEZyb250IERpc3RyaWJ1dGlvbiBJRCcsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRXhpc3RpbmdEaXN0cmlidXRpb25Eb21haW5OYW1lJywge1xuICAgICAgdmFsdWU6IGNvbmZpZy5kb21haW5OYW1lIHx8ICdkMmM0cWFiZzdqN2QyMy5jbG91ZGZyb250Lm5ldCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4aXN0aW5nIENsb3VkRnJvbnQgRGlzdHJpYnV0aW9uIERvbWFpbiBOYW1lJyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEZXBsb3ltZW50Um9sZUFybicsIHtcbiAgICAgIHZhbHVlOiBkZXBsb3ltZW50Um9sZS5yb2xlQXJuLFxuICAgICAgZGVzY3JpcHRpb246ICdJQU0gUm9sZSBBUk4gZm9yIGRlcGxveW1lbnQgb3BlcmF0aW9ucycsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnV2Vic2l0ZVVybCcsIHtcbiAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke2NvbmZpZy5kb21haW5OYW1lIHx8ICdkMmM0cWFiZzdqN2QyMy5jbG91ZGZyb250Lm5ldCd9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2Vic2l0ZSBVUkwnLFxuICAgIH0pO1xuICB9XG59Il19