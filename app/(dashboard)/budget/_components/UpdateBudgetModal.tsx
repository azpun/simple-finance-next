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
import useUpdateBudget from "@/hooks/useUpdateBudget";
import fetchDataBudgetById from "@/lib/api/budget";
import {
  CreateBudgetInputType,
  createBudgetSchema,
} from "@/validations/budget.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: string;
};

const UpdateBudgetModal = ({ isOpen, setIsOpen, selectedItem }: Props) => {
  const budgetId: string = selectedItem;

  const { mutateAsync } = useUpdateBudget();

  const { data: fillFormData } = useQuery({
    queryKey: ["budget", budgetId],
    queryFn: () => fetchDataBudgetById(budgetId),
    enabled: !!budgetId,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createBudgetSchema),
  });

  useEffect(() => {
    if (fillFormData) {
      reset(fillFormData);
    }
  }, [fillFormData, reset]);

  const onSubmit: SubmitHandler<CreateBudgetInputType> = data => {
    console.log(data);
    // toast.promise(
    //   mutateAsync(data, {
    //     onSuccess: () => {
    //       setIsOpen(false);
    //     },
    //     onError: error => {
    //       console.error("Error updating budget", error.message);
    //     },
    //   }),
    //   {
    //     loading: "Updating budget...",
    //     success: "Budget updated successfully",
    //     error: "Failed to update budget",
    //     duration: 5000,
    //     position: "top-center",
    //   },
    // );
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    console.log("ERROR NIH", errors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
          <DialogDescription>Make changes to your budget</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                      value={field.value ?? ""}
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
                <label htmlFor="year" className={errors.year && "text-red-400"}>
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
  );
};

export default UpdateBudgetModal;
