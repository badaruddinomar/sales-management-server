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
    const { search } = req.query;

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
      .sort({ createdAt: sort })
      .populate({ path: 'unit', select: 'name' })
      .populate({ path: 'category', select: 'name' });

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
    const product = await Product.findById(id)
      .populate({ path: 'unit', select: 'name' })
      .populate({ path: 'category', select: 'name' });
    // if product not found--
    if (!product) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Product not found'));
    }
    // check if product belongs to user--
    const isAuthorIdMatch =
      req.user._id.toString() === product?.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }

    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  },
);
export const updateProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product id is required');
    }
    const { name, purchasePrice, salePrice, stock, unit, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
    }
    const isAuthorIdMatch =
      req.user._id.toString() === product.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(httpStatus.FORBIDDEN, 'You are not permitted to update'),
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        purchasePrice,
        salePrice,
        stock,
        unit,
        category,
      },
      { new: true },
    )
      .populate({ path: 'unit', select: 'name' })
      .populate({ path: 'category', select: 'name' });

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  },
);
export const deleteProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get product from database--
    const product = await Product.findById(id);
    // if product not found--
    if (!product) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Product not found'));
    }
    // check if product belongs to user--
    const isAuthorIdMatch =
      req.user._id.toString() === product?.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // get product from database & delete--
    await Product.findByIdAndDelete(id);
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product deleted successfully',
    });
  },
);
