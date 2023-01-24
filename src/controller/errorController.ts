/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../types";

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errResult = {
    status: err.status,
    message: err.message,
  };
  res.status(err.statusCode).json({
    status: errResult.status,
    message: errResult.message,
  });
};

export default globalErrorHandler;
