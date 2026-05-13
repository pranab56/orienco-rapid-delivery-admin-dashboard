"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAllContactQuery } from "@/features/contact/contactApi";

export default function ContactUs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: contactData, isLoading } = useGetAllContactQuery({
    page,
    limit: 10,
    searchTerm: searchQuery,
  });

  const contacts = contactData?.data || [];
  const meta = contactData?.meta || { totalPage: 1 };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">Contact Us</h1>
        <p className="text-sm sm:text-base text-[#737780] font-normal">Respond to User Messages</p>
      </div>

      {/* ── Search Bar ── */}
      <div className="max-w-md">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-12 h-12 sm:h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
          />
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card className="border-none shadow-none bg-white p-1 sm:p-2 rounded-lg overflow-visible">
        <CardContent className="p-4 sm:p-10 pb-4">
          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-6 border-b border-gray-200/50 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">
                <div className="col-span-3">USER</div>
                <div className="col-span-3">MESSAGE</div>
                <div className="col-span-3">CONTACT</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-1 text-right">ACTIONS</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100/50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 py-10 items-center animate-pulse">
                      <div className="col-span-3 h-4 bg-gray-100 rounded w-24" />
                      <div className="col-span-3 h-4 bg-gray-100 rounded w-48" />
                      <div className="col-span-3 h-4 bg-gray-100 rounded w-32" />
                      <div className="col-span-2 h-4 bg-gray-100 rounded w-16" />
                      <div className="col-span-1 h-4 bg-gray-100 rounded w-8 ml-auto" />
                    </div>
                  ))
                ) : contacts.length > 0 ? (
                  contacts.map((msg: any) => (
                    <div key={msg._id} className="grid grid-cols-12 py-10 items-center group relative">
                      <div className="col-span-3">
                        <p className="text-sm sm:text-base font-bold text-[#2C2E33] leading-none mb-1 sm:mb-0">{msg.name}</p>
                      </div>

                      <div className="col-span-3">
                        <p className="text-sm font-bold text-[#2C2E33] opacity-80 truncate pr-4">{msg.message}</p>
                      </div>

                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#2C2E33]">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </div>
                          {msg.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 pl-0.5">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          {msg.email}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                          msg.isReplied
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        )}>
                          {msg.isReplied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Replied
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </>
                          )}
                        </div>
                      </div>

                      <div className="col-span-1 text-right relative">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === msg._id ? null : msg._id)}
                          className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-gray-400"
                        >
                          <MoreHorizontal className="w-6 h-6" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {menuOpenId === msg._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-8 z-20 w-52 bg-white rounded-lg shadow-xl border border-gray-100 p-1 overflow-hidden text-left"
                              >
                                <Link
                                  href={`/contact-us/${msg._id}`}
                                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm transition-colors group/item"
                                >
                                  <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-[#FF4A00]" />
                                  View Request
                                </Link>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400 font-medium">
                    No messages found
                  </div>
                )}
              </div>
            </div>
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
