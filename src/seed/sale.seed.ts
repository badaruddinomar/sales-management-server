import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Sale from '../models/sale.model';
import Product from '../models/product.model';
import config from '../config';

const generateFakeSales = async (count: number) => {
  const sales = [];

  const products = await Product.find().limit(count);

  for (let i = 0; i < count; i++) {
    const customerName = faker.word.words(3);
    const customerPhone = faker.phone.number();
    const saleDate = faker.date.recent();
    const paymentMethod = faker.helpers.arrayElement([
      'CASH',
      'CARD',
      'ONLINE',
    ]);
    const totalAmount = faker.commerce.price();

    const saleProducts = products.map((product) => ({
      product: product._id,
      unitAmount: faker.number.int({ min: 1, max: 5 }),
      unit: product.unit,
      salePrice: faker.number.float({
        min: product.salePrice,
        max: product.salePrice + 20,
      }),
    }));

    const sale = {
      customerName,
      customerPhone,
      products: saleProducts,
      totalAmount: parseFloat(totalAmount),
      paymentMethod,
      saleDate,
      createdBy: '677aa1e80c878f321f13f740',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    sales.push(sale);
  }

  return sales;
};

// Insert fake sales into the database
const insertFakeSales = async (count: number) => {
  try {
    await mongoose.connect(config.mongo_uri);

    const fakeSales = await generateFakeSales(count);

    const result = await Sale.insertMany(fakeSales);
    console.log('Sales inserted:', result);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting sales:', error);
  }
};

insertFakeSales(10);
