"use client";

import { useState } from "react";
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

import {
  useGetAllSupportQuery,
  useDeleteSupportMutation,
} from "@/features/support/supportApi";
import { toast } from "sonner";

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: supportData, isLoading, isError } = useGetAllSupportQuery({
    page,
    limit: 10,
    searchTerm: "" // Removed backend search for frontend filtering
  });

  const [deleteSupport] = useDeleteSupportMutation();

  const handleRemove = async (id: string) => {
    try {
      await deleteSupport(id).unwrap();
      toast.success("Support request removed successfully");
    } catch (error) {
      toast.error("Failed to remove support request");
    }
  };

  const requests = supportData?.data?.result || [];
  const meta = supportData?.data?.meta;

  const filteredRequests = requests.filter((req: any) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      req.user?.fullName?.toLowerCase().includes(lowerQuery) ||
      req.title?.toLowerCase().includes(lowerQuery) ||
      req.user?.email?.toLowerCase().includes(lowerQuery) ||
      req.user?.phone?.toLowerCase().includes(lowerQuery) ||
      req.status?.toLowerCase().includes(lowerQuery)
    );
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center py-10">Error loading support requests.</div>;
  }

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

      {/* ── Table Container ── */}
      <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100/80 hover:bg-transparent">
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">USER</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">TITLE</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">CONTACT</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">STATUS</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req: any) => (
                  <TableRow key={req._id} className="group border-b border-gray-50/50 hover:bg-white/60 transition-colors">
                    <TableCell className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                          {req.user?.image ? (
                            <img src={req.user.image} alt={req.user.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-base font-medium">
                              {req.user?.fullName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 whitespace-nowrap">
                          <p className="text-sm font-medium text-[#2C2E33] leading-none">{req.user?.fullName}</p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F2F2F2] rounded-md text-[10px] text-[#737780] font-bold">
                            <MapPin className="w-3 h-3" />
                            {req.user?.role}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-6 px-6">
                      <p className="text-sm font-medium text-gray-700 max-w-[200px] truncate">{req.title}</p>
                    </TableCell>
                    
                    <TableCell className="py-6 px-6">
                      <div className="space-y-1.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {req.user?.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {req.user?.email}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-6 px-6 whitespace-nowrap">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        req.status === "resolved" ? "bg-[#D1F7EA] text-[#10B981]" : "bg-[#FDE6D2] text-[#FF4A00]"
                      )}>
                        {req.status}
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
                              href={`/help-support/${req._id}`}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                              View Request
                            </Link>
                          </DropdownMenuItem>
                          
                          <div className="h-px bg-gray-50 my-1 mx-1" />
                          
                          <DropdownMenuItem 
                            onClick={() => handleRemove(req._id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Request
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
                      <p className="text-gray-400 font-medium">No support requests found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: meta?.totalPage || 1 }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-10 h-10 rounded-full text-sm font-medium shadow-xl transition-all",
                page === p ? "bg-[#FF4A00] text-white cursor-pointer shadow-orange-100" : "bg-white/50 text-gray-600 cursor-pointer hover:bg-white border border-gray-100"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(Math.min(meta?.totalPage || 1, page + 1))}
          disabled={page === meta?.totalPage}
          className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
