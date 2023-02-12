/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DocumentType } from "@typegoose/typegoose";
import SessionModel from "../models/sessionModel";
import { User } from "../models/userModel";
import { signJwt } from "../utils/jwt";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ userId });
}

export async function signRefeshToken({ userId }: { userId: string }) {
  // 1. 建立參考 session 的 refresh token
  // 2. 檢查 session 是否過期
  // 3. 透過 refresh token 建立 access toekn

  const session = await createSession({ userId });

  const refreshToken = signJwt({ session: session._id }, "REFRESH_PRIVATE_KEY");

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>): string {
  const payload = user.toJSON();
  const accessToken = signJwt(payload, "ACCESS_TOKEN_PRIVATE_KEY");
  return accessToken;
}
