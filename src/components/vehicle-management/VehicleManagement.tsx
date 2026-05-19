"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X,
  Camera,
  Edit2,
  Plus,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpin from "../LoadingSpin";

import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useGetAllVehicleQuery,
  useDeleteVehicleMutation,
} from "@/features/vehicle/vehicleApi";

export default function VehicleManagement() {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Add / Edit Form State
  const [vehicleForm, setVehicleForm] = useState({
    name: "",
    plate: "",
    category: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    plate: "",
    category: "",
    imageFile: "",
  });

  // Queries & Mutations
  const { data: vehicleData, isLoading, isError, refetch } = useGetAllVehicleQuery({ page });
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  const vehicles = vehicleData?.data?.vehicles || [];
  const meta = vehicleData?.data?.meta || { total: 0, limit: 10, page: 1, totalPage: 1 };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVehicleForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
    if (formErrors.imageFile) {
      setFormErrors((p) => ({ ...p, imageFile: "" }));
    }
  };

  const resetForm = () => {
    setVehicleForm({
      name: "",
      plate: "",
      category: "",
      imageFile: null,
      imagePreview: "",
    });
    setFormErrors({
      name: "",
      plate: "",
      category: "",
      imageFile: "",
    });
    setSelectedVehicle(null);
  };

  const handleAddSubmit = async () => {
    let hasError = false;
    const errors = { name: "", plate: "", category: "", imageFile: "" };

    if (!vehicleForm.imageFile) {
      errors.imageFile = "Vehicle image is required";
      hasError = true;
    }
    if (!vehicleForm.name.trim()) {
      errors.name = "Vehicle name is required";
      hasError = true;
    }
    if (!vehicleForm.plate.trim()) {
      errors.plate = "Plate number is required";
      hasError = true;
    }
    if (!vehicleForm.category) {
      errors.category = "Category is required";
      hasError = true;
    }

    setFormErrors(errors);
    if (hasError) return;

    const formData = new FormData();
    formData.append("name", vehicleForm.name.trim());
    formData.append("licensePlate", vehicleForm.plate.trim());
    formData.append("type", vehicleForm.category);
    formData.append("image", vehicleForm.imageFile!);

    try {
      const response = await createVehicle(formData).unwrap();
      toast.success(response?.message || "Vehicle added successfully");
      setIsAddModalOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add vehicle");
    }
  };

  const handleEditClick = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setVehicleForm({
      name: vehicle.name,
      plate: vehicle.licensePlate,
      category: vehicle.type,
      imageFile: null,
      imagePreview: vehicle.image,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    let hasError = false;
    const errors = { name: "", plate: "", category: "", imageFile: "" };

    if (!vehicleForm.name.trim()) {
      errors.name = "Vehicle name is required";
      hasError = true;
    }
    if (!vehicleForm.plate.trim()) {
      errors.plate = "Plate number is required";
      hasError = true;
    }
    if (!vehicleForm.category) {
      errors.category = "Category is required";
      hasError = true;
    }

    setFormErrors(errors);
    if (hasError) return;

    const formData = new FormData();
    formData.append("name", vehicleForm.name.trim());
    formData.append("licensePlate", vehicleForm.plate.trim());
    formData.append("type", vehicleForm.category);
    if (vehicleForm.imageFile) {
      formData.append("image", vehicleForm.imageFile);
    }

    try {
      const response = await updateVehicle({ id: selectedVehicle._id, data: formData }).unwrap();
      toast.success(response?.message || "Vehicle updated successfully");
      setIsEditModalOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update vehicle");
    }
  };

  const handleDeleteClick = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    try {
      const response = await deleteVehicle({ id: selectedVehicle._id }).unwrap();
      toast.success(response?.message || "Vehicle removed successfully");
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove vehicle");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-10">
      {/* ── Vehicle List Card ── */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C2E33]">
            Vehicle list
          </h2>
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 cursor-pointer bg-[#FF4A00] text-white rounded-lg text-sm font-medium shadow-md shadow-orange-100 hover:bg-[#e64300] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100/50 hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 pl-6 w-[35%]">
                    VEHICLE TYPE
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 w-[30%]">
                    VEHICLE NAME
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 w-[20%]">
                    VEHICLE NUMBER
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase h-14 text-right pr-6 w-[15%]">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <LoadingSpin />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-gray-500 font-medium border-b-0">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((item: any) => (
                    <TableRow key={item._id} className="group border-b border-gray-50 hover:bg-white/60 transition-colors">
                      {/* VEHICLE TYPE */}
                      <TableCell className="pl-6 py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0 relative">
                            {item.image ? (
                              <Image src={item.image} alt={item.type} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full bg-[#1A365D] flex items-center justify-center text-white text-[10px] sm:text-xs font-medium uppercase">
                                {item.type.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[#2C2E33] capitalize">
                            {item.type}
                          </p>
                        </div>
                      </TableCell>

                      {/* VEHICLE NAME */}
                      <TableCell className="py-5">
                        <p className="font-semibold text-sm text-[#2C2E33]">
                          {item.name}
                        </p>
                      </TableCell>

                      {/* VEHICLE NUMBER */}
                      <TableCell className="py-5">
                        <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase tracking-wider">
                          {item.licensePlate}
                        </span>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="pr-6 py-5 text-right relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-400 outline-none focus:ring-2 focus:ring-orange-200">
                            <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-xl border-gray-100 bg-white">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(item)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[#2C2E33] cursor-pointer rounded-lg focus:bg-gray-50 outline-none"
                            >
                              <Edit2 className="w-4 h-4 text-gray-400" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(item)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#FF0000] cursor-pointer rounded-lg focus:bg-red-50 focus:text-[#FF0000] outline-none"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              Remove Vehicle
                            </DropdownMenuItem>
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
      {!isLoading && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
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
                    "w-10 h-10 rounded-full shadow-md cursor-pointer text-sm font-bold transition-all",
                    page === p ? "bg-[#FF4A00] text-white shadow-orange-100" : "bg-white text-gray-600 border border-gray-150"
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
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* ── Add New Vehicle Modal ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#EAEAEA] rounded-2xl shadow-2xl overflow-hidden z-10 border border-white/20"
            >
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#2C2E33]">Add New Vehicle</h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side: Image upload */}
                  <div className="flex flex-col w-full md:w-[42%]">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-4 w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors h-[260px] md:h-[300px]",
                        formErrors.imageFile ? "border-red-500" : "border-[#B5B7BD]"
                      )}
                      onClick={() => document.getElementById("vehicle-image-add")?.click()}
                    >
                      <input id="vehicle-image-add" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      {vehicleForm.imagePreview ? (
                        <div className="relative w-32 h-32 overflow-hidden rounded-xl border border-gray-150">
                          <Image src={vehicleForm.imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-250">
                          <Camera className="w-7 h-7 text-[#FF4A00]" />
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p className="text-base font-bold text-gray-700">Vehicle Portrait</p>
                        <p className="text-xs text-gray-500 px-4 leading-relaxed">
                          Drag and drop high-resolution imagery here. Optimal for sidebar identification cards.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">JPG</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">PNG</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">MAX 10MB</span>
                      </div>
                    </div>
                    {formErrors.imageFile && <p className="text-xs text-red-500 mt-2 ml-1">{formErrors.imageFile}</p>}
                  </div>

                  {/* Right Side: Inputs */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">ASSET IDENTITY (NAME)</label>
                      <input
                        type="text"
                        placeholder="Ferrari"
                        value={vehicleForm.name}
                        onChange={(e) => {
                          setVehicleForm((p) => ({ ...p, name: e.target.value }));
                          if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                        }}
                        className={cn(
                          "w-full h-12 sm:h-14 px-4 bg-white/70 border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 transition-all font-medium text-sm text-[#2C2E33]",
                          formErrors.name ? "border-red-500" : "border-transparent"
                        )}
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Use unique internal identifiers for fleet tracking.</p>
                      {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">NUMBER PLATE</label>
                        <input
                          type="text"
                          placeholder="ABC-1234"
                          value={vehicleForm.plate}
                          onChange={(e) => {
                            setVehicleForm((p) => ({ ...p, plate: e.target.value }));
                            if (formErrors.plate) setFormErrors((p) => ({ ...p, plate: "" }));
                          }}
                          className={cn(
                            "w-full h-12 sm:h-14 px-4 bg-white/70 border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 transition-all font-medium text-sm text-[#2C2E33]",
                            formErrors.plate ? "border-red-500" : "border-transparent"
                          )}
                        />
                        {formErrors.plate && <p className="text-xs text-red-500">{formErrors.plate}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">VEHICLE CLASSIFICATION</label>
                        <Select
                          value={vehicleForm.category}
                          onValueChange={(val) => {
                            setVehicleForm((p) => ({ ...p, category: val }));
                            if (formErrors.category) setFormErrors((p) => ({ ...p, category: "" }));
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full h-12 sm:h-14 bg-white/70 border py-6 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 text-[#2C2E33]",
                              formErrors.category ? "border-red-500" : "border-transparent"
                            )}
                          >
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="z-[110] bg-white">
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="tricycle">Tricycle</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-6 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="text-sm font-bold text-[#737780] hover:text-[#2C2E33] tracking-wide uppercase transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleAddSubmit}
                    disabled={isCreating}
                    className="px-10 h-12 bg-[#FF4A00] text-white rounded-xl font-bold shadow-lg hover:bg-[#e64300] transition-colors disabled:opacity-50 min-w-[120px]"
                  >
                    {isCreating ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Vehicle Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#EAEAEA] rounded-2xl shadow-2xl overflow-hidden z-10 border border-white/20"
            >
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#2C2E33]">Edit Vehicle Details</h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Side: Image upload */}
                  <div className="flex flex-col w-full md:w-[42%]">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-4 w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors h-[260px] md:h-[300px]",
                        formErrors.imageFile ? "border-red-500" : "border-[#B5B7BD]"
                      )}
                      onClick={() => document.getElementById("vehicle-image-edit")?.click()}
                    >
                      <input id="vehicle-image-edit" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      {vehicleForm.imagePreview ? (
                        <div className="relative w-32 h-32 overflow-hidden rounded-xl border border-gray-150">
                          <Image src={vehicleForm.imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-gray-250">
                          <Camera className="w-7 h-7 text-[#FF4A00]" />
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p className="text-base font-bold text-gray-700">Vehicle Portrait</p>
                        <p className="text-xs text-gray-500 px-4 leading-relaxed">
                          Drag and drop high-resolution imagery here. Optimal for sidebar identification cards.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">JPG</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">PNG</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">MAX 10MB</span>
                      </div>
                    </div>
                    {formErrors.imageFile && <p className="text-xs text-red-500 mt-2 ml-1">{formErrors.imageFile}</p>}
                  </div>

                  {/* Right Side: Inputs */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">ASSET IDENTITY (NAME)</label>
                      <input
                        type="text"
                        placeholder="Ferrari"
                        value={vehicleForm.name}
                        onChange={(e) => {
                          setVehicleForm((p) => ({ ...p, name: e.target.value }));
                          if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                        }}
                        className={cn(
                          "w-full h-12 sm:h-14 px-4 bg-white/70 border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 transition-all font-medium text-sm text-[#2C2E33]",
                          formErrors.name ? "border-red-500" : "border-transparent"
                        )}
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Use unique internal identifiers for fleet tracking.</p>
                      {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">NUMBER PLATE</label>
                        <input
                          type="text"
                          placeholder="ABC-1234"
                          value={vehicleForm.plate}
                          onChange={(e) => {
                            setVehicleForm((p) => ({ ...p, plate: e.target.value }));
                            if (formErrors.plate) setFormErrors((p) => ({ ...p, plate: "" }));
                          }}
                          className={cn(
                            "w-full h-12 sm:h-14 px-4 bg-white/70 border rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 transition-all font-medium text-sm text-[#2C2E33]",
                            formErrors.plate ? "border-red-500" : "border-transparent"
                          )}
                        />
                        {formErrors.plate && <p className="text-xs text-red-500">{formErrors.plate}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#737780] tracking-wider uppercase">VEHICLE CLASSIFICATION</label>
                        <Select
                          value={vehicleForm.category}
                          onValueChange={(val) => {
                            setVehicleForm((p) => ({ ...p, category: val }));
                            if (formErrors.category) setFormErrors((p) => ({ ...p, category: "" }));
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full h-12 sm:h-14 bg-white/70 border py-6 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4A00]/20 text-[#2C2E33]",
                              formErrors.category ? "border-red-500" : "border-transparent"
                            )}
                          >
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="z-[110] bg-white">
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="tricycle">Tricycle</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-6 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="text-sm font-bold text-[#737780] hover:text-[#2C2E33] tracking-wide uppercase transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={isUpdating}
                    className="px-10 h-12 bg-[#FF4A00] text-white rounded-xl font-bold shadow-lg hover:bg-[#e64300] transition-colors disabled:opacity-50 min-w-[120px]"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Remove Vehicle Confirmation Modal ── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#F3F4F6] rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 sm:p-10 space-y-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-50 flex items-center justify-center relative shadow-inner">
                  <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF0000]" />
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="absolute -top-3 -right-3 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-md cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2C2E33]">
                    Remove Vehicle?
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                    Are you sure you want to permanently remove vehicle <strong className="text-gray-700">{selectedVehicle?.name}</strong> ({selectedVehicle?.licensePlate})? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4 w-full pt-4">
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 h-12 bg-[#FF0000] text-white rounded-xl cursor-pointer font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Removing..." : "Remove"}
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 h-12 bg-gray-300 text-gray-700 rounded-xl cursor-pointer font-bold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
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
