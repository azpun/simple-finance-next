import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: string;
};

const DeleteBudgetModal = ({ isOpen, setIsOpen, selectedItem }: Props) => {
  const id: string = selectedItem;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Warning!</DialogTitle>
        </DialogHeader>
        Are you sure you want to delete this budget?
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              // disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            // disabled={isPending}
            // onClick={() => deleteTransaction(selectedItem)}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBudgetModal;
