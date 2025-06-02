import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
  if (!jwt) {
    redirect("/");
  }
  return (
    <div data-no-lenis>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative h-svh pr-3 py-3 bg-[#f2f2f2] dark:bg-[#101010]">
          <div className="relative h-full w-full rounded-2xl bg-white dark:bg-black">
            <header className="absolute w-full z-[45] flex h-16 shrink-0 border-b-[1px] border-black/[0.1] dark:border-white/[0.1] items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 cursor-pointer" />
                <DynamicBreadcrumbs />
              </div>
              <ThemeToggle className="" />
            </header>
            <div className="w-full h-full flex flex-1 flex-col gap-4 p-4 z-0 relative pt-20">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
