import * as z from "zod";

export const transactionsThisMonthSchema = z.array(
  z.object({
    id: z.string(),
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
    title: z.string(),
    type: z.enum(["Income", "Expense"]),
    date: z.coerce.date(),
    category: z.object({
      name: z.string(),
    }),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
);

export const transactionsSchema = z.object({
  transactionsThisMonth: transactionsThisMonthSchema,
  transactionsExpanseSum: z.number(),
  transactionsIncomeSum: z.number(),
  monthlyNetFlow: z.number(),
  lifetimeTransactionsIncomeSum: z.number(),
  lifetimeTransactionsExpanseSum: z.number(),
  currentBalance: z.number(),
});

export const byCategoriesSchema = z.array(
  z.object({
    _sum: z.object({
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
    }),
    categoryId: z.string(),
    category: z.string(),
    percentage: z.number(),
  }),
);

export const operationOfSchema = z.object({
  amountOfBudgetThisMonth: z.number(),
  sumOfExpansesThisMonth: z.number(),
  budgetRemaining: z.number(),
  percentageRemaining: z.number(),
  percentageUsage: z.number(),
});

export const budgetSchema = z.object({
  totalAmount: z.number(),
  monthAndYear: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const dashboardDataSchema = z.object({
  transactions: transactionsSchema,
  byCategories: byCategoriesSchema,
  operationsOf: operationOfSchema,
  budget: budgetSchema,
});

export const dashboardResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  data: dashboardDataSchema,
});

export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;

export type DashboardData = z.infer<typeof dashboardResponseSchema>["data"];
