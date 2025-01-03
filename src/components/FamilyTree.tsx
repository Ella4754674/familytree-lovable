import { useState, useEffect } from "react";
import { FamilyMember, FamilyRelations } from "@/types/family";
import { SearchBar } from "./SearchBar";
import { FamilyCard } from "./FamilyCard";
import { AddFamilyMember } from "./AddFamilyMember";
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = "familyTreeData";

interface FamilyData {
  members: FamilyMember[];
  relations: Record<string, {
    spouses: string[];
    children: string[];
    parents: string[];
    siblings: string[];
  }>;
}

export const FamilyTree = () => {
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { members: [], relations: {} };
  });
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(familyData));
  }, [familyData]);

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

  const handleAddMember = (newMember: FamilyMember) => {
    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      relations: {
        ...prev.relations,
        [newMember.id]: {
          spouses: [],
          children: [],
          parents: [],
          siblings: [],
        },
      },
    }));
    setSearchResults((prev) => [...prev, newMember]);
  };

  const handleAddRelation = (member: FamilyMember, relation: string, relatedMember: FamilyMember) => {
    setFamilyData((prev) => {
      const newRelations = { ...prev.relations };
      
      // Add the relation in both directions
      if (!newRelations[member.id][relation].includes(relatedMember.id)) {
        newRelations[member.id][relation].push(relatedMember.id);
      }

      // Add reciprocal relation
      const reciprocalRelation = {
        spouse: "spouses",
        child: "parents",
        parent: "children",
        sibling: "siblings",
      }[relation];

      if (!newRelations[relatedMember.id][reciprocalRelation].includes(member.id)) {
        newRelations[relatedMember.id][reciprocalRelation].push(member.id);
      }

      return {
        members: [...prev.members, relatedMember],
        relations: newRelations,
      };
    });

    toast({
      title: "הצלחה",
      description: "הקשר המשפחתי נוסף בהצלחה",
    });
  };

  const getRelations = (memberId: string): FamilyRelations => {
    const memberRelations = familyData.relations[memberId] || {
      spouses: [],
      children: [],
      parents: [],
      siblings: [],
    };

    return {
      spouses: memberRelations.spouses.map((id) => 
        familyData.members.find((m) => m.id === id)!
      ),
      children: memberRelations.children.map((id) =>
        familyData.members.find((m) => m.id === id)!
      ),
      parents: memberRelations.parents.map((id) =>
        familyData.members.find((m) => m.id === id)!
      ),
      siblings: memberRelations.siblings.map((id) =>
        familyData.members.find((m) => m.id === id)!
      ),
    };
  };

  useEffect(() => {
    setSearchResults(familyData.members);
  }, [familyData.members]);

  return (
    <div className="min-h-screen bg-family-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8 text-family-primary">
          עץ המשפחה שלי
        </h1>
        
        <div className="mb-6">
          <AddFamilyMember onAdd={handleAddMember} />
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="space-y-6 mt-6">
          {searchResults.map((member) => (
            <FamilyCard
              key={member.id}
              member={member}
              relations={getRelations(member.id)}
              onAddRelation={handleAddRelation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};