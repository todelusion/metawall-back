/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgotPasswordPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/userSchema";
import { createUser, findByEmail, findByUser } from "../service/userService";
import { AppError, MongoServerError } from "../types";
import { mailer, tryCatch } from "../utils";
import sendEmail from "../utils/mailer";

// interface Request 接受泛型，且與函式參數的方式一樣，用傳入引數的位置識別對應的泛型
export const createUserHandler = tryCatch(
  async (
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
        text: `id: ${newUser._id as string}, verification code: ${
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
  }
);

// export const verifyUserHandler = tryCatch(
//   async (
//     req: Request<VerifyUserInput>,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     const { id, verificationCode } = req.params;
//     const user = await findByUser(id);
//     if (user === null) return next(new AppError("找不到指定用戶", 404));
//     if (user.verificationCode === verificationCode) {
//       user.verified = true;
//       await user.save();
//       res.status(200).json({
//         status: "success",
//         message: "用戶驗證成功",
//       });
//       return undefined;
//     }

//     return next(new AppError("驗證失敗", 401));
//   }
// );

export const forgotPasswordHandler = tryCatch(
  async (
    req: Request<{}, {}, ForgotPasswordPasswordInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = req.body;
    const user = await findByEmail(email);
    if (user === null) return next(new AppError("此用戶尚未註冊", 404));
    // if (!user.verified) return next(new AppError("此用戶尚未點擊驗證信", 401));

    user.passwordResetCode = nanoid();
    await user.save();
    await mailer({
      to: email,
      subject: "密碼重設信",
      text: `重設碼：${user.passwordResetCode}，用戶 id：${user._id as string}`,
    });

    res.status(200).json({
      status: "success",
      message: "成功寄出密碼重設信",
    });

    return undefined;
  }
);

export const resetPasswordHandler = tryCatch(
  async (
    req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findByUser(id);
    if (user === null) return next(new AppError("找不到指定用戶", 404));
    if (
      user.passwordResetCode === null ||
      user.passwordResetCode !== passwordResetCode
    )
      return next(new AppError("驗證失敗，請再寄一次密碼重設信", 401));
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "密碼重設成功",
    });
    return undefined;
  }
);
