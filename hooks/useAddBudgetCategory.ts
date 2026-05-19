import { FormValues } from "@/types/budgetCategories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddBudgetCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-budget-category"],
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/budget-categories", {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budget"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["report"],
      });
    },
    onError: err => {
      console.error("Error creating budget category", err.message);
    },
  });
};
