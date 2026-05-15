// app/(dashboard)/report/_components/ReportContent.tsx
"use client";
import { ChartPieDonut } from "@/components/common/ChartPie";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchGetDashboard } from "@/lib/api/dashboard";
import { getDataReport } from "@/lib/api/report";
import { DashboardData } from "@/validations/dashboard.validation";
import { ReportDataType } from "@/validations/report.validation";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const ReportContent = () => {
  const { data: report } = useQuery<ReportDataType>({
    queryKey: ["report"],
    queryFn: getDataReport,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { data: result, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchGetDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const finalSpendData = useMemo(() => {
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
    <div className="mt-2 space-y-4">
      <div>
        <div className="mx-4">
          <span>Filter Section Here</span>
        </div>
      </div>
      <div>
        <Card className="my-4 ">
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
            <div className="space-y-2">
              <h2>Total Pendapatan</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-2">
              <h2>Total Pengeluaran</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-2">
              <h2>Sisa Saldo Kas</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.netBalance.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="">
        <Card className="">
          <CardContent>
            <div>
              <div>
                <h2 className="text-xl">Ringkasan Pendapatan</h2>
              </div>
              <div className="my-4">
                <ul>
                  {report?.listTransactionsIncome.map((item, index) => (
                    <div key={index} className="flex flex-col gap-4">
                      <div>
                        <h3>Pendapatan Bulan Ini</h3>
                        <p>Rp.{item.amount.toLocaleString("id-ID")}</p>
                      </div>
                      <div>
                        <h3>Sumber Utama</h3>
                        <li
                          key={"Item ke-" + index}
                          className="p-4 mt-4 border rounded-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="capitalize">{item.category.name}</p>
                              <p>Rp.{item.amount.toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              {new Date(item.date).toLocaleDateString("id-ID")}
                            </div>
                          </div>
                        </li>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="">
          <CardContent>
            <div>
              <div>
                <h2 className="text-xl">List Pengeluaran</h2>
              </div>
              <div className="overflow-y-scroll max-h-100">
                <ul>
                  {report?.listTransactionsExpense.map((item, index) => (
                    <li key={"Item ke-" + index} className="mr-2">
                      <div className="p-4 mt-4 border rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-2">
                            <span>{item.title}</span>
                            <span>
                              Rp.{item.amount.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div>
                            {new Date(item.date).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="flex flex-col gap-6 max-h-212.5">
          <CardHeader>
            <h3 className="text-xl">Pengeluaran Per Kategori</h3>
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
      </div>
    </div>
  );
};
