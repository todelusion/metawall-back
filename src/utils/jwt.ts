// 使用 RS256 算法產生公私金鑰，非對稱比對公私鑰
import { SignOptions, sign, verify, JwtPayload } from "jsonwebtoken";

// 使用私鑰產生 token
export function signJwt(
  object: Object,
  keyname: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_PRIVATE_KEY",
  options?: SignOptions
): string {
  const signingKey = Buffer.from(
    process.env[keyname] as string,
    "base64"
  ).toString("ascii");

  return sign(object, signingKey, {
    ...(options !== undefined && options),
    algorithm: "RS256",
  });
}

// 使用公鑰比對 token
export function verifyJwt(
  token: string,
  keyname: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_PUBLIC_KEY"
): string | JwtPayload | null {
  const publicKey = Buffer.from(
    process.env[keyname] as string,
    "base64"
  ).toString("ascii");

  try {
    const decoded = verify(token, publicKey);
    return decoded;
  } catch (err) {
    return null;
  }
}
