// app/(dashboard)/transactions/[id]/TransactionByIdClient.tsx
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionTypes } from "@/validations/transaction.validate";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Prop = {
  initialData: TransactionTypes;
};

export const TransactionByIdClient = ({ initialData }: Prop) => {
  const isMobile = useIsMobile();
  return (
    <div>
      <Card className="my-4">
        <div className="mx-4 my-2">
          <Link href="/transactions">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
        <CardHeader className="my-2">
          <h1 className="text-2xl font-bold md:text-3xl">
            Transaction Details
          </h1>
        </CardHeader>
        <CardContent>
          <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-3">
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Transaction Id</h3>
              <p>{initialData.id}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Name</h3>
              <p>{initialData.title}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Amount</h3>
              <p>Rp.{initialData.amount.toLocaleString("id-ID")}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Type</h3>
              <p>{initialData.type}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Category</h3>
              <p>{initialData.category?.name}</p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
            <div className="flex flex-col gap-2 py-4">
              <h3 className="text-lg font-bold">Create At</h3>
              <p>
                {new Date(initialData.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator className={isMobile ? "block" : "hidden"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
