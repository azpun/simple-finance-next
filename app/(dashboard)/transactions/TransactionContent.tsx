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
      toast.success("Transaction deleted successfully", {
        duration: 4000,
        position: "top-center",
      });
      setSelectedItem("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete transaction", {
        duration: 5000,
        position: "top-center",
      });
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
              {result?.length === 0 && (
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
              {result?.map(transaction => (
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
        selectedItemForUpdate={selectedItem}
      />
    </>
  );
}
