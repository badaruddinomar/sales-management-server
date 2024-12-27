import { ISaleSearchQuery } from './../types/sale.types';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import Sale from '../models/sale.model';

export const createSale: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // create new sale--
    const sale = await Sale.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Sale created successfully',
      data: sale,
    });
  },
);
