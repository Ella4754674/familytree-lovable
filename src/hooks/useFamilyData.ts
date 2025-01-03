import { useState, useEffect } from "react";
import { FamilyMember } from "@/types/family";

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

export const useFamilyData = () => {
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { members: [], relations: {} };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(familyData));
  }, [familyData]);

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
  };

  const handleAddRelation = (member: FamilyMember, relation: string, relatedMember: FamilyMember) => {
    setFamilyData((prev) => {
      const newRelations = { ...prev.relations };
      
      if (!newRelations[member.id]) {
        newRelations[member.id] = {
          spouses: [],
          children: [],
          parents: [],
          siblings: [],
        };
      }
      
      if (!newRelations[relatedMember.id]) {
        newRelations[relatedMember.id] = {
          spouses: [],
          children: [],
          parents: [],
          siblings: [],
        };
      }

      const reciprocalRelations: Record<string, string> = {
        spouse: "spouses",
        child: "parents",
        parent: "children",
        sibling: "siblings",
      };

      const reciprocalRelation = reciprocalRelations[relation];

      if (!reciprocalRelation) {
        console.error("Invalid relation type:", relation);
        return prev;
      }

      if (!newRelations[member.id][relation]?.includes(relatedMember.id)) {
        newRelations[member.id][relation] = [
          ...(newRelations[member.id][relation] || []),
          relatedMember.id
        ];
      }

      if (!newRelations[relatedMember.id][reciprocalRelation]?.includes(member.id)) {
        newRelations[relatedMember.id][reciprocalRelation] = [
          ...(newRelations[relatedMember.id][reciprocalRelation] || []),
          member.id
        ];
      }

      const updatedMembers = prev.members.find(m => m.id === relatedMember.id)
        ? prev.members
        : [...prev.members, relatedMember];

      return {
        members: updatedMembers,
        relations: newRelations,
      };
    });
  };

  const getRelations = (memberId: string) => {
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

  return {
    familyData,
    handleAddMember,
    handleAddRelation,
    getRelations,
  };
};