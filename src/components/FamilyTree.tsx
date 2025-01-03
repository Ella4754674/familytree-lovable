import { useState, useEffect } from "react";
import { FamilyMember } from "@/types/family";
import { FamilyTreeHeader } from "./FamilyTreeHeader";
import { FamilyMembersList } from "./FamilyMembersList";
import { useFamilyData } from "@/hooks/useFamilyData";
import { useToast } from "@/components/ui/use-toast";

export const FamilyTree = () => {
  const { familyData, handleAddMember, handleAddRelation, getRelations } = useFamilyData();
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults(familyData.members);
      return;
    }

    const results = familyData.members.filter((member) =>
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddNewMember = (member: FamilyMember) => {
    handleAddMember(member);
    toast({
      title: "הצלחה",
      description: "בן המשפחה נוסף בהצלחה",
    });
  };

  const handleAddNewRelation = (member: FamilyMember, relation: string, relatedMember: FamilyMember) => {
    handleAddRelation(member, relation, relatedMember);
    toast({
      title: "הצלחה",
      description: "הקשר המשפחתי נוסף בהצלחה",
    });
  };

  useEffect(() => {
    setSearchResults(familyData.members);
  }, [familyData.members]);

  return (
    <div className="min-h-screen bg-family-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <FamilyTreeHeader 
          onAddMember={handleAddNewMember}
          onSearch={handleSearch}
        />
        
        <FamilyMembersList
          members={searchResults}
          getRelations={getRelations}
          onAddRelation={handleAddNewRelation}
        />
      </div>
    </div>
  );
};