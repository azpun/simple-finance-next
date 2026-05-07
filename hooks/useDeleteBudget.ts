import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-budget"],
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        throw new Error("Failed to delete budget");
      }

      return result;
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
      console.error("Error deleting budget", error.message);
    },
  });
};
