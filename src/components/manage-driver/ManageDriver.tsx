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
  Camera,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUserQuery,
  useNewDriverRequestsQuery,
  useApproveMutation,
  useDeleteUserMutation,
} from "@/features/user/userApi";
import {
  useCreateVehicleMutation,
  useGetAllVehicleQuery,
  useAssignVehicleToDriverMutation,
  useRemoveDriverMutation,
} from "@/features/vehicle/vehicleApi";

export default function ManageDriver() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    plate: "",
    category: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const [vehicleFormErrors, setVehicleFormErrors] = useState({
    name: "",
    plate: "",
    category: "",
    imageFile: "",
  });

  const { data: activeResponse, isLoading: isActiveLoading } = useGetAllUserQuery({
    page,
    role: "driver",
    searchTerm: searchQuery
  });
  const { data: requestsResponse, isLoading: isRequestsLoading } = useNewDriverRequestsQuery({
    page,
    searchTerm: searchQuery
  });
  const { data: vehicleData, isLoading: isVehicleLoading } = useGetAllVehicleQuery({ page: 1 });
  const vehicles = vehicleData?.data?.vehicles || [];

  const [approve, { isLoading: approveLoading }] = useApproveMutation();
  const [deleteUser, { isLoading: deletingUserLoading }] = useDeleteUserMutation();
  const [createVehicle, { isLoading: isCreatingVehicle }] = useCreateVehicleMutation();
  const [assignVehicle, { isLoading: isAssigning }] = useAssignVehicleToDriverMutation();
  const [unassignVehicle] = useRemoveDriverMutation();

  const activeDrivers = activeResponse?.data?.users || [];
  const requests = requestsResponse?.data?.users || [];
  const meta = activeTab === "active" ? activeResponse?.data?.meta : requestsResponse?.data?.meta;

  const stats = [
    { title: "TOTAL VEHICLES", value: vehicleData?.data?.meta?.total?.toString() || "0", icon: Bike, color: "#FF4A00" },
    { title: "ACTIVE DRIVERS", value: activeResponse?.data?.meta?.total?.toString() || "0", icon: Users, color: "#FF4A00" },
    { title: "AVAILABLE REQUESTS", value: requestsResponse?.data?.meta?.total?.toString() || "0", icon: ClipboardList, color: "#FF4A00" },
  ];

  const handleApprove = async (id: string) => {
    try {
      const response = await approve({ id }).unwrap();
      toast.success(response?.message || "Driver approved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve driver");
    }
  };

  const handleRemove = async () => {
    if (!selectedDriverId) return;
    try {
      const response = await deleteUser({ id: selectedDriverId }).unwrap();
      toast.success(response?.message || "Driver removed successfully");
      setIsRemoveModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove driver");
    }
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVehicleForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
    if (vehicleFormErrors.imageFile) {
      setVehicleFormErrors((p) => ({ ...p, imageFile: "" }));
    }
  };

  const resetVehicleForm = () => {
    setIsAddVehicleOpen(false);
    setVehicleForm({ name: "", plate: "", category: "", imageFile: null, imagePreview: "" });
    setVehicleFormErrors({ name: "", plate: "", category: "", imageFile: "" });
  };

  const handleAddVehicle = async () => {
    let hasError = false;
    const errors = { name: "", plate: "", category: "", imageFile: "" };

    if (!vehicleForm.imageFile) { errors.imageFile = "Vehicle image is required"; hasError = true; }
    if (!vehicleForm.name) { errors.name = "Vehicle name is required"; hasError = true; }
    if (!vehicleForm.plate) { errors.plate = "Plate number is required"; hasError = true; }
    if (!vehicleForm.category) { errors.category = "Category is required"; hasError = true; }

    setVehicleFormErrors(errors);

    if (hasError) return;

    const formData = new FormData();
    formData.append("name", vehicleForm.name);
    formData.append("licensePlate", vehicleForm.plate);
    formData.append("type", vehicleForm.category);
    formData.append("image", vehicleForm.imageFile!);

    try {
      const response = await createVehicle(formData).unwrap();
      toast.success(response?.message || "Vehicle added successfully");
      resetVehicleForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add vehicle");
    }
  };

  const handleAssignVehicle = async () => {
    if (!selectedDriverId || !selectedVehicleId) return;
    try {
      const response = await assignVehicle({ driverId: selectedDriverId, vehicleId: selectedVehicleId }).unwrap();
      toast.success(response?.message || "Vehicle assigned successfully");
      setIsAssignModalOpen(false);
      setSelectedVehicleId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign vehicle");
    }
  };

  const isLoading = activeTab === "active" ? isActiveLoading : isRequestsLoading;
  const currentData = activeTab === "active" ? activeDrivers : requests;

  const filteredData = currentData.filter((item: any) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(lowerQuery) ||
      item.email?.toLowerCase().includes(lowerQuery) ||
      item.driverInfo?.assignedVehiclePlate?.toLowerCase().includes(lowerQuery)
    );
  });

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
              onClick={() => { setActiveTab("active"); setPage(1); }}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer",
                activeTab === "active" ? "bg-white text-[#2C2E33] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Active Driver
            </button>
            <button
              onClick={() => { setActiveTab("requests"); setPage(1); }}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm cursor-pointer font-medium transition-all relative flex items-center gap-2",
                activeTab === "requests" ? "bg-white text-[#2C2E33] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              New Requests
              {activeTab !== "requests" && requests.length > 0 && (
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

      {/* ── Driver List ── */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#2C2E33] mb-6 sm:mb-8">
          {activeTab === "active" ? "Active Driver List" : "New Driver Requests"}
        </h2>

        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100/50 hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 pl-6">
                    {activeTab === "active" ? "DRIVER IDENTITY" : "DRIVER NAME"}
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14">
                    {activeTab === "active" ? "ASSIGNED VEHICLE" : "DATE APPLIED"}
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 text-right pr-6">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <LoadingSpin />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-gray-500 font-medium border-b-0">
                      {searchQuery ? `No drivers found matching "${searchQuery}".` : "No drivers found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item: any) => (
                    <TableRow key={item._id} className="group border-b border-gray-50 hover:bg-white/60 transition-colors">
                      <TableCell className="pl-6 py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0 relative">
                            {item.image ? (
                              <Image src={item.image} alt={item.fullName} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-[10px] sm:text-xs font-medium">
                                {item.fullName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5 whitespace-nowrap">
                            <p className="text-sm font-medium text-[#2C2E33]">{item.fullName}</p>
                            <p className="text-[11px] sm:text-xs font-medium text-gray-400">{item.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-5">
                        <div className="flex flex-col gap-1 pr-4">
                          {activeTab === "active" ? (
                            (() => {
                              const assignedV = vehicles.find((v: any) => v._id === item.driverInfo?.assignedVehicle);
                              const vName = assignedV
                                ? assignedV.name
                                : (item.driverInfo?.assignedVehicle
                                  ? (isVehicleLoading ? "Loading..." : "Unknown Vehicle")
                                  : "No vehicle assigned");
                              const vPlate = assignedV ? assignedV.licensePlate : item.driverInfo?.assignedVehiclePlate;

                              return (
                                <>
                                  <p className={cn("font-medium text-sm whitespace-nowrap", item.driverInfo?.assignedVehicle ? "text-[#2C2E33]" : "text-gray-400 italic")}>
                                    {vName}
                                  </p>
                                  {vPlate && (
                                    <span className="px-2 py-0.5 bg-[#D1D5DB] text-[#4B5563] text-[10px] font-bold rounded w-fit uppercase tracking-wider">
                                      {vPlate}
                                    </span>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            <p className="font-medium text-[#2C2E33] text-sm whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="pr-6 py-5 text-right relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-400 outline-none focus:ring-2 focus:ring-orange-200">
                            <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-gray-100">
                            <DropdownMenuItem
                              onClick={() => router.push(`/users-management/${item._id}`)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#737780] hover:text-[#2C2E33] cursor-pointer rounded-lg focus:bg-gray-50 focus:text-[#2C2E33]"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </DropdownMenuItem>

                            {activeTab === "active" ? (
                              <>
                                <DropdownMenuItem
                                  onClick={() => { setSelectedDriverId(item._id); setIsAssignModalOpen(true); }}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#10B981] cursor-pointer rounded-lg focus:bg-green-50 focus:text-[#10B981]"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  Assign Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                <DropdownMenuItem
                                  onClick={() => { setSelectedDriverId(item._id); setIsRemoveModalOpen(true); }}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#FF0000] cursor-pointer rounded-lg focus:bg-red-50 focus:text-[#FF0000]"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove Driver
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(item._id)}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#10B981] cursor-pointer rounded-lg focus:bg-green-50 focus:text-[#10B981]"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Approve Driver
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                                <DropdownMenuItem
                                  onClick={() => { setSelectedDriverId(item._id); setIsRemoveModalOpen(true); }}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#FF4A00] cursor-pointer rounded-lg focus:bg-orange-50 focus:text-[#FF4A00]"
                                >
                                  <X className="w-4 h-4" />
                                  Reject Driver
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {meta?.totalPage > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: meta.totalPage }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-bold transition-all",
                    page === p ? "bg-[#FF4A00] text-white shadow-orange-100" : "bg-white text-gray-600 border border-gray-100"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={page === meta.totalPage}
            onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* ── Remove/Reject Driver Modal ── */}
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-100 flex items-center justify-center relative">
                  <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF0000]" />
                  <button
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="absolute -top-6 sm:-top-8 cursor-pointer -right-32 sm:-right-50 p-1.5 sm:p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2C2E33]">
                    {activeTab === "active" ? "Remove Driver?" : "Reject Driver Request?"}
                  </h3>
                  {/* <div className="space-y-1 sm:space-y-2 text-left w-full">
                    <label className="text-xs sm:text-sm font-normal text-gray-500">Reason</label>
                    <textarea
                      placeholder="Enter the reason why..."
                      className="w-full h-20 sm:h-24 p-3 sm:p-4 bg-white border border-gray-200 mt-1 rounded-lg text-sm focus:ring-1 focus:ring-orange-200 outline-none resize-none"
                    />
                  </div> */}
                </div>

                <div className="flex gap-3 sm:gap-4 w-full">
                  <button
                    onClick={handleRemove}

                    className="flex-1 h-10 sm:h-12 bg-[#FF4F00] text-white rounded-md cursor-pointer font-medium text-base hover:opacity-90 transition-opacity"
                  >
                    {deletingUserLoading ? "Loading..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="flex-1 h-10 sm:h-12 bg-gray-400 text-white rounded-md cursor-pointer font-medium text-base hover:opacity-90 transition-opacity"
                  >
                    Cancel
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetVehicleForm}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#F2F2F2] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#2C2E33]">Add New Vehicle</h2>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col w-full sm:w-[42%]">
                    <div
                      className={cn("flex flex-col items-center justify-center gap-5 w-full border-2 border-dashed rounded-2xl p-8 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors", vehicleFormErrors.imageFile ? "border-red-500" : "border-gray-300")}
                      onClick={() => document.getElementById("vehicle-image-input")?.click()}
                    >
                      <input id="vehicle-image-input" type="file" accept="image/*" className="hidden" onChange={handleVehicleImageChange} />
                      {vehicleForm.imagePreview ? (
                        <Image src={vehicleForm.imagePreview} alt="Preview" width={128} height={128} className="w-32 h-32 object-cover rounded-xl" unoptimized />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                          <Camera className="w-7 h-7 text-[#FF4A00]" />
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p className="text-base font-semibold">Vehicle Image</p>
                        <p className="text-xs text-gray-500">Upload a clear photo of the vehicle.</p>
                      </div>
                    </div>
                    {vehicleFormErrors.imageFile && <p className="text-xs text-red-500 mt-2 ml-1">{vehicleFormErrors.imageFile}</p>}
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Vehicle Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Toyota Hiace"
                        value={vehicleForm.name}
                        onChange={(e) => {
                          setVehicleForm((p) => ({ ...p, name: e.target.value }));
                          if (vehicleFormErrors.name) setVehicleFormErrors((p) => ({ ...p, name: "" }));
                        }}
                        className={cn("w-full h-12 px-4 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20", vehicleFormErrors.name ? "border-red-500" : "border-gray-200")}
                      />
                      {vehicleFormErrors.name && <p className="text-xs text-red-500">{vehicleFormErrors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Plate Number</label>
                        <input
                          type="text"
                          placeholder="ABC-1234"
                          value={vehicleForm.plate}
                          onChange={(e) => {
                            setVehicleForm((p) => ({ ...p, plate: e.target.value }));
                            if (vehicleFormErrors.plate) setVehicleFormErrors((p) => ({ ...p, plate: "" }));
                          }}
                          className={cn("w-full h-12 px-4 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20", vehicleFormErrors.plate ? "border-red-500" : "border-gray-200")}
                        />
                        {vehicleFormErrors.plate && <p className="text-xs text-red-500">{vehicleFormErrors.plate}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Category</label>
                        <Select value={vehicleForm.category} onValueChange={(val) => {
                          setVehicleForm((p) => ({ ...p, category: val }));
                          if (vehicleFormErrors.category) setVehicleFormErrors((p) => ({ ...p, category: "" }));
                        }}>
                          <SelectTrigger className={cn("w-full h-12 bg-white border py-5.5 rounded-xl outline-none", vehicleFormErrors.category ? "border-red-500" : "border-gray-200")}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="z-[110]">
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="bike">Bike</SelectItem>
                          </SelectContent>
                        </Select>
                        {vehicleFormErrors.category && <p className="text-xs text-red-500">{vehicleFormErrors.category}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button onClick={resetVehicleForm} className="text-sm cursor-pointer font-medium text-gray-500 hover:text-gray-800">CANCEL</button>
                  <button
                    onClick={handleAddVehicle}
                    disabled={isCreatingVehicle}
                    className="px-10 cursor-pointer h-12 bg-[#FF4A00] text-white rounded-xl font-medium shadow-lg hover:bg-[#e64300] disabled:opacity-50"
                  >
                    {isCreatingVehicle ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Assign Vehicle Modal ── */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-semibold text-[#2C2E33]">Assign Vehicle to Driver</h2>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Select Vehicle</label>
                  <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                    <SelectTrigger className="w-full h-12 bg-white border border-gray-200 rounded-xl outline-none">
                      <SelectValue placeholder="Choose a vehicle" />
                    </SelectTrigger>
                    <SelectContent className="z-[110]">
                      {vehicles.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No vehicles available</div>
                      ) : (
                        vehicles.map((v: any) => (
                          <SelectItem key={v._id} value={v._id}>
                            {v.name} ({v.licensePlate})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-lg cursor-pointer font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignVehicle}
                    disabled={!selectedVehicleId || isAssigning}
                    className="flex-1 h-11 bg-[#FF4A00] text-white rounded-lg cursor-pointer font-medium hover:bg-[#e64300] transition-colors disabled:opacity-50"
                  >
                    {isAssigning ? "Assigning..." : "Assign"}
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

import Image from "next/image"; import toast from "react-hot-toast";
import LoadingSpin from "../LoadingSpin";

