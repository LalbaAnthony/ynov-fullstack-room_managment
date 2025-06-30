"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth";

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmNewPassword"],
  });

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

interface FirstConnectionModalProps {
  email: string;
  open: boolean;
  onClose: () => void;
}

export function FirstConnectionModal({
  email,
  open,
  onClose,
}: FirstConnectionModalProps) {
  const router = useRouter();
  const setFirstConnectionFalse = useAuthStore(
    (state) => state.setFirstConnectionFalse,
  );
  const token = useAuthStore((state) => state.token);

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    form.clearErrors();

    try {
      const response = await fetch("YOUR_NESTJS_API_URL/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du mot de passe.",
        );
      }

      toast.success("Mot de passe mis à jour avec succès !");
      setFirstConnectionFalse();
      onClose();

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        router.push(currentUser.isAdmin ? "/admin" : "/");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur inattendue est survenue.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Définir votre nouveau mot de passe</DialogTitle>
          <DialogDescription>
            C'est votre première connexion. Veuillez définir un nouveau mot de
            passe sécurisé.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              {...form.register("confirmNewPassword")}
            />
            {form.formState.errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Enregistrement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
