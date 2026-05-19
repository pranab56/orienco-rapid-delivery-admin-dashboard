"use client";

import { useState, useEffect } from "react";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { useGetAllUserQuery, useSuspenseMutation, useDeleteUserMutation } from "@/features/user/userApi";
import toast from "react-hot-toast";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const [page, setPage] = useState(1);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: response, isLoading } = useGetAllUserQuery({
    page,
    searchTerm: "", // Removed backend search
    status: filterValue
  });
  const [suspense] = useSuspenseMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = response?.data?.users || [];

  const filteredUsers = users.filter((u: any) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(lowerQuery) ||
      u.email?.toLowerCase().includes(lowerQuery) ||
      u.phone?.toLowerCase().includes(lowerQuery) ||
      u.address?.toLowerCase().includes(lowerQuery)
    );
  });
  const meta = response?.data?.meta || { totalPage: 1 };

  const handleSuspense = async (id: string) => {
    try {
      const response = await suspense({ id }).unwrap();
      console.log(response)
      toast.success(response?.message);

    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;
    try {
      const response = await deleteUser({ id: selectedUserId }).unwrap();
      toast.success(response?.message || "User removed successfully");
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-medium">User Management</h1>
        <p className="text-sm sm:text-base font-normal text-gray-500">
          Manage Grocerymarkets and Suppliers. Approve registrations and monitor activity.
        </p>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 sm:h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
          />
        </div>

        <Select
          value={filterValue}
          onValueChange={(val) => {
            setFilterValue(val);
            setPage(1); // Reset to first page on filter change
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px] py-6 sm:py-6 h-12 sm:h-14 bg-white/50 border-gray-100 rounded-sm font-medium text-gray-600 cursor-pointer focus:ring-1 focus:ring-[#FF4A00]/20">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-lg border-gray-100 shadow-xl">
            <SelectItem value="all" className="font-medium text-gray-500 py-3">All</SelectItem>
            <SelectItem value="active" className="font-medium text-gray-500 py-3">Active</SelectItem>
            <SelectItem value="suspended" className="font-medium text-gray-500 py-3">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white/40 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100/80 hover:bg-transparent">
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">USER</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">ROLE</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">CONTACT</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase">STATUS</TableHead>
                <TableHead className="py-5 px-6 text-[11px] font-medium text-[#9CA3AF] tracking-widest uppercase text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-50/50">
                    <TableCell className="py-6 px-6">
                      <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-24" />
                          <div className="h-3 bg-gray-100 rounded w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-8 bg-gray-100 rounded-xl w-24 animate-pulse" /></TableCell>
                    <TableCell>
                      <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-32" />
                        <div className="h-3 bg-gray-100 rounded w-40" />
                      </div>
                    </TableCell>
                    <TableCell><div className="h-6 bg-gray-100 rounded-lg w-20 animate-pulse" /></TableCell>
                    <TableCell className="text-right"><div className="h-8 bg-gray-100 rounded-lg w-8 ml-auto animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u: any) => (
                  <TableRow key={u._id} className="group border-b border-gray-50/50 hover:bg-white/60 transition-colors">
                    <TableCell className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shrink-0">
                          {u.image ? (
                            <img src={u.image} alt={u.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-base sm:text-lg font-bold">
                              {u.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          <p className="text-sm font-bold text-[#2C2E33] leading-none truncate">{u.fullName}</p>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md text-[10px] text-[#737780] font-medium max-w-[150px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{u.address || "No Address"}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {u.role === "user" ? (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E6F0FF] text-[#0066CC] font-bold text-[10px] rounded-lg uppercase tracking-wider">
                          <User className="w-3.5 h-3.5" />
                          User
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF4F0] text-[#FF4A00] font-bold text-[10px] rounded-lg uppercase tracking-wider">
                          <Bike className="w-3.5 h-3.5" />
                          Driver
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        u.status === "active" ? "bg-[#D1F7EA] text-[#10B981]" : "bg-[#FDE6D2] text-[#FF4A00]"
                      )}>
                        {u.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.status}
                      </div>
                    </TableCell>

                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 cursor-pointer rounded-xl transition-colors text-gray-400 focus:outline-none">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 bg-white border-gray-100 shadow-xl rounded-xl">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/users-management/${u._id}`}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleSuspense(u._id)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer",
                              u.status === "active" ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                            )}
                          >
                            {u.status === "active" ? (
                              <><ShieldAlert className="w-4 h-4" />Suspend User</>
                            ) : (
                              <><CheckCircle2 className="w-4 h-4" />Activate User</>
                            )}
                          </DropdownMenuItem>

                          <div className="h-px bg-gray-50 my-1 mx-1" />

                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(u._id)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-72 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-medium">No users found matching your criteria</p>
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
                      "w-10 h-10 rounded-full  cursor-pointer text-sm font-bold transition-all",
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

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="bg-white rounded-xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#2C2E33]">Remove User?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-medium font-normal">
              Are you sure you want to permanently remove this user account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="bg-gray-100 border-none rounded-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-[#FF0000] text-white rounded-sm font-medium hover:bg-red-600 transition-colors"
            >
              Yes, Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
