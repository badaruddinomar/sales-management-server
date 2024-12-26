import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsyn';
import Product from '../models/product.model';
import AppError from '../utils/AppError';

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
