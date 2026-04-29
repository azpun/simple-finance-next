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

import {
  TransactionData,
  TransactionResponse,
} from "@/validations/transaction.validate";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";
import { DropdownMenuTransaction } from "./DropdownMenuTransaction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UpdateTransactionDialog } from "@/components/common/UpdateTransactionDialog";

export default function TransactionContent() {
  const isMobile = useIsMobile();

  // Modal Delete
  const [open, setOpen] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  // untuk mengirim id transaksi ke modal/dialog
  const [selectedItem, setSelectedItem] = useState<string>("");

  const [selectedItemForUpdate, setSelectedItemForUpdate] =
    useState<string>("");

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

  const queryClient = useQueryClient();
  const { mutate: deleteTransaction, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
      toast.success("Transaction deleted successfully", { duration: 4000 });
      setSelectedItem("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete transaction", { duration: 5000 });
    },
  });

  return (
    <>
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
                  setSelectedItemForUpdate={setSelectedItemForUpdate}
                  transaction={transaction}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <table className="w-full border border-slate-700">
          <thead className="">
            <tr className="text-left text-white dark:text-white bg-slate-700">
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
                <td>Rp.{transaction.amount.toLocaleString("id-ID")}</td>
                <td className="">{transaction.type}</td>
                <td>
                  {new Date(transaction.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <DropdownMenuTransaction
                    setOpen={setOpen}
                    setOpenUpdate={setOpenUpdate}
                    setSelectedItem={setSelectedItem}
                    setSelectedItemForUpdate={setSelectedItemForUpdate}
                    transaction={transaction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              onClick={() => deleteTransaction(selectedItem)}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UpdateTransactionDialog
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        selectedItemForUpdate={selectedItemForUpdate}
      />
    </>
  );
}
