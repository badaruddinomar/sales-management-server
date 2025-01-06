import mongoose from 'mongoose';
import { ISale } from '../types/sale.types';

const saleSchema = new mongoose.Schema<ISale>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        unitAmount: {
          type: Number,
          required: true,
          min: 1,
        },
        unit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD', 'ONLINE'],
      default: 'CASH',
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);
const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
