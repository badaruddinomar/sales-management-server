import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import config from '../config';
import httpStatus from 'http-status';
import { IUser } from '../interface/user.interface';
export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Please login to access this resource',
    });
  }

  const decodedData = jwt.verify(token, config.jwt_secret) as JwtPayload;

  const user = await User.findById(decodedData?.userId);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Please login to access this resource',
    });
  }
  if (!user.isVerified) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Please verify your email to access this resource',
    });
  }
  req.user = user as IUser;
  next();
};

// Authorize Roles--
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role as string)) {
      return next(
        new AppError(
          httpStatus.FORBIDDEN,
          `Role ${req.user.role} is not allowed to access this resource.`,
        ),
      );
    }
    next();
  };
};
