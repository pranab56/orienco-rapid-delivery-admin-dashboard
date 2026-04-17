"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ChangeNamePage() {
  const [formData, setFormData] = useState({
    firstName: "Rasel",
    lastName: "Parvez",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    const newErrors = {
      firstName: !formData.firstName ? "First name is required" : "",
      lastName: !formData.lastName ? "Last name is required" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix the errors before saving");
      return;
    }
    
    toast.success("Name updated successfully");
  };

  return (
    <div className="max-w-5xl">
       <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-medium text-[#2C2E33]">Change Name</h1>
        <div className="pt-4">
          <h2 className="text-xl font-medium text-[#2C2E33]">Change your name</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your first name & last name for change admin name.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-700 ml-1">First Name</Label>
            <Input
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`h-14 bg-[#FFFAF5] border-none rounded-xl text-lg placeholder:text-gray-500 focus-visible:ring-1 ${
                errors.firstName ? "ring-1 ring-red-500" : "focus-visible:ring-gray-400"
              }`}
            />
            <AnimatePresence>
                {errors.firstName && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm font-medium ml-1"
                >
                    {errors.firstName}
                </motion.p>
                )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-700 ml-1">Last Name</Label>
            <Input
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`h-14 bg-[#FFFAF5] border-none rounded-xl text-lg placeholder:text-gray-500 focus-visible:ring-1 ${
                errors.lastName ? "ring-1 ring-red-500" : "focus-visible:ring-gray-400"
              }`}
            />
            <AnimatePresence>
                {errors.lastName && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm font-medium ml-1"
                >
                    {errors.lastName}
                </motion.p>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            className="bg-[#EA4335] hover:bg-[#D33828] text-white px-16 h-12 rounded-lg text-lg font-semibold shadow-lg shadow-orange-100 transition-all active:scale-95"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
