import * as z from "zod";

export const createBudgetSchema = z.object({
  id: z.string().optional(),
  month: z
    .any()
    .transform(value => {
      if (typeof value === "string") {
        const monthNumber = Number(value);
        if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
          return monthNumber;
        }
      }
      return value;
    })
    .refine(value => typeof value === "number" && value >= 1 && value <= 12, {
      message: "Please select a valid month",
    }),
  year: z
    .number()
    .int()
    .min(2026, "Year must be at least 2026")
    .max(2100, "Year must be at most 2100"),
  totalAmount: z
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
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
});

export type CreateBudgetInputType = z.infer<typeof createBudgetSchema>;

export const formattedDataBudget = z.array(
  z.object({
    id: z.string(),
    monthAndYear: z.string(),
    totalAmount: z
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
    description: z
      .string()
      .trim()
      .max(200, "Description must be at most 200 characters long")
      .nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
);

export type FormattedDataBudgetType = z.infer<typeof formattedDataBudget>;

export const DataBudget = z.object({
  id: z.string(),
  monthAndYear: z.string(),
  totalAmount: z
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
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DataBudgetType = z.infer<typeof DataBudget>;

export const UpdateDataBudget = z.object({
  id: z.string(),
  monthAndYear: z.string(),
  totalAmount: z
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
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters long")
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UpdateDataBudgetType = z.infer<typeof UpdateDataBudget>;
