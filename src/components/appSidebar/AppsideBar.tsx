"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bike,
  Box,
  Headset,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sections = [
  {
    label: "MAIN",
    items: [
      { name: "Overview", path: "/", icon: LayoutGrid },
      { name: "Manage Driver", path: "/manage-driver", icon: Bike, badge: true },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { name: "Users Management", path: "/users-management", icon: Users },
      { name: "Order Management", path: "/order-management", icon: Box },
    ],
  },
  {
    label: "HELP & SUPPORT",
    items: [
      { name: "Help & Support", path: "/help-support", icon: Headset },
      { name: "Contact Us", path: "/contact-us", icon: Megaphone },
      { name: "Legal", path: "/legal", icon: ShieldCheck },
      { name: "FAQ", path: "/faq", icon: HelpCircle },
    ],
  },
];

export default function AppSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E5E7EB]">
      <SidebarContent
        className="flex flex-col h-full overflow-hidden"
      // style={{ backgroundColor: "#E9E9E9", color: "#737780" }}
      >
        {/* ── Logo ── */}
        <SidebarHeader className="px-6 py-8">
          <Link href="/" className="flex items-center justify-center">
            <div className={cn("relative", isCollapsed ? "w-10 h-10" : "w-full h-24")}>
              <Image
                src="/icons/logo.png"
                fill
                alt="Orienco"
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </SidebarHeader>

        <div className="h-px mx-6 bg-gray-200/50" />

        {/* ── Navigation Sections ── */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar lg:py-4">
          {sections.map((section) => (
            <SidebarGroup key={section.label} className="mb-6 last:mb-0">
              {!isCollapsed && (
                <span className="px-4 text-base font-medium tracking-widest text-[#9CA3AF] mb-4 block">
                  {section.label}
                </span>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.name}
                          className={cn(
                            "h-12 px-4 rounded-sm transition-all duration-200 group relative",
                            active
                              ? "text-white shadow-lg shadow-orange-200"
                              : "text-[#737780] hover:bg-gray-200/50 hover:text-[#2C2E33]"
                          )}
                          style={active ? { backgroundColor: "#FF4A00" } : {}}
                        >
                          <Link href={item.path} className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-[#737780]")} />
                              {!isCollapsed && (
                                <span className="font-medium text-sm">{item.name}</span>
                              )}
                            </div>
                            {!isCollapsed && item.badge && !active && (
                              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        {/* ── Footer / Logout ── */}
        <SidebarFooter className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full h-14 bg-gray-100 cursor-pointer  hover:bg-gray-200 text-[#2C2E33] rounded-sm flex items-center justify-center gap-3 transition-colors duration-200 group",
              isCollapsed && "h-12"
            )}
          >
            <span className={cn("text-[#FF0000] font-bold text-lg", isCollapsed && "hidden")}>Logout</span>
            <LogOut className="w-6 h-6 text-[#FF0000]" />
          </button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
