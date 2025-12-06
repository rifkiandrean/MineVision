
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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
  Settings,
  Layers,
  Package,
  Settings2,
  BarChart4,
} from "lucide-react";
import { useFirebase } from "@/firebase";
import type { AppConfig } from "@/lib/types";

const iconMap: { [key: string]: React.ReactNode } = {
  "/": <LayoutDashboard />,
  "/perencanaan-tambang": <Layers />,
  "/produksi": <Truck />,
  "/geologi": <Mountain />,
  "/pengolahan": <Cog />,
  "/k3l": <ShieldCheck />,
  "/rantai-pasokan": <Package />,
  "/aset-dan-pemeliharaan": <Settings2 />,
  "/pelaporan-dan-analisis": <BarChart4 />,
  "default": <Pickaxe />,
};

const adminNavItems = [
  { href: "/administrasi/keuangan", icon: <Landmark />, label: "Keuangan" },
  { href: "/administrasi/sdm", icon: <Users />, label: "SDM" },
  { href: "/administrasi/it", icon: <Server />, label: "IT" },
];

const defaultMenuItems = [
  { id: 1, name: 'Dashboard', path: '/' },
  { id: 2, name: 'Perencanaan', path: '/perencanaan-tambang' },
  { id: 3, name: 'Produksi', path: '/produksi' },
  { id: 4, name: 'Geologi', path: '/geologi' },
  { id: 5, name: 'Pengolahan', path: '/pengolahan' },
  { id: 6, name: 'K3L', path: '/k3l' },
  { id: 7, name: 'Rantai Pasokan', path: '/rantai-pasokan' },
  { id: 8, name: 'Aset', path: '/aset-dan-pemeliharaan' },
  { id: 9, name: 'Laporan & BI', path: '/pelaporan-dan-analisis'},
];


interface SidebarNavProps {
    websiteName?: string;
    logoUrl?: string;
    menuItems?: AppConfig['menuItems'];
}

export default function SidebarNav({ websiteName = 'MineVision', logoUrl, menuItems = defaultMenuItems }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, user } = useFirebase();
  const [isAdminOpen, setIsAdminOpen] = useState(
    pathname.startsWith("/administrasi")
  );

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
    router.push('/login');
  };

  const mainNavItems = menuItems.map(item => ({
      href: item.path,
      icon: iconMap[item.path] || iconMap.default,
      label: item.name,
  }));

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={websiteName} width={32} height={32} className="object-contain" />
          ) : (
            <Pickaxe className="w-8 h-8 text-primary" />
          )}
          <h1 className="text-xl font-bold text-primary">{websiteName}</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            // Exclude the 'Administrasi' link from the main dynamic list, as it's handled separately
            item.href.startsWith('/administrasi') ? null : (
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
            )
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
                      isActive={pathname.startsWith(item.href)}
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
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/pengaturan">
                    <SidebarMenuButton isActive={pathname === '/pengaturan'} className="w-full justify-start">
                        <Settings />
                        <span>Pengaturan</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" data-ai-hint="person portrait"/>
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user?.displayName || user?.email || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'No email'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || user?.email || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'No email'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profil">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
