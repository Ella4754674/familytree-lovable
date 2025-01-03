import { AddFamilyMember } from "./AddFamilyMember";
import { SearchBar } from "./SearchBar";
import { FamilyMember } from "@/types/family";

interface FamilyTreeHeaderProps {
  onAddMember: (member: FamilyMember) => void;
  onSearch: (query: string) => void;
}

export const FamilyTreeHeader = ({ onAddMember, onSearch }: FamilyTreeHeaderProps) => {
  return (
    <>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8 text-family-primary">
        עץ המשפחה שלי
      </h1>
      
      <div className="mb-6">
        <AddFamilyMember onAdd={onAddMember} />
      </div>

      <SearchBar onSearch={onSearch} />
    </>
  );
};