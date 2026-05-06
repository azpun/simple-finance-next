import { UpdateTransactionInputType } from "@/validations/transaction.validate";

const fetchDataTransactionById = async (budgetId: string) => {
  const id = budgetId;
  const response = await fetch(`/api/transactions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch budget");
  }
  const result = await response.json();
  const data: UpdateTransactionInputType = result.data;

  return data;
};

export default fetchDataTransactionById;
