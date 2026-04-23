// components/common/AddTransactionDialog.tsx
"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  CreateTransactionInputType,
  transactionSchema,
  validateResponseTransaction,
} from "@/validations/transaction.validate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AddTransactionDialog = () => {
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTransactionInputType>({
    defaultValues: {
      amount: 0,
      title: "",
      description: "",
      type: "EXPENSE",
      category: {
        name: "Not Set",
      },
    },
    resolver: zodResolver(transactionSchema),
  });

  const { push } = useRouter();

  const onSubmit: SubmitHandler<CreateTransactionInputType> = async data => {
    const userId = session?.user?.id as string;
    const dataWithUserId = { ...data, userId };
    const jsonData = JSON.stringify(dataWithUserId);
    // console.log();

    try {
      const promise = fetch("api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      }).then(async res => {
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message);
        }

        return json;
      });

      toast.promise(promise, {
        loading: "Creating transaction...",
        success: "Transaction created successfully",
        error: "Failed to create transaction",
      });

      const jsonResult = await promise;
      const parsedResponse = await validateResponseTransaction(jsonResult);

      if (!parsedResponse.success) {
        console.error(
          "Format response tidak sesuai:",
          parsedResponse.error.message,
        );
      }
      push("/dashboard");
      return parsedResponse.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild className="md:hidden">
        {/* Floating button for mobile */}
        <div className="fixed bottom-10 right-10 md:hidden">
          <Button
            type="button"
            className="font-bold text-white rounded-full size-18 bg-primary hover:bg-primary/80"
          >
            <PlusIcon />
          </Button>
        </div>
      </DialogTrigger>
      <DialogTrigger asChild className="hidden md:block">
        {/* Button for desktop */}
        <Button type="button" className="mt-6 hover:bg-primary/80">
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Make transaction to your account
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
                    placeholder="Watch a Movie"
                    className={`${errors.title ? "border-2 border-red-500" : ""}`}
                    aria-invalid={errors.title ? "true" : "false"}
                  />
                )}
              />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
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
                <FieldError>{errors.amount.message}</FieldError>
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
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
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
  );
};

export default AddTransactionDialog;
