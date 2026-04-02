/**
 * Dummy Data JSON Generator
 * 
 * This script generates realistic dummy JSON data using @faker-js/faker.
 * It's perfect for populating UIs when the backend API isn't ready yet.
 */

const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// --- Configuration ---
const CONFIG = {
  // Where to save the generated JSON
  outputFile: path.join(__dirname, './output/data.json'),
  
  // Number of items to generate
  count: 50,
  
  // Choose the type of data to generate: 'users', 'products', or 'posts'
  // Or define your own custom schema in the function below!
  schemaType: 'users' 
};

/**
 * Defines the structure for a "User" object
 */
function createUser() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    jobTitle: faker.person.jobTitle(),
    address: {
      city: faker.location.city(),
      country: faker.location.country(),
    },
    isActive: faker.datatype.boolean(0.8), // 80% chance of being true
    createdAt: faker.date.past({ years: 2 })
  };
}

/**
 * Defines the structure for a "Product" object
 */
function createProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    category: faker.commerce.department(),
    inStock: faker.number.int({ min: 0, max: 100 }),
    image: faker.image.urlLoremFlickr({ category: 'product' })
  };
}

/**
 * Defines the structure for a "Post" object
 */
function createPost() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    views: faker.number.int({ min: 0, max: 10000 }),
    publishedAt: faker.date.recent({ days: 30 })
  };
}

/**
 * Main execution function
 */
function generateData() {
  console.log(`🚀 Starting data generation for ${CONFIG.count} ${CONFIG.schemaType}...`);
  
  const data = [];
  
  for (let i = 0; i < CONFIG.count; i++) {
    switch (CONFIG.schemaType) {
      case 'users':
        data.push(createUser());
        break;
      case 'products':
        data.push(createProduct());
        break;
      case 'posts':
        data.push(createPost());
        break;
      default:
        console.error(`❌ Unknown schemaType: ${CONFIG.schemaType}. Using 'users' instead.`);
        data.push(createUser());
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  try {
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Successfully generated ${data.length} items!`);
    console.log(`📂 Saved to: ${CONFIG.outputFile}`);
  } catch (error) {
    console.error(`❌ Failed to save file:`, error);
  }
}

// Execute
generateData();
