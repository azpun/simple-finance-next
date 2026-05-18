import {
  DataBudgetDescOptionalType,
  DataBudgetWitStatsType,
} from "@/validations/budget.validation";

export const fetchDataBudgetById = async (budgetId: string) => {
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
  const data: DataBudgetDescOptionalType = result.data;

  return data;
};

export const fetchDataBudgets = async () => {
  const response = await fetch("/api/budgets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch budget");
  }
  const result = await response.json();
  const data: DataBudgetWitStatsType[] = result.data;

  return data;
};
