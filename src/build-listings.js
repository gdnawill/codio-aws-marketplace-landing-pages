#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read marketplace configuration
const marketplaceConfig = JSON.parse(fs.readFileSync('../marketplace-config.json', 'utf8'));
const listings = marketplaceConfig.marketplaceListings;

// Read the HTML template
const templatePath = 'web-templates/index.template.html';
const template = fs.readFileSync(templatePath, 'utf8');

// Create output directories
const webDir = 'web';
const outputDir = 'web-generated';

// Clean and create output directory
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Copy shared assets (CSS, JS, assets)
const sharedDirs = ['css', 'js', 'assets'];
sharedDirs.forEach(dir => {
    const srcDir = path.join(webDir, dir);
    const destDir = path.join(outputDir, dir);
    
    if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
        console.log(`✅ Copied ${dir}/ to generated output`);
    }
});

// Generate landing pages for each enabled listing
Object.entries(listings).forEach(([listingKey, listing]) => {
    if (!listing.enabled) {
        console.log(`⏭️  Skipping disabled listing: ${listing.name}`);
        return;
    }
    console.log(`🔨 Generating landing page for: ${listing.name}`);
    
    // API endpoint will be set after CDK deployment
    const apiEndpoint = `https://api-${listing.path}.marketplace.codio.com/subscriber`;
    
    // Replace template variables
    let html = template
        .replace(/{{LISTING_NAME}}/g, listing.name)
        .replace(/{{LISTING_DESCRIPTION}}/g, listing.description)
        .replace(/{{PRODUCT_CODE}}/g, listing.productCode)
        .replace(/{{LISTING_PATH}}/g, listing.path)
        .replace(/{{API_ENDPOINT}}/g, apiEndpoint);
    
    // Create listing-specific directory
    const listingDir = path.join(outputDir, listing.path);
    fs.mkdirSync(listingDir, { recursive: true });
    
    // Copy shared assets to each listing directory
    sharedDirs.forEach(dir => {
        const srcDir = path.join(webDir, dir);
        const destDir = path.join(listingDir, dir);
        
        if (fs.existsSync(srcDir)) {
            fs.cpSync(srcDir, destDir, { recursive: true });
        }
    });
    
    // Write the generated HTML
    fs.writeFileSync(path.join(listingDir, 'index.html'), html);
    
    console.log(`✅ Generated: ${listing.path}/index.html with assets`);
});

// Also create a default index.html (for the root path)
const defaultListing = Object.values(listings)[0]; // Use first listing as default
let defaultHtml = template
    .replace(/{{LISTING_NAME}}/g, 'Codio Training Platform')
    .replace(/{{LISTING_DESCRIPTION}}/g, 'Build job-ready skills with hands-on coding labs and real-world projects')
    .replace(/{{PRODUCT_CODE}}/g, defaultListing.productCode)
    .replace(/{{LISTING_PATH}}/g, 'default');

fs.writeFileSync(path.join(outputDir, 'index.html'), defaultHtml);
console.log(`✅ Generated: index.html (default)`);

console.log(`\n🎉 Generated ${Object.keys(listings).length + 1} landing pages in ${outputDir}/`);
console.log('\nGenerated pages:');
console.log('- / (default)');
Object.values(listings).forEach(listing => {
    console.log(`- /${listing.path}/`);
});

console.log('\n📁 Directory structure:');
console.log(`${outputDir}/`);
console.log('├── index.html (default)');
console.log('├── css/');
console.log('├── js/');
console.log('├── assets/');
Object.values(listings).forEach(listing => {
    console.log(`└── ${listing.path}/`);
    console.log(`    └── index.html`);
});

console.log('\n🚀 Ready to deploy with CDK!');