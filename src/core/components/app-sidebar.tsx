"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/core/components/nav-main"
import { NavProjects } from "@/core/components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
} from "@/core/components/ui/sidebar"
import Link from "next/link"
import NavUser from "./nav-user"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "پروفایل",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "ویرایش",
          url: "#",
        },
        {
          title: "تغییر کلمه عبور",
          url: "#",
        },
        {
          title: "مشاهده پرفایل",
          url: "#",
        },
      ],
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="right" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="border-b pb-2 group/collapsible">
          <Link href='/dashboard' className="flex items-center gap-2 w-full ">
            <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
              <LayoutDashboardIcon className="size-5 text-primary" />
            </div>
            <span className="text-xl font-bold group-data-[state=open]:hidden">داشبورد</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
