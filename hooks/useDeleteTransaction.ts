import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      //   toast.success("Transaction deleted successfully", {
      //     duration: 4000,
      //     position: "top-center",
      //   });
    },
    onError: () => {
      //   toast.error("Failed to delete transaction", {
      //     duration: 5000,
      //     position: "top-center",
      //   });
    },
  });
};
