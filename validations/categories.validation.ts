import * as z from "zod";

export const pureCategoriesData = z.object({
  id: z.string(),
  name: z.string(),
  normalizeName: z.string(),
  type: z.enum(["Expense", "Income"]),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
