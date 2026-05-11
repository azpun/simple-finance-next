// app/(dashboard)/transactions/TransactionContent.tsx
"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useIsMobile } from "@/hooks/use-mobile";

import { TransactionData } from "@/validations/transaction.validate";

import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";
import { DropdownMenuTransaction } from "./DropdownMenuTransaction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UpdateTransactionDialog } from "@/components/common/UpdateTransactionDialog";
import { fetchDataTransactions } from "@/lib/api/transaction";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { FilterSelectContent } from "./FilterSelectContent";
import { SearchBox } from "./SearchBox";
import { useInput } from "@/hooks/useInput";
import { useDebounce } from "@/hooks/useDebounce";

type Category = {
  name: string;
};

export default function TransactionContent() {
  const isMobile = useIsMobile();

  // Modal Delete
  const [open, setOpen] = useState(false);

  // Modal Update
  const [openUpdate, setOpenUpdate] = useState(false);

  // untuk mengirim id transaksi ke modal/dialog
  const [selectedItem, setSelectedItem] = useState<string>("");

  // untuk filter
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // untuk search
  const [value, onChange] = useInput();

  // untuk efek debounce saat search
  const debounceValue = useDebounce(value, 1000);

  const { data: result, isLoading } = useQuery<TransactionData>({
    queryKey: ["transactions", debounceValue],
    queryFn: () => fetchDataTransactions(debounceValue),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { mutateAsync: deleteTransaction, isPending } = useDeleteTransaction();

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
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {filteredResult?.length === 0 && (
            <p className="p-2 text-center">No transaction found</p>
          )}
          {isLoading && <p>Loading...</p>}
          {filteredResult?.map(transaction => (
            <Card
              key={transaction.id}
              className="flex flex-row items-center justify-between p-6 mx-0"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg">{transaction.title}</h3>
                <p className="capitalize">{transaction.category.name}</p>
                <p>Rp.{transaction.amount.toLocaleString("id-ID")}</p>
                <p>{transaction.type}</p>
                <p>
                  {new Date(transaction.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <DropdownMenuTransaction
                  setOpen={setOpen}
                  setOpenUpdate={setOpenUpdate}
                  setSelectedItem={setSelectedItem}
                  transaction={transaction}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative overflow-x-auto border rounded-md shadow-xs">
          <table className="w-full text-sm text-left table-auto text-body lg:table-fixed">
            <thead className="border-b border-defult bg-secondary">
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
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {filteredResult?.map(transaction => (
                <tr key={transaction.id} className="p-2 text-sm">
                  <td className="px-6 py-4">{transaction.title}</td>
                  <td className="px-6 py-4 capitalize">
                    {transaction.category.name}
                  </td>
                  <td className="px-6 py-4">
                    Rp.{transaction.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">{transaction.type}</td>
                  <td className="px-6 py-4">
                    {new Date(transaction.updatedAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenuTransaction
                      setOpen={setOpen}
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning!</DialogTitle>
          </DialogHeader>
          Are you sure you want to delete this transaction?
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                deleteTransaction(selectedItem, {
                  onSuccess: () => {
                    toast.success("Transaction deleted successfully", {
                      duration: 4000,
                      position: "top-center",
                    });
                    setOpen(false);
                  },
                  onError: () => {
                    toast.error("Failed to delete transaction", {
                      duration: 5000,
                      position: "top-center",
                    });
                  },
                })
              }
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UpdateTransactionDialog
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        selectedItemForUpdate={selectedItem}
      />
    </>
  );
}
