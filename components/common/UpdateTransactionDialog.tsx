import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  UpdateTransactionInputType,
  updateTransactionSchema,
} from "@/validations/transaction.validate";

import { useEffect } from "react";

type Props = {
  openUpdate: boolean;
  setOpenUpdate: (openUpdate: boolean) => void;
  selectedItemForUpdate: string;
};

export const UpdateTransactionDialog = ({
  openUpdate,
  setOpenUpdate,
  selectedItemForUpdate,
}: Props) => {
  const id = selectedItemForUpdate as string;

  const { data: result } = useQuery<UpdateTransactionInputType>({
    queryKey: ["transactions", id],
    queryFn: async id => {
      const response = await fetch(`/api/transactions/${id.queryKey[1]}`);

      const result = await response.json();
      const data: UpdateTransactionInputType = result.data;

      if (!result.success) {
        throw new Error(result.message);
      }

      return data;
    },
    enabled: !!id,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateTransactionInputType>({
    resolver: zodResolver(updateTransactionSchema),
  });

  useEffect(() => {
    if (result) {
      reset(result);
    }
  }, [result, reset]);
  const onSubmit: SubmitHandler<UpdateTransactionInputType> = async data => {
    // const userId = session?.user?.id as string;
    // const dataWithUserId = { ...data, userId };
    console.log(data);
  };

  return (
    <>
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      name="title"
                      type="text"
                      value={field.value ?? ""}
                      placeholder="Watch a Movie"
                      className={`${errors.title ? "border-2 border-red-500" : ""}`}
                      aria-invalid={errors.title ? "true" : "false"}
                    />
                  )}
                />
                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="description"
                      name="description"
                      type="text"
                      value={field.value ?? ""}
                      placeholder="Watch a Movie at Home with Friends"
                      className={`${
                        errors.description ? "border-2 border-red-500" : ""
                      }`}
                      aria-invalid={errors.description ? "true" : "false"}
                    />
                  )}
                />
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="amount"
                      name="amount"
                      placeholder="35000"
                      type="number"
                      value={field.value ?? 0}
                      // walaupun type number, outputnya string. Jadi diubah ke number
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`${
                        errors.amount ? "border-2 border-red-500" : ""
                      }`}
                      aria-invalid={errors.amount ? "true" : "false"}
                    />
                  )}
                />
                {errors.amount && (
                  <FieldError>{String(errors.amount.message)}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      // {...field}
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="Expense">Expense</SelectItem>
                          <SelectItem value="Income">Income</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <FieldError>{errors.type.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="category"
                      name="category"
                      placeholder="Food"
                      value={field.value?.name || ""}
                      onChange={e => {
                        field.onChange({ name: e.target.value });
                      }}
                    />
                  )}
                />
                {errors.category && (
                  <FieldError>{errors.category.message}</FieldError>
                )}
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
    </>
  );
};
