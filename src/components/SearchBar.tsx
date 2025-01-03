import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <Input
        type="text"
        placeholder="Search family members..."
        value={query}
        onChange={handleSearch}
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-family-primary focus:ring-2 focus:ring-family-accent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
};