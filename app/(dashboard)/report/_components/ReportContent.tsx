import { Card, CardContent } from "@/components/ui/card";

export const ReportContent = () => {
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
              <p className="text-lg font-bold md:text-2xl">Rp.0</p>
            </div>
            <div className="space-y-2">
              <h2>Total Pengeluaran (Expense)</h2>
              <p className="text-lg font-bold md:text-2xl">Rp.0</p>
            </div>
            <div className="space-y-2">
              <h2>Sisa Saldo Bersih (Net Balance)</h2>
              <p className="text-lg font-bold md:text-2xl">Rp.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
