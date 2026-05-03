// app/(dashboard)/dashboard/page.tsx
"use client";

import { ChartPieDonut } from "@/components/common/ChartPie";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import AddTransactionDialog from "@/components/common/AddTransactionDialog";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardData,
  DashboardResponse,
} from "@/validations/dashboard.validation";
import React from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const isMobile = useIsMobile();

  // Check if the user is authenticated

  // Get transactions
  const { data: result, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard`);
      const result: DashboardResponse = await response.json();
      const data: DashboardData = result.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      return data;
    },
    staleTime: 0,
  });

  console.log(result?.budget);

  const finalSpendData = React.useMemo(() => {
    const main = result?.byCategories.slice(0, 5);
    const others = result?.byCategories.slice(5);

    const otherCombine = others?.reduce(
      (acc, item) => {
        acc._sum.amount += item._sum.amount ?? 0;
        acc.percentage += item.percentage ?? 0;
        return acc;
      },
      {
        category: "others",
        _sum: {
          amount: 0,
        },
        percentage: 0,
      },
    );
    return (otherCombine?._sum.amount ?? 0) > 0
      ? [...(main ?? []), otherCombine]
      : main;
  }, [result?.byCategories]);

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 lg:p-10 md:flex md:justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl">{`Hello... ${session?.user?.name}`}</h1>
          <p className="tracking-tight text-balance">
            Here&apos;s your financial snapshot for{" "}
            <span className="font-bold">{result?.budget.date}</span>
          </p>
        </div>
        <div className="hidden md:block">
          <AddTransactionDialog />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-7">
        {isMobile ? (
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <h3 className="text-xl">Summary</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3>Monthly Budget</h3>
                <p className="text-xl font-bold">
                  {result?.budget.totalAmount}
                </p>
              </div>
              <div>
                <h3>Spend so far</h3>
                <p className="text-xl font-bold">
                  Rp. {result?.sumOfExpanses.toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <h3>Remaining</h3>
                <p className="text-xl font-bold">Rp. 980.000</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="md:grid md:grid-cols-3">
            <Card className="flex flex-col gap-4">
              <CardHeader>
                <h3>Monthly Budget</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">
                  Rp. {result?.budget.totalAmount.toLocaleString("id-ID")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3>Spend so far </h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">
                  Rp. {result?.sumOfExpanses.toLocaleString("id-ID")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3>Remaining</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">Rp. 980.000</p>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2">
          <Card className="flex flex-col gap-6 max-h-212.5">
            <CardHeader>
              <h3 className="text-xl">Spending Breakdown</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {isLoading && <p className="text-center">Loading...</p>}
              {result?.byCategories?.length !== 0 ? (
                <>
                  <div>
                    <ChartPieDonut />
                  </div>
                  <div className="p-2 ">
                    <ul className="flex flex-col gap-3">
                      {finalSpendData?.map(category => (
                        <li key={category?.category}>
                          <Card>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <h4 className="capitalize">
                                  {category?.category}
                                </h4>
                                <div className="flex gap-3">
                                  <p>
                                    Rp.{" "}
                                    {category?._sum.amount.toLocaleString(
                                      "id-ID",
                                    )}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-500">
                                    {category?.percentage.toPrecision(2)}%
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="p-2 text-center">No data</p>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col gap-6 max-h-212.5">
            <CardHeader>
              <h3 className="text-xl">Recent Transactions</h3>
            </CardHeader>
            <CardContent>
              <div className="p-2 overflow-y-auto max-h-161">
                <ul className="flex flex-col gap-2 p-2 ">
                  {result?.transactions?.length !== 0 ? (
                    <>
                      {isLoading && <p className="text-center">Loading...</p>}
                      {result?.transactions?.map(transaction => (
                        <Card
                          key={transaction.id}
                          className="px-3 mx-0 border-0"
                        >
                          <li key={transaction.id}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold ">
                                  {transaction.title}
                                </h4>
                                <p className="text-xs capitalize">
                                  {transaction.category.name} - (
                                  {transaction.type})
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <p>
                                  Rp.{" "}
                                  {transaction.amount.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs">
                                  {new Date(
                                    transaction.updatedAt,
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          </li>
                        </Card>
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="text-center">
                        There are no recent transactions today
                      </p>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
