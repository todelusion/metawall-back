import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/userSchema";
import { createUser } from "../service/userService";
import { AppError, MongoServerError } from "../types";

const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body } = req;
  try {
    const newUser = await createUser(body);
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (error) {
    if ((error as MongoServerError).code === 11000) {
      next(new AppError("已存在相同帳戶", 409));
      return;
    }
    next(new AppError("伺服器錯誤", 500));
  }
};

export { createUserHandler };
