import { z } from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "必須要有電子信箱" })
      .email({ message: "不符合電子信箱格式" }),
    password: z
      .string({ required_error: "必須要有密碼" })
      .min(6, { message: "密碼必須至少 6 位數" }),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>["body"];
