"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FirstConnectionModal } from "@/components/first-connection-modal";
import { useAuthStore } from "@/lib/stores/auth";
import { mockUsers } from "@/lib/mockUsers";

const schema = z.object({
  email: z.string().email({ message: "Email invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const [showModal, setShowModal] = useState(false);
  const [emailForModal, setEmailForModal] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    try {
      // **Simule l'appel API NestJS ici**
      // En production, tu remplacerais ceci par un fetch à ton backend réel.
      // Par exemple :
      // const response = await fetch("YOUR_NESTJS_API_URL/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) { ... throw new Error() ... }
      // const apiData = await response.json();
      // const foundUser = apiData.user;
      // const token = apiData.accessToken;

      // --- SIMULATION AVEC MOCKUSERS ---
      await new Promise((res) => setTimeout(res, 800)); // petite pause simulée

      const foundUser = mockUsers.find(
        (u) => u.email === data.email && u.password === data.password,
      );

      if (!foundUser) {
        throw new Error("Identifiants invalides");
      }
      // --- FIN SIMULATION ---

      login(
        {
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          isAdmin: foundUser.isAdmin,
          isFirstConnection: foundUser.isFirstConnection,
        },
        foundUser.token,
      );

      toast.success("Connexion réussie !");
      setEmailForModal(foundUser.email);

      if (foundUser.isFirstConnection) {
        setShowModal(true);
      } else {
        router.push(foundUser.isAdmin ? "/admin" : "/");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground">Login to your account</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <FirstConnectionModal
        email={emailForModal}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
