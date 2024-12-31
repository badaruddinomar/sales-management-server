import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
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
      enum: ['in-stock', 'out-of-stock'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [1, 'Product quantity must be greater than 0'],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product creator is required'],
    },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model('Product', productSchema);
export default Product;
