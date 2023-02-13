import express from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  // verifyUserHandler,
} from "../controller/userController";
import { validateResource } from "../middleware";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  // verifyUserSchema,
} from "../schema/userSchema";

const userRouter = express.Router();

// 透過 validateResource 中間鍵，確保任何 req body/params/query 是我們預期的結構
userRouter.post(
  "/sign_up",
  validateResource(createUserSchema),
  createUserHandler
);

// userRouter.post(
//   "/verify/:id/:verificationCode",
//   validateResource(verifyUserSchema),
//   verifyUserHandler
// );

userRouter.post(
  "/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

userRouter.post(
  "/resetpassword/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

userRouter.get("/me", getCurrentUserHandler);

export default userRouter;
