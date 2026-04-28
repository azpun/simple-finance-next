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
      }),
    ),
    byCategories: z.array(
      z.object({
        _sum: z.object({
          amount: z.any().transform(value => {
            if (value && typeof value === "object" && "toNumber" in value) {
              return value.toNumber();
            }
            return Number(value);
          }),
        }),
        categoryId: z.string(),
        category: z.string(),
        percentage: z.number(),
      }),
    ),
    sumOfExpanses: z.number(),
  }),
});

export const dashboardDataSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      amount: z.any().transform(value => {
        if (value && typeof value === "object" && "toNumber" in value) {
          return value.toNumber();
        }
        return Number(value);
      }),
      title: z.string(),
      type: z.enum(["Income", "Expense"]),
      date: z.coerce.date(),
      category: z.object({
        name: z.string(),
      }),
    }),
  ),
  byCategories: z.array(
    z.object({
      _sum: z.object({
        amount: z.any().transform(value => {
          if (value && typeof value === "object" && "toNumber" in value) {
            return value.toNumber();
          }
          return Number(value);
        }),
      }),
      categoryId: z.string(),
      category: z.string(),
      percentage: z.number(),
    }),
  ),
  sumOfExpanses: z.number(),
});

export const byCategoriesSchema = z.object({
  _sum: z.object({
    amount: z.any().transform(value => {
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      return Number(value);
    }),
  }),
  categoryId: z.string(),
  category: z.string(),
  percentage: z.number(),
});

export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;

export type DashboardData = z.infer<typeof dashboardResponseSchema>["data"];

export type DashboardTransactions = z.infer<
  typeof dashboardResponseSchema
>["data"]["transactions"];

export type DashboardByCategories = z.infer<
  typeof dashboardResponseSchema
>["data"]["byCategories"];
