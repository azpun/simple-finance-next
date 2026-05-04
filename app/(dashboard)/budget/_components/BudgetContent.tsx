// app/(dashboard)/budget/_components/BudgetContent.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fetchGetDashboard } from "@/lib/api/dashboard";
import { FormattedDataBudgetType } from "@/validations/budget.validation";
import { DashboardData } from "@/validations/dashboard.validation";
import { useQuery } from "@tanstack/react-query";

export const BudgetContent = () => {
  const isMobile = useMediaQuery(1022);
  const isTabletDesktop = useMediaQuery(1024);

  const { data: budget } = useQuery<FormattedDataBudgetType>({
    queryKey: ["budget"],
    queryFn: async () => {
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
      const data: FormattedDataBudgetType = result.data;

      return data;
    },
    staleTime: 1000 * 60, // 1 minutes
  });

  const { data: dataDashboard } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchGetDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div>
      {isMobile && (
        <>
          <Card className="mx-0 md:mx-1 lg:mx-2">
            <CardHeader>
              <CardTitle>
                <div>
                  <h2>Budget </h2>
                </div>
              </CardTitle>
              <CardDescription>
                <div>
                  <p>Description</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Budget Amount and Remaining</p>
                <span>Progression bar of remaining budget</span>
              </div>
            </CardContent>
            <CardFooter>
              <div>Actions Button</div>
            </CardFooter>
          </Card>
        </>
      )}
      {!isTabletDesktop && (
        <div className="relative overflow-x-auto border rounded-md shadow-xs border-default">
          <table className="w-full text-sm text-left text-body lg:table-fixed">
            <thead className="border-b border-defult bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Progression bar
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Budget Amount and Remaining
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Actions Button
                </th>
              </tr>
            </thead>
            <tbody>
              {budget?.map((item, index) => (
                <tr key={index} className="border-b even:bg-secondary">
                  <td className="px-6 py-4 font-bold">{item.monthAndYear}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex ">
                        <p>
                          Rp.{" "}
                          {dataDashboard?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                            "id-ID",
                          )}{" "}
                          / Rp.{" "}
                          {dataDashboard?.budget.totalAmount.toLocaleString(
                            "id-ID",
                          )}
                        </p>
                        <p className="ml-auto">
                          (
                          {dataDashboard?.operationsOf.percentageRemaining.toPrecision(
                            1,
                          )}
                          %)
                        </p>
                      </div>
                      <Progress
                        value={dataDashboard?.operationsOf.percentageRemaining}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    Rp.{item.totalAmount.toLocaleString("id-ID")} / Rp.
                    {dataDashboard?.operationsOf.budgetRemaining.toLocaleString(
                      "id-ID",
                    )}
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
