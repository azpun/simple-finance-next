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
import { fetchDataBudgetById } from "@/lib/api/budget";
import { DataBudgetDescOptionalType } from "@/validations/budget.validation";
import { useQuery } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  budgetId: string;
  categoryId: string;
  amount: number;
};

export const AddBudgetCategory = ({ budgetId }: { budgetId: string }) => {
  const { data: dataBudget } = useQuery<DataBudgetDescOptionalType>({
    queryKey: ["budget", budgetId],
    queryFn: () => fetchDataBudgetById(budgetId),
  });
  const expenseCategories = dataBudget?.categories.filter(
    item => item.type === "Expense",
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {
    const newData = {
      budgetId: budgetId,
      categoryId: data.categoryId,
      amount: data.amount,
    };
    console.log(newData);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="mx-4">
          <Button>Add Budget Category</Button>
        </DialogTrigger>
        <DialogContent>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold md:text-3xl">
                Add Budget Category
              </DialogTitle>
              <p className="tracking-tight text-balance">
                Here&apos;s your budget category list
              </p>
            </DialogHeader>
            <div>
              <div>
                <label htmlFor="category">Category</label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {expenseCategories?.map(item => (
                            <SelectItem
                              className="capitalize"
                              key={item.name}
                              value={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-red-500">{errors.categoryId.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="amount">Amount</label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`${
                        errors.amount ? "border-2 border-red-500" : ""
                      }`}
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-red-500">{errors.amount.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
