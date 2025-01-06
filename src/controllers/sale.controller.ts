import { ISaleSearchQuery } from './../types/sale.types';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
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
      .sort({ createdAt: sort })
      .populate({ path: 'products.product', select: 'name' })
      .populate({
        path: 'products.unit',
        select: 'name',
      });

    const totalSales = await Sale.countDocuments({ createdBy: req.user?._id });
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

export const getSingleSale: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get sale from database--
    const sale = await Sale.findById(id)
      .populate({ path: 'products.product', select: 'name' })
      .populate({
        path: 'products.unit',
        select: 'name',
      });

    // if sale not found--
    if (!sale) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Sale not found'));
    }
    // check if sale belongs to user--
    const isAuthorIdMatch =
      sale?.createdBy && req.user._id.toString() === sale.createdBy.toString();

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
      message: 'Sale fetched successfully',
      data: sale,
    });
  },
);

export const updateSale: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Sale id is required');
    }

    const sale = await Sale.findById(id);

    if (!sale) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Sale not found');
    }
    const isAuthorIdMatch =
      sale?.createdBy && req.user._id.toString() === sale.createdBy.toString();

    if (!isAuthorIdMatch) {
      throw next(
        new AppError(httpStatus.FORBIDDEN, 'You are not permitted to update'),
      );
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Sale updated successfully',
      data: updatedSale,
    });
  },
);
export const deleteSale: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get sale from database--
    const sale = await Sale.findById(id);
    // if sale not found--
    if (!sale) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Sale not found'));
    }

    // check if sale belongs to user--
    const isAuthorIdMatch =
      sale?.createdBy && req.user._id.toString() === sale.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // get sale from database & delete--
    await Sale.findByIdAndDelete(id);

    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Sale deleted successfully',
    });
  },
);
