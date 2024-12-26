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
    if (!name) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Category name is required');
    }
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

export const getSingleCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get category from database--
    const category = await Category.findById(id);
    // check if category belongs to user--
    const isAuthorIdMatch =
      req.user._id.toString() === category?.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // if category not found--
    if (!category) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Category not found'));
    }
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Category fetched successfully',
      data: category,
    });
  },
);
export const updateCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Category id is required');
    }
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category)
      throw new AppError(httpStatus.BAD_REQUEST, 'Category not found');
    const isAuthorIdMatch =
      req.user._id.toString() === category.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(httpStatus.FORBIDDEN, 'You are not permitted to update'),
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
      },
      { new: true },
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Category updated successfully',
      data: updateCategory,
    });
  },
);
