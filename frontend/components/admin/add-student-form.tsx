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
import { Student } from "@/types/students";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom est requis." }),
  lastName: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  group: z.string().optional().or(z.literal("")),
});

type AddStudentFormData = z.infer<typeof formSchema>;

interface AddStudentFormProps {
  onAddStudent: (newStudent: Student) => void;
}

export function AddStudentForm({ onAddStudent }: AddStudentFormProps) {
  const form = useForm<AddStudentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      group: "",
    },
  });

  async function onSubmit(values: AddStudentFormData) {
    console.log("Form submitted with:", values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newStudent: Student = {
      id: `mock-id-${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      group: values.group || "",
    };

    onAddStudent(newStudent);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de famille" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Groupe (Facultatif)</FormLabel>
              <FormControl>
                <Input placeholder="Laisser vide pour l'instant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Ajout en cours..." : "Ajouter l'élève"}
        </Button>
      </form>
    </Form>
  );
}