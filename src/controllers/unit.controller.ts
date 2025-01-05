import { IUnitSearchQuery } from './../types/unit.types';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import catchAsync from '../utils/catchAsyn';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import Unit from '../models/unit.model';
import Product from '../models/product.model';

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

    const totalUnits = await Unit.countDocuments({ createdBy: req.user?._id });
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

export const getSingleUnit: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get unit from database--
    const unit = await Unit.findById(id);
    // if unit not found--
    if (!unit) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Unit not found'));
    }
    // check if unit belongs to user--
    const isAuthorIdMatch =
      req.user._id.toString() === unit?.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    const productsCount = await Product.countDocuments({ unit: id });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Unit fetched successfully',
      data: unit,
      meta: {
        productsCount,
        message: `${productsCount} products under this unit`,
      },
    });
  },
);

export const updateUnit: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unit id is required');
    }
    const { name } = req.body;

    const unit = await Unit.findById(id);
    if (!unit) throw new AppError(httpStatus.BAD_REQUEST, 'Unit not found');
    const isAuthorIdMatch =
      req.user._id.toString() === unit.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(httpStatus.FORBIDDEN, 'You are not permitted to update'),
      );
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      {
        name,
      },
      { new: true },
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Unit updated successfully',
      data: updatedUnit,
    });
  },
);

export const deleteUnit: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // get unit from the database--
    const unit = await Unit.findById(id);
    // if unit not found--
    if (!unit) {
      throw next(new AppError(httpStatus.NOT_FOUND, 'Unit not found'));
    }
    // check if unit belongs to user--
    const isAuthorIdMatch =
      req.user._id.toString() === unit?.createdBy.toString();
    if (!isAuthorIdMatch) {
      throw next(
        new AppError(
          httpStatus.FORBIDDEN,
          'You are not allowed to access this resource',
        ),
      );
    }
    // get unit from database & delete--
    await Unit.findByIdAndDelete(id);
    // delete all products under this category--
    await Product.deleteMany({ unit: id });
    // send response to client--
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Unit deleted successfully',
      data: unit,
    });
  },
);
