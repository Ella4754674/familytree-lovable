export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  spouses?: Spouse[];
  parents?: string[];
  children?: string[];
  siblings?: string[];
}

export interface Spouse {
  id: string;
  marriageDate?: string;
  divorceDate?: string;
  children?: string[];
}

export interface FamilyRelations {
  spouses: FamilyMember[];
  children: FamilyMember[];
  parents: FamilyMember[];
  siblings: FamilyMember[];
}