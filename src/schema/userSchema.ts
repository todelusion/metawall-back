import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "必須要有電子信箱" })
        .email({ message: "不符合電子信箱格式" }),
      nickname: z.string().optional(),
      password: z
        .string({ required_error: "必須要有密碼" })
        .min(6, { message: "密碼必須至少 6 位數" }),
      passwordConfirm: z.string({ required_error: "必須確認密碼" }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "密碼不相同",
      path: ["passwordConfirm"],
    }),
});
export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "必須要有電子信箱" })
      .email({ message: "不符合電子信箱格式" }),
  }),
});

// 不在解析 params schema 放入錯誤訊息是因為，
// params 如果錯誤代表路由會先錯誤，express 則會直接拋出錯誤，進不到 validateResource
// 但還是會定義 schema 是為了能產生 params 型別以便放入 Request 泛型
export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({ required_error: "必須要有密碼" })
        .min(6, { message: "密碼必須至少 6 位數" }),
      passwordConfirm: z.string({ required_error: "必須確認密碼" }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "密碼不相同",
      path: ["passwordConfirm"],
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];

export type VerifyUserInput = z.infer<typeof verifyUserSchema>["params"];

export type ForgotPasswordPasswordInput = z.infer<
  typeof forgotPasswordSchema
>["body"];

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
