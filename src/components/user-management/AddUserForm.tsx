"use client";

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
import { UserPlus, X } from "lucide-react";
import { toast } from "react-hot-toast";

const inputCls =
  "h-11 rounded-sm border text-sm px-4 focus-visible:ring-1 focus-visible:ring-[#FF4A00] focus-visible:border-[#FF4A00]";
const inputStyle = { borderColor: "#F2F2F2", color: "#2C2E33", backgroundColor: "#FAFAFA" };

export default function AddUserForm({ onCancel }: { onCancel?: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("User added successfully!");
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-5 sm:p-8 rounded-xl relative shadow-xl border border-white/40">
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </button>
      )}

      <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#FFF3ED] flex items-center justify-center">
          <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF4A00]" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold mt-1 sm:mt-2" style={{ color: "#2C2E33" }}>Add New User</h2>
        <p className="text-xs sm:text-sm text-center" style={{ color: "#6C757D" }}>
          Fill in the details below to create a new user account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Full Name</Label>
          <Input className={inputCls} style={inputStyle} placeholder="e.g. Marcus Holloway" required />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold" style={{ color: "#2C2E33" }}>Email Address</Label>
          <Input className={inputCls} style={inputStyle} type="email" placeholder="marcus@example.com" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] sm:text-sm font-semibold" style={{ color: "#2C2E33" }}>Role</Label>
            <Select defaultValue="Customer">
              <SelectTrigger className="h-10 sm:h-11 w-full py-4 sm:py-5 rounded-sm border focus:ring-[#FF4A00]" style={inputStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] sm:text-sm font-semibold" style={{ color: "#2C2E33" }}>Status</Label>
            <Select defaultValue="Active">
              <SelectTrigger className="h-10 sm:h-11 py-4 sm:py-5 w-full rounded-sm border focus:ring-[#FF4A00]" style={inputStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl font-semibold border"
            style={{ borderColor: "#F2F2F2", color: "#2C2E33" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 rounded-xl font-semibold text-white"
            style={{ backgroundColor: "#FF4A00" }}
          >
            Add User
          </Button>
        </div>
      </form>
    </div>
  );
}

