
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import SidebarNav from "./sidebar-nav";
import { useFirebase } from "@/firebase";
import { Pickaxe } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();

  const noSidebarRoutes = ["/login"];
  const isPublicRoute = noSidebarRoutes.includes(pathname);

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
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
