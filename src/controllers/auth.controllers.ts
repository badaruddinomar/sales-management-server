import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { createCookie } from '../utils/createCookie';
import sendEmail from '../utils/sendEmail';
import { verifyEmailTemplate } from '../emailTemplates/verifyEmailTemplate';
import crypto from 'crypto';
import { forgotPasswordEmailTemplate } from '../emailTemplates/forgotPassEmailTemplate';
import config from '../config';

export const signup: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    // check if user exists--
    const user = await User.findOne({ email });
    if (user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'User already exists!'));
    }

    // hash password--
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // create new user--
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // create verify token--
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    newUser.verifyCode = verificationCode;
    newUser.verifyCodeExpire = new Date(new Date().getTime() + 15 * 60 * 1000);

    // save user--
    await newUser.save();

    // set cookie--
    createCookie(res, newUser);
    // send verification email--
    await sendEmail({
      reciverEmail: newUser.email,
      subject: 'Verify your email',
      body: verifyEmailTemplate(verificationCode),
    });
    // send response to client--
    const { password: _password, ...userDataWithPass } = newUser.toObject();
    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'user created successfully',
      data: userDataWithPass,
    });
  },
);

export const verifyEmail: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { verificationCode } = req.body;
    // check if verification code is valid--
    const user = await User.findOne({
      verifyCode: verificationCode,
      verifyCodeExpire: { $gt: Date.now() },
    });

    // if not valid--
    if (!user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'Invalid code'));
    }
    // if valid--
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpire = undefined;
    await user.save();
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Email verified successfully',
    });
  },
);

export const signin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // check if user exists--
    const user = await User.findOne({ email });
    if (!user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials'));
    }
    // compare the password--
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials'));
    }
    // create cookie--
    createCookie(res, user);
    // send response to client--
    const { password: _password, ...userDataWithPass } = user.toObject();
    res.status(httpStatus.OK).json({
      success: true,
      message: 'user logged in successfully',
      data: userDataWithPass,
    });
  },
);

export const forgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    // check if user exists--
    const user = await User.findOne({ email });
    if (!user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'User not found'));
    }
    // create forgot password token--
    const forgotPasswordToken = crypto.randomBytes(32).toString('hex');
    user.forgotPasswordToken = forgotPasswordToken;
    user.forgotPasswordTokenExpire = new Date(
      new Date().getTime() + 15 * 60 * 1000,
    );

    await user.save();
    // send verification email--
    const resetUrl =
      config.client_url + '/reset-password/?token=' + forgotPasswordToken;
    await sendEmail({
      reciverEmail: user.email,
      subject: 'Reset your password',
      body: forgotPasswordEmailTemplate(resetUrl),
    });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  },
);

export const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const { token } = req.query;
    // check if token is valid--
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
    }
    // hash password--
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // update password--
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpire = undefined;
    await user.save();
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Password reset successfully',
    });
  },
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(httpStatus.OK).json({
      success: true,
      message: 'user logged out successfully',
    });
  },
);
