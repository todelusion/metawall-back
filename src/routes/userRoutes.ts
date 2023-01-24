import express from "express";
import { createUserHandler } from "../controller/userController";
import { validateResource } from "../middleware";
import { createUserSchema } from "../schema/userSchema";

const userRouter = express.Router();

// 透過 validateResource 中間鍵，確保任何 req body 是我們預期的結構
userRouter
  .route("/sign_up")
  .post(validateResource(createUserSchema), createUserHandler);

export default userRouter;
