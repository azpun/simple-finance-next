import { DataBudgetType } from "@/validations/budget.validation";

const fetchDataBudgetById = async (budgetId: string) => {
  const id = budgetId;
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
};

export default fetchDataBudgetById;
