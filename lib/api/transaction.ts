import {
  TransactionData,
  TransactionResponse,
  UpdateTransactionInputType,
} from "@/validations/transaction.validate";

export const fetchDataTransactionById = async (transactionId: string) => {
  const id = transactionId;
  const response = await fetch(`/api/transactions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("STATUS:", response.status);
    console.error("STATUS TEXT:", response.statusText);

    const errorText = await response.text();
    console.error("BODY:", errorText);

    throw new Error("Failed to fetch transaction");
  }
  const result = await response.json();
  const data: UpdateTransactionInputType = result.data;

  return data;
};

export const fetchDataTransactions = async () => {
  const response = await fetch(`/api/transactions`);
  const result: TransactionResponse = await response.json();
  const data: TransactionData = result.data;

  if (!result.success) {
    throw new Error(result.message);
  }

  return data;
};
