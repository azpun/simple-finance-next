"use client";

import { ChartPieDonut } from "@/components/common/ChartPie";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isMobile = useIsMobile();

  // Check if the user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl">{`Hello... ${session?.user?.name}`}</h1>
      </div>
      <div className="flex flex-col gap-4 md:gap-7">
        {isMobile ? (
          <Card className="flex flex-col gap-6">
            <CardHeader>
              <h3 className="text-xl">Summary</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3>Monthly Budget</h3>
                <p className="text-xl font-bold">$1,000</p>
              </div>
              <div>
                <h3>Spend so far</h3>
                <p className="text-xl font-bold">$500</p>
              </div>
              <div>
                <h3>Remaining</h3>
                <p className="text-xl font-bold">$500</p>
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
                <p className="text-xl font-bold">$1,000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3>Spend so far</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">$500</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3>Remaining</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xl font-bold">$500</p>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-xl">Spending Breakdown</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div>
                <ChartPieDonut />
              </div>
              <div>
                <ul>
                  <li>Category 1</li>
                  <li>Category 2</li>
                  <li>Category 3</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-xl">Recent Transactions</h3>
            </CardHeader>
            <CardContent>
              <div>
                <ul>
                  <li>Transaction 1</li>
                  <li>Transaction 2</li>
                  <li>Transaction 3</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
