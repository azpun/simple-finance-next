import { Progress } from "@/components/ui/progress";
import { DataBudgetWitStatsType } from "@/validations/budget.validation";

import { Circle } from "lucide-react";

type Prop = {
  dataBudget: DataBudgetWitStatsType;
};

const MobileCardContent = ({ dataBudget }: Prop) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex text-muted-foreground">
        <p>
          Rp. {dataBudget.totalExpense.amount.toLocaleString("id-ID")} / Rp.{" "}
          {dataBudget?.totalAmount.toLocaleString("id-ID")}
        </p>
        <p className="ml-auto">
          {dataBudget.percentageUsage.toPrecision(3)}% Usage
        </p>
      </div>
      <Progress
        value={dataBudget.percentageUsage}
        className="w-full h-2 my-2"
      />
      {(dataBudget.percentageUsage ?? 0) > 100 && (
        <div className="flex items-center gap-2">
          <Circle fill="red" className="w-4 h-4 text-red-500" />
          <span>Over Budget</span>
        </div>
      )}

      {(dataBudget.percentageUsage ?? 0) >= 81 &&
        (dataBudget.percentageUsage ?? 0) <= 100 && (
          <div className="flex items-center gap-2">
            <Circle fill="red" className="w-4 h-4 text-red-500" />
            <span>Danger</span>
          </div>
        )}

      {(dataBudget.percentageUsage ?? 0) >= 51 &&
        (dataBudget.percentageUsage ?? 0) <= 80 && (
          <div className="flex items-center gap-2">
            <Circle fill="yellow" className="w-4 h-4 text-yellow-500" />
            <span>Warning</span>
          </div>
        )}

      {(dataBudget.percentageUsage ?? 0) >= 0 &&
        (dataBudget.percentageUsage ?? 0) <= 50 && (
          <div className="flex items-center gap-2">
            <Circle fill="green" className="w-4 h-4 text-green-500" />
            <span>Good</span>
          </div>
        )}
    </div>
  );
};

export default MobileCardContent;
