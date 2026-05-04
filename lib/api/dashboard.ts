import {
  DashboardData,
  DashboardResponse,
} from "@/validations/dashboard.validation";

export const fetchGetDashboard = async () => {
  const response = await fetch(`/api/dashboard`);
  const result: DashboardResponse = await response.json();
  const data: DashboardData = result.data;

  if (!result.success) {
    throw new Error(result.message);
  }

  return data;
};
