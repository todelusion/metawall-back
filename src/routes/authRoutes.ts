import express from "express";
import { createSessionHandler } from "../controller/authController";
import { validateResource } from "../middleware";
import { createSessionSchema } from "../schema/authSchema";

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default authRouter;
