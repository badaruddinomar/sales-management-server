import { ObjectId } from 'mongoose';

export interface ISaleSearchQuery {
  customerName?: { $regex: string; $options: string };
  customerPhone?: { $regex: string; $options: string };
  createdBy: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export interface ISale {
  _id: string;
  customerName: string;
  customerPhone: string;
  products: {
    product: ObjectId;
    unitAmount: number;
    unit: ObjectId;
    salePrice: number;
  }[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE';
  saleDate: Date;
  createdBy: ObjectId;
  createdAt: Date;
}
