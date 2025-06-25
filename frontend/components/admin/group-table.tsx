"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

import { Group } from "@/types/group";
import { Student } from "@/types/students";

interface GroupTableProps {
  groups: Group[];
  students: Student[];
}

export function GroupTable({ groups, students }: GroupTableProps) {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [currentGroupMembers, setCurrentGroupMembers] = useState<Student[]>([]);
  const [currentGroupName, setCurrentGroupName] = useState("");

  const handleViewMembers = (group: Group) => {
    setCurrentGroupName(group.name);
    const members = students.filter(student => group.members.includes(student.id));
    setCurrentGroupMembers(members);
    setIsMembersModalOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du Groupe</TableHead>
            <TableHead>Membres</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Salle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length > 0 ? (
            groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.members.length}</TableCell>
                <TableCell>{group.capacity}</TableCell>
                <TableCell>{group.roomId || "Non assignée"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewMembers(group)}
                    title={`Voir les membres du ${group.name}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Voir les membres</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Aucun groupe créé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isMembersModalOpen} onOpenChange={setIsMembersModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Membres du groupe : {currentGroupName}</DialogTitle>
            <DialogDescription>Liste des élèves assignés à ce groupe.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto mt-4 pr-2">
            {currentGroupMembers.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {currentGroupMembers.map(member => (
                  <li key={member.id}>{member.firstName} {member.lastName} ({member.email})</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Ce groupe n'a pas encore de membres.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}