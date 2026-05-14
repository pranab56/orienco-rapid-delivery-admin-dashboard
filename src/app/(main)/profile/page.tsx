"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/features/profile/profileApi";
import LoadingSpin from "@/components/LoadingSpin";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isUpdatingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData?.data) {
      const { fullName, email, phone, address, image } = profileData.data;
      setFormData(prev => ({
        ...prev,
        fullName: fullName || "",
        email: email || "",
        phone: phone || "",
        address: address || ""
      }));
      if (image) {
        setProfileImage(image);
      }
    }
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.oldPassword) newErrors.oldPassword = "Old password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (validateProfile()) {
      try {
        const formDataPayload = new FormData();
        formDataPayload.append("fullName", formData.fullName);
        formDataPayload.append("address", formData.address);
        formDataPayload.append("phone", formData.phone);
        if (selectedImageFile) {
          formDataPayload.append("image", selectedImageFile);
        }

        await updateProfile(formDataPayload).unwrap();
        toast.success("Profile updated successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update profile");
      }
    } else {
      toast.error("Please fill all required profile fields correctly");
    }
  };

  const handleUpdatePassword = async () => {
    if (validatePassword()) {
      try {
        await changePassword({
          currentPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }).unwrap();
        toast.success("Password updated successfully");
        setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" }));
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update password");
      }
    } else {
      toast.error("Please fill all required password fields correctly");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <LoadingSpin />
      </div>
    )
  }

  return (
    <div className="container mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1 mb-8 sm:mb-10 pt-1 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2C2E33]">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">Manage your account information and security settings.</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Profile Info Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-center">
            {/* Avatar Upload */}
            <div className="relative group shrink-0">
              <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-[#F1DED6] text-[#FF4A00] text-2xl sm:text-3xl font-bold">
                  {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-[#FF4A00] text-white p-2 sm:p-2.5 rounded-full shadow-lg hover:bg-[#E64200] transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2C2E33]">{formData.fullName}</h2>
              <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.fullName ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                    }`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.email ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                    }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`pl-11 sm:pl-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.phone ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                    }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={`pl-11 sm:pl-12 pt-4 sm:pt-5 min-h-[100px] bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all resize-none ${errors.address ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                    }`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="w-full sm:w-auto bg-[#FF4A00] hover:bg-[#E64200] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-lg text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-gray-100 space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2C2E33] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#FF4A00]" />
                  Change Password
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your password to keep your account secure.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pb-2">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Old Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) => handleChange("oldPassword", e.target.value)}
                    placeholder="Enter old password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.oldPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.oldPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.newPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Enter confirm password"
                    className={`pl-11 sm:pl-12 pr-12 h-12 sm:h-14 bg-gray-50/30 border-gray-100 rounded-lg sm:rounded-xl text-sm sm:text-base focus:bg-white transition-all ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "focus:ring-[#FF4A00]/20 focus:border-[#FF4A00]/30"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] sm:text-xs font-medium ml-1 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto bg-[#FF4A00] hover:bg-[#E64200] text-white px-8 sm:px-10 h-11 sm:h-12 rounded-lg text-sm sm:text-base font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
