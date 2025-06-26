"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProtectedRoute } from "@/components/protected-route";
import { Calendar } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div data-no-lenis>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="relative h-svh pr-4 py-4 bg-[#f2f2f2] dark:bg-[#101010]">
            <div className="relative h-full w-full rounded-2xl bg-white dark:bg-black shadow-md dark:shadow-none z-10">
              <header className="w-full bg-white dark:bg-black z-[45] rounded-t-2xl flex h-16 shrink-0 border-b-[1px] border-black/[0.1] dark:border-white/[0.1] items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1 cursor-pointer" />
                  <DynamicBreadcrumbs />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <ThemeToggle className="ml-2" />
                </div>
              </header>
              <div className="w-full h-[calc(100%-4rem)] overflow-y-auto flex flex-1 flex-col gap-4 p-4 z-0 relative">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
