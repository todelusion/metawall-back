import type { Request, Response, NextFunction } from "express";

type Middleware = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<void>;

const tryCatch =
  (callback: Middleware) =>
  (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch((err) => next(err));
  };

export default tryCatch;
