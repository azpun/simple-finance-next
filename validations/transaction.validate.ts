import * as zod from "zod";

const CategorySchema = zod.object({
  name: zod.string(),
});

export const TransactionSchema = zod.object({
  id: zod.string(),
  amount: zod.any().transform(value => {
    if (value && typeof value === "object" && "toNumber" in value) {
      return value.toNumber();
    }
    return Number(value);
  }),
  title: zod.string(),
  description: zod.string().optional(),
  type: zod.enum(["Income", "Expense"]),
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
    .trim()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
  type: zod.enum(["Expense", "Income"], {
    error: "Type must be either 'Expense' or 'Income'",
  }),
  category: zod.object({
    name: zod
      .string()
      .trim()
      .min(1, "Category name cannot be empty")
      .max(15, "Category name cannot be more than 15 characters long"),
  }),
});

export type CreateTransactionInputType = zod.infer<typeof transactionSchema>;

export const validateCreateTransaction = (
  payload: CreateTransactionInputType,
) => {
  return transactionSchema.safeParseAsync(payload);
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
export const validateResponseTransaction = (payload: unknown) => {
  return transactionResponseSchema.safeParseAsync(payload);
};
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
