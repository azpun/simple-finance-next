// app/(dashboard)/transactions/_components/DeleteTransactionDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: string;
};

export const DeleteTransactionDialog = ({
  isOpen: openDelete,
  setIsOpen: setOpenDelete,
  selectedItem,
}: Props) => {
  const { mutateAsync: deleteTransaction, isPending } = useDeleteTransaction();
  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
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
                  setOpenDelete(false);
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
  );
};
