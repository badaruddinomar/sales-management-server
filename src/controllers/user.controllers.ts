import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import User from '../models/user.model';

export const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw next(new AppError(httpStatus.BAD_REQUEST, 'User not found!'));
    }
    const { password: _password, ...userDataWithOutPass } = user.toObject();
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'User fetched successfully',
      data: userDataWithOutPass,
    });
  },
);
