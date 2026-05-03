import * as z from "zod";

export const dashboardResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  data: z.object({
    transactions: z.array(
      z.object({
        id: z.string(),
        amount: z.number(),
        title: z.string(),
        type: z.enum(["Income", "Expense"]),
        date: z.coerce.date(),
        category: z.object({
          name: z.string(),
        }),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    ),
    byCategories: z.array(
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
    ),
    sumOfExpanses: z.number(),
    budget: z.object({
      totalAmount: z.number(),
      date: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
  }),
});

export const dashboardDataSchema = z.object({
  transactions: z.array(
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
  ),
  byCategories: z.array(
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
  ),
  sumOfExpanses: z.number(),
  budget: z.object({
    totalAmount: z.number(),
    date: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
});

export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;

export type DashboardData = z.infer<typeof dashboardResponseSchema>["data"];

export type DashboardTransactions = z.infer<
  typeof dashboardResponseSchema
>["data"]["transactions"];

export type DashboardByCategories = z.infer<
  typeof dashboardResponseSchema
>["data"]["byCategories"];
