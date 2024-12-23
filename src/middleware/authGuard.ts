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
  const { token } = req.cookies;

  if (!token) {
    throw next(
      new AppError(
        httpStatus.UNAUTHORIZED,
        'Please login to access this resource.',
      ),
    );
  }

  const decodedData = jwt.verify(token, config.jwt_secret) as JwtPayload;

  req.user = (await User.findById(decodedData.userId)) as IUser;
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
