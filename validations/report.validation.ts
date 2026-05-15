import * as z from "zod";
import { TransactionSchema } from "./transaction.validate";

export const reportDataSchema = z.object({
  listTransactionsExpense: z.array(TransactionSchema),
  listTransactionsIncome: z.array(TransactionSchema),
  netBalance: z.number(),
  totalExpense: z.number(),
  totalIncome: z.number(),
});

export type ReportDataType = z.infer<typeof reportDataSchema>;
