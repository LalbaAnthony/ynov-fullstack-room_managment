"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentTable } from "@/components/admin/student-table";
import { AddStudentForm } from "@/components/admin/add-student-form";
import { toast } from "react-hot-toast";

import { mockStudents } from "@/lib/mockStudents";
import { Student } from "@/types/students";

export default function Students() {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const handleAddStudent = (newStudent: Student) => {
    console.log("Adding student:", newStudent);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    toast.success("Élève ajouté avec succès !");
    setIsAddStudentModalOpen(false);
  };

  const handleXmlImport = () => {
    toast("Fonctionnalité d'import XML à implémenter...");
    console.log("XML Import clicked!");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Élèves</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsAddStudentModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un élève
          </Button>
          <Button variant="outline" onClick={handleXmlImport}>
            <Upload className="mr-2 h-4 w-4" /> Importer XML
          </Button>
        </div>
      </div>

      <StudentTable students={students} />

      <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel élève</DialogTitle>
          </DialogHeader>
          <AddStudentForm onAddStudent={handleAddStudent} />
        </DialogContent>
      </Dialog>
    </div>
  );
}