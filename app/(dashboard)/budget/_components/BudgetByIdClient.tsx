"use client";

import { DataBudgetType } from "@/validations/budget.validation";
import { useQuery } from "@tanstack/react-query";

const BudgetByIdClient = ({ budgetId }: { budgetId: string }) => {
  const id = budgetId;
  const { data: dataBudget } = useQuery<DataBudgetType>({
    queryKey: ["budget", id],
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1];
      const response = await fetch(`/api/budgets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget");
      }
      const result = await response.json();
      const data: DataBudgetType = result.data;

      return data;
    },
  });

  if (dataBudget === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{dataBudget.monthAndYear}</h1>
      <p>{dataBudget.totalAmount}</p>
    </div>
  );
};

export default BudgetByIdClient;
