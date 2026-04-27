import {
  CreateTransactionInputType,
  // validateResponseTransaction,
} from "@/validations/transaction.validate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionInputType) => {
      const promise = fetch("api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(async res => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message);
        }
        return json;
      });

      toast.promise(promise, {
        loading: "Creating transaction...",
        success: "Transaction created successfully",
        error: "Failed to create transaction",
      });

      const jsonResult = await promise;

      // console.log("JSON result:", jsonResult);

      return jsonResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "active",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create transaction");
      console.error("Error creating transaction", error.message);
    },
  });
};

export default useAddTransaction;
