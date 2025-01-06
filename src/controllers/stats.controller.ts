import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Product from '../models/product.model';
import Sale from '../models/sale.model';
import { ISale } from '../types/sale.types';

export const getStats: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date();

    if (!startDate) start.setDate(start.getDate() - 30); // Default to last 30 days

    const totalProducts = await Product.countDocuments({
      createdBy: req.user?._id,
    });

    const sales = await Sale.find({
      createdBy: req.user?._id,
      saleDate: {
        $gte: start,
        $lte: end,
      },
    });
    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.products.length,
      0,
    );

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalTransactions = sales.length;
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Stats fetched successfully',
      data: { totalProducts, totalRevenue, totalTransactions, totalSales },
    });
  },
);
