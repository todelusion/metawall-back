/* eslint-disable @typescript-eslint/explicit-function-return-type */
import UserModel, { User } from "../models/userModel";

export async function createUser(input: Partial<User>) {
  return UserModel.create(input);
}
