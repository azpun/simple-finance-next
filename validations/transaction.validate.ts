import * as zod from "zod";

const CategorySchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  userId: zod.string(),
  createdAt: zod.coerce.date(),
  updatedAt: zod.coerce.date(),
});

const TransactionSchema = zod.object({
  id: zod.string(),
  amount: zod.number(),
  title: zod.string(),
  description: zod.string(),
  type: zod.enum(["INCOME", "EXPENSE"]),
  date: zod.coerce.date(),
  categoryId: zod.string(),
  userId: zod.string(),
  createdAt: zod.coerce.date(),
  updatedAt: zod.coerce.date(),
  category: CategorySchema,
});

export type TransactionTypes = zod.infer<typeof TransactionSchema>;

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

const withPercentege = zod.object({
  _sum: zod.object({
    amount: zod.number(),
  }),
  categoryId: zod.string(),
  category: zod.string(),
  percentage: zod.number(),
});

export type TransactionWithPercentage = zod.infer<typeof withPercentege>;

export const transactionResponseSchema = zod.object({
  success: zod.boolean(),
  status: zod.number(),
  message: zod.string(),
  data: zod.object({
    transactions: zod.array(TransactionSchema),
    dailyTransactions: zod.array(TransactionSchema),
    sumOfExpanses: zod.number(),
    withPercentege: zod.array(withPercentege),
  }),
});

export type TransactionResponse = zod.infer<typeof transactionResponseSchema>;
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
