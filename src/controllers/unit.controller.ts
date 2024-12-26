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
