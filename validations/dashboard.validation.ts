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
        type: z.enum(["INCOME", "EXPENSE"]),
        date: z.coerce.date(),
        category: z.object({
          name: z.string(),
        }),
      }),
    ),
    byCategories: z.array(
      z.object({
        _sum: z.object({
          amount: z.number(),
        }),
        categoryId: z.string(),
        category: z.string(),
        percentage: z.number(),
      }),
    ),
    sumOfExpanses: z.number(),
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
