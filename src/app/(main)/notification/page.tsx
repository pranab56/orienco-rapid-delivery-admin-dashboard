"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  UserPlus,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifCategory = "order" | "driver" | "alert" | "system" | "promo";

interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialNotifications: Notification[] = [
  {
    id: "1",
    category: "order",
    title: "New Order Received",
    message: "Order #ORD-00842 has been placed by John Doe for a delivery to Downtown District.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    category: "driver",
    title: "Driver Request Submitted",
    message: "Julian Dashwood has applied to become a driver. Review their profile now.",
    time: "18 min ago",
    read: false,
  },
  {
    id: "3",
    category: "alert",
    title: "Delivery Delay Reported",
    message: "Order #ORD-00791 is delayed due to traffic in the Valley Region. ETA shifted by 30 mins.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    category: "system",
    title: "Driver Verified",
    message: "Marcus Thorne's documents have been successfully verified. They are now active.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    category: "promo",
    title: "Flash Sale Announcement",
    message: "Inform users of a 20% discount on express deliveries this weekend.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    category: "order",
    title: "Order Completed",
    message: "Order #ORD-00780 has been successfully delivered to the customer.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "7",
    category: "alert",
    title: "Low Vehicle Fuel Alert",
    message: "Vehicle CA-904-XL-22 assigned to Marcus Thorne is reporting low fuel levels.",
    time: "2 days ago",
    read: true,
  },
];

// ─── Category Config ──────────────────────────────────────────────────────────

const categoryConfig: Record<NotifCategory, {
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  label: string;
}> = {
  order:  { icon: Package,       bg: "bg-orange-100", iconColor: "text-[#FF4A00]", label: "Order" },
  driver: { icon: UserPlus,      bg: "bg-blue-100",   iconColor: "text-blue-600",  label: "Driver" },
  alert:  { icon: AlertTriangle, bg: "bg-red-100",    iconColor: "text-red-500",   label: "Alert" },
  system: { icon: ShieldCheck,   bg: "bg-green-100",  iconColor: "text-green-600", label: "System" },
  promo:  { icon: Megaphone,     bg: "bg-purple-100", iconColor: "text-purple-600",label: "Promo" },
};

const filterTabs = ["All", "Unread", "Order", "Driver", "Alert", "System", "Promo"] as const;
type FilterTab = typeof filterTabs[number];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.category === activeFilter.toLowerCase();
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#2C2E33]">Notifications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {unreadCount > 0 ? (
              <span>You have <span className="text-[#FF4A00] font-semibold">{unreadCount} unread</span> notifications.</span>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="h-10 px-5 rounded-lg border-gray-200 text-sm font-medium text-[#2C2E33] hover:bg-gray-100 cursor-pointer disabled:opacity-40"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          <Button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="h-10 px-5 rounded-lg bg-[#FF4A00] hover:bg-[#e64300] text-white text-sm font-medium shadow-lg shadow-orange-100 cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
              activeFilter === tab
                ? "bg-[#FF4A00] text-white shadow-lg shadow-orange-100"
                : "bg-white text-[#737780] hover:bg-gray-100 border border-gray-200"
            )}
          >
            {tab}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notification List ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-400">No notifications here</p>
              <p className="text-sm text-gray-400 mt-1">Check back later</p>
            </motion.div>
          ) : (
            filtered.map((notif, index) => {
              const cfg = categoryConfig[notif.category];
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "flex items-start gap-4 px-6 py-5 border-b border-gray-100 last:border-none cursor-pointer transition-colors group",
                    !notif.read ? "bg-[#FFF6F3]" : "bg-white hover:bg-gray-50"
                  )}
                >
                  {/* Icon */}
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                    <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("text-sm text-[#2C2E33]", !notif.read ? "font-semibold" : "font-medium")}>
                          {notif.title}
                          {!notif.read && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#FF4A00] align-middle" />
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); remove(notif.id); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", cfg.bg, cfg.iconColor)}>
                        {cfg.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}