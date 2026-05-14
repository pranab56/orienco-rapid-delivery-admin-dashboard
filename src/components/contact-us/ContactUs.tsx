"use client";
import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAllContactQuery } from "@/features/contact/contactApi";

export default function ContactUs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: contactData, isLoading } = useGetAllContactQuery({
    page,
    limit: 10,
    searchTerm: "", // Disabled backend search for local filtering
  });

  const contacts = contactData?.data || [];

  const filteredContacts = contacts.filter((msg: any) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(lowerQuery) ||
      msg.message?.toLowerCase().includes(lowerQuery) ||
      msg.email?.toLowerCase().includes(lowerQuery) ||
      msg.phone?.toLowerCase().includes(lowerQuery)
    );
  });
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

      {/* ── Table Container ── */}
      <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100/80 hover:bg-transparent">
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">USER</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">MESSAGE</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">CONTACT</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">STATUS</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-50/50">
                    <TableCell className="py-6 px-6"><div className="h-4 bg-gray-100 rounded w-24 animate-pulse" /></TableCell>
                    <TableCell className="py-6 px-6"><div className="h-4 bg-gray-100 rounded w-48 animate-pulse" /></TableCell>
                    <TableCell className="py-6 px-6"><div className="h-4 bg-gray-100 rounded w-32 animate-pulse" /></TableCell>
                    <TableCell className="py-6 px-6"><div className="h-6 bg-gray-100 rounded-full w-24 animate-pulse" /></TableCell>
                    <TableCell className="py-6 px-6 text-right"><div className="h-8 bg-gray-100 rounded w-8 ml-auto animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((msg: any) => (
                  <TableRow key={msg._id} className="group border-b border-gray-50/50 hover:bg-white/60 transition-colors">
                    <TableCell className="py-6 px-6">
                      <p className="text-sm font-medium text-[#2C2E33]">{msg.name}</p>
                    </TableCell>

                    <TableCell className="py-6 px-6">
                      <p className="text-sm font-medium text-gray-700 max-w-[250px] truncate">{msg.message}</p>
                    </TableCell>

                    <TableCell className="py-6 px-6">
                      <div className="space-y-1.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {msg.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {msg.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 px-6 whitespace-nowrap">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        msg.isReplied ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"
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
                    </TableCell>

                    <TableCell className="py-6 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 cursor-pointer rounded-xl transition-colors text-gray-400 focus:outline-none">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 bg-white border-gray-100 shadow-xl rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/contact-us/${msg._id}`}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                              View Request
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-gray-400 font-medium">No messages found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
                      "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-medium transition-all",
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
