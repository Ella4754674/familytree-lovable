import { useState } from "react";
import { format, differenceInYears } from "date-fns";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FamilyMember, FamilyRelations } from "@/types/family";
import { AddFamilyMember } from "./AddFamilyMember";

interface FamilyCardProps {
  member: FamilyMember;
  relations: FamilyRelations;
  expanded?: boolean;
  onAddRelation: (member: FamilyMember, relation: string, relatedMember: FamilyMember) => void;
}

export const FamilyCard = ({ member, relations, expanded = false, onAddRelation }: FamilyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const age = differenceInYears(new Date(), new Date(birthDate));
    return age;
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy");
  };

  const handleAddRelation = (relation: "spouse" | "child" | "parent" | "sibling") => {
    return (newMember: FamilyMember) => {
      onAddRelation(member, relation, newMember);
    };
  };

  return (
    <Card className={`w-full max-w-md mx-auto transition-all duration-200 ${isExpanded ? "animate-card-expand" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-family-accent flex items-center justify-center">
            <User className="text-family-primary" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold">
              {member.firstName} {member.lastName}
            </h3>
            {member.birthDate && (
              <p className="text-sm text-gray-600">
                גיל: {getAge(member.birthDate)}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {member.birthDate && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">תאריך לידה</h4>
                <p>{formatDate(member.birthDate)}</p>
              </div>
            )}

            <div className="space-y-2">
              <AddFamilyMember
                existingMember={member}
                relationship="spouse"
                onAdd={handleAddRelation("spouse")}
              />
              <AddFamilyMember
                existingMember={member}
                relationship="child"
                onAdd={handleAddRelation("child")}
              />
              <AddFamilyMember
                existingMember={member}
                relationship="parent"
                onAdd={handleAddRelation("parent")}
              />
              <AddFamilyMember
                existingMember={member}
                relationship="sibling"
                onAdd={handleAddRelation("sibling")}
              />
            </div>

            {relations.spouses.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">בני/בנות זוג</h4>
                <ul className="mt-1 space-y-1">
                  {relations.spouses.map((spouse) => (
                    <li key={spouse.id} className="text-sm">
                      {spouse.firstName} {spouse.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relations.children.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">ילדים</h4>
                <ul className="mt-1 space-y-1">
                  {relations.children.map((child) => (
                    <li key={child.id} className="text-sm">
                      {child.firstName} {child.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relations.parents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">הורים</h4>
                <ul className="mt-1 space-y-1">
                  {relations.parents.map((parent) => (
                    <li key={parent.id} className="text-sm">
                      {parent.firstName} {parent.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relations.siblings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">אחים/אחיות</h4>
                <ul className="mt-1 space-y-1">
                  {relations.siblings.map((sibling) => (
                    <li key={sibling.id} className="text-sm">
                      {sibling.firstName} {sibling.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};