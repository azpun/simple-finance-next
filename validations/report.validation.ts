import * as z from "zod";

export const reportDataSchema = z.object({
  netBalance: z.number(),
  totalExpense: z.number(),
  totalIncome: z.number(),
});

export type ReportDataType = z.infer<typeof reportDataSchema>;
