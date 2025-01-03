import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FamilyMember } from "@/types/family";

interface AddFamilyMemberProps {
  onAdd: (member: FamilyMember) => void;
  existingMember?: FamilyMember;
  relationship?: "spouse" | "child" | "parent" | "sibling";
}

export const AddFamilyMember = ({ onAdd, existingMember, relationship }: AddFamilyMemberProps) => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      birthDate: birthDate || undefined,
    };

    onAdd(newMember);
    setOpen(false);
    setFirstName("");
    setLastName("");
    setBirthDate("");
    
    toast({
      title: "הצלחה",
      description: "בן המשפחה נוסף בהצלחה",
    });
  };

  const relationshipText = {
    spouse: "בן/בת זוג",
    child: "ילד/ה",
    parent: "הורה",
    sibling: "אח/ות",
  }[relationship!] || "";

  const getDialogTitle = () => {
    if (!existingMember) return "הוספת בן משפחה חדש";
    return `הוספת ${relationshipText} ל${existingMember.firstName}`;
  };

  const getButtonText = () => {
    if (!existingMember) return "הוסף בן משפחה חדש";
    return `הוסף ${relationshipText}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">שם פרטי</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">שם משפחה</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">תאריך לידה</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            הוסף
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};