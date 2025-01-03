import { FamilyMember, FamilyRelations } from "@/types/family";
import { FamilyCard } from "./FamilyCard";

interface FamilyMembersListProps {
  members: FamilyMember[];
  getRelations: (memberId: string) => FamilyRelations;
  onAddRelation: (member: FamilyMember, relation: string, relatedMember: FamilyMember) => void;
}

export const FamilyMembersList = ({ members, getRelations, onAddRelation }: FamilyMembersListProps) => {
  return (
    <div className="space-y-6 mt-6">
      {members.map((member) => (
        <FamilyCard
          key={member.id}
          member={member}
          relations={getRelations(member.id)}
          onAddRelation={onAddRelation}
        />
      ))}
    </div>
  );
};