"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronRight,
  Search,
  Camera,
  Asterisk,
  UserSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const routeTitleMap: Record<string, string> = {
  "": "Overview",
  "notification": "Notifications",
  "manage-driver": "Manage Driver",
  "users-management": "Users Management",
  "order-management": "Order Management",
  "help-support": "Help & Support",
  "contact-us": "Contact Us",
  "legal": "Legal",
  "faq": "FAQ",
  "terms-conditions": "Terms & Conditions",
  "privacy-policy": "Privacy Policy",
};

export default function MyNavber() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    // Remove (main) from parts if it exists in the URL (it shouldn't but just in case)
    const filteredParts = parts.filter(p => !p.startsWith('('));
    
    const crumbs = ["Home Page"];

    filteredParts.forEach((part) => {
      crumbs.push(routeTitleMap[part] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "));
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-20 items-center justify-between gap-4 bg-gray-100 px-8 w-full shrink-0 border-b border-gray-200/50">
      
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 text-[#737780]">
        {breadcrumbs.map((crumb, i) => (
          <div key={`${crumb}-${i}`} className="flex items-center gap-2">
            <span className={cn(
              "text-sm transition-colors", 
              i === breadcrumbs.length - 1 ? "font-semibold text-[#2C2E33]" : "hover:text-[#2C2E33] cursor-pointer"
            )}>
              {crumb}
            </span>
            {i < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
          </div>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] transition-colors group-focus-within:text-[#FF4A00]" />
          <Input 
            placeholder="Search anything..." 
            className="h-12 w-full pl-12 pr-4 bg-white border-none shadow-none rounded-lg text-[#2C2E33] placeholder:text-[#737780] focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal whitespace-nowrap overflow-hidden"
          />
        </div>
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <Link href="/notification">
          <button className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl cursor-pointer transition-colors group">
            <Bell className="w-6 h-6 text-[#2C2E33] transition-transform group-hover:rotate-12" />
            <span className="absolute top-2.5 right-4 w-2 h-2 bg-[#FF4500] rounded-full border-2 border-[#D9D9D9]" />
          </button>
        </Link>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4 pl-4 border-l border-gray-300/50 cursor-pointer group outline-none">
              <div className="text-right">
                <p className="text-base font-bold text-[#2C2E33] leading-none mb-1">Admin</p>
                <p className="text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase">DIVINE</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF4A00] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-200 transition-transform group-active:scale-95">
                D
              </div>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            sideOffset={22}
            className="w-64 bg-[#EAEAEA] border-none rounded-xl p-0 shadow-2xl relative overflow-visible"
          >
            {/* Triangle/Arrow */}
            <div className="absolute -top-2.5 right-4 w-5 h-5 bg-[#EAEAEA] rotate-45 rounded-sm" />
            
            <div className="relative bg-[#EAEAEA] rounded-xl overflow-hidden z-10">
              <DropdownMenuItem asChild className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-200/50 transition-colors focus:bg-gray-200/80 outline-none group border-b border-gray-300/40">
                <Link href="/change-password">
                  <div className="flex items-center gap-1 text-[#737780] group-hover:text-[#2C2E33]">
                      <span className="text-sm font-bold">|</span>
                      <Asterisk className="w-4 h-4" />
                  </div>
                  <span className="text-base font-medium text-[#737780] group-hover:text-[#2C2E33]">Change Password</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-200/50 transition-colors focus:bg-gray-200/80 outline-none group border-b border-gray-300/40 font-medium">
                <Link href="/profile">
                  <UserSquare className="w-5 h-5 text-[#737780] group-hover:text-[#2C2E33]" />
                  <span className="text-base font-medium text-[#737780] group-hover:text-[#2C2E33]">Change Name</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-200/50 transition-colors focus:bg-gray-200/80 outline-none group">
                <Link href="/profile">
                  <Camera className="w-5 h-5 text-[#737780] group-hover:text-[#2C2E33]" />
                  <span className="text-base font-medium text-[#737780] group-hover:text-[#2C2E33]">Change Picture</span>
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
