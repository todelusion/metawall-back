/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import app from "./app";
// import app from "./app";

const port = process.env.PORT ?? 3000;

async function connectToDb(): Promise<void> {
  const { DATABASE, DATABASE_PASSWORD } = process.env;

  if (DATABASE === undefined || DATABASE_PASSWORD === undefined)
    return console.error("DATABASE or DATABASE_PASSWORD not found in .env");

  const DB = DATABASE.replace("<PASSWORD>", DATABASE_PASSWORD);

  try {
    await mongoose.connect(DB);
    return console.log("connect to MongoDB");
  } catch (error) {
    return process.exit(1);
  }
}

app.listen(port, () => {
  console.log(`watching port ${port}`);
  void connectToDb();
});
