
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Mountain,
  Cog,
  ShieldCheck,
  Briefcase,
  Landmark,
  Users,
  Server,
  ChevronDown,
  LogOut,
  UserCircle,
  Pickaxe,
} from "lucide-react";

const navItems = [
  { href: "/", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/produksi", icon: <Truck />, label: "Produksi" },
  { href: "/geologi", icon: <Mountain />, label: "Geologi" },
  { href: "/pengolahan", icon: <Cog />, label: "Pengolahan" },
  { href: "/k3l", icon: <ShieldCheck />, label: "K3L" },
];

const adminNavItems = [
  { href: "/administrasi/keuangan", icon: <Landmark />, label: "Keuangan" },
  { href: "/administrasi/sdm", icon: <Users />, label: "SDM" },
  { href: "/administrasi/it", icon: <Server />, label: "IT" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [isAdminOpen, setIsAdminOpen] = useState(
    pathname.startsWith("/administrasi")
  );

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Pickaxe className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-primary">MineVision</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/administrasi")}
                  className="w-full justify-start"
                >
                  <Briefcase />
                  <span>Administrasi</span>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isAdminOpen && "rotate-180"
                    )}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      className="w-full justify-start"
                      variant="ghost"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" data-ai-hint="person portrait"/>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@minevision.co</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@minevision.co
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
