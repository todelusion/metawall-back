import { Error } from "mongoose";

class MongoServerError extends Error {
  code: number;
}

export default MongoServerError;
