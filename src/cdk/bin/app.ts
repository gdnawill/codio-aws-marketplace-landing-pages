#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodioMarketplaceStack } from '../lib/codio-marketplace-stack';

const app = new cdk.App();

// Get environment configuration from CDK context
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Load marketplace configuration from external file
const fs = require('fs');
const path = require('path');

let marketplaceConfig;
try {
  const configPath = path.join(__dirname, '../../../marketplace-config.json');
  marketplaceConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Error loading marketplace-config.json:', error.message);
  process.exit(1);
}

const listings = marketplaceConfig.marketplaceListings || {};
const deploymentSettings = marketplaceConfig.deploymentSettings || {};

// Create a stack for each enabled marketplace listing
Object.entries(listings).forEach(([listingKey, listing]: [string, any]) => {
  if (listing.enabled) {
    new CodioMarketplaceStack(app, `CodioMarketplace-${listing.path}`, {
      env,
      listing,
      sharedConfig: deploymentSettings,
      description: `Codio AWS Marketplace SaaS Infrastructure for ${listing.name}`,
      stackName: `codio-marketplace-${listing.path}`,
    });
  }
});

// If no listings configured, create a default one
if (Object.keys(listings).length === 0) {
  console.warn('No marketplace listings configured. Creating default stack.');
  new CodioMarketplaceStack(app, 'CodioMarketplace-default', {
    env,
    listing: {
      name: 'Codio Training Platform',
      description: 'Build job-ready skills with hands-on coding labs',
      productCode: 'codio-default-product',
      path: 'default',
    },
    sharedConfig: config,
    description: 'Codio AWS Marketplace SaaS Infrastructure (Default)',
  });
}