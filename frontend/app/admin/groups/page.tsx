"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

import { Group } from "@/types/group";
import { Student } from "@/types/students";
import { mockGroups } from "@/lib/mockGroups";
import { mockStudents } from "@/lib/mockStudents";

import { GroupTable } from "@/components/admin/group-table";
import { CreateGroupForm } from "@/components/admin/create-group-form";
import { Input } from "@/components/ui/input";

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAssignStudentsModalOpen, setIsAssignStudentsModalOpen] = useState(false);

  const unassignedStudents = useMemo(() => {
    return students.filter(student => !student.groupId);
  }, [students]);

  const getNextGroupName = () => {
    const lastGroup = groups.reduce((prev, current) => {
      const prevNum = parseInt(prev.name.match(/\d+/)?.[0] || '0');
      const currentNum = parseInt(current.name.match(/\d+/)?.[0] || '0');
      return prevNum > currentNum ? prev : current;
    }, { name: "Groupe 0" } as Group);

    const lastGroupNumber = parseInt(lastGroup.name.match(/\d+/)?.[0] || '0');
    return `Groupe ${lastGroupNumber + 1}`;
  };

  const handleCreateGroup = (newGroupData: { name: string; capacity: number; members: string[] }) => {
    const newGroupId = `g-${Date.now()}`;
    const newGroup: Group = {
      id: newGroupId,
      name: newGroupData.name,
      capacity: newGroupData.capacity,
      members: newGroupData.members,
    };

    setGroups(prevGroups => [...prevGroups, newGroup]);

    setStudents(prevStudents =>
      prevStudents.map(student =>
        newGroupData.members.includes(student.id)
          ? { ...student, groupId: newGroupId, group: newGroup.name }
          : student
      )
    );

    toast.success(`Groupe "${newGroup.name}" créé avec succès !`);
    setIsCreateGroupModalOpen(false);
  };

  const handleAutoAssignStudents = (numStudentsPerGroup: number) => {
    if (unassignedStudents.length === 0) {
      toast.loading("Aucun élève non assigné à répartir.");
      return;
    }

    const shuffledStudents = [...unassignedStudents].sort(() => 0.5 - Math.random());
    let currentStudentIndex = 0;
    let groupCounter = groups.length;

    const newGroups: Group[] = [];
    const updatedStudents: Student[] = [...students];

    while (currentStudentIndex < shuffledStudents.length) {
      groupCounter++;
      const groupName = `Groupe ${groupCounter}`;
      const newGroupId = `g-${Date.now() + groupCounter}`;

      const membersForThisGroup = shuffledStudents.slice(
        currentStudentIndex,
        currentStudentIndex + numStudentsPerGroup
      );

      const memberIds = membersForThisGroup.map(s => s.id);

      newGroups.push({
        id: newGroupId,
        name: groupName,
        members: memberIds,
        capacity: numStudentsPerGroup,
      });

      membersForThisGroup.forEach(member => {
        const studentIndex = updatedStudents.findIndex(s => s.id === member.id);
        if (studentIndex !== -1) {
          updatedStudents[studentIndex] = {
            ...updatedStudents[studentIndex],
            groupId: newGroupId,
            group: groupName,
          };
        }
      });

      currentStudentIndex += numStudentsPerGroup;
    }

    setGroups(prevGroups => [...prevGroups, ...newGroups]);
    setStudents(updatedStudents);
    toast.success(`${newGroups.length} nouveaux groupes créés et élèves répartis !`);
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Groupes</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsCreateGroupModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Créer un groupe (Manuel)
          </Button>
          <Button variant="outline" onClick={() => setIsAssignStudentsModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> Répartition automatique
          </Button>
        </div>
      </div>

      <GroupTable groups={groups} students={students} />

      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau groupe</DialogTitle>
          </DialogHeader>
          <CreateGroupForm
            initialGroupName={getNextGroupName()}
            unassignedStudents={unassignedStudents}
            onCreateGroup={handleCreateGroup}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignStudentsModalOpen} onOpenChange={setIsAssignStudentsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Répartition automatique des élèves</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Nombre d'élèves non assignés : <span className="font-bold">{unassignedStudents.length}</span>
            </p>
            {unassignedStudents.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Suggestion : Vous pouvez créer environ{" "}
                  <span className="font-bold">{Math.max(1, Math.ceil(unassignedStudents.length / 5))}</span> groupes de 5 élèves.
                </p>
                <div className="grid gap-2">
                  <label htmlFor="numStudents" className="text-sm font-medium">Élèves par groupe</label>
                  <Input
                    id="numStudents"
                    type="number"
                    min="1"
                    defaultValue="5"
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (value > 0) handleAutoAssignStudents(value);
                      }
                    }}
                  />
                </div>
                <Button className="w-full" onClick={() => {
                  const inputElement = document.getElementById("numStudents") as HTMLInputElement;
                  const value = parseInt(inputElement.value);
                  if (value > 0) handleAutoAssignStudents(value);
                  setIsAssignStudentsModalOpen(false);
                }}>
                  Répartir les élèves
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Tous les élèves sont déjà assignés à un groupe.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}