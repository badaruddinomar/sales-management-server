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

export const getAllSales: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { search } = req.query;

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'asc' ? 1 : -1;

    const query: ISaleSearchQuery = { createdBy: req.user?._id };
    if (search) {
      query.$or = [
        { customerName: { $regex: search as string, $options: 'i' } },
        { customerPhone: { $regex: search as string, $options: 'i' } },
      ];
    }

    const sales = await Sale.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sort });

    const totalSales = await Sale.countDocuments();
    const totalPages = Math.ceil(totalSales / limit);

    res.status(httpStatus.OK).json({
      success: true,
      data: sales,
      meta: {
        total: totalSales,
        pages: totalPages,
        currentPage: page,
        limit,
      },
    });
  },
);
