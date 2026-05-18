import { useMutation } from "@tanstack/react-query";

type FormValues = {
  budgetId: string;
  categoryId: string;
  amount: number;
};

export const useAddBudgetCategory = () => {
  return useMutation({
    mutationKey: ["add-budget-category"],
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      const result = await response.json();
      return result;
    },
  });
};
