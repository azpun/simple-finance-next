import * as zod from "zod";

export const registerSchema = zod.object({
  name: zod.string().min(3, "Name must be at least 3 characters long"),
  email: zod
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = zod.object({
  email: zod
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterInputType = zod.infer<typeof registerSchema>;
export type LoginInputType = zod.infer<typeof loginSchema>;
