import * as zod from "zod";

const CategorySchema = zod.object({
  name: zod.string(),
});

const TransactionSchema = zod.object({
  id: zod.string(),
  amount: zod.number(),
  title: zod.string(),
  type: zod.enum(["INCOME", "EXPENSE"]),
  date: zod.coerce.date(),
  category: CategorySchema,
});

export type TransactionTypes = zod.infer<typeof TransactionSchema>;

// =================================================================
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

export type CreateTransactionInputType = zod.infer<typeof transactionSchema>;

export const validateResponseTransaction = (payload: unknown) => {
  return transactionResponseSchema.safeParseAsync(payload);
};
// =================================================================

export const transactionResponseSchema = zod.object({
  success: zod.boolean(),
  status: zod.number(),
  message: zod.string(),
  data: zod.array(TransactionSchema),
});

export type TransactionResponse = zod.infer<typeof transactionResponseSchema>;
export type TransactionData = zod.infer<
  typeof transactionResponseSchema
>["data"];
// export const createTrasactionValidation = (
//   payload: CreateTransactionInputType,
// ) => {
//   return transactionSchema.safeParseAsync(payload);
// };

// export const transactionSchemaPartial = transactionSchema.partial();
// export const updateTrasactionValidation = (
//   payload: UpdateTransactionInputType,
// ) => {
//   return transactionSchemaPartial.safeParseAsync(payload);
// };
// export type UpdateTransactionInputType = zod.infer<
//   typeof transactionSchemaPartial
// >;
