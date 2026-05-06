import { Progress } from "@/components/ui/progress";
import { DashboardData } from "@/validations/dashboard.validation";
import { Circle } from "lucide-react";

type Prop = {
  dataDashboard: DashboardData;
};

const MobileCardContent = ({ dataDashboard }: Prop) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex ">
        <p>
          Rp.{" "}
          {dataDashboard?.operationsOf.sumOfExpansesThisMonth.toLocaleString(
            "id-ID",
          )}{" "}
          / Rp. {dataDashboard?.budget.totalAmount.toLocaleString("id-ID")}
        </p>
        <p className="ml-auto">
          ({dataDashboard?.operationsOf.percentageRemaining.toPrecision(1)}
          %)
        </p>
      </div>
      <Progress
        value={dataDashboard?.operationsOf.percentageRemaining}
        className="w-full h-2 my-2"
      />
      {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) < 50 && (
        <div className="flex items-center gap-2 ">
          <Circle fill="green" className="w-4 h-4 text-[#008000]" />
          <span>Good</span>
        </div>
      )}
      {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) >= 50 &&
        (dataDashboard?.operationsOf?.percentageRemaining ?? 0) <= 80 && (
          <div className="flex items-center gap-2 ">
            <Circle fill="yellow" className="w-4 h-4 text-yellow-500" />
            <span>Warning</span>
          </div>
        )}
      {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) > 80 &&
        (dataDashboard?.operationsOf?.percentageRemaining ?? 0) <= 100 && (
          <div className="flex items-center gap-2 ">
            <Circle fill="red" className="w-4 h-4 text-red-500" />
            <span>Danger</span>
          </div>
        )}
      {(dataDashboard?.operationsOf?.percentageRemaining ?? 0) > 100 && (
        <div className="flex items-center gap-2 ">
          <Circle fill="red" className="w-4 h-4 text-red-500" />
          <span>Over Budget</span>
        </div>
      )}
    </div>
  );
};

export default MobileCardContent;
