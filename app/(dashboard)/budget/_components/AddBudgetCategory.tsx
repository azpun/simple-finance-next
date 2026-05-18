import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddBudgetCategory = ({ budgetId }: { budgetId: string }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="mx-4">
          <Button
          // onClick={() => {
          //   alert("Comming Soon");
          // }}
          >
            Add Budget Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold md:text-3xl">
              Add Budget Category
            </DialogTitle>
            <p className="tracking-tight text-balance">
              Here&apos;s your budget category list
            </p>
          </DialogHeader>
          <div></div>
        </DialogContent>
      </Dialog>
    </>
  );
};
