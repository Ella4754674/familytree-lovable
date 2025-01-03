import { useState } from "react";
import { FamilyMember, FamilyRelations } from "@/types/family";
import { SearchBar } from "./SearchBar";
import { FamilyCard } from "./FamilyCard";

// Sample data - replace with your actual data source
const sampleFamilyMember: FamilyMember = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  birthDate: "1980-01-01",
};

const sampleRelations: FamilyRelations = {
  spouses: [],
  children: [],
  parents: [],
  siblings: [],
};

export const FamilyTree = () => {
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([sampleFamilyMember]);

  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-family-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8 text-family-primary">
          Family Tree
        </h1>
        
        <SearchBar onSearch={handleSearch} />

        <div className="space-y-6">
          {searchResults.map((member) => (
            <FamilyCard
              key={member.id}
              member={member}
              relations={sampleRelations}
            />
          ))}
        </div>
      </div>
    </div>
  );
};