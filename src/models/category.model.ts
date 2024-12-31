import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Category creator is required'],
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
