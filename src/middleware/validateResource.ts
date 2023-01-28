// validateResource 中間鍵，統一使用 zod schema 解析 Request 與 Response
// 由於是通用 middleware，因此 schema 型別使用 AnyZodObject

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (result.success) {
      next();
    } else {
      res.status(400).json({
        status: "failed",
        data: result.error.formErrors,
      });
    }
  };

export default validateResource;
