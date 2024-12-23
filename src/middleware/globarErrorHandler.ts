import httpStatus from 'http-status';
import config from '../config';
import AppError from '../utils/AppError';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  err.message = err.message || 'Internal server error';

  // wrong mongodb id error--
  if (err.name === 'CastError') {
    const message = `Resource not found: ${err.path}`;
    err = next(new AppError(httpStatus.BAD_REQUEST, message));
  }
  // mongoose duplicate key errors--
  if (err.code === 110000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = next(new AppError(httpStatus.BAD_REQUEST, message));
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(
      (val) => (val as { message: string }).message,
    );
    const message = `Validation error: ${messages.join('. ')}`;
    err = next(new AppError(httpStatus.BAD_REQUEST, message));
  }

  // wrong jwt error--
  if (err.name === 'JsonWebTokenError') {
    const message = `json web token is invalid try again`;
    err = next(new AppError(httpStatus.BAD_REQUEST, message));
  }
  // jwt expires error--
  if (err.name === 'TokenExpiredError') {
    const message = 'Json web token expired';
    err = next(new AppError(httpStatus.BAD_REQUEST, message));
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: config.node_env === 'development' ? err.stack : null,
  });
};
export default globalErrorHandler;
