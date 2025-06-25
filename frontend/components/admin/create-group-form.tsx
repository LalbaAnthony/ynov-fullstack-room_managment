"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Student } from "@/types/students";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom du groupe est requis." }),
  capacity: z.number().min(1, { message: "La capacité doit être au moins de 1." }),
  members: z.array(z.string()).default([]),
});

type CreateGroupFormData = z.infer<typeof formSchema>;

interface CreateGroupFormProps {
  initialGroupName: string;
  unassignedStudents: Student[];
  onCreateGroup: (data: { name: string; capacity: number; members: string[] }) => void;
}

export function CreateGroupForm({
  initialGroupName,
  unassignedStudents,
  onCreateGroup,
}: CreateGroupFormProps) {
  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialGroupName,
      capacity: 25,
      members: [],
    },
  });

  async function onSubmit(values: CreateGroupFormData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (values.members.length > values.capacity) {
      toast.error("Le nombre d'élèves assignés dépasse la capacité du groupe.");
      return;
    }

    onCreateGroup(values);
    form.reset({
      name: initialGroupName,
      capacity: 25,
      members: [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du groupe</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité maximale</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))} // Assure que la valeur est un nombre
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigner des élèves</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(selectedValues: string[]) => field.onChange(selectedValues)}
                  value={field.value.length ? field.value[0] : ""}
                  multiple
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner des élèves" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Élèves non assignés</SelectLabel>
                      {unassignedStudents.length > 0 ? (
                        unassignedStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} ({student.email})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-students" disabled>
                          Aucun élève non assigné
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              {/* NOTE: Shadcn Select ne supporte pas nativement la multi-sélection via l'attribut 'multiple'.
                  Pour une vraie multi-sélection, il faudrait utiliser une librairie tierce (ex: react-select)
                  ou implémenter une UI de sélection multiple personnalisée.
                  Pour cette simulation, le Select gérera une sélection simple ou nécessitera une logique plus complexe si tu veux une vraie multi-sélection.
                  Pour l'instant, on simule que l'API peut prendre plusieurs IDs.
                  Tu peux ajouter une checkbox à côté de chaque SelectItem pour une vraie multi-sélection.
                  Pour un POC, on peut simplement prendre le premier élève ou simuler.
              */}
              {/* Simulation très simplifiée pour assigner un seul élève via Select */}
              {/* Si tu veux une vraie multi-sélection, il faut une UI différente (ex: checkboxes dans une ScrollArea) */}
              {/* Pour l'instant, le form.reset() réinitialisera 'members' à [], mais l'utilisateur ne verra qu'une seule sélection s'il utilise le select */}
              <p className="text-sm text-muted-foreground mt-1">
                Note : Pour une multi-sélection d'élèves, une implémentation UI plus avancée serait nécessaire (ex: liste avec checkboxes). Pour l'instant, la sélection est simulée.
              </p>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Création en cours..." : "Créer le groupe"}
        </Button>
      </form>
    </Form>
  );
}