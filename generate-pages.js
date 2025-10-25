const fs = require('fs');
const path = require('path');

// Read the configuration
const config = JSON.parse(fs.readFileSync('page-config.json', 'utf8'));

// Read the template
const template = fs.readFileSync('src/web-templates/index.template.html', 'utf8');

// Generate pages for each product
Object.entries(config.products).forEach(([productKey, product]) => {
  // Generate features HTML
  const featuresHtml = product.features.map(feature => `
                <div class="feature">
                    <div class="feature-icon">${feature.icon}</div>
                    <div class="feature-text">
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                </div>`).join('');

  // Create page content
  let pageContent = template
    .replace(/{{LISTING_NAME}}/g, product.name)
    .replace(/{{LISTING_DESCRIPTION}}/g, product.description)
    .replace(/{{FEATURES}}/g, featuresHtml)
    .replace(/{{PRODUCT_CODE}}/g, product.productCode)
    .replace(/{{API_ENDPOINT}}/g, product.apiEndpoint);

  // Write the generated page
  const outputFile = `${productKey}-index.html`;
  fs.writeFileSync(outputFile, pageContent);
  console.log(`Generated ${outputFile}`);
});

console.log('All pages generated successfully!');