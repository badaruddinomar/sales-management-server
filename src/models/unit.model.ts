import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Unit name is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Unit creator is required'],
    },
  },
  {
    timestamps: true,
  },
);
const Unit = mongoose.model('Unit', unitSchema);
export default Unit;
