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
        <span className="flex flex-row items-end gap-3 text-black dark:text-white ">
          <span className="block group-data-[collapsible=icon]:w-6 w-8 transition-all duration-300 ease-out">
            <svg
              width="100%"
              viewBox="0 0 121 162"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M59.9656 0.669922L64.7336 15.3442H80.163L67.6804 24.4134L72.4483 39.0877L59.9656 30.0185L47.483 39.0877L52.2509 24.4134L39.7682 15.3442H55.1977L59.9656 0.669922Z"
                fill="currentColor"
              />
              <path
                d="M46.1157 40.8352V130.399C46.1157 141.479 59.9658 153.483 59.9658 153.483C59.9658 153.483 74.2776 141.941 74.2776 130.399V40.8352L120.445 74.0754C120.445 74.0754 120.444 111.471 120.445 130.399C120.445 149.328 98.6948 161.331 83.0493 161.331C67.4038 161.331 59.9658 153.483 59.9658 153.483C59.9658 153.483 50.7836 161.331 36.8823 161.331C22.981 161.331 1.33398 151.174 0.410457 130.399C-0.513071 109.624 0.410457 74.0754 0.410457 74.0754L46.1157 40.8352Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="block w-24 mb-1">
            <svg
              width="100%"
              viewBox="0 0 351 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.5682 0.644391C52.843 0.644391 66.0663 10.4093 67.8972 26.7858H52.4361C51.3172 19.6656 44.5021 14.0711 36.5682 14.0711C23.5483 14.0711 16.8349 24.3446 16.8349 38.9919C16.8349 52.6221 23.2432 63.3025 36.5682 63.3025C45.7228 63.3025 51.7241 57.4028 53.0464 47.0276H68.5075C66.88 65.3368 54.3688 76.7292 36.5682 76.7292C14.3937 76.7292 0.865271 60.2509 0.865271 38.9919C0.865271 17.5295 14.0886 0.644391 36.5682 0.644391ZM72.8011 22.412H87.245V52.2152C87.245 60.2509 89.3811 65.0317 96.5013 65.0317C104.435 65.0317 107.69 60.4544 107.69 50.0792V22.412H122.134V75H108.402V67.6763H108.097C104.435 73.576 98.3322 76.424 91.924 76.424C78.1921 76.424 72.8011 69.5072 72.8011 55.0633V22.412ZM158.729 20.9879C160.154 20.9879 161.171 21.2931 161.883 21.4965V34.9232C160.459 34.6181 158.729 34.4147 156.695 34.4147C146.218 34.4147 142.455 41.6366 142.455 51.2998V75H128.011V22.412H141.743V32.1769H141.946C144.692 25.5652 151.508 20.9879 158.729 20.9879ZM184.982 20.9879C201.562 20.9879 210.615 34.0078 210.615 49.5706C210.615 50.3843 210.513 52.2152 210.513 52.2152H172.573C172.98 61.2681 177.15 65.5403 185.389 65.5403C190.882 65.5403 195.764 62.387 196.883 58.7252H209.598C205.733 70.6261 197.595 76.424 184.982 76.424C168.3 76.424 158.129 64.93 158.129 48.7568C158.129 32.8889 169.114 20.9879 184.982 20.9879ZM172.573 43.0607H196.069C194.645 35.1267 191.187 31.8717 184.474 31.8717C177.455 31.8717 173.183 36.1439 172.573 43.0607ZM244.306 20.9879C252.138 20.9879 257.224 24.2429 259.665 29.7356C263.53 24.1412 269.227 20.9879 275.635 20.9879C288.655 20.9879 294.758 28.1082 294.758 39.704V75H280.314V44.5864C280.314 37.6696 279.297 32.3803 271.464 32.3803C264.649 32.3803 261.801 37.161 261.801 45.6036V75H247.357V43.9761C247.357 37.161 246.34 32.3803 238.61 32.3803C235.253 32.3803 228.845 34.7198 228.845 44.383V75H214.401V22.412H228.031V29.5322H228.234C232.303 23.7343 237.796 20.9879 244.306 20.9879ZM325.299 20.9879C340.658 20.9879 348.287 26.1755 348.287 35.9404V63.8111C348.287 67.9815 348.795 72.8639 350.118 75H335.47C334.962 73.3725 334.555 71.6433 334.453 69.9141C330.384 74.1863 324.18 76.424 316.754 76.424C305.972 76.424 298.852 70.8296 298.852 60.6578C298.852 55.5719 300.479 52.0118 303.429 49.4689C306.786 46.6208 311.668 45.095 320.416 44.1795C329.774 43.1624 333.843 42.3486 333.843 37.6696C333.843 31.6683 329.469 30.6511 324.586 30.6511C318.585 30.6511 315.432 33.0923 314.923 38.5851H300.479C301.09 27.091 310.549 20.9879 325.299 20.9879ZM313.296 60.0475C313.296 64.2179 315.839 66.7609 322.145 66.7609C329.876 66.7609 333.843 62.5904 333.843 54.8599V49.2654C332.52 50.486 329.978 51.1981 325.095 51.8084C317.67 52.7238 313.296 54.3513 313.296 60.0475Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </span>
      </SidebarHeader>
      <SidebarContent className="whitespace-nowrap">
        <SidebarGroup>
          <SidebarMenuButton
            asChild
            className="cursor-pointer bg-white dark:bg-black rounded-lg transition-all duration-300  ease-out group-data-[collapsible=icon]:[&>svg]:size-4 [&>svg]:size-5 px-3"
          >
            <div>
              <Search className="text-black/60 dark:text-white/60" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none w-[80%]"
              />
              <span className="ml-auto dark:bg-white/15 bg-black/10 size-5 flex items-center justify-center rounded-md text-xs">
                /
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenuButton asChild className="text-base">
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
          <SidebarMenuButton asChild className="text-base [&>svg]:w-5">
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
          <SidebarMenuButton asChild className="text-base [&>svg]:w-5">
            <Link href="/dashboard/companies">
              <svg
                viewBox="0 0 22 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 3C2 1.34315 3.34315 0 5 0H11C12.6569 0 14 1.34315 14 3V4V15H15V4H17C18.6569 4 20 5.34315 20 7V15H21C21.5523 15 22 15.4477 22 16C22 16.5523 21.5523 17 21 17H1C0.44772 17 0 16.5523 0 16C0 15.4477 0.44772 15 1 15H2V3ZM6 6C6 5.44772 6.44772 5 7 5H9C9.5523 5 10 5.44772 10 6C10 6.55228 9.5523 7 9 7H7C6.44772 7 6 6.55228 6 6ZM6 10C6 9.4477 6.44772 9 7 9H9C9.5523 9 10 9.4477 10 10C10 10.5523 9.5523 11 9 11H7C6.44772 11 6 10.5523 6 10Z"
                  fill="currentColor"
                />
              </svg>

              <span>Companies</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild className="text-base">
            <Link href="/dashboard/opportunities">
              <svg
                width="100%"
                viewBox="0 0 20 19"
                fill="none"
                className="mb-0.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 2C7.44772 2 7 2.44772 7 3V4H13V3C13 2.44772 12.5523 2 12 2H8ZM15 4V3C15 1.34315 13.6569 0 12 0H8C6.34315 0 5 1.34315 5 3V4H3C1.34315 4 0 5.34315 0 7V16C0 17.6569 1.34315 19 3 19H17C18.6569 19 20 17.6569 20 16V7C20 5.34315 18.6569 4 17 4H15Z"
                  fill="currentColor"
                />
              </svg>

              <span>Opportunities</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild className="text-base [&>svg]:size-">
            <Link href="/dashboard/activities">
              <svg
                width="100%"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.17071 2C4.58254 0.83481 5.69378 0 7 0H9C10.3062 0 11.4175 0.83481 11.8293 2H13C14.6569 2 16 3.34315 16 5V17C16 18.6569 14.6569 20 13 20H3C1.34315 20 0 18.6569 0 17V5C0 3.34315 1.34315 2 3 2H4.17071ZM6 3V4H10V3C10 2.44772 9.5523 2 9 2H7C6.4477 2 6 2.44772 6 3Z"
                  fill="currentColor"
                />
              </svg>

              <span>Activities</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-3.5">{/* <NavUser /> */}</SidebarFooter>
    </Sidebar>
  );
}
