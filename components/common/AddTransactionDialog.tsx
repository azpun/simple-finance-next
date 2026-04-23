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
import { Field, FieldGroup, FieldLabel } from "../ui/field";
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

const AddTransactionDialog = () => {
  return (
    <Dialog>
      <form>
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
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" name="title" placeholder="Watch a Movie" />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                name="description"
                placeholder="Watch a Movie at Home with Friends"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                name="amount"
                placeholder="35000"
                type="number"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Select name="type">
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
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddTransactionDialog;
