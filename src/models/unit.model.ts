import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Unit name is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
const Unit = mongoose.model('Unit', unitSchema);
export default Unit;
