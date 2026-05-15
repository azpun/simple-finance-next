import { ReportDataType } from "@/validations/report.validation";

export const getDataReport = async () => {
  const response = await fetch("/api/report", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  const data: ReportDataType = result.data;
  return data;
};
