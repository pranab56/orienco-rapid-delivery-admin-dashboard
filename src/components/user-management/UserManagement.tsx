"use client";

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
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddUserForm from "./AddUserForm";

/* ── Stat cards ─────────────────────────────────────────────── */
const stats = [
  { label: "Total users", value: "12,482", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Active Now", value: "3,829", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Pending", value: "142", icon: CalendarCheck, iconBg: "#E8F5E9", iconColor: "#2B9724" },
  { label: "Suspended", value: "18", icon: CalendarX, iconBg: "#FEE2E2", iconColor: "#DC3545" },
];

/* ── Tab filter ─────────────────────────────────────────────── */
const TABS = ["All", "Active", "Inactive", "Suspended"] as const;
type Tab = (typeof TABS)[number];

/* ── Status badge type ──────────────────────────────────────── */
type Status = "Active" | "Suspended" | "Inactive";

/* ── Dummy rows ─────────────────────────────────────────────── */
const AVATAR = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&auto=format";

const customers: { id: number; name: string; email: string; status: Status; date: string; bookings: number }[] = [
  { id: 1, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 2, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Suspended", date: "Oct 24, 2023", bookings: 42 },
  { id: 3, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Inactive", date: "Oct 24, 2023", bookings: 42 },
  { id: 4, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 5, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 6, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 7, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 8, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
  { id: 9, name: "Marcus Holloway", email: "marcus.h@example.com", status: "Active", date: "Oct 24, 2023", bookings: 42 },
];

const TOTAL = 240;
const PER_PAGE = 9;
const LAST_PG = Math.ceil(TOTAL / PER_PAGE);
const PAGES = [1, 2, 3, "...", LAST_PG];

/* ── Status badge ────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; color: string }> = {
    Active: { bg: "#E8F5E9", color: "#2B9724" },
    Suspended: { bg: "#FEE2E2", color: "#DC3545" },
    Inactive: { bg: "#F3F4F6", color: "#6C757D" },
  };
  const { bg, color } = map[status];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {status}
    </span>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function UserManagement() {
  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  /* filter rows by tab */
  const filtered = tab === "All"
    ? customers
    : customers.filter((c) => c.status === tab);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

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
              <Card className="px-3 sm:px-5 py-3 sm:py-4 border-none shadow-sm bg-white flex flex-col gap-2 sm:gap-3 ">
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.iconColor }} />
                </div>
                <p className="text-[10px] sm:text-sm font-medium" style={{ color: "#6C757D" }}>{s.label}</p>
                <p className="text-lg sm:text-2xl font-bold" style={{ color: "#2C2E33" }}>{s.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Customer List Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-sm bg-white overflow-hidden p-0">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 pt-5 pb-3 gap-4">
            <h2 className="text-sm sm:text-base font-bold" style={{ color: "#2C2E33" }}>Customer List</h2>
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
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 border-b overflow-x-auto no-scrollbar" style={{ borderColor: "#F2F2F2" }}>
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
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "#2C2E33" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full mobile-scroll-container">
            <Table className="min-w-[700px] sm:min-w-[800px] lg:min-w-0">
              <TableHeader>
                <TableRow style={{ borderColor: "#F2F2F2" }}>
                  <TableHead className="w-10 pl-4 sm:pl-6">
                    <Checkbox
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6C757D" }}>
                    Customer Info
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6C757D" }}>
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6C757D" }}>
                    Join Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6C757D" }}>
                    Total Bookings
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    style={{ borderColor: "#F2F2F2" }}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4 sm:pl-6">
                      <Checkbox
                        checked={selected.includes(c.id)}
                        onCheckedChange={() => toggle(c.id)}
                      />
                    </TableCell>

                    {/* Customer Info */}
                    <TableCell className="min-w-[200px] sm:min-w-[250px]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={AVATAR}
                            alt={c.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: "#2C2E33" }}>{c.name}</p>
                          <p className="text-[10px] sm:text-xs truncate" style={{ color: "#6C757D" }}>{c.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="whitespace-nowrap"><StatusBadge status={c.status} /></TableCell>

                    {/* Join Date */}
                    <TableCell className="whitespace-nowrap">
                      <span className="text-xs sm:text-sm" style={{ color: "#2C2E33" }}>{c.date}</span>
                    </TableCell>

                    {/* Total Bookings */}
                    <TableCell className="whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-semibold" style={{ color: "#2C2E33" }}>
                        {c.bookings}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-sm" style={{ color: "#6C757D" }}>
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t gap-4"
            style={{ borderColor: "#F2F2F2" }}
          >
            <p className="text-xs sm:text-sm order-2 sm:order-1" style={{ color: "#6C757D" }}>
              Showing{" "}
              <span className="font-semibold" style={{ color: "#2C2E33" }}>
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, TOTAL)}
              </span>{" "}
              of{" "}
              <span className="font-semibold" style={{ color: "#2C2E33" }}>{TOTAL}</span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-2 sm:px-3 h-8 text-[10px] sm:text-sm rounded-sm disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#2C2E33" }}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Prev
              </button>

              <div className="flex items-center gap-0.5">
                {PAGES.map((p, i) =>
                  p === "..." ? (
                    <span key={i} className="px-1 text-xs sm:text-sm" style={{ color: "#6C757D" }}>...</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setPage(Number(p))}
                      className="w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-sm rounded-sm font-medium transition-colors cursor-pointer"
                      style={
                        page === p
                          ? { backgroundColor: "#FF4A00", color: "#FFFFFF" }
                          : { color: "#2C2E33", backgroundColor: "transparent" }
                      }
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(LAST_PG, p + 1))}
                disabled={page === LAST_PG}
                className="flex items-center gap-1 px-2 sm:px-3 h-8 text-[10px] sm:text-sm rounded-sm disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#2C2E33" }}
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

