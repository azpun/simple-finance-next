import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod.string().min(3, "Name must be at least 3 characters long"),
    email: zod
      .email({
        message: "Please enter a valid email address",
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      })
      .trim()
      .toLowerCase(),
    password: zod
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirm: zod
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const registerResponseSchema = zod.object({
  success: zod.boolean(),
  status: zod.number(),
  message: zod.string(),
  data: zod.object({
    id: zod.string(),
    email: zod.string(),
    name: zod.string(),
  }),
});

export const errorResponseSchema = zod.object({
  success: zod.literal("false"),
  status: zod.number(),
  message: zod.string(),
  errors: zod.any(),
});

export const validateRegister = (payload: RegisterInputType) => {
  return registerSchema.safeParse(payload);
};

export const validateRegisterResponse = (payload: unknown) => {
  return registerResponseSchema.safeParse(payload);
};

export const validateErrorResponse = (payload: unknown) => {
  return errorResponseSchema.safeParse(payload);
};

export const loginSchema = zod.object({
  email: zod
    .email({
      message: "Please enter a valid email address",
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    })
    .trim()
    .toLowerCase(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

export const validateLogin = (payload: LoginInputType) => {
  return loginSchema.safeParse(payload);
};

export type RegisterInputType = zod.infer<typeof registerSchema>;
export type LoginInputType = zod.infer<typeof loginSchema>;
