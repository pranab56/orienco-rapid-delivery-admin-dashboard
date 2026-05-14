import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/auth/authApi";

const inputCls = "h-11 rounded-sm border text-sm px-4 focus-visible:ring-1 focus-visible:ring-[#FF4A00] focus-visible:border-[#FF4A00]";
const inputStyle = { borderColor: "#F2F2F2", color: "#2C2E33", backgroundColor: "#FAFAFA" };

export default function ProfileSettings() {
  const { data: profileResponse, isLoading } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image || "",
      });
    }
  }, [profileResponse]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4A00]" />
      </div>
    );
  }

  const user = profileResponse?.data;

  return (
    <div className="max-w-4xl space-y-6 pb-5">

      {/* ── Personal Information Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden relative border-4 border-white shadow-sm bg-gray-100">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#FF4A00] text-3xl font-bold uppercase">
                  {formData.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2C2E33] flex items-center justify-center text-white border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "#2C2E33" }}>{formData.fullName || "Admin Profile"}</h2>
              <p className="text-xs sm:text-sm font-medium uppercase tracking-widest" style={{ color: "#6C757D" }}>
                {user?.role || "Super Admin"} • {user?.status || "Active"}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-9 sm:h-10 rounded-sm px-4 text-[10px] sm:text-xs font-semibold border cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#F2F2F2", color: "#2C2E33" }}
            >
              Update Profile Photo
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Full Name</Label>
            <Input 
              className={inputCls} 
              style={inputStyle} 
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 flex flex-col md:col-span-2">
            <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Email Address</Label>
            <Input 
              className={inputCls} 
              style={inputStyle} 
              value={formData.email}
              readOnly
              disabled
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Phone Number</Label>
            <Input 
              className={inputCls} 
              style={inputStyle} 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Role</Label>
            <Input 
              style={inputStyle} 
              value={user?.role || ""}
              readOnly
              disabled
              className={cn(inputCls, "capitalize")}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Footer Action Card ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3"
      >
        <Button
          variant="outline"
          className="h-11 px-6 sm:px-10 rounded-sm font-semibold border bg-[#F3F4F6] border-transparent cursor-pointer hover:bg-gray-200"
          style={{ color: "#2C2E33" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="h-11 px-6 sm:px-10 rounded-sm font-semibold text-white cursor-pointer min-w-[140px]"
          style={{ backgroundColor: "#FF4A00" }}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
        </Button>
      </motion.div>

    </div>
  );
}

import { cn } from "@/lib/utils";

