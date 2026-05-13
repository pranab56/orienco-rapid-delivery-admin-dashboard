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
  Clock,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetAllParcelsQuery } from "@/features/parcel/parcelApi";

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useGetAllParcelsQuery({ page });

  const parcels = response?.data?.parcels || [];
  const meta = response?.data?.meta || { totalPage: 1 };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">Order Management</h1>
        <p className="text-sm sm:text-base text-[#737780] font-normal">Monitor the orders from the users.</p>
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
      <Card className="border-none shadow-none p-1 sm:p-2 rounded-lg overflow-visible bg-white">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="px-5 sm:px-10 py-4 sm:py-6 text-[10px] sm:text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">ORDER ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-6 text-[10px] sm:text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">USER NAME</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-6 text-[10px] sm:text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">DROP ADDRESS</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-6 text-[10px] sm:text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">STATUS</th>
                  <th className="px-5 sm:px-10 py-4 sm:py-6 text-[10px] sm:text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 sm:px-10 py-8"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                      <td className="px-4 sm:px-6 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100" />
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-100 rounded w-24" />
                            <div className="h-2 bg-gray-100 rounded w-32" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-8"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                      <td className="px-4 sm:px-6 py-8"><div className="h-6 bg-gray-100 rounded-full w-24" /></td>
                      <td className="px-5 sm:px-10 py-8 text-right"><div className="h-8 bg-gray-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : parcels.length > 0 ? (
                  parcels.map((parcel: any) => (
                    <tr key={parcel._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 sm:px-10 py-4 sm:py-6">
                        <span className="text-xs sm:text-sm font-semibold text-[#FF4A00]">
                          #{parcel._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1A365D] flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-white overflow-hidden">
                            {parcel.sender?.image ? (
                              <img src={parcel.sender.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              parcel.sender?.fullName?.charAt(0) || <Package className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-[#2C2E33] truncate">
                              {parcel.sender?.fullName || "Guest User"}
                            </p>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-400 truncate">
                              {parcel.sender?.email || "No Email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-[200px] sm:max-w-[300px] truncate lg:max-w-[400px]">
                          {parcel.dropLocation?.address || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-wider shadow-sm",
                          parcel.status === "DELIVERED"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : parcel.status === "PENDING" || parcel.status === "CREATED"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                        )}>
                          {parcel.status === "DELIVERED" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {parcel.status}
                        </div>
                      </td>
                      <td className="px-5 sm:px-10 py-4 sm:py-6 text-right relative">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === parcel._id ? null : parcel._id)}
                          className="p-1.5 sm:p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-gray-400 group-hover:text-gray-600"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {menuOpenId === parcel._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-14 top-8 z-20 w-44 bg-white rounded-lg shadow-xl border border-gray-100 p-1 overflow-hidden text-left"
                              >
                                <Link
                                  href={`/order-management/${parcel._id}`}
                                  className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors group/item"
                                >
                                  <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF4A00]" />
                                  View Details
                                </Link>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400 font-medium text-lg">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Pagination ── */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: meta.totalPage }).map((_, i) => {
              const p = i + 1;
              // Simple pagination logic
              if (p === 1 || p === meta.totalPage || (p >= page - 1 && p <= page + 1)) {
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-bold transition-all",
                      page === p ? "bg-[#FF4A00] text-white shadow-lg shadow-orange-100" : "bg-white/50 text-gray-600 hover:bg-white border border-gray-100"
                    )}
                  >
                    {p}
                  </button>
                );
              }
              if (p === page - 2 || p === page + 2) {
                return <span key={p} className="text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            disabled={page === meta.totalPage}
            onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
