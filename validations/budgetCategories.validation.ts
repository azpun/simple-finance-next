import * as z from "zod";
import { pureDataBudget } from "./budget.validation";
import { pureCategoriesData } from "./categories.validation";

export const budgetCategoriesDataSchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  categoryId: z.string(),
  amount: z
    .any()
    .transform(value => {
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      return Number(value);
    })
    .refine(value => !isNaN(value) && value > 0, {
      message: "Amount budget must be a valid number",
    }),
  budget: pureDataBudget,
  category: pureCategoriesData,
});

export type BudgetCategories = z.infer<typeof budgetCategoriesDataSchema>;
