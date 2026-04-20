"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockRequests = [
  { id: 1, user: "Metro Mart", location: "Downtown District", title: "ID Card Issue", phone: "+16546565656", email: "john@metromart.com", status: "Solved" },
  { id: 2, user: "Fresh Farms LLC", location: "Valley Region", title: "ID Card Issue", phone: "+16546565656", email: "sarah@freshfarms.com", status: "Solved" },
  { id: 3, user: "City Grocers", location: "Westside", title: "ID Card Issue", phone: "+16546565656", email: "mike@citygrocers.com", status: "Solved" },
  { id: 4, user: "Grain Masters", location: "North Hills", title: "ID Card Issue", phone: "+16546565656", email: "alan@grainmasters.com", status: "Pending" },
];

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">Help & Support</h1>
        <p className="text-sm sm:text-base text-[#737780] font-normal">Solve the problems of the users.</p>
      </div>

      {/* ── Search Bar ── */}
      <div className="max-w-md">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 sm:h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
          />
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card className="border-none shadow-none bg-white p-1 sm:p-2 rounded-lg overflow-visible">
        <CardContent className="p-4 sm:p-10 pb-4">
          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[850px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-6 border-b border-gray-200/50 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">
                <div className="col-span-4">USER</div>
                <div className="col-span-2">TITLE</div>
                <div className="col-span-3">CONTACT</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-1 text-right">ACTIONS</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100/50">
                {mockRequests.map((req) => (
                  <div key={req.id} className="grid grid-cols-12 py-8 items-center group relative">
                    <div className="col-span-4 flex items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                        {/* Avatar placeholder */}
                        <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-base sm:text-xl font-medium">
                          {req.user.charAt(0)}
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2 whitespace-nowrap">
                        <p className="text-sm sm:text-base font-medium text-[#2C2E33] leading-none">{req.user}</p>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F2F2F2] rounded-md text-[9px] sm:text-[10px] text-[#737780] font-bold">
                          <MapPin className="w-3 h-3" />
                          {req.location}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-700">{req.title}</p>
                    </div>

                    <div className="col-span-3 space-y-2 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {req.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {req.email}
                      </div>
                    </div>

                    <div className="col-span-2 whitespace-nowrap">
                      <div className={cn(
                        "inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider",
                        req.status === "Solved" ? "bg-[#D1F7EA] text-[#10B981]" : "bg-[#FDE6D2] text-[#FF4A00]"
                      )}>
                        {req.status}
                      </div>
                    </div>

                    <div className="col-span-1 text-right relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === req.id ? null : req.id)}
                        className="p-2 hover:bg-white cursor-pointer rounded-lg transition-colors text-gray-400"
                      >
                        <MoreHorizontal className="w-6 h-6" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {menuOpenId === req.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-7 z-20 w-52 bg-white rounded-sm shadow-lg border border-gray-100 p-1 overflow-hidden text-left"
                            >
                              <Link
                                href={`/help-support/${req.id}`}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition-colors group/item"
                              >
                                <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF4A00]" />
                                View Request
                              </Link>
                              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#FF0000] cursor-pointer hover:bg-red-50 rounded-sm transition-colors group/item mt-1">
                                <Trash2 className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF0000]" />
                                Remove Request
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Desktop Version */}
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, "...", 10].map((page, i) => (
            <button
              key={i}
              className={cn(
                "w-10 h-10 rounded-full text-sm font-medium shadow-xl transition-all",
                page === 1 ? "bg-[#FF4A00] text-white cursor-pointer shadow-orange-100" : "bg-white/50 text-gray-600 cursor-pointer hover:bg-white border border-gray-100"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile Version - Compact */}
        <div className="flex sm:hidden items-center gap-1">
          {[1, 2, "...", 10].map((page, i) => (
            <button
              key={`mob-${i}`}
              className={cn(
                "w-8 h-8 rounded-full shadow-md cursor-pointer text-xs font-bold transition-all",
                page === 1 ? "bg-[#FF4A00] text-white shadow-md shadow-orange-100" : "bg-white/50 text-gray-600 border border-gray-100"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
