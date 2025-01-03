import { useState } from "react";
import { format, differenceInYears } from "date-fns";
import { ChevronDown, ChevronUp, User, Heart, Users, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
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

  const RelationshipSection = ({ title, icon: Icon, members, type }: {
    title: string;
    icon: any;
    members: FamilyMember[];
    type: "spouse" | "child" | "parent" | "sibling";
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-family-primary" size={20} />
        <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {members.map((relative) => (
          <div key={relative.id} className="flex items-center justify-between p-2 bg-family-background rounded-lg">
            <div className="flex items-center gap-2">
              <User size={16} className="text-family-secondary" />
              <span className="text-sm">
                {relative.firstName} {relative.lastName}
              </span>
            </div>
            {relative.birthDate && (
              <span className="text-xs text-gray-500">
                גיל: {getAge(relative.birthDate)}
              </span>
            )}
          </div>
        ))}
        <AddFamilyMember
          existingMember={member}
          relationship={type}
          onAdd={handleAddRelation(type)}
        />
      </div>
    </div>
  );

  return (
    <Card className={`w-full transition-all duration-200 ${isExpanded ? "animate-card-expand" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-family-accent flex items-center justify-center">
            <User className="text-family-primary" size={24} />
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
        <CardContent className="p-4 pt-0 space-y-6">
          {member.birthDate && (
            <div className="p-3 bg-family-background rounded-lg">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">תאריך לידה</h4>
              <p className="text-sm">{formatDate(member.birthDate)}</p>
            </div>
          )}

          {relations.spouses.length > 0 && (
            <RelationshipSection
              title="בן/בת זוג"
              icon={Heart}
              members={relations.spouses}
              type="spouse"
            />
          )}

          {relations.children.length > 0 && (
            <RelationshipSection
              title="ילדים"
              icon={ArrowDownCircle}
              members={relations.children}
              type="child"
            />
          )}

          {relations.parents.length > 0 && (
            <RelationshipSection
              title="הורים"
              icon={ArrowUpCircle}
              members={relations.parents}
              type="parent"
            />
          )}

          {relations.siblings.length > 0 && (
            <RelationshipSection
              title="אחים/אחיות"
              icon={Users}
              members={relations.siblings}
              type="sibling"
            />
          )}

          {!isExpanded && (
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
          )}
        </CardContent>
      )}
    </Card>
  );
};