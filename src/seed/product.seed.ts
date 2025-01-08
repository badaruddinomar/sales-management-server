import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Product from '../models/product.model';
import config from '../config';

function generateFakeProducts(count: number, unit: string, category: string) {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      name: faker.word.words(3),
      purchasePrice: parseFloat(
        faker.number.float({ min: 10, max: 50 }).toFixed(2),
      ),
      salePrice: parseFloat(
        faker.number.float({ min: 51, max: 100 }).toFixed(2),
      ),
      stock: faker.helpers.arrayElement(['in-stock', 'out-of-stock']),
      unitAmount: faker.number.int({ min: 1, max: 50 }),
      unit,
      category,
      createdBy: '677aa1e80c878f321f13f740',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return products;
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongo_uri);
    console.log('Databse connected successfully.');

    // Generate fake products
    const unit = '677aad2a0c878f321f13f7c9';
    const category = '677aacc10c878f321f13f77b';
    const fakeProducts = generateFakeProducts(10, unit, category);

    // Insert fake products into the database--
    const data = await Product.insertMany(fakeProducts);
    console.log(data);
    // Close the database connection
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding the database:', error);
    await mongoose.disconnect();
  }
}

seedDatabase();
