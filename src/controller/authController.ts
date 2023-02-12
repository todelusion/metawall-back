/* eslint-disable no-underscore-dangle */
// 處理所有身分驗證包括一般登入、google 登入等

import { NextFunction, Request, Response } from "express";
import { CreateSessionInput } from "../schema/authSchema";
import { CreateUserInput } from "../schema/userSchema";
import { signAccessToken, signRefeshToken } from "../service/authService";
import { findByEmail } from "../service/userService";
import { AppError } from "../types";
import { tryCatch } from "../utils";

export const createSessionHandler = tryCatch(
  async (
    req: Request<{}, {}, CreateSessionInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("in createSessionHandler");
    const { email, password } = req.body;
    const user = await findByEmail(email);

    if (user === null) return next(new AppError("此用戶尚未註冊", 404));
    const isValid = await user.validatePassword(password);

    if (!isValid) return next(new AppError("密碼錯誤", 401));

    // 註冊 access token
    const accessToken = signAccessToken(user);

    // 註冊 refresh token
    // const refreshToken = await signRefeshToken({ userId: user._id });
    // console.log(accessToken, refreshToken);

    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     accessToken,
    //     refreshToken,
    //   },
    // });

    res.send("test");
    return undefined;
  }
);
