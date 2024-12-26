import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import Category from '../models/category.model';
import httpStatus from 'http-status';
import { ICategorySearchQuery } from '../types/category.types';

export const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
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

export const getAllCategories: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { search } = req.query;

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'asc' ? 1 : -1;

    const query: ICategorySearchQuery = { createdBy: req.user?._id };
    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }

    const categories = await Category.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sort });

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(httpStatus.OK).json({
      success: true,
      data: categories,
      meta: {
        total: totalCategories,
        pages: totalPages,
        currentPage: page,
        limit,
      },
    });
  },
);
