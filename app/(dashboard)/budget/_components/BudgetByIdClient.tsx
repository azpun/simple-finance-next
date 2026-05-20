"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchDataBudgetById } from "@/lib/api/budget";
import { DataBudgetDescOptionalType } from "@/validations/budget.validation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddBudgetCategory } from "./AddBudgetCategory";
import { RemappedData } from "@/validations/budgetCategories.validation";
import { Progress } from "@/components/ui/progress";

const BudgetByIdClient = ({ budgetId }: { budgetId: string }) => {
  const isMobile = useIsMobile();
  const id = budgetId;
  const { data: dataBudget } = useQuery<DataBudgetDescOptionalType>({
    queryKey: ["budget", id],
    queryFn: () => fetchDataBudgetById(id),
  });

  const { data: dataBudgetCategories } = useQuery<RemappedData[]>({
    queryKey: ["budget-categories", id],
    queryFn: async () => {
      const response = await fetch(`/api/budget-categories/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      const data: RemappedData[] = result.data;

      return data;
    },
  });

  if (dataBudget === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
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
      <div className="px-4 space-x-1"></div>
      <AddBudgetCategory budgetId={id} />
      <div>
        <div className="mx-4 mb-4">
          <h1 className="text-xl font-bold md:text-2xl">
            Budget Category List
          </h1>
        </div>
        <div className="space-y-4">
          {dataBudgetCategories?.length === 0 ||
          dataBudgetCategories === undefined ? (
            <Card>
              <CardHeader className="my-2">
                <h2 className="text-lg font-bold md:text-xl">
                  No budget category found
                </h2>
              </CardHeader>
            </Card>
          ) : (
            <>
              {dataBudgetCategories?.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="">
                    <h2 className="text-lg font-bold capitalize md:text-xl">
                      {category.categoryName}
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <p>
                        Rp.
                        {(category.categorySumAmount ?? 0).toLocaleString(
                          "id-ID",
                        )}{" "}
                        dari Rp.
                        {category.amountBudgetCategory.toLocaleString(
                          "id-ID",
                        )}{" "}
                        digunakan
                      </p>
                      <p>({category.categoryUsegePercentage.value ?? 0}%)</p>
                    </div>
                    <div>
                      <Progress
                        value={category.categoryUsegePercentage.value}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetByIdClient;
