import * as z from "zod";

export const createBudgetSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z
    .number()
    .int()
    .min(2025, "Year must be at least 2025")
    .max(2100, "Year must be at most 2100"),
  amount: z
    .any()
    .transform(value => {
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      return Number(value);
    })
    .refine(value => !isNaN(value) && value > 0, {
      message: "Amount must be a number greater than 0",
    }),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
});

export type CreateBudgetInputType = z.infer<typeof createBudgetSchema>;
