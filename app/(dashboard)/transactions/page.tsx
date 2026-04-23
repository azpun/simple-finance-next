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

  const dummyData = [
    {
      id: 1,
      amount: 1000,
      title: "Transaction 1",
      description: "Description 1",
      type: "INCOME",
      date: "2023-01-01",
      categoryId: 1,
      category: "Category 1",
      userId: 1,
      createdAt: "2023-01-01",
    },
    {
      id: 2,
      amount: 2000,
      title: "Transaction 2",
      description: "Description 2",
      type: "EXPENSE",
      date: "2023-01-02",
      categoryId: 2,
      category: "Category 1",
      userId: 1,
      createdAt: "2023-01-02",
    },
    {
      id: 3,
      amount: 3000,
      title: "Transaction 3",
      description: "Description 3",
      type: "INCOME",
      date: "2023-01-03",
      categoryId: 1,
      category: "Category 1",
      userId: 1,
      createdAt: "2023-01-03",
    },
  ];
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
          {dummyData.map(transaction => (
            <Card
              key={transaction.id}
              className="flex flex-row items-center justify-between p-6"
            >
              <div>
                <h3>{transaction.title}</h3>
                <p>{transaction.category}</p>
              </div>
              <div>
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
            {dummyData.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.title}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
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
