"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  setOpen: (open: boolean) => void;
  setOpenUpdate: (openUpdate: boolean) => void;
  setSelectedItem: (id: string) => void;
  setSelectedItemForUpdate: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any;
};

export const DropdownMenuTransaction = ({
  setOpen,
  setOpenUpdate,
  setSelectedItem,
  setSelectedItemForUpdate,
  transaction,
}: Props) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-14">
            <MoreHorizontalIcon />
            <span className="sr-only">Open Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/transactions/${transaction.id}`}>
            <DropdownMenuItem>Detail</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              setSelectedItemForUpdate(transaction.id);
              setOpenUpdate(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={e => {
              e.preventDefault();
              setSelectedItem(transaction.id);
              setOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
