import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Product purchase price is required'],
      min: [0, 'Product purchase price must be greater than 0'],
    },
    salePrice: {
      type: Number,
      required: [true, 'Product sale price is required'],
      min: [0, 'Product purchase price must be greater than 0'],
    },
    stock: {
      type: String,
      required: [true, 'Product stock is required'],
      enum: ['in stock', 'out of stock'],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Product unit is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model('Product', productSchema);
export default Product;
