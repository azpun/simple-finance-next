"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
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
import {
  CreateBudgetInputType,
  createBudgetSchema,
} from "@/validations/budget.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAddBudget from "@/hooks/useAddBudget";
import { toast } from "sonner";

export const AddBudgetButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { mutateAsync } = useAddBudget();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBudgetSchema),
  });

  const onAddBudget: SubmitHandler<CreateBudgetInputType> = async data => {
    await toast.promise(
      mutateAsync(data, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: error => {
          console.error("Error creating budget", error.message);
        },
      }),
      {
        loading: "Creating budget...",
        success: "Create budget successful",
        error: (err: Error) => err.message,
        duration: 5000,
        position: "top-center",
      },
    );
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="fixed bottom-10 right-10 md:hidden">
          <Button
            type="button"
            className="font-bold text-white rounded-full size-18 bg-primary hover:bg-primary/80"
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild className="hidden md:block">
          <Button type="button" className="btn btn-primary">
            Add Budget
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>add your montly budget</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddBudget)}>
            <FieldGroup>
              <div className="box-border flex items-end gap-2">
                <Field>
                  <label
                    htmlFor="month"
                    className={errors.month && "text-red-400"}
                  >
                    Month
                  </label>
                  <Controller
                    control={control}
                    name="month"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        // {value =>
                        //   field.onChange(parseInt(value, 10))
                        // }
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`p-4.75 ${errors.month && "border-red-400"}`}
                        >
                          <SelectValue placeholder="Select a month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Month&apos;s</SelectLabel>
                            <SelectItem value="1">January</SelectItem>
                            <SelectItem value="2">February</SelectItem>
                            <SelectItem value="3">March</SelectItem>
                            <SelectItem value="4">April</SelectItem>
                            <SelectItem value="5">May</SelectItem>
                            <SelectItem value="6">June</SelectItem>
                            <SelectItem value="7">July</SelectItem>
                            <SelectItem value="8">August</SelectItem>
                            <SelectItem value="9">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.month && (
                    <span className={errors.month ? "text-red-400" : ""}>
                      {errors.month && <>{errors.month.message}</>}
                    </span>
                  )}
                </Field>
                <Field>
                  <label
                    htmlFor="year"
                    className={errors.year && "text-red-400"}
                  >
                    Year
                  </label>
                  <Controller
                    control={control}
                    name="year"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Select a year 2025 - 2100"
                        value={field.value ?? 0}
                        onChange={e => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        className={`${errors.year && "border-red-400"}`}
                      />
                    )}
                  />
                  {errors.year && (
                    <span className="text-red-400">{errors.year.message}</span>
                  )}
                </Field>
              </div>
              <Field>
                <label
                  htmlFor="totalAmount"
                  className={errors.totalAmount && "text-red-400"}
                >
                  Amount
                </label>
                <Controller
                  control={control}
                  name="totalAmount"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter amount"
                      value={field.value ?? 0}
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`${errors.year && "border-red-400"}`}
                    />
                  )}
                />
                {errors.totalAmount && (
                  <span className={errors.totalAmount ? "text-red-400" : ""}>
                    {errors.totalAmount && <>{errors.totalAmount.message}</>}
                  </span>
                )}
              </Field>
              <Field>
                <label htmlFor="description">Description</label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter description"
                      value={field.value ?? ""}
                    />
                  )}
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
