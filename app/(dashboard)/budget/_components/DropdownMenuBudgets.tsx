"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormattedDataBudgetType } from "@/validations/budget.validation";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  data: FormattedDataBudgetType;
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
      {data.map((item, index) => (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-14">
              <MoreHorizontalIcon />
              <span className="sr-only">Open Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Link href={`/budget/${item.id}`}>
              <DropdownMenuItem>Detail</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                setSelectedItem(item.id);
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
                setSelectedItem(item.id);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </>
  );
};
