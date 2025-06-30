"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function SidebarFooterContent() {
  const userName = "John Doe"; // Valeur en dur
  const userInitials = "JD"; // Valeur en dur (pour l'avatar fallback)
  const userAvatar = ""; // Laissez vide si pas d'image, ou mettez un chemin

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span className="truncate font-medium group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
              {userName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:hidden"
            asChild
          >
            <Link href="/logout">
              {" "}
              {/* Remplacez par votre route de déconnexion */}
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
