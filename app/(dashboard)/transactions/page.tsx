"use client";
import AddTransactionDialog from "@/components/common/AddTransactionDialog";
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

import {
  TransactionData,
  TransactionResponse,
} from "@/validations/transaction.validate";

import { useQuery } from "@tanstack/react-query";
import { MoreHorizontalIcon } from "lucide-react";

export default function Transactions() {
  const isMobile = useIsMobile();

  const { data: result, isLoading } = useQuery<TransactionData>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/transactions`);
      const result: TransactionResponse = await response.json();
      const data: TransactionData = result.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      return data;
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
          <AddTransactionDialog />
        </div>
      </div>
      <div className="p-6">This is for Filter and Search</div>
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {result?.length === 0 && (
            <p className="p-2 text-center">No transaction found</p>
          )}
          {isLoading && <p>Loading...</p>}
          {result?.map(transaction => (
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
            {result?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-2 text-center">
                  There is no transactions found
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-2 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {result?.map(transaction => (
              <tr key={transaction.id} className="p-2 text-sm">
                <td>{transaction.title}</td>
                <td className="capitalize">{transaction.category.name}</td>
                <td>Rp.{transaction.amount}</td>
                <td className="">{transaction.type}</td>
                <td>
                  {new Date(transaction.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-10">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuItem>Detail</DropdownMenuItem>
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
