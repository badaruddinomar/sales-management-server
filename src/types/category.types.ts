import { ObjectId } from 'mongoose';

export interface ICategorySearchQuery {
  name?: { $regex: string; $options: string };
  createdBy: string;
}

export interface ICategory {
  _id: string;
  name: string;
  createdBy: ObjectId;
  createdAt: Date;
}
