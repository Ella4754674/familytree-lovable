import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder="חפש בן משפחה..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full text-right"
      />
    </div>
  );
};