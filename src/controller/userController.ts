/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/userSchema";
import { createUser } from "../service/userService";
import { AppError, MongoServerError } from "../types";
import sendEmail from "../utils/mailer";

// interface Request 接受泛型，且與函式參數的方式一樣，用傳入引入的位置識別對應的泛型
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body } = req;
  try {
    const newUser = await createUser(body);
    await sendEmail({
      to: body.email,
      subject: "帳戶驗證信",
      text: `id: ${newUser._id as number}, verification code: ${
        newUser.verificationCode
      }`,
    });
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

export const verifyUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("params", req.params);
};
