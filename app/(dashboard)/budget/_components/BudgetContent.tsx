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
import { DropdownMenuBudgets } from "./DropdownMenuBudgets";
import { Circle } from "lucide-react";

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
          {budget?.map(item => (
            <Card key={item.monthAndYear} className="mx-0 md:mx-1 lg:mx-2">
              <CardHeader>
                <CardTitle>
                  <div>
                    <h2>{item.monthAndYear}</h2>
                  </div>
                </CardTitle>
                <CardDescription>
                  <div>
                    <p>{item.description}</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
              <CardFooter>
                <div>Actions Button</div>
              </CardFooter>
            </Card>
          ))}
        </>
      )}
      {!isTabletDesktop && (
        <div className="relative overflow-x-auto border rounded-md shadow-xs border-default">
          <table className="w-full text-sm text-left text-body md:table-fixed">
            <thead className="border-b border-defult bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium w-[10vw]">
                  Month
                </th>
                <th scope="col" className="px-6 py-3 font-medium w-[10vw]">
                  Budget Amount
                </th>
                <th scope="col" className="px-6 py-3 font-medium w-[40vw]">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium w-[10vw] text-center"
                >
                  Actions Button
                </th>
              </tr>
            </thead>
            <tbody>
              {budget?.map((item, index) => (
                <tr key={index} className="border-b even:bg-secondary">
                  <td className="px-6 py-4 font-bold">{item.monthAndYear}</td>
                  <td className="px-6 py-4">
                    Rp. {item.totalAmount.toLocaleString("id-ID")}
                  </td>
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
                        className="h-2 my-2"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) <
                      50 && (
                      <div className="flex items-center gap-2 ">
                        <Circle
                          fill="green"
                          className="w-4 h-4 text-green-500"
                        />
                        <span>Good</span>
                      </div>
                    )}
                    {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) >=
                      50 &&
                      (dataDashboard?.operationsOf?.percentageRemaining ?? 0) <=
                        80 && (
                        <div className="flex items-center gap-2 ">
                          <Circle
                            fill="yellow"
                            className="w-4 h-4 text-yellow-500"
                          />
                          <span>Warning</span>
                        </div>
                      )}
                    {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) >
                      80 &&
                      (dataDashboard?.operationsOf?.percentageRemaining ?? 0) <=
                        100 && (
                        <div className="flex items-center gap-2 ">
                          <Circle fill="red" className="w-4 h-4 text-red-500" />
                          <span>Danger</span>
                        </div>
                      )}
                    {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) >
                      100 && (
                      <div className="flex items-center gap-2 ">
                        <Circle fill="red" className="w-4 h-4 text-red-500" />
                        <span>Over Budget</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenuBudgets />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
