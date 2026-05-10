"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

type Category = {
  name: string;
};

export const FilterSelectContent = ({
  uniqueAvailableCategories,
}: {
  uniqueAvailableCategories: Category[];
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div>Type:</div>
        <Select>
          <SelectTrigger>Type</SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <div>Category:</div>
        <Select>
          <SelectTrigger>Category</SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {uniqueAvailableCategories.map(category => (
                <SelectItem
                  className="capitalize"
                  key={category.name}
                  value={category.name}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
