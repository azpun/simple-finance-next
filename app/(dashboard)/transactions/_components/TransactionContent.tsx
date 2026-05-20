// app/(dashboard)/transactions/TransactionContent.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionData } from "@/validations/transaction.validate";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DropdownMenuTransaction } from "./DropdownMenuTransaction";
import { Button } from "@/components/ui/button";
import { UpdateTransactionDialog } from "@/app/(dashboard)/transactions/_components/UpdateTransactionDialog";
import { fetchDataTransactions } from "@/lib/api/transaction";
import { FilterSelectContent } from "./FilterSelectContent";
import { SearchBox } from "./SearchBox";
import { useInput } from "@/hooks/useInput";
import { useDebounce } from "@/hooks/useDebounce";
import { DeleteTransactionDialog } from "./DeleteTransactionDialog";
import Link from "next/link";
import { Dot, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

type Category = {
  name: string;
};

export default function TransactionContent() {
  const { status } = useSession();
  const isMobile = useIsMobile();
  // Modal Delete
  const [openDelete, setOpenDelete] = useState(false);
  // Modal Update
  const [openUpdate, setOpenUpdate] = useState(false);
  // untuk mengirim id transaksi ke modal/dialog
  const [selectedItem, setSelectedItem] = useState<string>("");
  // untuk filter
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  // untuk input search
  const [value, onChange] = useInput();
  // untuk efek debounce saat search
  const debounceValue = useDebounce(value, 1000);

  const { data: result, isLoading } = useQuery<TransactionData>({
    queryKey: ["transactions", debounceValue],
    queryFn: () => fetchDataTransactions(debounceValue),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const filteredResult = useMemo(() => {
    if (filterCategory === "all" && filterType === "all") {
      return result;
    } else if (filterCategory === "all" && filterType !== "all") {
      return result?.filter(item => item.type === filterType);
    } else if (filterCategory !== "all" && filterType === "all") {
      return result?.filter(item => item.category.name === filterCategory);
    } else {
      return result?.filter(
        item =>
          item.category.name === filterCategory && item.type === filterType,
      );
    }
  }, [filterType, filterCategory, result]);

  const availableCategories = (): Category[] => {
    const uniqueAvailableCategories = [
      ...new Map(
        result?.map(item => [item.category.name, item.category]),
      ).values(),
    ];

    if (uniqueAvailableCategories.length === 0) {
      return [{ name: "No category" }];
    }

    return uniqueAvailableCategories;
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-3 my-3 md:flex-row">
        <FilterSelectContent
          uniqueAvailableCategories={availableCategories()}
          setFilterCategory={setFilterCategory}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          filterType={filterType}
        />
        <SearchBox setValueSearch={onChange} />
      </div>
      {isLoading && <p>Loading...</p>}
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {filteredResult?.length === 0 && (
            <p className="p-2 text-center">No transaction found</p>
          )}
          {filteredResult?.map(transaction => (
            <Card key={transaction.id} className="mx-0">
              <div className="p-4 space-y-2">
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-lg font-semibold">
                      {transaction.title}
                    </h3>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <p>{transaction.type}</p>
                    <span>
                      <Dot />
                    </span>
                    <p className="capitalize">{transaction.category.name}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-2xl font-bold
                    ${transaction.type === "Expense" ? "text-red-400" : "text-green-400"}`}
                  >
                    Rp.{transaction.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.updatedAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </CardContent>
              </div>
              <CardFooter className="flex space-x-2">
                <Link className="flex-1" href={`/budget/${transaction.id}`}>
                  <Button variant="outline" className="w-full h-10">
                    Detail
                  </Button>
                </Link>
                <div className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-10"
                    onClick={e => {
                      e.preventDefault();
                      setOpenUpdate(true);
                      setSelectedItem(transaction.id);
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <div>
                  <Button
                    variant="destructive"
                    className="w-full h-10"
                    onClick={e => {
                      e.preventDefault();
                      setOpenDelete(true);
                      setSelectedItem(transaction.id);
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative overflow-x-auto border rounded-md shadow-xs">
          <table className="w-full text-sm text-left table-auto text-body lg:table-fixed">
            <thead className="border-b border-defult bg-zinc-300/20 dark:bg-zinc-300/10">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredResult?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    There is no transactions found
                  </td>
                </tr>
              )}
              {/* {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              )} */}
              {filteredResult?.map(transaction => (
                <tr key={transaction.id} className="p-2 text-sm">
                  <td className="px-6 py-3 font-semibold">
                    {transaction.title}
                  </td>
                  <td className="px-6 py-3 capitalize text-muted-foreground">
                    {transaction.category.name}
                  </td>
                  <td
                    className={`px-6 py-3 ${transaction.type === "Expense" ? "text-red-400 " : "text-green-400"}`}
                  >
                    Rp.{transaction.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(transaction.updatedAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <DropdownMenuTransaction
                      setOpen={setOpenDelete}
                      setOpenUpdate={setOpenUpdate}
                      setSelectedItem={setSelectedItem}
                      transaction={transaction}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeleteTransactionDialog
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        selectedItem={selectedItem}
      />
      <UpdateTransactionDialog
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        selectedItemForUpdate={selectedItem}
      />
    </>
  );
}
