import { IUnitSearchQuery } from './../types/unit.types';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import Unit from '../models/unit.model';

export const createUnit: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // get data from request body--
    const { name } = req.body;
    if (!name) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unit name is required');
    }
    // create new unit--
    const unit = await Unit.create({
      name,
      createdBy: req.user?._id,
    });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Unit created successfully',
      data: unit,
    });
  },
);

export const getAllUnits: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { search } = req.query;

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'asc' ? 1 : -1;

    const query: IUnitSearchQuery = { createdBy: req.user?._id };
    if (search) {
      query.name = { $regex: search as string, $options: 'i' };
    }

    const units = await Unit.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sort });

    const totalUnits = await Unit.countDocuments();
    const totalPages = Math.ceil(totalUnits / limit);

    res.status(httpStatus.OK).json({
      success: true,
      data: units,
      meta: {
        total: totalUnits,
        pages: totalPages,
        currentPage: page,
        limit,
      },
    });
  },
);
