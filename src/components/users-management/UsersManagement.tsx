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
  User,
  Bike,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: 1, user: "Metro Mart", location: "Downtown District", role: "User", phone: "+16546565656", email: "john@metromart.com", status: "Active" },
  { id: 2, user: "Fresh Farms LLC", location: "Valley Region", role: "Driver", phone: "+16546565656", email: "sarah@freshfarms.com", status: "Active" },
  { id: 3, user: "City Grocers", location: "Westside", role: "User", phone: "+16546565656", email: "mike@citygrocers.com", status: "Active" },
  { id: 4, user: "Grain Masters", location: "North Hills", role: "Driver", phone: "+16546565656", email: "alan@grainmasters.com", status: "Suspended" },
];

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-3xl font-medium">User Management</h1>
        <p className=" font-normal text-gray-500">
          Manage Grocerymarkets and Suppliers. Approve registrations and monitor activity.
        </p>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
          />
        </div>

        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="w-full md:w-[180px] py-6 h-14 bg-white/50 border-gray-100 rounded-sm font-medium text-gray-600 cursor-pointer focus:ring-1 focus:ring-[#FF4A00]/20">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-lg border-gray-100 shadow-xl">
            <SelectItem value="all" className="font-medium text-gray-500 py-3">All</SelectItem>
            <SelectItem value="active" className="font-medium text-gray-500 py-3">Active</SelectItem>
            <SelectItem value="suspended" className="font-medium text-gray-500 py-3">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table Card ── */}
      <Card className="border-none shadow-none rounded-lg overflow-visible p-2">
        <CardContent className="p-10 pb-4">
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 pb-6 border-b border-gray-200/50 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">
              <div className="col-span-12 lg:col-span-3">USER</div>
              <div className="hidden lg:block lg:col-span-2">ROLE</div>
              <div className="hidden lg:block lg:col-span-3">CONTACT</div>
              <div className="hidden lg:block lg:col-span-3">STATUS</div>
              <div className="hidden lg:block lg:col-span-1 text-right">ACTIONS</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100/50">
              {mockUsers.map((u) => (
                <div key={u.id} className="grid grid-cols-12 py-8 items-center group relative">
                  <div className="col-span-12 lg:col-span-3 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                      <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-xl font-bold">
                        {u.user.charAt(0)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-bold text-[#2C2E33] leading-none">{u.user}</p>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F2F2F2] rounded-md text-[10px] text-[#737780] font-bold">
                        <MapPin className="w-3 h-3" />
                        {u.location}
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:col-span-2">
                    {u.role === "User" ? (
                      <div className="inline-flex  w-8/12 items-center gap-2 px-6 py-2 bg-[#CFDEE3] text-[#0066CC] font-bold text-xs rounded-xl">
                        <User className="w-4 h-4" />
                        User
                      </div>
                    ) : (
                      <div className="inline-flex w-8/12 items-center gap-2 px-6 py-2 bg-[#F6EDEB] text-[#FF4A00] font-bold text-xs rounded-xl">
                        <Bike className="w-4 h-4" />
                        Driver
                      </div>
                    )}
                  </div>

                  <div className="hidden lg:block lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {u.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {u.email}
                    </div>
                  </div>

                  <div className="hidden lg:block lg:col-span-3">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider",
                      u.status === "Active" ? "bg-[#D1F7EA] text-[#10B981]" : "bg-[#FDE6D2] text-[#FF4A00]"
                    )}>
                      {u.status === "Active" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {u.status}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-1 text-right relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === u.id ? null : u.id)}
                      className="p-2 hover:bg-white cursor-pointer rounded-lg transition-colors text-gray-400"
                    >
                      <MoreHorizontal className="w-6 h-6" />
                    </button>

                    <AnimatePresence>
                      {menuOpenId === u.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-12 z-20 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden text-left"
                          >
                            <Link
                              href={`/users-management/${u.id}`}
                              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors group/item"
                            >
                              <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF4A00]" />
                              View Profile
                            </Link>
                            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#10B981] hover:bg-green-50 rounded-sm cursor-pointer transition-colors group/item">
                              <CheckCircle2 className="w-4 h-4" />
                              Active User
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#D97706] hover:bg-amber-50 rounded-sm cursor-pointer transition-colors group/item">
                              <ShieldAlert className="w-4 h-4" />
                              Suspend User
                            </button>
                            <div className="h-px bg-gray-50 my-1 mx-2" />
                            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#FF0000] hover:bg-red-50 rounded-sm cursor-pointer transition-colors group/item">
                              <Trash2 className="w-4 h-4" />
                              Remove User
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
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-2 mt-12 pb-2">
        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        {[1, 2, 3, 4, 5, 6, "...", 10].map((page, i) => (
          <button
            key={i}
            className={cn(
              "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-bold transition-all",
              page === 1 ? "bg-[#FF4A00] text-white shadow-lg shadow-orange-100" : "bg-white/50 text-gray-600 hover:bg-white border border-gray-100"
            )}
          >
            {page}
          </button>
        ))}
        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
