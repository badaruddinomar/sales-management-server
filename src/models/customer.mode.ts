import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      unique: [true, 'Customer name must be unique'],
    },
    gender: {
      type: String,
      required: [true, 'Customer gender is required'],
      enum: ['male', 'female', 'other'],
    },
    phone: {
      type: String,
      unique: [true, 'Customer phone must be unique'],
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
