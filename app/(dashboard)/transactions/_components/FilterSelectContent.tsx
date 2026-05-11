"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  name: string;
};

export const FilterSelectContent = ({
  uniqueAvailableCategories,
  setFilterCategory,
  setFilterType,
  filterCategory,
  filterType,
}: {
  uniqueAvailableCategories: Category[];
  setFilterCategory: (category: string) => void;
  setFilterType: (type: string) => void;
  filterCategory: string;
  filterType: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div>Type:</div>

        <Select
          onValueChange={(value: string) => {
            setFilterType(value);
          }}
          value={filterType}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={filterType} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <div>Category:</div>

        <Select
          onValueChange={value => {
            setFilterCategory(value);
          }}
          value={filterCategory}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={filterCategory} />
          </SelectTrigger>
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
