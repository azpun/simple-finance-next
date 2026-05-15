// app/(dashboard)/report/_components/ReportContent.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { getDataReport } from "@/lib/api/report";
import { ReportDataType } from "@/validations/report.validation";
import { useQuery } from "@tanstack/react-query";

export const ReportContent = () => {
  const { data: report } = useQuery<ReportDataType>({
    queryKey: ["report"],
    queryFn: getDataReport,
  });

  return (
    <div>
      <div>
        <div>
          <span>Filter Section Here</span>
        </div>
      </div>
      <div>
        <Card className="mx-0 my-4">
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
            <div className="space-y-2">
              <h2>Total Pendapatan (Income)</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-2">
              <h2>Total Pengeluaran (Expense)</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-2">
              <h2>Sisa Saldo Bersih (Net Balance)</h2>
              <p className="text-lg font-bold md:text-2xl">
                Rp.{report?.netBalance.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
