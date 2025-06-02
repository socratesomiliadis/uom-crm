"use client";

import * as React from "react";
import {
  LayoutDashboard,
  LayoutDashboardIcon,
  MessageCircle,
  Plus,
  Search,
  Settings2,
  TicketsPlane,
  Users,
} from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Trips",
      url: "/dashboard/trips",
      icon: TicketsPlane,
      isActive: true,
      items: [
        {
          title: "Upcoming Trips",
          url: "/dashboard/trips",
        },
        {
          title: "Past Trips",
          url: "/dashboard/trips/past",
        },
      ],
    },
    {
      title: "Passengers",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Manage Passengers",
          url: "/dashboard/passengers",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
      ],
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b-[0px] overflow-hidden transition-all duration-300 ease-out p-4 mt-2 group-data-[collapsible=icon]:p-[calc(1rem-2.5px)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-11 rounded-2xl flex items-center justify-center font-black text-xl text-white dark:text-black bg-[linear-gradient(90deg,#f4d3ca,#d1f0ea,#bdbff8,#cec0f5)] outline-[2px] outline-offset-[-3px] outline-white dark:outline-black">
            C
          </div>
          <div className="flex flex-col gap-0">
            <h1 className="text-base tracking-tight leading-none">Acme Inc.</h1>
            <span className="text-sm text-black/60 dark:text-white/60">
              Enterprise
            </span>
          </div>
        </div>
        <div className="size-8 bg-gradient-to-r text-white dark:text-black from-[#67f9e1] via-[#f0dd71] to-[#cd40f0] rounded-full flex items-center justify-center">
          <svg
            width="50%"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 0C6.51472 0 4.5 2.01472 4.5 4.5C4.5 6.98528 6.51472 9 9 9C11.4853 9 13.5 6.98528 13.5 4.5C13.5 2.01472 11.4853 0 9 0Z"
              fill="currentColor"
            />
            <path
              d="M9.0015 10C5.16958 10 2.23686 12.2962 1.04605 15.516C0.70562 16.4365 0.93869 17.3438 1.47985 17.9887C2.00722 18.6172 2.82133 19 3.69832 19H14.3046C15.1816 19 15.9957 18.6172 16.5231 17.9887C17.0643 17.3438 17.2973 16.4365 16.9569 15.516C15.7661 12.2962 12.8334 10 9.0015 10Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </SidebarHeader>
      <SidebarContent className="whitespace-nowrap">
        <SidebarGroup>
          <SidebarMenuButton asChild className="">
            <button>
              <Search />
              <span>Search</span>
              <span className="ml-auto dark:bg-white/15 bg-black/10 size-5 flex items-center justify-center rounded-md text-xs">
                /
              </span>
            </button>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenuButton
            asChild
            className="text-base hover:bg-[#f3f3f3] dark:hover:bg-[#151515] transition-all duration-300 ease-out"
          >
            <Link href="/dashboard">
              <svg
                width="100%"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16146 1.0032e-06H8V6H1.0032e-06V4.16145C-1.89968e-05 3.63432 -2.8966e-05 3.17954 0.030571 2.80497C0.062871 2.40963 0.134191 2.01641 0.326981 1.63803C0.614601 1.07354 1.07354 0.614601 1.63803 0.326981C2.01641 0.134191 2.40963 0.062871 2.80497 0.030571C3.17954 -2.8966e-05 3.63433 -1.89968e-05 4.16146 1.0032e-06Z"
                  fill="currentColor"
                />
                <path
                  d="M1.0032e-06 8V13.8385C-1.89968e-05 14.3657 -2.8966e-05 14.8205 0.030571 15.195C0.062871 15.5904 0.134191 15.9836 0.326981 16.362C0.614601 16.9265 1.07354 17.3854 1.63803 17.673C2.01641 17.8658 2.40963 17.9371 2.80497 17.9694C3.17954 18 3.6343 18 4.16144 18H8V8H1.0032e-06Z"
                  fill="currentColor"
                />
                <path
                  d="M10 18H13.8386C14.3657 18 14.8205 18 15.195 17.9694C15.5904 17.9371 15.9836 17.8658 16.362 17.673C16.9265 17.3854 17.3854 16.9265 17.673 16.362C17.8658 15.9836 17.9371 15.5904 17.9694 15.195C18 14.8205 18 14.3657 18 13.8386V12H10V18Z"
                  fill="currentColor"
                />
                <path
                  d="M18 10V4.16144C18 3.6343 18 3.17954 17.9694 2.80497C17.9371 2.40963 17.8658 2.01641 17.673 1.63803C17.3854 1.07354 16.9265 0.614601 16.362 0.326981C15.9836 0.134191 15.5904 0.062871 15.195 0.030571C14.8205 -2.8966e-05 14.3657 -1.89968e-05 13.8386 1.0032e-06H10V10H18Z"
                  fill="currentColor"
                />
              </svg>

              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            className="text-base hover:bg-[#f3f3f3] dark:hover:bg-[#151515] transition-all duration-300 ease-out [&>svg]:size-4.5"
          >
            <Link href="/dashboard/contacts">
              <svg
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6062 14.6135C12.5926 10.9806 9.8695 9 6.99876 9C4.12798 9 1.40488 10.9807 0.391378 14.6135C-0.138562 16.5131 1.48155 18 3.14471 18H10.8528C12.516 18 14.1361 16.5131 13.6062 14.6135Z"
                  fill="currentColor"
                />
                <path
                  d="M2.99854 4C2.99854 1.79086 4.7894 0 6.99854 0C9.2077 0 10.9985 1.79086 10.9985 4C10.9985 6.20914 9.2077 8 6.99854 8C4.7894 8 2.99854 6.20914 2.99854 4Z"
                  fill="currentColor"
                />
                <path
                  d="M12.4985 4.5C12.4985 2.567 14.0655 1 15.9985 1C17.9315 1 19.4985 2.567 19.4985 4.5C19.4985 6.433 17.9315 8 15.9985 8C14.0655 8 12.4985 6.433 12.4985 4.5Z"
                  fill="currentColor"
                />
                <path
                  d="M13.1943 9.7732C14.2405 10.9095 15.0549 12.3635 15.5327 14.0761C15.8263 15.1287 15.7367 16.1327 15.3873 17H19.3047C20.8021 17 22.2877 15.656 21.8023 13.9161C20.9185 10.7482 18.5337 9 16.0012 9C15.0168 9 14.0547 9.2642 13.1943 9.7732Z"
                  fill="currentColor"
                />
              </svg>

              <span>Contacts</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            className="text-base hover:bg-[#f3f3f3] dark:hover:bg-[#151515] transition-all duration-300 ease-out [&>svg]:w-4.5"
          >
            <Link href="/dashboard/companies">
              <svg
                viewBox="0 0 22 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 3C2 1.34315 3.34315 0 5 0H11C12.6569 0 14 1.34315 14 3V4V15H15V4H17C18.6569 4 20 5.34315 20 7V15H21C21.5523 15 22 15.4477 22 16C22 16.5523 21.5523 17 21 17H1C0.44772 17 0 16.5523 0 16C0 15.4477 0.44772 15 1 15H2V3ZM6 6C6 5.44772 6.44772 5 7 5H9C9.5523 5 10 5.44772 10 6C10 6.55228 9.5523 7 9 7H7C6.44772 7 6 6.55228 6 6ZM6 10C6 9.4477 6.44772 9 7 9H9C9.5523 9 10 9.4477 10 10C10 10.5523 9.5523 11 9 11H7C6.44772 11 6 10.5523 6 10Z"
                  fill="currentColor"
                />
              </svg>

              <span>Companies</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-3.5">{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
}
