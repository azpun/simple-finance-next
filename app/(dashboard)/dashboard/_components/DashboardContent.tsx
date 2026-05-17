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
          <>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-muted-foreground">Saldo Saat Ini</h3>
                  <p className="mt-2 text-xl font-bold">
                    Rp.
                    {result?.transactions.currentBalance.toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 mx-2">
              <Card className="mx-2">
                <CardContent>
                  <div>
                    <h3 className="text-muted-foreground">
                      Pemasukan Bulan Ini
                    </h3>
                    <p className="mt-2 text-xl font-bold text-green-400">
                      Rp.
                      {result?.transactions.transactionsIncomeSum.toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="mx-2">
                <CardContent>
                  <div>
                    <h3 className="text-muted-foreground">
                      Pengeluaran Bulan Ini
                    </h3>
                    <p className="mt-2 text-xl font-bold text-red-400">
                      Rp.
                      {result?.transactions.transactionsExpanseSum.toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center">
                  <h3 className="text-muted-foreground">
                    {(result?.transactions.monthlyNetFlow ?? 0) < 0
                      ? "Defisit Bulan Ini"
                      : "Surplus Bulan Ini"}
                  </h3>
                  <p
                    className={`mt-2 text-xl font-bold 
                    ${(result?.transactions?.monthlyNetFlow ?? 0) < 0 ? "text-red-400" : "text-green-400"}`}
                  >
                    {(result?.transactions?.monthlyNetFlow ?? 0) < 0
                      ? " - "
                      : ""}
                    Rp.
                    {result?.transactions.monthlyNetFlow.toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-start justify-between gap-2 md:items-center md:flex-row text-muted-foreground">
                    <p>
                      {result?.operationsOf.percentageUsage.toPrecision(2)}%
                      budget bulan ini digunakan
                    </p>
                    <p>
                      Rp.
                      {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                        "id-ID",
                      )}{" "}
                      dari Rp.
                      {result?.budget.totalAmount.toLocaleString("id-ID")}{" "}
                    </p>
                  </div>
                  <Progress
                    value={result?.operationsOf.percentageUsage}
                    className="h-2 my-2"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="flex flex-col items-center my-0">
              <div>
                <h3 className="text-muted-foreground">Saldo Saat Ini</h3>
              </div>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">
                  Rp.{" "}
                  {result?.transactions.currentBalance.toLocaleString("id-ID")}
                </p>
              </CardContent>
            </Card>
            <div className="md:grid md:grid-cols-3">
              <Card className="flex flex-col gap-4">
                <CardHeader>
                  <h3 className="text-muted-foreground">Pemasukan Bulan Ini</h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-xl font-bold text-green-400">
                    Rp.{" "}
                    {result?.transactions.transactionsIncomeSum.toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-muted-foreground">
                    Pengeluaran Bulan Ini
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-red-400">
                      Rp.{" "}
                      {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardHeader>
                  <h3 className="text-muted-foreground">
                    {(result?.transactions.monthlyNetFlow ?? 0) < 0
                      ? "Defisit Bulan Ini"
                      : "Surplus Bulan Ini"}
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <p
                    className={`text-xl font-bold
                    ${(result?.transactions?.monthlyNetFlow ?? 0) < 0 ? "text-red-400" : "text-green-400"}`}
                  >
                    {(result?.transactions?.monthlyNetFlow ?? 0) < 0
                      ? " - "
                      : ""}
                    Rp.{" "}
                    {result?.transactions.monthlyNetFlow.toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-gray-500">
                    <p className="text-muted-foreground">
                      {result?.operationsOf.percentageUsage.toPrecision(2)}%
                      budget bulan ini digunakan
                    </p>
                    <p className="text-muted-foreground">
                      Rp.
                      {result?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
                        "id-ID",
                      )}{" "}
                      dari Rp.
                      {result?.budget.totalAmount.toLocaleString("id-ID")}{" "}
                    </p>
                  </div>
                  <Progress
                    value={result?.operationsOf.percentageUsage}
                    className="h-2 my-2"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="grid grid-cols-1 ">
          <Card className="flex flex-col gap-6 max-h-125">
            <CardHeader>
              <h3 className="text-xl">Recent Transactions</h3>
            </CardHeader>
            <CardContent>
              <div className="p-2 overflow-y-auto max-h-125">
                <ul className="flex flex-col gap-2 p-2 ">
                  {result?.transactions.transactionsThisMonth.length !== 0 ? (
                    <>
                      {isLoading && <p className="text-center">Loading...</p>}
                      {result?.transactions?.transactionsThisMonth.map(
                        transaction => (
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
                        ),
                      )}
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
