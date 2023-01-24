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

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
