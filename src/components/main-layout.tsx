
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "./sidebar-nav";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { Pickaxe } from "lucide-react";
import type { AppConfig } from "@/lib/types";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading, firestore } = useFirebase();

  const [websiteName, setWebsiteName] = useState('MineVision');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [menuItems, setMenuItems] = useState<AppConfig['menuItems']>([]);

  const appConfigDocRef = useMemoFirebase(() => {
    // Wait until user loading is false before attempting to fetch
    if (!firestore || isUserLoading) return null;
    return doc(firestore, 'appConfig', 'main');
  }, [firestore, isUserLoading]);

  const { data: appConfig } = useDoc<AppConfig>(appConfigDocRef);

  useEffect(() => {
    if (appConfig) {
        if (appConfig.websiteName) {
            setWebsiteName(appConfig.websiteName);
            document.title = appConfig.websiteName;
        }
        if (appConfig.logoUrl) {
            setLogoUrl(appConfig.logoUrl);
        }
        if (appConfig.menuItems) {
            setMenuItems(appConfig.menuItems);
        }
    }
  }, [appConfig]);


  const noSidebarRoutes = ["/login"];
  const isPublicRoute = noSidebarRoutes.includes(pathname);
  const isHomePage = pathname === '/';

  useEffect(() => {
    // If auth check is done, there's no user, and it's not a public route, redirect to login.
    if (!isUserLoading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, isUserLoading, isPublicRoute, router]);

  // If it's a public route, just render the children (e.g., the login page)
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // While checking for user or if no user and about to redirect, show a loading screen.
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Pickaxe className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  // If user is logged in, render the main layout with sidebar.
  // Don't show sidebar on mobile home page because it has a grid menu
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarNav websiteName={websiteName} logoUrl={logoUrl} menuItems={menuItems} />
        </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
