"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Users,
  ClipboardList,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserPlus,
  Trash2,
  AlertTriangle,
  X,
  Camera
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const stats = [
  { title: "TOTAL VEHICLES", value: "142", icon: Bike, color: "#FF4A00" },
  { title: "ACTIVE DRIVERS", value: "128", icon: Users, color: "#FF4A00" },
  { title: "AVAILABLE REQUESTS", value: "13", icon: ClipboardList, color: "#FF4A00" },
];

const mockDrivers = [
  { id: "Emp #04928", name: "Marcus Thorne", vehicle: "Freightliner Cascadia", plate: "CA-904-XL-22", image: "/avatars/driver1.png" },
  { id: "Emp #04112", name: "Sarah Jennings", vehicle: "Tesla Semi (Proto)", plate: "EV-441-TS-01", image: "/avatars/driver2.png" },
  { id: "Emp #04391", name: "Leo Rodriguez", vehicle: "Peterbilt 579", plate: "TX-229-PB-09", image: "/avatars/driver3.png" },
  { id: "Emp #04882", name: "Elena Vance", vehicle: "No vehicle assigned", plate: null, image: "/avatars/driver4.png" },
];

const mockRequests = [
  { id: 1, name: "Julian Dashwood", email: "julian.d@example.com", date: "Oct 12, 2023", image: "/avatars/req1.png" },
  { id: 2, name: "Maya West", email: "maya.w@webmail.com", date: "Oct 12, 2023", image: "/avatars/req2.png" },
  { id: 3, name: "Ryan Kholin", email: "r.kholin@logistics.co", date: "Oct 12, 2023", image: "/avatars/req3.png" },
];

export default function ManageDriver() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | number | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    plate: "",
    category: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVehicleForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleAddVehicle = () => {
    setIsAddVehicleOpen(false);
    setVehicleForm({ name: "", plate: "", category: "", imageFile: null, imagePreview: "" });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-lg h-full p-0">
              <CardContent className="p-5 sm:p-8 space-y-1 sm:space-y-2">
                <p className="text-[10px] sm:text-xs font-medium text-[#9CA3AF]">
                  {stat.title}
                </p>
                <p className="text-3xl sm:text-5xl font-medium text-[#2C2E33]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 sm:gap-6 mt-6 sm:mt-10">
        <div className="space-y-3 flex-1 max-w-4xl">
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF4A00] transition-colors" />
            <Input
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 sm:h-14 bg-white/50 border-none rounded-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#FF4A00]/20 transition-all font-normal"
            />
          </div>

          <div className="flex p-1.5 sm:p-2 bg-gray-200 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("active")}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer",
                activeTab === "active" ? "bg-white text-[#2C2E33] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Active Driver
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm cursor-pointer font-medium transition-all relative flex items-center gap-2",
                activeTab === "requests" ? "bg-white text-[#2C2E33] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              New Requests
              {activeTab !== "requests" && (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border-2 border-gray-100" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 cursor-pointer bg-[#FF4A00] text-white rounded-lg text-sm font-medium shadow-lg shadow-orange-100 hover:bg-[#e64300] transition-all"
          >
            Add Vehicles
          </button>
        </div>
      </div>

      {/* ── Driver List Card ── */}
      <Card className="border-none shadow-none bg-white rounded-lg overflow-visible p-1 sm:p-2">
        <CardContent className="p-4 sm:p-10">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C2E33] mb-6 sm:mb-8">
            {activeTab === "active" ? "Active Driver List" : "New Driver Requests"}
          </h2>

          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-4 border-b border-gray-100/50 text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">
                <div className="col-span-5">{activeTab === "active" ? "DRIVER IDENTITY" : "DRIVER NAME"}</div>
                <div className="col-span-5">{activeTab === "active" ? "ASSIGNED VEHICLE" : "DATE APPLIED"}</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100/50">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(activeTab === "active" ? mockDrivers : mockRequests).map((item: any) => (
                  <div key={item.id} className="grid grid-cols-12 py-6 items-center group relative">
                    <div className="col-span-5 flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                        {/* Avatar placeholder */}
                        <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-[10px] sm:text-xs font-medium">
                          {item.name.charAt(0)}
                        </div>
                      </div>
                      <div className="space-y-0.5 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-400">{item.id || item.email}</p>
                      </div>
                    </div>

                    <div className="col-span-5 flex flex-col gap-1 pr-4">
                      {activeTab === "active" ? (
                        <>
                          <p className={cn("font-medium text-sm whitespace-nowrap", item.plate ? "text-gray-900" : "text-gray-400 italic")}>
                            {item.vehicle}
                          </p>
                          {item.plate && (
                            <span className="px-2 py-0.5 bg-[#D1D5DB] text-[#4B5563] text-[10px] font-bold rounded w-fit uppercase tracking-wider">
                              {item.plate}
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="font-medium text-gray-900 text-sm whitespace-nowrap">{item.date}</p>
                      )}
                    </div>

                    <div className="col-span-2 text-right relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                        className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-gray-400"
                      >
                        <MoreHorizontal className="w-6 h-6" />
                      </button>

                      {/* Popover Menu */}
                      <AnimatePresence>
                        {menuOpenId === item.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setMenuOpenId(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-full  w-56 bg-white rounded-lg shadow-2xl border border-gray-100 z-20 p-2 text-left"
                            >
                              <button
                                onClick={() => { setMenuOpenId(null); router.push(`/manage-driver/${encodeURIComponent(item.id)}`); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                              >
                                <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#FF4A00]" />
                                View Profile
                              </button>

                              {activeTab === "active" ? (
                                <>
                                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#10B981] hover:bg-green-50 rounded-lg cursor-pointer transition-colors group">
                                    <UserPlus className="w-4 h-4" />
                                    Assign Vehicle
                                  </button>
                                  <button
                                    onClick={() => { setIsRemoveModalOpen(true); setMenuOpenId(null); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#FF0000] hover:bg-red-50 rounded-lg cursor-pointer transition-colors group border-t border-gray-50 mt-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove Driver
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#10B981] hover:bg-green-50 rounded-lg cursor-pointer transition-colors group">
                                    <UserPlus className="w-4 h-4" />
                                    Approve Driver
                                  </button>
                                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#FF4A00] hover:bg-orange-50 rounded-lg cursor-pointer transition-colors group border-t border-gray-50 mt-1">
                                    <X className="w-4 h-4" />
                                    Reject Driver
                                  </button>
                                </>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}

        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Desktop Pages */}
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, "...", 10].map((page, i) => (
            <button
              key={i}
              className={cn(
                "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-bold transition-all",
                page === 1 ? "bg-[#FF4A00] text-white shadow-lg shadow-orange-100" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile Compact Pages */}
        <div className="flex sm:hidden items-center gap-1">
          {[1, 2, 3, "...", 10].map((page, i) => (
            <button
              key={`mob-${i}`}
              className={cn(
                "w-8 h-8 rounded-full shadow-md cursor-pointer text-xs font-bold transition-all",
                page === 1 ? "bg-[#FF4A00] text-white shadow-md shadow-orange-100" : "bg-white text-gray-600 border border-gray-100"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* ── Remove Driver Modal ── */}
      <AnimatePresence>
        {isRemoveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRemoveModalOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-gray-100 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 flex flex-col items-center text-center">
                {/* Warning Icon Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-100 flex items-center justify-center relative">
                  <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF0000]" />
                  <button
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="absolute -top-6 sm:-top-8 cursor-pointer -right-32 sm:-right-50 p-1.5 sm:p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2C2E33]">Do you want to Remove the user?</h3>
                  <div className="space-y-1 sm:space-y-2 text-left w-full">
                    <label className="text-xs sm:text-sm font-normal">Reason</label>
                    <textarea
                      placeholder="Enter The Reason Why You Want To Remove"
                      className="w-full h-20 sm:h-24 p-3 sm:p-4 bg-[#E5E5E5] mt-1 border-none rounded-sm text-sm focus:ring-1 focus:ring-orange-200 outline-none resize-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 w-full">
                  <button
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="flex-1 h-10 sm:h-12 bg-[#FF4F00] text-white rounded-md cursor-pointer font-medium text-base sm:text-lg hover:opacity-90 transition-opacity"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="flex-1 h-10 sm:h-12 bg-gray-400 text-white rounded-md cursor-pointer font-medium text-base sm:text-lg hover:opacity-90 transition-opacity"
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ── Add New Vehicle Modal ── */}
      <AnimatePresence>
        {isAddVehicleOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddVehicleOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl bg-[#F2F2F2] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#2C2E33]">Add New Vehicle</h2>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* ── Left: Image Upload ── */}
                  <div
                    className="flex flex-col items-center justify-center gap-5 w-full sm:w-[42%] border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors"
                    onClick={() => document.getElementById("vehicle-image-input")?.click()}
                  >
                    <input
                      id="vehicle-image-input"
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleVehicleImageChange}
                    />

                    {vehicleForm.imagePreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={vehicleForm.imagePreview}
                        alt="Vehicle preview"
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <Camera className="w-7 h-7 text-[#FF4A00]" />
                      </div>
                    )}

                    <div className="text-center space-y-1.5">
                      <p className="text-base font-semibold text-[#2C2E33]">Vehicle Portrait</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Drag and drop high-resolution imagery here. Optimal for sidebar identification cards.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {["JPG", "PNG", "MAX 10MB"].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); document.getElementById("vehicle-image-input")?.click(); }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-[#2C2E33] hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Select File
                    </button>
                  </div>

                  {/* ── Right: Form Fields ── */}
                  <div className="flex-1 space-y-5">
                    {/* Asset Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        Asset Identity (Name)
                      </label>
                      <input
                        type="text"
                        placeholder="Ferrari"
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full h-14 px-4 bg-[#EDE8DF] mt-1 border-none rounded-xl text-base text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#FF4A00]/20 outline-none resize-none placeholder:text-gray-400"
                      />
                      <p className="text-xs text-gray-400">
                        Use unique internal identifiers for fleet tracking.
                      </p>
                    </div>

                    {/* Number Plate + Classification */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Number Plate
                        </label>
                        <input
                          type="text"
                          placeholder="ABC-1234"
                          value={vehicleForm.plate}
                          onChange={(e) => setVehicleForm((p) => ({ ...p, plate: e.target.value }))}
                          className="w-full h-12 px-4 bg-[#EDE8DF] mt-1 border-none rounded-xl text-base text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#FF4A00]/20 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-500">
                          Vehicle Classification
                        </label>
                        <Select
                          value={vehicleForm.category}
                          onValueChange={(val) => setVehicleForm((p) => ({ ...p, category: val }))}
                        >
                          <SelectTrigger
                            className="w-full h-12 mt-1 px-4 bg-[#EDE8DF] py-6 border-none rounded-lg text-base text-gray-800 focus:ring-1 focus:ring-[#FF4A00]/30 cursor-pointer"
                          >
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="z-[200] rounded-lg border-none shadow-xl bg-white">
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="bike">Bike</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Footer Actions ── */}
                <div className="flex items-center justify-end gap-4 sm:gap-8 pt-2">
                  <button
                    onClick={() => setIsAddVehicleOpen(false)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleAddVehicle}
                    className="flex-1 sm:flex-none sm:px-16 h-12 bg-[#FF4A00] hover:bg-[#e64300] text-white rounded-xl text-base font-medium shadow-lg shadow-orange-200 transition-all active:scale-95 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
