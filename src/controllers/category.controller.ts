import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import Category from '../models/category.model';
import httpStatus from 'http-status';

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get data from request body--
    const { name } = req.body;

    // create new category--
    const category = await Category.create({
      name,
      createdBy: req.user?._id,
    });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  },
);
