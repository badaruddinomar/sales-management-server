import { Request, Response, RequestHandler, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Product from '../models/product.model';
import Sale from '../models/sale.model';
import { ISale } from '../types/sale.types';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import AppError from '../utils/AppError';

export const getStats: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const lastMonth = req.query.lastMonth;
    if (lastMonth) {
      // Validate query
      if (!lastMonth || isNaN(Number(lastMonth))) {
        throw next(
          new AppError(
            httpStatus.BAD_REQUEST,
            "'lastMonth' query parameter is required and must be a number",
          ),
        );
      }

      const monthsAgo = Number(lastMonth);

      // Get start and end dates for the requested month
      const start = startOfMonth(subMonths(new Date(), monthsAgo));
      const end = endOfMonth(subMonths(new Date(), monthsAgo));

      const saleDate = {
        $gte: start,
        $lte: end,
      };

      // Fetch data for the specified month
      const totalProducts = await Product.countDocuments({
        createdBy: req.user?._id,
        createdAt: saleDate,
      });

      const sales = await Sale.find({
        createdBy: req.user?._id,
        saleDate,
      });

      const totalSales = sales.reduce(
        (sum, sale: ISale) => sum + sale.products.length,
        0,
      );

      // Calculate total revenue
      const totalRevenue = sales.reduce((sum, sale: ISale) => {
        const total = sum + sale.totalAmount;
        if (!Number.isInteger(total)) total.toFixed(2);
        return total;
      }, 0);

      const totalTransactions = sales.length;

      // Fetch data for the previous month to calculate percentages
      const prevStart = startOfMonth(subMonths(new Date(), monthsAgo + 1));
      const prevEnd = endOfMonth(subMonths(new Date(), monthsAgo + 1));

      const prevSaleDate = {
        $gte: prevStart,
        $lte: prevEnd,
      };

      const prevTotalProducts = await Product.countDocuments({
        createdBy: req.user?._id,
        createdAt: prevSaleDate,
      });

      const prevSales = await Sale.find({
        createdBy: req.user?._id,
        saleDate: prevSaleDate,
      });

      const prevTotalSales = prevSales.reduce(
        (sum, sale: ISale) => sum + sale.products.length,
        0,
      );

      const prevTotalRevenue = prevSales.reduce(
        (sum, sale: ISale) => sum + sale.totalAmount,
        0,
      );

      const prevTotalTransactions = prevSales.length;

      // Calculate percentage changes
      const calcPercentage = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        const percentage = ((current - previous) / previous) * 100;
        if (Number.isInteger(percentage)) {
          return percentage;
        } else {
          return percentage.toFixed(2);
        }
      };

      const productPercentage = calcPercentage(
        totalProducts,
        prevTotalProducts,
      );
      const salesPercentage = calcPercentage(totalSales, prevTotalSales);
      const revenuePercentage = calcPercentage(totalRevenue, prevTotalRevenue);
      const transactionPercentage = calcPercentage(
        totalTransactions,
        prevTotalTransactions,
      );

      // Send response to client
      res.status(httpStatus.OK).json({
        success: true,
        message: 'Stats fetched successfully',
        data: {
          products: {
            total: totalProducts,
            percentage: productPercentage,
          },
          sales: {
            total: totalSales,
            percentage: salesPercentage,
          },
          revenue: {
            total: totalRevenue,
            percentage: revenuePercentage,
          },
          transactions: {
            total: totalTransactions,
            percentage: transactionPercentage,
          },
        },
      });
    } else {
      const sales = await Sale.find({
        createdBy: req.user?._id,
      });

      const totalSales = sales.reduce(
        (sum, sale: ISale) => sum + sale.products.length,
        0,
      );
      const totalTransactions = sales.length;
      // Calculate total revenue
      const totalRevenue = sales.reduce((sum, sale: ISale) => {
        const total = sum + sale.totalAmount;
        if (!Number.isInteger(total)) total.toFixed(2);
        return total;
      }, 0);

      res.status(httpStatus.OK).json({
        success: true,
        message: 'Stats fetched successfully',
        data: {
          sales: {
            total: totalSales,
          },
          transactions: {
            total: totalTransactions,
          },
          revenue: {
            total: totalRevenue,
          },
        },
      });
    }
  },
);
