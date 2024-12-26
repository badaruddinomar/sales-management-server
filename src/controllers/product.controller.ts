import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsyn';
import Product from '../models/product.model';
import AppError from '../utils/AppError';
import { IProductSearchQuery } from '../types/product.types';

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // get data from request body--
    const { name, purchasePrice, salePrice, stock, unit, category } = req.body;

    // create new product--
    const product = await Product.create({
      name,
      purchasePrice,
      salePrice,
      stock,
      unit,
      category,
      createdBy: req.user?._id,
    });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  },
);
export const getAllProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { search, category } = req.query;

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'asc' ? 1 : -1;

    const query: IProductSearchQuery = { createdBy: req.user?._id };
    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sort });

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(httpStatus.OK).json({
      success: true,
      data: products,
      meta: {
        total: totalProducts,
        pages: totalPages,
        currentPage: page,
        limit,
      },
    });
  },
);
export const getSingleProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get product from database--
    const product = await Product.findById(id);
    // check if product belongs to user--
    if (product?.createdBy.toString() !== req.user?._id) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // if product not found--
    if (!product) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Product not found'));
    }
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  },
);

export const deleteProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get product from database--
    const product = await Product.findByIdAndDelete(id);
    // check if product belongs to user--
    if (product?.createdBy.toString() !== req.user?._id) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // if product not found--
    if (!product) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Product not found'));
    }
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  },
);
