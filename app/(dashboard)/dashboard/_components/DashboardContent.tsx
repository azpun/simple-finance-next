"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddTransactionDialog from "@/app/(dashboard)/transactions/_components/AddTransactionDialog";
import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "@/validations/dashboard.validation";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { fetchGetDashboard } from "@/lib/api/dashboard";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardContent = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const isMobile = useIsMobile();

  const { data: result, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchGetDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Check if the user is authenticated
  if (!user?.id || user.id === undefined) {
    return <div>Not Authenticated</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 lg:p-10 md:flex md:justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl">{`Hello... ${session?.user?.name}`}</h1>
          <p className="tracking-tight text-balance">
            Here&apos;s your financial snapshot for{" "}
            <span className="font-bold">{result?.budget.monthAndYear}</span>
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
              <h3 className="text-2xl font-bold">Summary</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3>Monthly Budget</h3>
                <p className="mt-2 text-xl font-bold">
                  Rp. {result?.budget.totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <h3>Spend so far</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center mt-2">
                    <p className="text-xl font-bold">
                      Rp.{" "}
                      {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <p>
                        Usage Rp.{" "}
                        {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                          "id-ID",
                        )}{" "}
                        / {result?.budget.totalAmount.toLocaleString("id-ID")}
                      </p>
                      <p className="ml-auto ">
                        {result?.operationsOf.percentageUsage.toPrecision(2)}%
                      </p>
                    </div>
                    <Progress
                      value={result?.operationsOf.percentageUsage}
                      className="h-2 my-2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3>Remaining</h3>
                <p className="mt-2 text-xl font-bold">
                  Rp.{" "}
                  {result?.operationsOf.budgetRemaining.toLocaleString("id-ID")}
                </p>
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
                <div className="flex items-center">
                  <p className="text-xl font-bold">
                    Rp.{" "}
                    {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <p>
                      Usage Rp.{" "}
                      {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                        "id-ID",
                      )}{" "}
                      / {result?.budget.totalAmount.toLocaleString("id-ID")}
                    </p>
                    <p className="ml-auto ">
                      {result?.operationsOf.percentageUsage.toPrecision(2)}%
                    </p>
                  </div>
                  <Progress
                    value={result?.operationsOf.percentageUsage}
                    className="h-2 my-2"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3>Remaining</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">
                  Rp.{" "}
                  {result?.operationsOf.budgetRemaining.toLocaleString("id-ID")}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 ">
          <Card className="flex flex-col gap-6 max-h-125">
            <CardHeader>
              <h3 className="text-xl">Recent Transactions</h3>
            </CardHeader>
            <CardContent>
              <div className="p-2 overflow-y-auto max-h-125">
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
};

export default DashboardContent;
