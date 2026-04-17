"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const mockOrders = [
  { id: "#ORD-29481", user: "Alex Thompson", email: "alex.t@example.com", address: "482 Berkeley Ave, San Francisco, CA", status: "PROCESSING" },
  { id: "#ORD-29482", user: "Sarah Jenkins", email: "s.jenkins@cloud.net", address: "1204 Broadway, New York, NY", status: "COMPLETED" },
  { id: "#ORD-29483", user: "Marcus Wei", email: "m.wei@techcorp.io", address: "77 King St, Toronto, ON", status: "PROCESSING" },
  { id: "#ORD-29484", user: "Elena Rodriguez", email: "elena.rod@global.com", address: "12 Paseo de la Reforma, CDMX", status: "PROCESSING" },
];

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-3xl font-medium">Order Management</h1>
        <p className="text-[#737780] font-normal">Monitor the orders from the users.</p>
      </div>

      {/* ── Search Bar ── */}
      <div className="max-w-md">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
          />
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card className="border-none shadow-none p-2 rounded-lg overflow-visible">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="px-10 py-6 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">ORDER ID</th>
                  <th className="px-6 py-6 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">USER NAME</th>
                  <th className="px-6 py-6 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">ADDRESS</th>
                  <th className="px-6 py-6 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">STATUS</th>
                  <th className="px-10 py-6 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/40 transition-colors">
                    <td className="px-10 py-6">
                      <span className="text-sm font-normal text-red-400">{order.id}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-[#1A365D] flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-white">
                          {order.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.user}</p>
                          <p className="text-xs font-normal text-gray-500">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-normal text-gray-500 max-w-[300px] truncate lg:max-w-none">
                        {order.address}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      {order.status === "PROCESSING" ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#BFD1F7] text-[#0066CC] font-bold text-[10px] rounded-full uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-[#0066CC]" />
                          PROCESSING
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D1F7EA] text-[#10B981] font-bold text-[10px] rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          COMPLETED
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === order.id ? null : order.id)}
                        className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-gray-400 group-hover:text-gray-600"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {menuOpenId === order.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-14 top-16 z-20 w-38 bg-white rounded-sm shadow-none border border-gray-100 p-2 overflow-hidden"
                            >
                              <Link
                                href={`/order-management/${order.id.replace('#', '')}`}
                                className="w-full flex items-center gap-3 p-2 text-sm font-normal text-gray-700 hover:bg-gray-50 rounded-sm transition-colors group/item"
                              >
                                <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF4A00]" />
                                View Request
                              </Link>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-2 mt-12">
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
