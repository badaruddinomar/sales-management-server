import { ObjectId } from 'mongoose';
export interface IUnitSearchQuery {
  name?: { $regex: string; $options: string };
  createdBy: string;
}

export interface IUnit {
  _id: string;
  name: string;
  createdBy: ObjectId;
  createdAt: Date;
}
