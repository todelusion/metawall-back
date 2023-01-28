/* eslint-disable @typescript-eslint/explicit-function-return-type */

import UserModel, { User } from "../models/userModel";

export async function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export async function findByUser(id: string) {
  return UserModel.findById(id);
}

export async function findByEmail(email: string) {
  return UserModel.findOne({ email });
}
