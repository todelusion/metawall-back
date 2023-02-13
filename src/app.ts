import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./controller/errorController";
import { deserializeUser } from "./middleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { AppError } from "./types";

const app = express();
app.use(express.json());
app.use(deserializeUser);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`找不到路徑${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
