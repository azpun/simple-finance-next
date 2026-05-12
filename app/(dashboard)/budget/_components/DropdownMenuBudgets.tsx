"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataBudgetDescOptionalType } from "@/validations/budget.validation";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  data: DataBudgetDescOptionalType;
  setSelectedItem: (id: string) => void;
  setUpdateModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
};

export const DropdownMenuBudgets = ({
  data,
  setSelectedItem,
  setUpdateModalOpen,
  setDeleteModalOpen,
}: Props) => {
  if (!data) {
    console.log("data not found");
    return null;
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-14">
            <MoreHorizontalIcon />
            <span className="sr-only">Open Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Link href={`/budget/${data.id}`}>
            <DropdownMenuItem>Detail</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              setSelectedItem(data.id);
              setUpdateModalOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={e => {
              e.preventDefault();
              setSelectedItem(data.id);
              setDeleteModalOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
