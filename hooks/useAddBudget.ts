// hooks/useAddBudget.ts
import { CreateBudgetInputType } from "@/validations/budget.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useAddBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBudgetInputType) => {
      const promise = new Promise(async (resolve, reject) => {
        const response = await fetch("/api/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          reject(new Error("Failed to create budget"));
        } else {
          resolve(response.json());
        }
      });
      toast.promise(promise, {
        loading: "Creating budget...",
        success: "Create budget successful",
        error: (err: Error) => err.message,
        duration: 5000,
        position: "top-center",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create budget", {
        duration: 5000,
        position: "top-center",
      });
      console.error("Error creating budget", error.message);
    },
  });
};

export default useAddBudget;
