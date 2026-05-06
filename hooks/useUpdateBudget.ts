import { CreateBudgetInputType } from "@/validations/budget.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-budget"],
    mutationFn: async (data: CreateBudgetInputType) => {
      const response = await fetch(`/api/budgets/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      toast.success("Budget updated successfully", {
        duration: 5000,
        position: "top-center",
      });
    },
    onError: error => {
      console.error("Error updating budget", error);
      toast.error("Failed to update budget", {
        duration: 5000,
        position: "top-center",
      });
    },
  });
};

export default useUpdateBudget;
