import { UpdateTransactionInputType } from "@/validations/transaction.validate";

const fetchDataTransactionById = async (transactionId: string) => {
  const id = transactionId;
  const response = await fetch(`/api/transactions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch transaction");
  }
  const result = await response.json();
  const data: UpdateTransactionInputType = result.data;

  return data;
};

export default fetchDataTransactionById;
