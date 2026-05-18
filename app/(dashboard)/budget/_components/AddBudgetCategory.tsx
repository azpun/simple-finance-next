"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchDataTransactions } from "@/lib/api/transaction";
import { TransactionData } from "@/validations/transaction.validate";
import { useQuery } from "@tanstack/react-query";

type Category = {
  name: string;
};

export const AddBudgetCategory = ({ budgetId }: { budgetId: string }) => {
  const { data: result } = useQuery<TransactionData>({
    queryKey: ["transactions"],
    queryFn: () => fetchDataTransactions(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  const availableCategories = (): Category[] => {
    const expenseCategories = result?.filter(item => item.type === "Expense");

    const uniqueAvailableCategories = [
      ...new Map(
        expenseCategories?.map(item => [item.category.name, item.category]),
      ).values(),
    ];

    if (uniqueAvailableCategories.length === 0) {
      return [{ name: "No category" }];
    }

    return uniqueAvailableCategories;
  };
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
          <div>
            <form className="space-y-3">
              <div>
                <label htmlFor="category">Category</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {availableCategories().map(item => (
                        <SelectItem
                          className="capitalize"
                          key={item.name}
                          value={item.name}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <Input type="text" placeholder="Enter amount" />
              </div>
            </form>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
