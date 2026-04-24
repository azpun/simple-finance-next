"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Transaction } from "@/types/transactions";

import { useQuery } from "@tanstack/react-query";
import { MoreHorizontalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Transactions() {
  const { status } = useSession();
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const isMobile = useIsMobile();

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/transactions`);
      const result = await response.json();

      result.data = result.data.map((transaction: Transaction) => {
        return {
          ...transaction,
          date: new Date(transaction.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });

  return (
    <div>
      <div className="p-6 md:flex md:justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl">Transactions</h1>
          <p className="tracking-tight text-balance">
            Here&apos;s your transaction list
          </p>
        </div>
        <div className="hidden md:block">
          <Button className="mt-6 hover:bg-primary/80">Add Transaction</Button>
        </div>
      </div>

      <div className="p-6">This is for Filter and Search</div>

      {isMobile ? (
        <div className="flex flex-col gap-4">
          {transactions?.map(transaction => (
            <Card
              key={transaction.id}
              className="flex flex-row items-center justify-between p-6"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg">{transaction.title}</h3>
                <p>{transaction.category.name}</p>
                <p>Rp. {transaction.amount}</p>
              </div>

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-14">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <table className="w-full border border-slate-700">
          <thead className="">
            <tr className="text-left bg-slate-700">
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions?.map(transaction => (
              <tr key={transaction.id} className="p-2 text-sm">
                <td>{transaction.title}</td>
                <td className="capitalize">{transaction.category.name}</td>
                <td>Rp.{transaction.amount}</td>
                <td className="">{transaction.type}</td>
                <td>{transaction.date}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-10">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
