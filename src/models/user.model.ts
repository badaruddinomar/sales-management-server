import mongoose from 'mongoose';
import { IUser } from '../interface/user.interface';
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin'],
    },
    verifyCode: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpire: Date,
  },
  { timestamps: true },
);
const User = mongoose.model('User', userSchema);
export default User;
