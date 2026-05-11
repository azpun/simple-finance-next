import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBox = ({
  setValueSearch,
}: {
  setValueSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <span className="sr-only">Search</span>
      <div className="relative w-full">
        <Search className="absolute w-6 h-6 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name"
          className="pl-9"
          onChange={setValueSearch}
        />
      </div>
    </>
  );
};
