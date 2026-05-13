import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreVertical,
  Eye,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AddUserForm from "./AddUserForm";
import { 
  useGetAllUserQuery, 
  useSuspenseMutation, 
  useDeleteUserMutation 
} from "@/features/user/userApi";

/* ── Stat cards ─────────────────────────────────────────────── */
const stats = [
  { label: "Total users", value: "12,482", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Active Now", value: "3,829", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Pending", value: "142", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Suspended", value: "18", icon: CalendarX, iconBg: "#FEE2E2", iconColor: "#DC3545" },
];

/* ── Tab filter ─────────────────────────────────────────────── */
const TABS = ["All", "Active", "Suspended"] as const;
type Tab = (typeof TABS)[number];

/* ── Status badge ────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "#E8F5E9", color: "#2B9724" },
    suspended: { bg: "#FEE2E2", color: "#DC3545" },
    inactive: { bg: "#F3F4F6", color: "#6C757D" },
  };
  const { bg, color } = map[status.toLowerCase()] || { bg: "#F3F4F6", color: "#6C757D" };
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: bg, color }}
    >
      {status === "active" ? (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {status}
    </span>
  );
}

export default function UserManagement() {
  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const { data: response, isLoading } = useGetAllUserQuery({ page });
  const [suspense] = useSuspenseMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = response?.data?.users || [];
  const meta = response?.data?.meta || { total: 0, totalPage: 1, limit: 10 };

  const filteredUsers = tab === "All" 
    ? users 
    : users.filter((u: any) => u.status.toLowerCase() === tab.toLowerCase());

  const handleSuspense = async (id: string) => {
    try {
      await suspense({ id }).unwrap();
      toast.success("User status updated successfully");
      setMenuOpenId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser({ id }).unwrap();
      toast.success("User deleted successfully");
      setMenuOpenId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const toggleAll = () =>
    setSelected(selected.length === filteredUsers.length ? [] : filteredUsers.map((u: any) => u._id));

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="px-3 sm:px-5 py-3 sm:py-4 border-none shadow-sm bg-white flex flex-col gap-2 sm:gap-3">
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.iconColor }} />
                </div>
                <p className="text-[10px] sm:text-sm font-medium text-[#6C757D]">{s.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-[#2C2E33]">{s.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── User List Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-sm bg-white overflow-hidden p-0">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 pt-5 pb-3 gap-4">
            <h2 className="text-sm sm:text-base font-bold text-[#2C2E33]">Customer List</h2>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 px-4 rounded-sm text-xs sm:text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FF4A00" }}
                >
                  <Plus className="w-4 h-4" /> Add New User
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl p-0 border-none bg-transparent shadow-none [&>button]:hidden w-[95vw] sm:w-full">
                <AddUserForm onCancel={() => setIsAddOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 border-b overflow-x-auto no-scrollbar border-[#F2F2F2]">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); setSelected([]); }}
                className="pb-3 text-xs sm:text-sm font-semibold relative cursor-pointer transition-colors shrink-0"
                style={{ color: tab === t ? "#2C2E33" : "#6C757D" }}
              >
                {t}
                {tab === t && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2C2E33]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <Table className="min-w-[700px] sm:min-w-[800px] lg:min-w-0">
              <TableHeader>
                <TableRow className="border-[#F2F2F2]">
                  <TableHead className="w-10 pl-4 sm:pl-6">
                    <Checkbox
                      checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-[#6C757D]">
                    Customer Info
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-[#6C757D]">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-[#6C757D]">
                    Join Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-[#6C757D]">
                    Role
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-[#6C757D] text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((u: any) => (
                  <TableRow
                    key={u._id}
                    className="border-[#F2F2F2] hover:bg-gray-50/60 transition-colors"
                  >
                    <TableCell className="pl-4 sm:pl-6">
                      <Checkbox
                        checked={selected.includes(u._id)}
                        onCheckedChange={() => toggle(u._id)}
                      />
                    </TableCell>

                    <TableCell className="min-w-[200px] sm:min-w-[250px]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.fullName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#2C2E33] font-bold text-xs">
                              {u.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate text-[#2C2E33]">{u.fullName}</p>
                          <p className="text-[10px] sm:text-xs truncate text-[#6C757D]">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <StatusBadge status={u.status} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-[#2C2E33]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-semibold uppercase text-[#6C757D]">
                        {u.role}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-4 sm:pr-6 relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === u._id ? null : u._id)}
                        className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-gray-400"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {menuOpenId === u._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-12 z-20 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-1 overflow-hidden text-left"
                            >
                              <Link
                                href={`/users-management/${u._id}`}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors group"
                              >
                                <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#FF4A00]" />
                                View Profile
                              </Link>
                              <button 
                                onClick={() => handleSuspense(u._id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#D97706] hover:bg-amber-50 rounded-md transition-colors group"
                              >
                                <ShieldAlert className="w-4 h-4" />
                                {u.status === "suspended" ? "Reactivate" : "Suspend"}
                              </button>
                              <div className="h-px bg-gray-50 my-1 mx-2" />
                              <button 
                                onClick={() => handleDelete(u._id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#FF0000] hover:bg-red-50 rounded-md transition-colors group"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove User
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-sm text-[#6C757D]">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t gap-4 border-[#F2F2F2]">
            <p className="text-xs sm:text-sm order-2 sm:order-1 text-[#6C757D]">
              Showing{" "}
              <span className="font-semibold text-[#2C2E33]">
                {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#2C2E33]">{meta.total}</span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-2 sm:px-3 h-8 text-[10px] sm:text-sm rounded-sm disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors text-[#2C2E33]"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
              </button>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: meta.totalPage }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === meta.totalPage || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-sm rounded-sm font-medium transition-colors cursor-pointer"
                        style={
                          page === p
                            ? { backgroundColor: "#FF4A00", color: "#FFFFFF" }
                            : { color: "#2C2E33", backgroundColor: "transparent" }
                        }
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="px-1 text-xs sm:text-sm text-[#6C757D]">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                disabled={page === meta.totalPage}
                className="flex items-center gap-1 px-2 sm:px-3 h-8 text-[10px] sm:text-sm rounded-sm disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors text-[#2C2E33]"
              >
                Next <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}

