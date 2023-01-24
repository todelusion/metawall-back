/* eslint-disable import/first */
import dotenv from "dotenv";
import express from "express";

dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import { tryCatch } from "./utils";
// import app from "./app";

const port = process.env.PORT ?? 3000;
const app = express();

const connectToDb = async (): Promise<void> => {
  const { DATABASE, DATABASE_PASSWORD } = process.env;

  if (DATABASE === undefined || DATABASE_PASSWORD === undefined)
    return console.error("DATABASE or DATABASE_PASSWORD not found in .env");

  const DB = DATABASE.replace("<PASSWORD>", DATABASE_PASSWORD);

  const result = await tryCatch(async () => mongoose.connect(DB));
  if (result === undefined) return process.exit(1);
  return console.log("connect to MongoDB");
};

app.listen(port, () => {
  console.log(`watching port ${port}`);
  void connectToDb();
});
