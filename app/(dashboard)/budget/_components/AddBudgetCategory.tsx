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
import { useAddBudgetCategory } from "@/hooks/useAddBudgetCategory";
import { fetchDataBudgetById } from "@/lib/api/budget";
import { FormValues } from "@/types/budgetCategories";
import { DataBudgetDescOptionalType } from "@/validations/budget.validation";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddBudgetCategory = ({ budgetId }: { budgetId: string }) => {
  const [open, setOpen] = useState(false);

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
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutateAsync, isPending } = useAddBudgetCategory();

  const onSubmit: SubmitHandler<FormValues> = data => {
    const newData = {
      budgetId: budgetId,
      categoryId: data.categoryId,
      amount: data.amount,
    };
    toast.promise(
      mutateAsync(newData, {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }),
      {
        loading: "Adding budget category...",
        success: "Budget category added successfully",
        error: "Failed to add budget category",
        duration: 5000,
        position: "top-center",
      },
    );
  };

  const {} = useQuery({
    queryKey: ["budget-categories"],
    queryFn: async () => {
      const response = await fetch("/api/budget-categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
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
                      disabled={isPending}
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
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
