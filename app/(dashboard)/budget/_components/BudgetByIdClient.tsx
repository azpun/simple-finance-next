"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import fetchDataBudgetById from "@/lib/api/budget";
import { DataBudgetType } from "@/validations/budget.validation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BudgetByIdClient = ({ budgetId }: { budgetId: string }) => {
  const isMobile = useIsMobile();
  const id = budgetId;
  const { data: dataBudget } = useQuery<DataBudgetType>({
    queryKey: ["budget", id],
    queryFn: () => fetchDataBudgetById(id),
  });

  if (dataBudget === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="my-4">
        <div className="mx-4 my-2">
          <Link href="/budget">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
        <CardHeader className="my-2">
          <h1 className="text-2xl font-bold md:text-3xl">Budget Details</h1>
        </CardHeader>
        <CardContent>
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-3">
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Budget Id</h3>
              <p>{dataBudget.id}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Month</h3>
              <p>{dataBudget.monthAndYear}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Amount</h3>
              <p>Rp.{dataBudget.totalAmount.toLocaleString("id-ID")}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Create At</h3>
              <p>
                {new Date(dataBudget.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Update At</h3>
              <p>
                {new Date(dataBudget.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Description</h3>
              <p>{dataBudget.description ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="px-4 space-x-1">
        <Button>Update</Button>
        <Button
          onClick={() => {
            alert("Comming Soon");
          }}
        >
          Add Budget Category
        </Button>
      </div>
    </div>
  );
};

export default BudgetByIdClient;
