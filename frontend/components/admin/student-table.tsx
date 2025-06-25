// components/admin/student-table.tsx
"use client"; // Important for client-side interactivity

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

import { Student } from "@/types/students";
import { Copy, RefreshCw } from "lucide-react";

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [studentToReset, setStudentToReset] = useState<Student | null>(null);
  const [isNewPasswordModalOpen, setIsNewPasswordModalOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleResetPasswordClick = (student: Student) => {
    setStudentToReset(student);
    setIsConfirmResetOpen(true);
  };

  const confirmResetPassword = async () => {
    if (!studentToReset) return;

    setIsConfirmResetOpen(false);
    toast.loading("Réinitialisation du mot de passe en cours...", { id: "resetToast" });

    try {
      // --- API Call to NestJS Backend ---
      // Replace with your actual NestJS API endpoint for password reset
      // This endpoint should:
      // 1. Generate a new temporary password.
      // 2. Update the user's password in the database.
      // 3. Set `isFirstConnection` to `true` for this user.
      // 4. Return the newly generated password.
      const response = await fetch("YOUR_NESTJS_API_URL/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: studentToReset.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la réinitialisation du mot de passe.");
      }

      const data = await response.json();
      const newPassword = data.newPassword;

      setGeneratedPassword(newPassword);
      setIsNewPasswordModalOpen(true);
      toast.success("Mot de passe réinitialisé !", { id: "resetToast" });

    } catch (error: any) {
      toast.error(error.message || "Échec de la réinitialisation du mot de passe.", { id: "resetToast" });
    } finally {
      setStudentToReset(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Mot de passe copié !");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Groupe</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.group || "Non assigné"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResetPasswordClick(student)}
                    title="Réinitialiser le mot de passe"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Réinitialiser le mot de passe de {student.firstName} {student.lastName}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Aucun élève trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isConfirmResetOpen} onOpenChange={setIsConfirmResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la réinitialisation du mot de passe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réinitialiser le mot de passe pour{" "}
              <span className="font-bold">{studentToReset?.firstName} {studentToReset?.lastName}</span> ?
              Un nouveau mot de passe temporaire sera généré, et l'utilisateur devra le modifier à sa prochaine connexion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>Réinitialiser</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isNewPasswordModalOpen} onOpenChange={setIsNewPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau mot de passe généré</DialogTitle>
            <DialogDescription>
              Veuillez noter ce mot de passe. L'utilisateur devra le changer à sa prochaine connexion.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input type="text" readOnly value={generatedPassword} className="font-mono" />
            <Button onClick={copyToClipboard} size="sm" title="Copier le mot de passe">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copier le mot de passe</span>
            </Button>
          </div>
          <p className="text-sm text-red-500">
            **Important :** Ce mot de passe est temporaire. L'utilisateur sera invité à le changer lors de sa prochaine connexion.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}