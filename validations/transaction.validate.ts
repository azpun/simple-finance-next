import * as zod from "zod";

export const transactionSchema = zod.object({
  amount: zod.number().gt(0, "Amount must be greater than 0"),
  title: zod
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  description: zod
    .string()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
  type: zod.enum(["EXPENSE", "INCOME"]),
  category: zod.object({
    name: zod
      .string()
      .max(15, "Category name cannot be more than 15 characters long"),
  }),
});

export const createTrasactionValidation = (
  payload: CreateTransactionInputType,
) => {
  return transactionSchema.safeParseAsync(payload);
};

export const updateTrasactionValidation = (
  payload: UpdateTransactionInputType,
) => {
  return transactionSchemaPartial.safeParseAsync(payload);
};

export const transactionSchemaPartial = transactionSchema.partial();

export type CreateTransactionInputType = zod.infer<typeof transactionSchema>;

export type UpdateTransactionInputType = zod.infer<
  typeof transactionSchemaPartial
>;
