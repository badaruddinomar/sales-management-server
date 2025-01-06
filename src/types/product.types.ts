import { ObjectId } from 'mongoose';

export interface IProductSearchQuery {
  name?: { $regex: string; $options: string };
  category?: string;
  createdBy: string;
}
export interface IProduct {
  _id: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  unitAmount: number;
  stock: string;
  unit: ObjectId;
  category: ObjectId;
  createdBy: ObjectId;
  createdAt: Date;
}
