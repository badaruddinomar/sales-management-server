import { dayConst, monthsConst } from './../constants/index';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import Product from '../models/product.model';
import Sale from '../models/sale.model';
import { ISale } from '../types/sale.types';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  startOfYear,
  endOfYear,
  subMonths,
  subYears,
} from 'date-fns';
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

export const getPieChartStats: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const sales = await Sale.find({
      createdBy: req.user?._id,
    });
    const maleCustomer = sales.filter(
      (sale: ISale) => sale.gender === 'male',
    ).length;
    const femaleCustomer = sales.filter(
      (sale: ISale) => sale.gender === 'female',
    ).length;
    const genderRatio = {
      male: maleCustomer,
      female: femaleCustomer,
    };
    const totalCashPayments = sales.filter(
      (sale: ISale) => sale.paymentMethod === 'CASH',
    ).length;
    const totalCardPayments = sales.filter(
      (sale: ISale) => sale.paymentMethod === 'CARD',
    ).length;
    const totalOnlinePayments = sales.filter(
      (sale: ISale) => sale.paymentMethod === 'ONLINE',
    ).length;
    const paymentRatio = {
      cash: totalCashPayments,
      card: totalCardPayments,
      online: totalOnlinePayments,
    };
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        genderRatio,
        paymentRatio,
      },
    });
  },
);

export const getRevenueLineChartStats: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let range = req.query.range;
    if (!range) range = 'this_week';
    let startDate: Date, endDate: Date;
    const now = new Date();

    switch (range) {
      case 'this_week':
        startDate = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
        endDate = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case 'last_week':
        startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
        endDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
        break;
      case 'last_six_months':
        startDate = subMonths(now, 6);
        endDate = now;
        break;
      case 'this_year':
        startDate = startOfYear(now);
        endDate = now;
        break;
      case 'last_year':
        startDate = startOfYear(subYears(now, 1));
        endDate = endOfYear(subYears(now, 1));
        break;
      default:
        throw next(new AppError(httpStatus.BAD_REQUEST, 'Invalid date range'));
    }

    // Fetch sales within the date range
    const sales = await Sale.find({
      createdBy: req.user?._id,
      saleDate: { $gte: startDate, $lte: endDate },
    });

    // Group sales data and generate labels
    const labels: string[] = [];
    const groupedData: { [key: string]: number } = {};

    if (range === 'this_week' || range === 'last_week') {
      // Weekly data: Group by day of the week
      dayConst.forEach((day) => {
        labels.push(day);
        groupedData[day] = 0;
      });

      sales.forEach((sale) => {
        const day = dayConst[new Date(sale.createdAt).getDay()];
        groupedData[day] += sale.totalAmount;
      });
    } else if (
      range === 'this_year' ||
      range === 'last_year' ||
      range === 'last_six_months'
    ) {
      // Yearly or Monthly data: Group by month

      monthsConst.forEach((month) => {
        labels.push(month);
        groupedData[month] = 0;
      });

      sales.forEach((sale) => {
        const month = monthsConst[new Date(sale.createdAt).getMonth()];
        let amount = sale.totalAmount;
        groupedData[month] += amount;
      });
    }

    // Convert grouped data into datasets
    const data = labels.map((label) => groupedData[label] || 0);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Revenue Stats fetched successfully',
      data: {
        labels,
        data,
      },
    });
  },
);
