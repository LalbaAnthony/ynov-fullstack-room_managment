"use client";

import { Users, DoorOpen, UserRoundCog } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function SidebarContentSections() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Gestion des Utilisateurs</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/students">
                <Users className="h-5 w-5" />
                <span>Étudiants</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Organisation de l'Établissement</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/rooms">
                <DoorOpen className="h-5 w-5" />
                <span>Salles</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/groups">
                <UserRoundCog className="h-5 w-5" />
                <span>Groupes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <div className="mt-auto p-4 flex justify-center group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
        <img
          src="/logo-room-managment.png"
          alt="App Logo"
          className="h-30 w-auto"
        />
      </div>
    </>
  );
}
