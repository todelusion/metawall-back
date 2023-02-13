import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (authorization === undefined) return next();
  const accessToken = authorization.replace(/^Bearer\s/, "");

  const decoded = verifyJwt(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

  if (decoded !== null) {
    res.locals.user = decoded;
    next();
  }
  return next();
};

export default deserializeUser;
