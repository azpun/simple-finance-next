import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteBudget } from "@/hooks/useDeleteBudget";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: string;
};

const DeleteBudgetModal = ({ isOpen, setIsOpen, selectedItem }: Props) => {
  const id: string = selectedItem;

  const { mutateAsync, isPending } = useDeleteBudget();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning!</DialogTitle>
        </DialogHeader>
        Are you sure you want to delete this budget?
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              toast.promise(
                mutateAsync(id, {
                  onSuccess: () => {
                    setIsOpen(false);
                  },
                  onError: error => {
                    console.error("Error deleting budget", error.message);
                  },
                }),
                {
                  loading: "Deleting budget...",
                  success: "Budget deleted successfully",
                  error: "Error deleting budget",
                  duration: 5000,
                  position: "top-center",
                },
              );
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBudgetModal;
